import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastAnimation', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out')
      ]),
      transition('* => void', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      <div 
        *ngFor="let toast of toastService.toasts$()" 
        [@toastAnimation]
        [ngClass]="getToastClasses(toast)"
        class="theme-shadow-lg rounded-lg p-4 border-l-4 backdrop-blur-sm relative overflow-hidden">
        
        <!-- Progress bar for timed toasts -->
        <div 
          *ngIf="!toast.persistent && toast.duration"
          class="absolute top-0 left-0 h-1 bg-current opacity-30 animate-shrink"
          [style.animation-duration]="toast.duration + 'ms'">
        </div>
        
        <div class="flex items-start">
          <!-- Icon -->
          <div class="flex-shrink-0">
            <i [ngClass]="getIconClass(toast)" class="text-lg"></i>
          </div>
          
          <!-- Content -->
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium" [ngClass]="getTitleClass(toast)">
              {{ toast.title }}
            </p>
            <p *ngIf="toast.message" class="mt-1 text-sm" [ngClass]="getMessageClass(toast)">
              {{ toast.message }}
            </p>
          </div>
          
          <!-- Close button -->
          <div class="ml-4 flex-shrink-0">
            <button
              type="button"
              (click)="toastService.remove(toast.id)"
              class="rounded-md inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-75 transition-opacity"
              [ngClass]="getCloseButtonClass(toast)">
              <span class="sr-only">Fermer</span>
              <i class="pi pi-times text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes shrink {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }
    
    .animate-shrink {
      animation: shrink linear forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClasses(toast: Toast): string {
    const baseClasses = 'theme-bg-card border';
    
    switch (toast.type) {
      case 'success':
        return `${baseClasses} border-success-500 bg-success-50/90 dark:bg-success-900/20`;
      case 'error':
        return `${baseClasses} border-error-500 bg-error-50/90 dark:bg-error-900/20`;
      case 'warning':
        return `${baseClasses} border-warning-500 bg-warning-50/90 dark:bg-warning-900/20`;
      case 'info':
        return `${baseClasses} border-primary-500 bg-primary-50/90 dark:bg-primary-900/20`;
      default:
        return baseClasses;
    }
  }

  getIconClass(toast: Toast): string {
    switch (toast.type) {
      case 'success':
        return 'pi pi-check-circle text-success-600 dark:text-success-400';
      case 'error':
        return 'pi pi-times-circle text-error-600 dark:text-error-400';
      case 'warning':
        return 'pi pi-exclamation-triangle text-warning-600 dark:text-warning-400';
      case 'info':
        return 'pi pi-info-circle text-primary-600 dark:text-primary-400';
      default:
        return 'pi pi-info-circle text-neutral-600 dark:text-neutral-400';
    }
  }

  getTitleClass(toast: Toast): string {
    switch (toast.type) {
      case 'success':
        return 'text-success-800 dark:text-success-200';
      case 'error':
        return 'text-error-800 dark:text-error-200';
      case 'warning':
        return 'text-warning-800 dark:text-warning-200';
      case 'info':
        return 'text-primary-800 dark:text-primary-200';
      default:
        return 'theme-text-card';
    }
  }

  getMessageClass(toast: Toast): string {
    switch (toast.type) {
      case 'success':
        return 'text-success-700 dark:text-success-300';
      case 'error':
        return 'text-error-700 dark:text-error-300';
      case 'warning':
        return 'text-warning-700 dark:text-warning-300';
      case 'info':
        return 'text-primary-700 dark:text-primary-300';
      default:
        return 'theme-text-muted';
    }
  }

  getCloseButtonClass(toast: Toast): string {
    switch (toast.type) {
      case 'success':
        return 'text-success-500 focus:ring-success-500';
      case 'error':
        return 'text-error-500 focus:ring-error-500';
      case 'warning':
        return 'text-warning-500 focus:ring-warning-500';
      case 'info':
        return 'text-primary-500 focus:ring-primary-500';
      default:
        return 'theme-text-muted focus:ring-primary-500';
    }
  }
}