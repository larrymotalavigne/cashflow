import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TranslationService } from './translation.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [ButtonModule, TooltipModule],
  template: `
    <p-button 
      [icon]="translationService.getLanguageIcon()"
      (click)="translationService.toggleLanguage()"
      [pTooltip]="translationService.translate('accessibility.toggleLanguage')"
      tooltipPosition="bottom"
      styleClass="p-button-text p-button-rounded language-toggle"
      [attr.aria-label]="getToggleAriaLabel()">
    </p-button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    .language-toggle {
      min-height: 44px !important;
      min-width: 44px !important;
      touch-action: manipulation;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }
    
    @media (hover: hover) {
      .language-toggle:hover {
        transform: scale(1.1);
      }
    }
    
    .language-toggle:active {
      transform: scale(0.95);
    }
    
    @media (max-width: 640px) {
      .language-toggle {
        min-height: 48px !important;
        min-width: 48px !important;
      }
    }
  `]
})
export class LanguageToggleComponent {
  translationService = inject(TranslationService);

  getToggleAriaLabel(): string {
    const current = this.translationService.language();
    const next = current === 'fr' ? 'English' : 'Français';
    return `Switch to ${next}`;
  }
}