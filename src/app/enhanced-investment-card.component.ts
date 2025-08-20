import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { Investment, InvestmentSector } from './data';
import { GameConfigService } from './game-config.service';
import { GameService } from './game.service';
import { FinancialCounterComponent } from './loading.component';

@Component({
  selector: 'app-enhanced-investment-card',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, BadgeModule, TooltipModule, CheckboxModule, FinancialCounterComponent],
  template: `
    <div class="investment-card theme-bg-card theme-shadow-md hover:theme-shadow-lg transition-all duration-300 rounded-xl border theme-border overflow-hidden group hover:scale-[1.02] cursor-pointer"
         [ngClass]="getCardClasses()">
      
      <!-- Header Section -->
      <div class="card-header p-4 pb-3 border-b theme-border">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <div *ngIf="comparisonMode" class="flex-shrink-0">
                <p-checkbox 
                  [(ngModel)]="isSelected" 
                  (onChange)="onSelectionChange()"
                  [inputId]="'select-' + investment.name">
                </p-checkbox>
              </div>
              <h3 class="text-lg font-bold theme-text-card line-clamp-2 flex-1">
                {{ investment.name }}
              </h3>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [ngClass]="getTypeBadgeClasses(investment.type)">
                {{ getTypeIcon(investment.type) }} {{ investment.type }}
              </span>
              <span *ngIf="investment.sector" 
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [ngClass]="getSectorBadgeClasses()"
                    [pTooltip]="getSectorTooltip()" 
                    tooltipPosition="top">
                <i class="pi text-xs mr-1" [ngClass]="getSectorIcon()"></i>
                {{ getSectorName() }}
              </span>
              <div class="flex items-center gap-1" [pTooltip]="getRiskTooltip()" tooltipPosition="top">
                <i class="pi text-xs" [ngClass]="getRiskIcon()"></i>
                <span class="text-xs theme-text-muted">{{ getRiskLevel() }}</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end">
            <div class="roi-indicator mb-1" [ngClass]="getROIIndicatorClass()">
              <span class="text-sm font-bold">{{ getROI() }}%</span>
            </div>
            <span class="text-xs theme-text-muted">ROI annuel</span>
          </div>
        </div>
      </div>

      <!-- Metrics Section -->
      <div class="card-metrics p-4 py-3">
        <div class="grid grid-cols-2 gap-4">
          <!-- Price -->
          <div class="metric-item">
            <div class="flex items-center gap-1 mb-1">
              <i class="pi pi-euro text-warning-500 text-xs"></i>
              <span class="text-xs font-medium theme-text-muted uppercase tracking-wide">Prix</span>
            </div>
            <app-financial-counter 
              [value]="investment.amount" 
              [animate]="false"
              class="metric-value">
            </app-financial-counter>
          </div>

          <!-- Monthly Return -->
          <div class="metric-item">
            <div class="flex items-center gap-1 mb-1">
              <i class="pi pi-chart-line text-success-500 text-xs"></i>
              <span class="text-xs font-medium theme-text-muted uppercase tracking-wide">Mensuel</span>
            </div>
            <app-financial-counter 
              [value]="investment.income" 
              [animate]="false"
              class="metric-value">
            </app-financial-counter>
          </div>
        </div>

        <!-- Payback Period -->
        <div class="mt-3 flex items-center justify-between">
          <div class="flex items-center gap-1">
            <i class="pi pi-clock text-primary-500 text-xs"></i>
            <span class="text-xs theme-text-muted">Rentabilité:</span>
          </div>
          <span class="text-sm font-semibold theme-text-card">{{ getPaybackPeriod() }} mois</span>
        </div>

        <!-- Progress Bar for ROI -->
        <div class="mt-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs theme-text-muted">Performance</span>
            <span class="text-xs font-medium" [ngClass]="getROITextClass()">{{ getPerformanceRating() }}</span>
          </div>
          <div class="w-full theme-bg-muted rounded-full h-1.5">
            <div 
              class="h-1.5 rounded-full transition-all duration-500"
              [ngClass]="getROIBarClass()"
              [style.width.%]="getROIBarWidth()">
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="card-actions p-4 pt-3 bg-gradient-to-r from-neutral-50/50 to-primary-50/30 dark:from-neutral-800/50 dark:to-primary-900/30">
        <div class="grid grid-cols-1 gap-2" [ngClass]="comparisonMode ? 'grid-cols-1' : 'grid-cols-2'">
          
          <!-- Primary Actions -->
          <div *ngIf="!comparisonMode" class="flex flex-col gap-2">
            <!-- Buy Button -->
            <p-button 
              [label]="canAfford ? 'Acheter' : 'Fonds insuffisants'" 
              [icon]="canAfford ? 'pi pi-shopping-cart' : 'pi pi-exclamation-triangle'"
              (click)="onBuy()" 
              [disabled]="!canAfford"
              [styleClass]="'w-full p-button-sm ' + (canAfford ? 'p-button-success' : 'p-button-warning')"
              [pTooltip]="canAfford ? 'Acheter avec vos liquidités' : 'Vous n\\'avez pas assez de liquidités'">
            </p-button>

            <!-- Loan Button -->
            <p-button 
              [label]="'Emprunt (' + (configService.loanRate * 100) + '%)'" 
              icon="pi pi-credit-card"
              (click)="onBuyWithLoan()" 
              styleClass="w-full p-button-sm p-button-info p-button-outlined"
              [pTooltip]="'Acheter avec un emprunt (frais: ' + (configService.loanRate * 100) + '%)'">
            </p-button>
          </div>

          <!-- Secondary Actions -->
          <div class="flex flex-col gap-2">
            <p-button 
              label="Refuser" 
              icon="pi pi-times"
              (click)="onReject()" 
              styleClass="w-full p-button-sm p-button-danger p-button-outlined"
              pTooltip="Rejeter cette opportunité">
            </p-button>

            <p-button 
              *ngIf="!comparisonMode"
              label="Comparer" 
              icon="pi pi-chart-bar"
              (click)="onCompare()" 
              styleClass="w-full p-button-sm p-button-secondary p-button-outlined"
              pTooltip="Ajouter à la comparaison">
            </p-button>
          </div>
        </div>
      </div>

      <!-- Hover Overlay for Additional Info -->
      <div class="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
    </div>
  `,
  styles: [`
    .investment-card {
      position: relative;
      min-height: 320px;
      max-width: 400px;
    }

    .roi-indicator {
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: 700;
      text-align: center;
      min-width: 60px;
    }

    .metric-value {
      font-size: 1.125rem;
      font-weight: 700;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Animation for hover states */
    .investment-card:hover .roi-indicator {
      transform: scale(1.05);
      transition: transform 0.2s ease-out;
    }

    /* Performance bar animations */
    .performance-bar {
      animation: fillBar 1s ease-out;
    }
  `]
})
export class EnhancedInvestmentCardComponent {
  @Input() investment!: Investment;
  @Input() comparisonMode: boolean = false;
  @Input() isSelected: boolean = false;
  
