import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'cashflow-theme';
  
  // Signal to track current theme
  theme = signal<Theme>('system');
  
  // Signal to track effective theme (resolved system preference)
  effectiveTheme = signal<'light' | 'dark'>('light');

  constructor() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme) {
      this.theme.set(savedTheme);
    }

    // Set up effect to apply theme changes
    effect(() => {
      this.applyTheme();
    });

    // Listen for system theme changes
    this.setupSystemThemeListener();
    
    // Set initial effective theme
    this.updateEffectiveTheme();
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.updateEffectiveTheme();
  }

  toggleTheme(): void {
    const current = this.theme();
    if (current === 'light') {
      this.setTheme('dark');
    } else if (current === 'dark') {
      this.setTheme('system');
    } else {
      this.setTheme('light');
    }
  }

  private updateEffectiveTheme(): void {
    const theme = this.theme();
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.effectiveTheme.set(isDark ? 'dark' : 'light');
    } else {
      this.effectiveTheme.set(theme);
    }
  }

  private applyTheme(): void {
    const effectiveTheme = this.effectiveTheme();
    const htmlElement = document.documentElement;
    
    if (effectiveTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', effectiveTheme === 'dark' ? '#0f172a' : '#ffffff');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = effectiveTheme === 'dark' ? '#0f172a' : '#ffffff';
      document.head.appendChild(meta);
    }
  }

  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.theme() === 'system') {
        this.updateEffectiveTheme();
      }
    });
  }

  // Helper method to get theme icon
  getThemeIcon(): string {
    switch (this.theme()) {
      case 'light':
        return 'pi pi-sun';
      case 'dark':
        return 'pi pi-moon';
      case 'system':
        return 'pi pi-desktop';
      default:
        return 'pi pi-sun';
    }
  }

  // Helper method to get theme label
  getThemeLabel(): string {
    switch (this.theme()) {
      case 'light':
        return 'Mode clair';
      case 'dark':
        return 'Mode sombre';
      case 'system':
        return 'Système';
      default:
        return 'Mode clair';
    }
  }
}