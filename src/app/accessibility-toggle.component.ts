import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { AccessibilityService } from './accessibility.service';
import { TranslationService } from './translation.service';

@Component({
  selector: 'app-accessibility-toggle',
  standalone: true,
  imports: [ButtonModule, MenuModule, TooltipModule],
  template: `
    <div class="accessibility-controls flex align-items-center gap-2">
      <!-- Language Toggle -->
      <p-button 
        [icon]="'pi pi-globe'"
        [label]="translationService.getLanguageIcon()"
        (click)="translationService.toggleLanguage()"
        [pTooltip]="translationService.t('accessibility.toggleLanguage')"
        tooltipPosition="bottom"
        styleClass="p-button-text p-button-rounded accessibility-toggle"
        [attr.aria-label]="translationService.t('accessibility.toggleLanguage')">
      </p-button>

      <!-- Accessibility Menu -->
      <p-button 
        icon="pi pi-universal-access"
        (click)="accessibilityMenu.toggle($event)"
        [pTooltip]="'Accessibility Options'"
        tooltipPosition="bottom"
        styleClass="p-button-text p-button-rounded accessibility-toggle"
        [attr.aria-label]="'Open accessibility options'">
      </p-button>
      
      <p-menu 
        #accessibilityMenu 
        [model]="menuItems" 
        [popup]="true"
        styleClass="accessibility-menu">
      </p-menu>
    </div>
  `,
  styles: [`
    .accessibility-controls {
      position: relative;
    }
    
    .accessibility-toggle {
      min-height: 44px !important;
      min-width: 44px !important;
      touch-action: manipulation;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform;
    }
    
    @media (hover: hover) {
      .accessibility-toggle:hover {
        transform: scale(1.1);
      }
    }
    
    .accessibility-toggle:active {
      transform: scale(0.95);
    }
    
    @media (max-width: 640px) {
      .accessibility-toggle {
        min-height: 48px !important;
        min-width: 48px !important;
      }
    }

    :host ::ng-deep .accessibility-menu {
      min-width: 280px;
    }

    :host ::ng-deep .accessibility-menu .p-menuitem-link {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    :host ::ng-deep .accessibility-menu .p-menuitem-icon {
      margin-right: 8px;
    }

    :host ::ng-deep .accessibility-menu .toggle-indicator {
      width: 40px;
      height: 20px;
      background: var(--color-muted);
      border-radius: 10px;
      position: relative;
      transition: background-color 0.3s;
    }

    :host ::ng-deep .accessibility-menu .toggle-indicator::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s;
    }

    :host ::ng-deep .accessibility-menu .toggle-indicator.active {
      background: var(--color-primary);
    }

    :host ::ng-deep .accessibility-menu .toggle-indicator.active::after {
      transform: translateX(20px);
    }
  `]
})
export class AccessibilityToggleComponent {
  accessibilityService = inject(AccessibilityService);
  translationService = inject(TranslationService);

  menuItems: MenuItem[] = [
    {
      label: this.translationService.t('accessibility.toggleScreenReader'),
      icon: 'pi pi-volume-up',
      command: () => this.toggleScreenReader(),
      template: this.createToggleTemplate('screenReaderEnabled')
    },
    {
      label: this.translationService.t('accessibility.toggleHighContrast'),
      icon: 'pi pi-eye',
      command: () => this.toggleHighContrast(),
      template: this.createToggleTemplate('highContrastEnabled')
    },
    {
      separator: true
    },
    {
      label: 'Reduce Motion',
      icon: 'pi pi-pause',
      command: () => this.toggleReducedMotion(),
      template: this.createToggleTemplate('reducedMotionEnabled')
    },
    {
      label: 'Keyboard Navigation',
      icon: 'pi pi-keyboard',
      command: () => this.toggleKeyboardNavigation(),
      template: this.createToggleTemplate('keyboardOnlyNavigation')
    }
  ];

  private createToggleTemplate(settingKey: keyof typeof this.accessibilityService.settings.value) {
    return `
      <div class="p-menuitem-content" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <div style="display: flex; align-items: center;">
          <i class="p-menuitem-icon"></i>
          <span class="p-menuitem-text"></span>
        </div>
        <div class="toggle-indicator ${this.accessibilityService.settings()[settingKey] ? 'active' : ''}"></div>
      </div>
    `;
  }

  toggleScreenReader(): void {
    const current = this.accessibilityService.settings().screenReaderEnabled;
    this.accessibilityService.updateSetting('screenReaderEnabled', !current);
    
    if (!current) {
      this.accessibilityService.announce(
        this.translationService.t('accessibility.screenReaderEnabled')
      );
    }
  }

  toggleHighContrast(): void {
    const current = this.accessibilityService.settings().highContrastEnabled;
    this.accessibilityService.updateSetting('highContrastEnabled', !current);
    
    if (this.accessibilityService.settings().screenReaderEnabled) {
      this.accessibilityService.announce(
        current ? 'High contrast disabled' : this.translationService.t('accessibility.highContrastEnabled')
      );
    }
  }

  toggleReducedMotion(): void {
    const current = this.accessibilityService.settings().reducedMotionEnabled;
    this.accessibilityService.updateSetting('reducedMotionEnabled', !current);
    
    if (this.accessibilityService.settings().screenReaderEnabled) {
      this.accessibilityService.announce(
        current ? 'Motion restored' : this.translationService.t('accessibility.reducedMotionEnabled')
      );
    }
  }

  toggleKeyboardNavigation(): void {
    const current = this.accessibilityService.settings().keyboardOnlyNavigation;
    this.accessibilityService.updateSetting('keyboardOnlyNavigation', !current);
    
    if (this.accessibilityService.settings().screenReaderEnabled) {
      this.accessibilityService.announce(
        current ? 'Keyboard navigation disabled' : this.translationService.t('accessibility.keyboardNavigationEnabled')
      );
    }
  }
}