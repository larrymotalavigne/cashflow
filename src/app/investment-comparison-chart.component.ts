import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { GameService } from './game.service';
import { ThemeService } from './theme.service';
import { Subscription } from 'rxjs';

interface InvestmentPerformance {
  name: string;
  totalInvested: number;
  monthlyReturn: number;
  roi: number;
  paybackPeriod: number; // months
  type: string;
  purchaseAge: number;
}

@Component({
  selector: 'app-investment-comparison-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule, ButtonModule, DropdownModule, CheckboxModule, FormsModule],
  template: `
    <p-card class="theme-bg-card theme-shadow-lg">
      <ng-template pTemplate="header">
        <div class="flex justify-content-between align-items-center p-3">
          <h3 class="m-0 theme-text-card">📈 Comparaison des Investissements</h3>
          <div class="flex gap-2">
            <p-button 
              icon="pi pi-refresh" 
              (click)="updateData()" 
              class="p-button-outlined p-button-sm"
              pTooltip="Actualiser les données">
            </p-button>
            <p-button 
              icon="pi pi-download" 
              (click)="exportComparison()" 
              class="p-button-outlined p-button-sm"
              pTooltip="Exporter la comparaison">
            </p-button>
          </div>
        </div>
      </ng-template>
      
      <ng-template pTemplate="content">
        <div *ngIf="investmentPerformance.length === 0" class="text-center p-6">
          <div class="text-6xl mb-4">📊</div>
          <h4 class="theme-text-primary mb-2">Aucun investissement à comparer</h4>
          <p class="theme-text-muted">Achetez des investissements pour voir leur performance comparative.</p>
        </div>

        <div *ngIf="investmentPerformance.length > 0">
          <!-- Controls -->
          <div class="mb-4 p-3 theme-bg-muted rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium theme-text-primary mb-2">Type de comparaison</label>
                <p-dropdown 
                  [options]="comparisonTypes" 
                  [(ngModel)]="selectedComparisonType" 
                  (onChange)="updateChart()"
                  class="w-full">
                </p-dropdown>
              </div>
              <div>
                <label class="block text-sm font-medium theme-text-primary mb-2">Type de graphique</label>
                <p-dropdown 
                  [options]="chartTypes" 
                  [(ngModel)]="selectedChartType" 
                  (onChange)="updateChart()"
                  class="w-full">
                </p-dropdown>
              </div>
            </div>
          </div>

          <!-- Investment Performance Summary -->
          <div class="mb-4">
            <h4 class="theme-text-primary mb-3 flex items-center">
              <i class="pi pi-chart-line mr-2 text-primary-600 dark:text-primary-400"></i>
              Performance par Investissement
            </h4>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div *ngFor="let investment of investmentPerformance; trackBy: trackByName" 
                   class="p-3 theme-bg-card rounded-lg theme-shadow-sm border-l-4"
                   [style.border-left-color]="getInvestmentColor(investment.type)">
                <div class="flex justify-content-between align-items-start mb-2">
                  <h5 class="theme-text-card mb-1">{{ investment.name }}</h5>
                  <span class="text-xs theme-bg-muted px-2 py-1 rounded-full">{{ investment.type }}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span class="theme-text-muted">Investi:</span>
                    <span class="font-semibold theme-text-card ml-1">{{ formatCurrency(investment.totalInvested) }}</span>
                  </div>
                  <div>
                    <span class="theme-text-muted">ROI:</span>
                    <span class="font-semibold ml-1" [ngClass]="getROIClass(investment.roi)">
                      {{ investment.roi.toFixed(1) }}%
                    </span>
                  </div>
                  <div>
                    <span class="theme-text-muted">Retour/mois:</span>
                    <span class="font-semibold theme-text-card ml-1">{{ formatCurrency(investment.monthlyReturn) }}</span>
                  </div>
                  <div>
                    <span class="theme-text-muted">Rentabilité:</span>
                    <span class="font-semibold theme-text-card ml-1">{{ investment.paybackPeriod }} mois</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Comparison Chart -->
          <div class="chart-container mb-4" style="height: 400px;">
            <p-chart 
              [type]="selectedChartType" 
              [data]="chartData" 
              [options]="chartOptions"
              class="w-full h-full">
            </p-chart>
          </div>

          <!-- Investment Type Analysis -->
          <div class="mb-4">
            <h4 class="theme-text-primary mb-3 flex items-center">
              <i class="pi pi-objects-column mr-2 text-primary-600 dark:text-primary-400"></i>
              Analyse par Type d'Investissement
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div *ngFor="let typeStats of investmentTypeStats" 
                   class="p-4 theme-bg-muted rounded-lg text-center">
                <div class="text-2xl mb-2">{{ getTypeIcon(typeStats.type) }}</div>
                <h5 class="theme-text-primary mb-2">{{ typeStats.type }}</h5>
                <div class="space-y-1 text-sm">
                  <div>
                    <span class="theme-text-muted">Nombre:</span>
                    <span class="font-semibold theme-text-primary ml-1">{{ typeStats.count }}</span>
                  </div>
                  <div>
                    <span class="theme-text-muted">Investi total:</span>
                    <span class="font-semibold theme-text-primary ml-1">{{ formatCurrency(typeStats.totalInvested) }}</span>
                  </div>
                  <div>
                    <span class="theme-text-muted">ROI moyen:</span>
                    <span class="font-semibold ml-1" [ngClass]="getROIClass(typeStats.avgROI)">
                      {{ typeStats.avgROI.toFixed(1) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Best/Worst Performers -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 theme-bg-muted rounded-lg">
              <h5 class="theme-text-primary mb-3 flex items-center">
                <i class="pi pi-crown mr-2 text-success-600 dark:text-success-400"></i>
                Meilleur Investissement
              </h5>
              <div *ngIf="bestPerformer" class="p-3 theme-bg-card rounded-lg">
                <h6 class="theme-text-card mb-2">{{ bestPerformer.name }}</h6>
                <div class="text-sm space-y-1">
                  <div class="flex justify-content-between">
                    <span class="theme-text-muted">ROI:</span>
                    <span class="font-semibold text-success-600 dark:text-success-400">{{ bestPerformer.roi.toFixed(1) }}%</span>
                  </div>
                  <div class="flex justify-content-between">
                    <span class="theme-text-muted">Retour mensuel:</span>
                    <span class="font-semibold theme-text-card">{{ formatCurrency(bestPerformer.monthlyReturn) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 theme-bg-muted rounded-lg">
              <h5 class="theme-text-primary mb-3 flex items-center">
                <i class="pi pi-exclamation-triangle mr-2 text-warning-600 dark:text-warning-400"></i>
                Moins Performant
              </h5>
              <div *ngIf="worstPerformer" class="p-3 theme-bg-card rounded-lg">
                <h6 class="theme-text-card mb-2">{{ worstPerformer.name }}</h6>
                <div class="text-sm space-y-1">
                  <div class="flex justify-content-between">
                    <span class="theme-text-muted">ROI:</span>
                    <span class="font-semibold text-warning-600 dark:text-warning-400">{{ worstPerformer.roi.toFixed(1) }}%</span>
                  </div>
                  <div class="flex justify-content-between">
                    <span class="theme-text-muted">Retour mensuel:</span>
                    <span class="font-semibold theme-text-card">{{ formatCurrency(worstPerformer.monthlyReturn) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-template>
    </p-card>
  `
})
export class InvestmentComparisonChartComponent implements OnInit, OnDestroy {
  private game = inject(GameService);
  private themeService = inject(ThemeService);
  private subscription?: Subscription;

