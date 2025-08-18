import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  private nextId = 1;

  // Read-only signal for components to subscribe to
  readonly toasts$ = this.toasts.asReadonly();

  show(toast: Omit<Toast, 'id'>): string {
    const id = `toast-${this.nextId++}`;
    const newToast: Toast = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast
    };

    this.toasts.update(toasts => [...toasts, newToast]);

    // Auto-dismiss if not persistent
    if (!newToast.persistent && newToast.duration) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    }

    return id;
  }

  success(title: string, message?: string, options?: Partial<Toast>): string {
    return this.show({
      type: 'success',
      title,
      message,
      ...options
    });
  }

  error(title: string, message?: string, options?: Partial<Toast>): string {
    return this.show({
      type: 'error',
      title,
      message,
      ...options
    });
  }

  warning(title: string, message?: string, options?: Partial<Toast>): string {
    return this.show({
      type: 'warning',
      title,
      message,
      ...options
    });
  }

  info(title: string, message?: string, options?: Partial<Toast>): string {
    return this.show({
      type: 'info',
      title,
      message,
      ...options
    });
  }

  remove(id: string): void {
    this.toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}