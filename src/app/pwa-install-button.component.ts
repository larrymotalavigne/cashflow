import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from './pwa.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pwa-install-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pwa-controls" *ngIf="!isInstalled()">
      <!-- Install Button -->
      <button 
        *ngIf="canInstall$ | async"
        (click)="installApp()"
        class="install-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Install App
      </button>
      
      <!-- Offline Indicator -->
      <div 
        *ngIf="!(isOnline$ | async)"
        class="offline-indicator bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
        <div class="w-2 h-2 bg-red-500 rounded-full"></div>
        Offline Mode
      </div>
    </div>
  `,
  styles: [`
    .pwa-controls {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .install-btn {
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }
    
    .offline-indicator {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `]
})
export class PwaInstallButtonComponent {
  canInstall$: Observable<boolean>;
  isOnline$: Observable<boolean>;

  constructor(private pwaService: PwaService) {
    this.canInstall$ = this.pwaService.canInstall$;
    this.isOnline$ = this.pwaService.isOnline$;
  }

  async installApp(): Promise<void> {
    const result = await this.pwaService.installApp();
    if (result) {
      console.log('App installed successfully');
    }
  }

  isInstalled(): boolean {
    return this.pwaService.isInstalled();
  }
}