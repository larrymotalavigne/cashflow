import { Injectable, signal } from '@angular/core';

export interface ConfirmationDialogConfig {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'warning' | 'info';
  persistent?: boolean;
}

export interface ConfirmationResult {
  confirmed: boolean;
  dialogId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private dialogs = signal<ConfirmationDialogConfig[]>([]);
  private nextId = 1;
  private confirmationPromises = new Map<string, { resolve: (result: ConfirmationResult) => void }>();

  // Read-only signal for components to subscribe to
  readonly dialogs$ = this.dialogs.asReadonly();

  async confirm(config: Omit<ConfirmationDialogConfig, 'id'>): Promise<ConfirmationResult> {
    const id = `confirmation-${this.nextId++}`;
    const dialogConfig: ConfirmationDialogConfig = {
      id,
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      type: 'default',
      ...config
    };

    // Add dialog to the list
    this.dialogs.update(dialogs => [...dialogs, dialogConfig]);

    // Create and store promise
    return new Promise<ConfirmationResult>((resolve) => {
      this.confirmationPromises.set(id, { resolve });
    });
  }

  async confirmDanger(title: string, message: string, confirmText: string = 'Supprimer'): Promise<ConfirmationResult> {
    return this.confirm({
      title,
      message,
      confirmText,
      type: 'danger'
    });
  }

  async confirmWarning(title: string, message: string, confirmText: string = 'Continuer'): Promise<ConfirmationResult> {
    return this.confirm({
      title,
      message,
      confirmText,
      type: 'warning'
    });
  }

  async confirmInfo(title: string, message: string, confirmText: string = 'OK'): Promise<ConfirmationResult> {
    return this.confirm({
      title,
      message,
      confirmText,
      type: 'info'
    });
  }

  resolveDialog(dialogId: string, confirmed: boolean): void {
    const promise = this.confirmationPromises.get(dialogId);
    if (promise) {
      promise.resolve({ confirmed, dialogId });
      this.confirmationPromises.delete(dialogId);
    }

    // Remove dialog from the list
    this.dialogs.update(dialogs => dialogs.filter(dialog => dialog.id !== dialogId));
  }

  cancelAll(): void {
    // Resolve all pending dialogs as cancelled
    this.confirmationPromises.forEach((promise, dialogId) => {
      promise.resolve({ confirmed: false, dialogId });
    });
    
    // Clear all
    this.confirmationPromises.clear();
    this.dialogs.set([]);
  }
}