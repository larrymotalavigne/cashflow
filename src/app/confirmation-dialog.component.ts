import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationDialogService, ConfirmationDialogConfig } from './confirmation-dialog.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-confirmation-dialogs',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  animations: [
    trigger('dialogAnimation', [
      state('in', style({ opacity: 1, transform: 'scale(1)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out')
      ]),
      transition('* => void', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ])
  ],
  template: `
    <div *ngFor="let dialog of confirmationService.dialogs$()" [@dialogAnimation]>
      <p-dialog 
        [visible]="true"
        [modal]="true"
        [closable]="false"
        [header]="dialog.title"
        [style]="{width: '450px'}"
        styleClass="confirmation-dialog theme-bg-card">
        
        <div class="confirmation-content">
          <!-- Icon based on dialog type -->
          <div class="flex items-start mb-4">
            <div class="flex-shrink-0 mr-4">
              <div [ngClass]="getIconWrapperClass(dialog)" class="w-12 h-12 rounded-full flex items-center justify-center">
                <i [ngClass]="getIconClass(dialog)" class="text-2xl"></i>
              </div>
            </div>
            <div class="flex-1">
              <p class="theme-text-card text-base leading-relaxed">
                {{ dialog.message }}
              </p>
            </div>
          </div>
        </div>
        
        <ng-template pTemplate="footer">
          <div class="flex justify-end gap-3">
            <p-button 
              [label]="dialog.cancelText || 'Annuler'"
              (click)="confirmationService.resolveDialog(dialog.id, false)"
              [styleClass]="'p-button-outlined ' + getCancelButtonClass(dialog)"
              size="small">
            </p-button>
            <p-button 
              [label]="dialog.confirmText || 'Confirmer'"
              (click)="confirmationService.resolveDialog(dialog.id, true)"
              [styleClass]="getConfirmButtonClass(dialog)"
              size="small">
            </p-button>
          </div>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    :host {
      position: relative;
      z-index: 1000;
    }
    
    .confirmation-content {
      min-height: 80px;
    }
    
    .confirmation-dialog {
      z-index: 1001;
    }
    
    /* Custom focus styles */
    .p-button:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
    }
  `]
})
export class ConfirmationDialogComponent {
  confirmationService = inject(ConfirmationDialogService);

  getIconWrapperClass(dialog: ConfirmationDialogConfig): string {
    switch (dialog.type) {
      case 'danger':
        return 'bg-error-100 dark:bg-error-900/20';
      case 'warning':
        return 'bg-warning-100 dark:bg-warning-900/20';
      case 'info':
        return 'bg-primary-100 dark:bg-primary-900/20';
      default:
        return 'bg-neutral-100 dark:bg-neutral-800';
    }
  }

  getIconClass(dialog: ConfirmationDialogConfig): string {
    switch (dialog.type) {
      case 'danger':
        return 'pi pi-exclamation-triangle text-error-600 dark:text-error-400';
      case 'warning':
        return 'pi pi-exclamation-triangle text-warning-600 dark:text-warning-400';
      case 'info':
        return 'pi pi-info-circle text-primary-600 dark:text-primary-400';
      default:
        return 'pi pi-question-circle text-neutral-600 dark:text-neutral-400';
    }
  }

  getConfirmButtonClass(dialog: ConfirmationDialogConfig): string {
    switch (dialog.type) {
      case 'danger':
        return 'p-button-danger';
      case 'warning':
        return 'p-button-warning';
      case 'info':
        return 'p-button-info';
      default:
        return '';
    }
  }

  getCancelButtonClass(dialog: ConfirmationDialogConfig): string {
    switch (dialog.type) {
      case 'danger':
        return 'p-button-outlined-secondary';
      case 'warning':
        return 'p-button-outlined-secondary';
      case 'info':
        return 'p-button-outlined-secondary';
      default:
        return '';
    }
  }
}