  investmentPerformance: InvestmentPerformance[] = [];
  investmentTypeStats: any[] = [];
  bestPerformer?: InvestmentPerformance;
  worstPerformer?: InvestmentPerformance;

  comparisonTypes = [
    { label: 'ROI (%)', value: 'roi' },
    { label: 'Retour mensuel (€)', value: 'monthlyReturn' },
    { label: 'Montant investi (€)', value: 'totalInvested' },
    { label: 'Période de rentabilité (mois)', value: 'paybackPeriod' }
  ];
  selectedComparisonType = 'roi';

  chartTypes = [
    { label: 'Barres', value: 'bar' },
    { label: 'Barres horizontales', value: 'horizontalBar' },
    { label: 'Radar', value: 'radar' },
    { label: 'Doughnut', value: 'doughnut' }
  ];
  selectedChartType = 'bar';

  chartData: any = {};
  chartOptions: any = {};

  ngOnInit() {
    this.updateData();
    this.initializeChart();
    
    // Subscribe to game events
    this.subscription = this.game.stateChanged.subscribe(() => {
      this.updateData();
      this.updateChart();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private initializeChart() {
    const isDark = this.themeService.effectiveTheme() === 'dark';
    
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Comparaison des Investissements',
          color: isDark ? '#f8fafc' : '#0f172a'
        },
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: isDark ? '#e2e8f0' : '#334155'
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#e2e8f0' : '#334155',
          borderColor: isDark ? '#475569' : '#e2e8f0',
          borderWidth: 1,
          callbacks: {
            label: (context: any) => {
              let value = context.parsed.y || context.parsed;
              if (this.selectedComparisonType === 'roi') {
                return `${context.dataset.label}: ${value.toFixed(1)}%`;
              } else if (this.selectedComparisonType === 'monthlyReturn' || this.selectedComparisonType === 'totalInvested') {
                return `${context.dataset.label}: ${this.formatCurrency(value)}`;
              } else {
                return `${context.dataset.label}: ${value} mois`;
              }
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: isDark ? '#374151' : '#f1f5f9'
          },
          ticks: {
            color: isDark ? '#9ca3af' : '#64748b'
          }
        },
        y: {
          grid: {
            color: isDark ? '#374151' : '#f1f5f9'
          },
          ticks: {
            color: isDark ? '#9ca3af' : '#64748b',
            callback: (value: any) => {
              if (this.selectedComparisonType === 'roi') {
                return value + '%';
              } else if (this.selectedComparisonType === 'monthlyReturn' || this.selectedComparisonType === 'totalInvested') {
                return this.formatCurrency(value);
              } else {
                return value + ' mois';
              }
            }
          }
        }
      }
    };
  }

