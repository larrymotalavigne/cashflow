import { Injectable, ElementRef, signal } from '@angular/core';

export interface FocusableElement {
  id: string;
  element: HTMLElement;
  priority: number;
  group?: string;
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  callback: () => void;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {
  private focusableElements = signal<FocusableElement[]>([]);
  private shortcuts = signal<KeyboardShortcut[]>([]);
  private currentFocusIndex = signal<number>(-1);
  private isEnabled = signal<boolean>(true);

  // Read-only signals
  readonly focusableElements$ = this.focusableElements.asReadonly();
  readonly shortcuts$ = this.shortcuts.asReadonly();
  readonly currentFocusIndex$ = this.currentFocusIndex.asReadonly();
  readonly isEnabled$ = this.isEnabled.asReadonly();

  constructor() {
    this.setupGlobalKeyboardListeners();
  }

  private setupGlobalKeyboardListeners(): void {
    document.addEventListener('keydown', (event) => {
      if (!this.isEnabled()) return;

      // Handle keyboard shortcuts
      if (this.handleShortcuts(event)) {
        return;
      }

      // Handle navigation keys
      this.handleNavigationKeys(event);
    });

    // Handle focus trap for modals
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        this.handleTabNavigation(event);
      }
    });
  }

  private handleShortcuts(event: KeyboardEvent): boolean {
    const shortcuts = this.shortcuts();
    
    for (const shortcut of shortcuts) {
      const ctrlMatch = !shortcut.ctrlKey || event.ctrlKey;
      const altMatch = !shortcut.altKey || event.altKey;
      const shiftMatch = !shortcut.shiftKey || event.shiftKey;
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
        event.preventDefault();
        shortcut.callback();
        return true;
      }
    }

    return false;
  }

  private handleNavigationKeys(event: KeyboardEvent): void {
    const elements = this.focusableElements();
    if (elements.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this.focusNext();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this.focusPrevious();
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirst();
        break;
      case 'End':
        event.preventDefault();
        this.focusLast();
        break;
      case 'Escape':
        event.preventDefault();
        this.clearFocus();
        break;
    }
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    const modalElements = document.querySelectorAll('[role="dialog"]:not([hidden])');
    if (modalElements.length === 0) return;

    // Find the topmost modal
    const modal = modalElements[modalElements.length - 1] as HTMLElement;
    const focusableElements = this.getFocusableElementsInContainer(modal);
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift+Tab - go backwards
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab - go forwards
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private getFocusableElementsInContainer(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled]):not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      'a[href]:not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]:not([tabindex="-1"])'
    ];

    return Array.from(container.querySelectorAll(focusableSelectors.join(', '))) as HTMLElement[];
  }

  registerFocusableElement(element: HTMLElement, id: string, priority: number = 0, group?: string): void {
    const focusableElement: FocusableElement = {
      id,
      element,
      priority,
      group
    };

    this.focusableElements.update(elements => {
      const filtered = elements.filter(el => el.id !== id);
      return [...filtered, focusableElement].sort((a, b) => b.priority - a.priority);
    });
  }

  unregisterFocusableElement(id: string): void {
    this.focusableElements.update(elements => elements.filter(el => el.id !== id));
  }

  registerShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.update(shortcuts => [...shortcuts, shortcut]);
  }

  unregisterShortcut(key: string, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean): void {
    this.shortcuts.update(shortcuts => 
      shortcuts.filter(s => !(
        s.key === key &&
        s.ctrlKey === ctrlKey &&
        s.altKey === altKey &&
        s.shiftKey === shiftKey
      ))
    );
  }

  focusNext(): void {
    const elements = this.focusableElements();
    if (elements.length === 0) return;

    const currentIndex = this.currentFocusIndex();
    const nextIndex = currentIndex >= elements.length - 1 ? 0 : currentIndex + 1;
    
    this.focusElementAtIndex(nextIndex);
  }

  focusPrevious(): void {
    const elements = this.focusableElements();
    if (elements.length === 0) return;

    const currentIndex = this.currentFocusIndex();
    const prevIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
    
    this.focusElementAtIndex(prevIndex);
  }

  focusFirst(): void {
    this.focusElementAtIndex(0);
  }

  focusLast(): void {
    const elements = this.focusableElements();
    if (elements.length > 0) {
      this.focusElementAtIndex(elements.length - 1);
    }
  }

  focusElement(id: string): void {
    const elements = this.focusableElements();
    const index = elements.findIndex(el => el.id === id);
    if (index !== -1) {
      this.focusElementAtIndex(index);
    }
  }

  clearFocus(): void {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.currentFocusIndex.set(-1);
  }

  private focusElementAtIndex(index: number): void {
    const elements = this.focusableElements();
    if (index >= 0 && index < elements.length) {
      const element = elements[index];
      element.element.focus();
      this.currentFocusIndex.set(index);
    }
  }

  enable(): void {
    this.isEnabled.set(true);
  }

  disable(): void {
    this.isEnabled.set(false);
  }

  getShortcutHelp(): string[] {
    return this.shortcuts().map(shortcut => {
      const keys = [];
      if (shortcut.ctrlKey) keys.push('Ctrl');
      if (shortcut.altKey) keys.push('Alt');
      if (shortcut.shiftKey) keys.push('Shift');
      keys.push(shortcut.key.toUpperCase());
      
      return `${keys.join('+')} - ${shortcut.description}`;
    });
  }
}