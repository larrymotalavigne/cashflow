import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, fromEvent, merge, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: any;
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnlineSubject.asObservable();
  
  private canInstallSubject = new BehaviorSubject<boolean>(false);
  public canInstall$ = this.canInstallSubject.asObservable();

  constructor(private swUpdate: SwUpdate) {
    this.initOnlineStatus();
    this.initInstallPrompt();
    this.checkForUpdates();
  }

  private initOnlineStatus(): void {
    // Monitor online/offline status
    merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe(status => {
      this.isOnlineSubject.next(status);
    });
  }

  private initInstallPrompt(): void {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.canInstallSubject.next(true);
    });

    // Listen for the app being installed
    window.addEventListener('appinstalled', () => {
      this.canInstallSubject.next(false);
      this.deferredPrompt = null;
    });
  }

  private checkForUpdates(): void {
    if (this.swUpdate.isEnabled) {
      // Check for updates every 6 hours
      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 6 * 60 * 60 * 1000);

      // Handle available updates
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          if (confirm('New version available. Load new version?')) {
            window.location.reload();
          }
        }
      });
    }
  }

  async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      this.canInstallSubject.next(false);
      this.deferredPrompt = null;
      return true;
    }
    
    return false;
  }

  isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }
}