  updateData() {
    this.investmentPerformance = this.game.investments.map(investment => {
      const roi = investment.amount > 0 ? (investment.income * 12 / investment.amount) * 100 : 0;
      const paybackPeriod = investment.income > 0 ? Math.ceil(investment.amount / investment.income) : 0;
      
      return {
        name: investment.name,
        totalInvested: investment.amount,
        monthlyReturn: investment.income,
        roi: roi,
        paybackPeriod: paybackPeriod,
        type: investment.type,
        purchaseAge: this.game.age // Approximation
      };
    });

    this.calculateTypeStats();
    this.findBestAndWorstPerformers();
    this.updateChart();
  }

  private calculateTypeStats() {
    const typeMap = new Map<string, {count: number, totalInvested: number, totalROI: number}>();
    
    this.investmentPerformance.forEach(investment => {
      if (!typeMap.has(investment.type)) {
        typeMap.set(investment.type, { count: 0, totalInvested: 0, totalROI: 0 });
      }
      
      const stats = typeMap.get(investment.type)!;
      stats.count++;
      stats.totalInvested += investment.totalInvested;
      stats.totalROI += investment.roi;
    });

    this.investmentTypeStats = Array.from(typeMap.entries()).map(([type, stats]) => ({
      type,
      count: stats.count,
      totalInvested: stats.totalInvested,
      avgROI: stats.totalROI / stats.count
    }));
  }

  private findBestAndWorstPerformers() {
    if (this.investmentPerformance.length === 0) {
      this.bestPerformer = undefined;
      this.worstPerformer = undefined;
      return;
    }

    this.bestPerformer = this.investmentPerformance.reduce((best, current) => 
      current.roi > best.roi ? current : best
    );

    this.worstPerformer = this.investmentPerformance.reduce((worst, current) => 
      current.roi < worst.roi ? current : worst
    );
  }

  updateChart() {
    if (this.investmentPerformance.length === 0) {
      this.chartData = { labels: [], datasets: [] };
      return;
    }

    const labels = this.investmentPerformance.map(inv => inv.name);
    let data: number[] = [];
    let label = '';

    switch (this.selectedComparisonType) {
      case 'roi':
        data = this.investmentPerformance.map(inv => inv.roi);
        label = 'ROI (%)';
        break;
      case 'monthlyReturn':
        data = this.investmentPerformance.map(inv => inv.monthlyReturn);
        label = 'Retour mensuel (€)';
        break;
      case 'totalInvested':
        data = this.investmentPerformance.map(inv => inv.totalInvested);
        label = 'Montant investi (€)';
        break;
      case 'paybackPeriod':
        data = this.investmentPerformance.map(inv => inv.paybackPeriod);
        label = 'Période de rentabilité (mois)';
        break;
    }

    // Generate colors based on investment type
    const colors = this.investmentPerformance.map(inv => this.getInvestmentColor(inv.type));

    this.chartData = {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1
      }]
    };
  }

  getInvestmentColor(type: string): string {
    const colorMap: { [key: string]: string } = {
      'Immobilier': '#22c55e',
      'Actions': '#3b82f6',
      'Obligations': '#8b5cf6',
      'Crypto': '#f59e0b',
      'Matières premières': '#ef4444',
      'Business': '#06b6d4'
    };
    return colorMap[type] || '#6b7280';
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

  getROIClass(roi: number): string {
    if (roi > 15) return 'text-success-600 dark:text-success-400';
    if (roi > 8) return 'text-primary-600 dark:text-primary-400';
    if (roi > 0) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  trackByName(index: number, item: InvestmentPerformance): string {
    return item.name;
  }

  exportComparison() {
    if (this.investmentPerformance.length === 0) return;

    const headers = ['Nom', 'Type', 'Montant Investi', 'Retour Mensuel', 'ROI (%)', 'Période Rentabilité (mois)'];
    const csvData: string[] = [headers.join(',')];
    
    this.investmentPerformance.forEach(investment => {
      const row = [
        `"${investment.name}"`,
        investment.type,
        investment.totalInvested.toString(),
        investment.monthlyReturn.toString(),
        investment.roi.toFixed(2),
        investment.paybackPeriod.toString()
      ];
      csvData.push(row.join(','));
    });

    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `investment-comparison-${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}