import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [ButtonModule, TooltipModule],
  template: `
    <p-button 
      [icon]="themeService.getThemeIcon()"
      (click)="themeService.toggleTheme()"
      [pTooltip]="themeService.getThemeLabel()"
      tooltipPosition="bottom"
      styleClass="p-button-text p-button-rounded theme-toggle"
      [attr.aria-label]="'Basculer vers ' + getNextThemeLabel()">
    </p-button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    .theme-toggle {
      min-height: 44px !important;
      min-width: 44px !important;
      touch-action: manipulation;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }
    
    @media (hover: hover) {
      .theme-toggle:hover {
        transform: scale(1.1);
      }
    }
    
    .theme-toggle:active {
      transform: scale(0.95);
    }
    
    @media (max-width: 640px) {
      .theme-toggle {
        min-height: 48px !important;
        min-width: 48px !important;
      }
    }
  `]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);

  getNextThemeLabel(): string {
    const current = this.themeService.theme();
    switch (current) {
      case 'light':
        return 'mode sombre';
      case 'dark':
        return 'mode système';
      case 'system':
        return 'mode clair';
      default:
        return 'mode sombre';
    }
  }
}