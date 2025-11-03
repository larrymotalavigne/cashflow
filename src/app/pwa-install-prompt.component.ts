import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';
import {animate, style, transition, trigger} from '@angular/animations';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
}

@Component({
    selector: 'app-pwa-install-prompt',
    standalone: true,
    imports: [CommonModule, ButtonModule],
    animations: [
        trigger('slideIn', [
            transition(':enter', [
                style({transform: 'translateY(100%)', opacity: 0}),
                animate('300ms ease-out', style({transform: 'translateY(0)', opacity: 1}))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({transform: 'translateY(100%)', opacity: 0}))
            ])
        ])
    ],
    template: `
        <div *ngIf="showPrompt && !isInstalled && deferredPrompt"
             @slideIn
             class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50
                    theme-bg-card theme-shadow-2xl rounded-2xl border-2 border-primary-500
                    p-4 backdrop-blur-lg bg-opacity-95">
            <div class="flex items-start gap-3">
                <!-- Icon -->
                <div class="flex-shrink-0 bg-gradient-to-br from-primary-500 to-secondary-500 p-2.5 rounded-xl">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <h3 class="font-semibold theme-text-primary text-base mb-1">
                        Install CashFlow App
                    </h3>
                    <p class="theme-text-secondary text-sm mb-3">
                        Install the app on your device for quick access and a better experience, even offline!
                    </p>

                    <!-- Actions -->
                    <div class="flex gap-2">
                        <p-button label="Install"
                                  (click)="install()"
                                  [outlined]="false"
                                  size="small"
                                  class="flex-1"
                                  icon="pi pi-download"
                                  styleClass="p-button-success p-button-sm"></p-button>
                        <p-button label="Later"
                                  (click)="dismiss()"
                                  [outlined]="true"
                                  size="small"
                                  class="flex-1"
                                  styleClass="p-button-secondary p-button-sm"></p-button>
                    </div>
                </div>

                <!-- Close button -->
                <button (click)="close()"
                        class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                               transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    `
})
export class PwaInstallPromptComponent implements OnInit {
    showPrompt = false;
    isInstalled = false;
    deferredPrompt: BeforeInstallPromptEvent | null = null;

    ngOnInit() {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            return;
        }

        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e as BeforeInstallPromptEvent;

            // Show the prompt after a short delay (better UX)
            setTimeout(() => {
                // Check if user has dismissed the prompt before
                const dismissed = localStorage.getItem('pwa-install-dismissed');
                const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
                const dayInMs = 24 * 60 * 60 * 1000;

                // Show prompt if not dismissed or if more than 7 days have passed
                if (!dismissed || Date.now() - dismissedTime > 7 * dayInMs) {
                    this.showPrompt = true;
                }
            }, 3000);
        });

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.showPrompt = false;
            localStorage.removeItem('pwa-install-dismissed');
        });
    }

    async install() {
        if (!this.deferredPrompt) return;

        // Show the install prompt
        await this.deferredPrompt.prompt();

        // Wait for the user's response
        const {outcome} = await this.deferredPrompt.userChoice;

        // Log the outcome
        console.log(`User response to install prompt: ${outcome}`);

        // Clear the deferred prompt
        this.deferredPrompt = null;
        this.showPrompt = false;
    }

    dismiss() {
        // Hide for 7 days
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        this.showPrompt = false;
    }

    close() {
        // Hide permanently (user can still install from browser menu)
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        this.showPrompt = false;
    }
}