  @Output() buy = new EventEmitter<Investment>();
  @Output() buyWithLoan = new EventEmitter<Investment>();
  @Output() reject = new EventEmitter<Investment>();
  @Output() compare = new EventEmitter<Investment>();
  @Output() selectionChange = new EventEmitter<{investment: Investment, selected: boolean}>();

  constructor(
    public gameService: GameService,
    public configService: GameConfigService
  ) {}

  get canAfford(): boolean {
    return this.gameService.canBuy(this.investment);
  }

  getROI(): string {
    const roi = (this.investment.income * 12 / this.investment.amount) * 100;
    return roi.toFixed(1);
  }

  getROIValue(): number {
    return (this.investment.income * 12 / this.investment.amount) * 100;
  }

  getPaybackPeriod(): number {
    return Math.ceil(this.investment.amount / this.investment.income);
  }

  getTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'Immobilier': '🏠',
      'Actions': '📈',
      'Obligations': '📋',
      'Crypto': '₿',
      'Matières premières': '🥇',
      'Business': '💼'
    };
    return iconMap[type] || '💰';
  }

  getTypeBadgeClasses(type: string): string {
    const colorMap: { [key: string]: string } = {
      'Immobilier': 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300',
      'Actions': 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300',
      'Obligations': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      'Crypto': 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300',
      'Matières premières': 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-300',
      'Business': 'bg-accent-100 text-accent-800 dark:bg-accent-900/20 dark:text-accent-300'
    };
    return colorMap[type] || 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/20 dark:text-neutral-300';
  }

  getRiskLevel(): string {
    // Use new risk assessment system (Task 1.3)
    if (this.investment.riskCategory) {
      switch (this.investment.riskCategory) {
        case 'very_high': return 'Très élevé';
        case 'high': return 'Élevé';
        case 'medium': return 'Moyen';
        case 'low': return 'Faible';
        default: return 'Moyen';
      }
    }
    
    // Fallback to old ROI-based system
    const roi = this.getROIValue();
    if (roi > 20) return 'Élevé';
    if (roi > 12) return 'Moyen';
    return 'Faible';
  }

  getRiskIcon(): string {
    // Use new risk assessment system (Task 1.3)
    if (this.investment.riskCategory) {
      switch (this.investment.riskCategory) {
        case 'very_high': return 'pi-exclamation-triangle text-error-600';
        case 'high': return 'pi-exclamation-triangle text-error-500';
        case 'medium': return 'pi-info-circle text-warning-500';
        case 'low': return 'pi-shield text-success-500';
        default: return 'pi-info-circle text-warning-500';
      }
    }
    
    // Fallback to old ROI-based system
    const roi = this.getROIValue();
    if (roi > 20) return 'pi-exclamation-triangle text-error-500';
    if (roi > 12) return 'pi-info-circle text-warning-500';
    return 'pi-shield text-success-500';
  }

  getRiskTooltip(): string {
    // Use new risk assessment system (Task 1.3)
    if (this.investment.riskScore && this.investment.volatility) {
      const volatilityPercent = Math.round(this.investment.volatility * 100);
      switch (this.investment.riskCategory) {
        case 'very_high': 
          return `Risque très élevé (${this.investment.riskScore}/10) - Volatilité: ${volatilityPercent}% - Rendements très variables`;
        case 'high': 
          return `Risque élevé (${this.investment.riskScore}/10) - Volatilité: ${volatilityPercent}% - Rendements volatils`;
        case 'medium': 
          return `Risque modéré (${this.investment.riskScore}/10) - Volatilité: ${volatilityPercent}% - Équilibre risque/rendement`;
        case 'low': 
          return `Risque faible (${this.investment.riskScore}/10) - Volatilité: ${volatilityPercent}% - Rendements stables`;
        default: 
          return `Score de risque: ${this.investment.riskScore}/10 - Volatilité: ${volatilityPercent}%`;
      }
    }
    
    // Fallback to old ROI-based system
    const roi = this.getROIValue();
    if (roi > 20) return 'Investissement à haut risque - rendements élevés mais volatils';
    if (roi > 12) return 'Investissement à risque modéré - équilibre risque/rendement';
    return 'Investissement sûr - rendements stables et prévisibles';
  }

  getROIIndicatorClass(): string {
    const roi = this.getROIValue();
    if (roi > 15) return 'bg-success-500 text-white';
    if (roi > 8) return 'bg-primary-500 text-white';
    if (roi > 0) return 'bg-warning-500 text-white';
    return 'bg-error-500 text-white';
  }

  getROITextClass(): string {
    const roi = this.getROIValue();
    if (roi > 15) return 'text-success-600 dark:text-success-400';
    if (roi > 8) return 'text-primary-600 dark:text-primary-400';
    if (roi > 0) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  }

  getROIBarClass(): string {
    const roi = this.getROIValue();
    if (roi > 15) return 'bg-success-500';
    if (roi > 8) return 'bg-primary-500';
    if (roi > 0) return 'bg-warning-500';
    return 'bg-error-500';
  }

  getROIBarWidth(): number {
    const roi = this.getROIValue();
    // Map ROI to a 0-100 scale for the progress bar
    return Math.min(roi * 3, 100); // 33% ROI = 100% bar
  }

  getPerformanceRating(): string {
    const roi = this.getROIValue();
    if (roi > 15) return 'Excellent';
    if (roi > 8) return 'Bon';
    if (roi > 0) return 'Correct';
    return 'Faible';
  }

  getCardClasses(): string {
    let classes = '';
    if (this.isSelected) {
      classes += 'ring-2 ring-primary-500 ';
    }
    if (!this.canAfford && !this.comparisonMode) {
      classes += 'opacity-75 ';
    }
    return classes;
  }

  onBuy(): void {
    if (this.canAfford) {
      this.buy.emit(this.investment);
    }
  }

  onBuyWithLoan(): void {
    this.buyWithLoan.emit(this.investment);
  }

  onReject(): void {
    this.reject.emit(this.investment);
  }

  onCompare(): void {
    this.compare.emit(this.investment);
  }

  onSelectionChange(): void {
    this.selectionChange.emit({
      investment: this.investment,
      selected: this.isSelected
    });
  }

  // Sector display methods for Task 1.6
  getSectorName(): string {
    if (!this.investment.sector) return '';
    
    switch (this.investment.sector) {
      case 'technology': return 'Technologie';
      case 'healthcare': return 'Santé';
      case 'real_estate': return 'Immobilier';
      case 'finance': return 'Finance';
      case 'energy': return 'Énergie';
      case 'consumer_goods': return 'Biens de consommation';
      case 'utilities': return 'Services publics';
      case 'telecommunications': return 'Télécommunications';
      case 'industrials': return 'Industriels';
      case 'materials': return 'Matériaux';
      default: return '';
    }
  }

  getSectorIcon(): string {
    if (!this.investment.sector) return 'pi-tag';
    
    switch (this.investment.sector) {
      case 'technology': return 'pi-desktop';
      case 'healthcare': return 'pi-heart';
      case 'real_estate': return 'pi-home';
      case 'finance': return 'pi-dollar';
      case 'energy': return 'pi-bolt';
      case 'consumer_goods': return 'pi-shopping-bag';
      case 'utilities': return 'pi-cog';
      case 'telecommunications': return 'pi-phone';
      case 'industrials': return 'pi-building';
      case 'materials': return 'pi-box';
      default: return 'pi-tag';
    }
  }

  getSectorBadgeClasses(): string {
    if (!this.investment.sector) return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    
    switch (this.investment.sector) {
      case 'technology': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'healthcare': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'real_estate': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'finance': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'energy': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'consumer_goods': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'utilities': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'telecommunications': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300';
      case 'industrials': return 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300';
      case 'materials': return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
      default: return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300';
    }
  }

  getSectorTooltip(): string {
    if (!this.investment.sector) return '';
    
    const sectorName = this.getSectorName();
    const riskMultiplier = this.investment.sectorRiskMultiplier || 1;
    const returnMultiplier = this.investment.sectorReturnMultiplier || 1;
    
    return `Secteur ${sectorName} - Risque: ${(riskMultiplier * 100).toFixed(0)}%, Rendement: ${(returnMultiplier * 100).toFixed(0)}%`;
  }
}