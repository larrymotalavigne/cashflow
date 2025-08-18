import { Injectable, signal } from '@angular/core';

export interface AccessibilitySettings {
  screenReaderEnabled: boolean;
  highContrastEnabled: boolean;
  reducedMotionEnabled: boolean;
  keyboardOnlyNavigation: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private readonly SETTINGS_KEY = 'cashflow-accessibility';
  
  // Live region for screen reader announcements
  private liveRegion: HTMLElement | null = null;
  
  // Accessibility settings signal
  settings = signal<AccessibilitySettings>({
    screenReaderEnabled: false,
    highContrastEnabled: false,
    reducedMotionEnabled: false,
    keyboardOnlyNavigation: false
  });

  constructor() {
    this.loadSettings();
    this.createLiveRegion();
    this.detectAccessibilityPreferences();
  }

  private loadSettings(): void {
    const savedSettings = localStorage.getItem(this.SETTINGS_KEY);
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        this.settings.set({ ...this.settings(), ...settings });
      } catch (error) {
        console.warn('Failed to load accessibility settings:', error);
      }
    }
  }

  private saveSettings(): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings()));
  }

  private createLiveRegion(): void {
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.setAttribute('class', 'sr-only');
    this.liveRegion.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;
    document.body.appendChild(this.liveRegion);
  }

  private detectAccessibilityPreferences(): void {
    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      this.updateSetting('reducedMotionEnabled', true);
    }

    // Detect high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    if (prefersHighContrast) {
      this.updateSetting('highContrastEnabled', true);
    }

    // Listen for changes in accessibility preferences
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.updateSetting('reducedMotionEnabled', e.matches);
    });

    window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
      this.updateSetting('highContrastEnabled', e.matches);
    });
  }

  updateSetting<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ): void {
    this.settings.update(settings => ({
      ...settings,
      [key]: value
    }));
    this.saveSettings();
    this.applyAccessibilitySettings();
  }

  private applyAccessibilitySettings(): void {
    const settings = this.settings();
    const htmlElement = document.documentElement;

    // Apply high contrast mode
    if (settings.highContrastEnabled) {
      htmlElement.classList.add('high-contrast');
    } else {
      htmlElement.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (settings.reducedMotionEnabled) {
      htmlElement.classList.add('reduce-motion');
    } else {
      htmlElement.classList.remove('reduce-motion');
    }

    // Apply keyboard-only navigation
    if (settings.keyboardOnlyNavigation) {
      htmlElement.classList.add('keyboard-only');
    } else {
      htmlElement.classList.remove('keyboard-only');
    }
  }

  // Screen reader announcements
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.liveRegion || !this.settings().screenReaderEnabled) return;

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = message;

    // Clear the message after a short delay to allow for re-announcements
    setTimeout(() => {
      if (this.liveRegion) {
        this.liveRegion.textContent = '';
      }
    }, 1000);
  }

  // Announce financial changes
  announceFinancialChange(type: 'income' | 'expense' | 'investment' | 'cash', 
                         amount: number, 
                         description?: string): void {
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(Math.abs(amount));

    let message = '';
    switch (type) {
      case 'income':
        message = `Revenu ajouté: ${formattedAmount}`;
        break;
      case 'expense':
        message = `Dépense: ${formattedAmount}`;
        break;
      case 'investment':
        message = `Investissement ${amount > 0 ? 'acheté' : 'vendu'}: ${formattedAmount}`;
        break;
      case 'cash':
        message = `Solde mis à jour: ${formattedAmount}`;
        break;
    }

    if (description) {
      message += ` - ${description}`;
    }

    this.announce(message, 'polite');
  }

  // Skip links functionality
  addSkipLink(targetId: string, label: string): void {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = label;
    skipLink.className = 'skip-link';
    skipLink.setAttribute('tabindex', '0');
    
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Insert at beginning of body
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Focus management
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    firstElement.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  // ARIA label helpers
  setAriaLabel(element: HTMLElement, label: string): void {
    element.setAttribute('aria-label', label);
  }

  setAriaDescription(element: HTMLElement, description: string): void {
    const descId = `desc-${Math.random().toString(36).substr(2, 9)}`;
    const descElement = document.createElement('span');
    descElement.id = descId;
    descElement.textContent = description;
    descElement.className = 'sr-only';
    
    element.appendChild(descElement);
    element.setAttribute('aria-describedby', descId);
  }

  // Keyboard navigation helpers
  makeKeyboardFocusable(element: HTMLElement): void {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    element.classList.add('keyboard-focusable');
  }

  removeKeyboardFocus(element: HTMLElement): void {
    element.setAttribute('tabindex', '-1');
    element.classList.remove('keyboard-focusable');
  }
}