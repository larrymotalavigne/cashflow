import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { GameService } from './game.service';
import { ThemeService } from './theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, DropdownModule, ButtonModule, CardModule, CheckboxModule, FormsModule],
  template: `
    <p-card class="theme-bg-card theme-shadow-lg">
      <ng-template pTemplate="header">
        <div class="flex justify-content-between align-items-center p-3">
          <h3 class="m-0 theme-text-card">📊 Évolution Financière</h3>
          <div class="flex gap-2">
            <p-button 
              icon="pi pi-download" 
              (click)="exportChart()" 
              class="p-button-outlined p-button-sm"
              pTooltip="Exporter le graphique">
            </p-button>
          </div>
        </div>
      </ng-template>
      
      <ng-template pTemplate="content">
        <!-- Controls Section -->
        <div class="mb-4 p-3 theme-bg-muted rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <!-- Time Range Selector -->
            <div>
              <label class="block text-sm font-medium theme-text-primary mb-2">Période d'affichage</label>
              <p-dropdown 
                [options]="timeRangeOptions" 
                [(ngModel)]="selectedTimeRange" 
                (onChange)="updateChartData()"
                placeholder="Sélectionner période"
                class="w-full">
              </p-dropdown>
            </div>
            
            <!-- Chart Type Selector -->
            <div>
              <label class="block text-sm font-medium theme-text-primary mb-2">Type de graphique</label>
              <p-dropdown 
                [options]="chartTypeOptions" 
                [(ngModel)]="selectedChartType" 
                (onChange)="updateChartData()"
                placeholder="Type de graphique"
                class="w-full">
              </p-dropdown>
            </div>
            
            <!-- Data Series Toggle -->
            <div>
              <label class="block text-sm font-medium theme-text-primary mb-2">Données affichées</label>
              <div class="space-y-2">
                <div class="flex align-items-center" *ngFor="let series of dataSeriesOptions">
                  <p-checkbox 
                    [(ngModel)]="series.visible" 
                    (onChange)="updateChartData()"
                    [inputId]="series.key">
                  </p-checkbox>
                  <label [for]="series.key" class="ml-2 text-sm theme-text-primary cursor-pointer">
                    {{ series.label }}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Goals Progress -->
        <div class="mb-4 p-3 theme-bg-muted rounded-lg" *ngIf="financialGoals.length > 0">
          <h4 class="theme-text-primary mb-3 flex items-center">
            <i class="pi pi-flag mr-2 text-primary-600 dark:text-primary-400"></i>
            Objectifs Financiers
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div *ngFor="let goal of financialGoals" class="p-3 theme-bg-card rounded-lg theme-shadow-sm">
              <div class="flex justify-content-between align-items-center mb-2">
                <span class="font-medium theme-text-card">{{ goal.name }}</span>
                <span class="text-sm" [ngClass]="goal.achieved ? 'text-success-600 dark:text-success-400' : 'theme-text-muted'">
                  {{ goal.achieved ? '✅ Atteint' : getProgressPercentage(goal) + '%' }}
                </span>
              </div>
              <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  [ngClass]="goal.achieved ? 'bg-success-500' : 'bg-primary-500'"
                  [style.width.%]="Math.min(getProgressPercentage(goal), 100)">
                </div>
              </div>
              <div class="mt-1 text-xs theme-text-muted">
                {{ formatCurrency(goal.currentValue) }} / {{ formatCurrency(goal.targetValue) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="chart-container">
          <p-chart 
            [type]="selectedChartType" 
            [data]="chartData" 
            [options]="chartOptions"
            class="w-full">
          </p-chart>
        </div>

        <!-- Statistics Summary -->
        <div class="mt-4 p-3 theme-bg-muted rounded-lg">
          <h4 class="theme-text-primary mb-3 flex items-center">
            <i class="pi pi-chart-bar mr-2 text-primary-600 dark:text-primary-400"></i>
            Statistiques de Performance
          </h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-success-600 dark:text-success-400">{{ formatCurrency(getNetWorth()) }}</div>
              <div class="text-sm theme-text-muted">Valeur nette</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(getTotalPassiveIncome()) }}</div>
              <div class="text-sm theme-text-muted">Revenus passifs</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-accent-600 dark:text-accent-400">{{ getROI().toFixed(1) }}%</div>
              <div class="text-sm theme-text-muted">ROI moyen</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold theme-text-primary">{{ getTurnsToFreedom() }}</div>
              <div class="text-sm theme-text-muted">Tours vers liberté</div>
            </div>
          </div>
        </div>
      </ng-template>
    </p-card>
  `
})
export class ProgressChartComponent implements OnInit, OnDestroy {
  private game = inject(GameService);
  private themeService = inject(ThemeService);
  private subscription?: Subscription;
  
  Math = Math; // For template access

  // Time range options
  timeRangeOptions = [
    { label: 'Derniers 5 tours', value: 5 },
    { label: 'Derniers 10 tours', value: 10 },
    { label: 'Derniers 20 tours', value: 20 },
    { label: 'Tous les tours', value: 'all' }
  ];
  selectedTimeRange = 'all';

  // Chart type options
  chartTypeOptions = [
    { label: 'Ligne', value: 'line' },
    { label: 'Barres', value: 'bar' },
    { label: 'Aires', value: 'area' }
  ];
  selectedChartType = 'line';

  // Data series options
  dataSeriesOptions = [
    { key: 'cash', label: 'Liquidités', visible: true, color: '#22c55e' },
    { key: 'totalIncome', label: 'Revenus totaux', visible: true, color: '#3b82f6' },
    { key: 'activeIncome', label: 'Revenus actifs', visible: false, color: '#06b6d4' },
    { key: 'passiveIncome', label: 'Revenus passifs', visible: true, color: '#8b5cf6' },
    { key: 'expenses', label: 'Dépenses', visible: true, color: '#ef4444' },
    { key: 'netWorth', label: 'Valeur nette', visible: false, color: '#f59e0b' },
    { key: 'investments', label: 'Investissements', visible: false, color: '#10b981' }
  ];

  // Financial goals
  financialGoals = [
    {
      name: 'Indépendance financière',
      targetValue: 0, // Will be calculated based on expenses
      currentValue: 0,
      achieved: false,
      type: 'passive_income_coverage'
    },
    {
      name: 'Premier million',
      targetValue: 1000000,
      currentValue: 0,
      achieved: false,
      type: 'net_worth'
    },
    {
      name: 'Revenus passifs 5000€/mois',
      targetValue: 5000,
      currentValue: 0,
      achieved: false,
      type: 'passive_income'
    }
  ];

  chartData: any = {};
  chartOptions: any = {};

  ngOnInit() {
    this.initializeChart();
    this.updateChartData();
    this.updateFinancialGoals();

    // Subscribe to game events
    this.subscription = this.game.turnEnded.subscribe(() => {
      this.updateChartData();
      this.updateFinancialGoals();
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
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: 'Évolution Financière',
          color: isDark ? '#f8fafc' : '#0f172a',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: isDark ? '#e2e8f0' : '#334155'
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#e2e8f0' : '#334155',
          borderColor: isDark ? '#475569' : '#e2e8f0',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
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
            callback: (value: any) => this.formatCurrency(value)
          }
        }
      }
    };
  }

  updateChartData() {
    const turnHistory = this.game.turnHistory;
    let data = [...turnHistory];

    // Apply time range filter
    if (this.selectedTimeRange !== 'all') {
      data = data.slice(-this.selectedTimeRange);
    }

    // Generate labels
    const labels = data.map(turn => `Âge ${turn.age}`);
    
    // Add current turn if not in history yet
    if (!data.find(turn => turn.age === this.game.age)) {
      labels.push(`Âge ${this.game.age}`);
      data.push({
        turnNumber: data.length + 1,
        age: this.game.age,
        cashBefore: this.game.cash,
        cashAfter: this.game.cash,
        income: this.game.income,
        expenses: this.game.expenses,
        passiveIncome: this.game.passiveIncome,
        events: [],
        investmentsPurchased: [],
        date: new Date().toISOString()
      });
    }

    // Generate datasets based on visible series
    const datasets: any[] = [];
    
    this.dataSeriesOptions.forEach(series => {
      if (!series.visible) return;

      let data_points: number[] = [];
      
      switch (series.key) {
        case 'cash':
          data_points = data.map(turn => turn.cashAfter);
          break;
        case 'totalIncome':
          data_points = data.map(turn => turn.income + turn.passiveIncome);
          break;
        case 'activeIncome':
          data_points = data.map(turn => turn.income);
          break;
        case 'passiveIncome':
          data_points = data.map(turn => turn.passiveIncome);
          break;
        case 'expenses':
          data_points = data.map(turn => turn.expenses);
          break;
        case 'netWorth':
          data_points = data.map(turn => {
            // Calculate net worth: cash + investment value - loans
            const investmentValue = this.getInvestmentValueAtTurn(turn.turnNumber);
            return turn.cashAfter + investmentValue - this.game.loanTotal;
          });
          break;
        case 'investments':
          data_points = data.map(turn => this.getInvestmentValueAtTurn(turn.turnNumber));
          break;
      }

      const dataset: any = {
        label: series.label,
        data: data_points,
        borderColor: series.color,
        backgroundColor: series.color + '20',
        tension: 0.4,
        fill: this.selectedChartType === 'area'
      };

      if (this.selectedChartType === 'bar') {
        dataset.backgroundColor = series.color;
      }

      datasets.push(dataset);
    });

    this.chartData = {
      labels,
      datasets
    };
  }

  private getInvestmentValueAtTurn(turnNumber: number): number {
    // Simple approximation - in a real app, you'd track this more precisely
    const currentInvestments = this.game.investments.reduce((sum, inv) => sum + inv.amount, 0);
    return currentInvestments * (turnNumber / Math.max(this.game.turnHistory.length, 1));
  }

  updateFinancialGoals() {
    // Update financial independence goal (passive income >= expenses)
    this.financialGoals[0].targetValue = this.game.expenses;
    this.financialGoals[0].currentValue = this.game.passiveIncome;
    this.financialGoals[0].achieved = this.game.passiveIncome >= this.game.expenses;

    // Update net worth goal
    this.financialGoals[1].currentValue = this.getNetWorth();
    this.financialGoals[1].achieved = this.getNetWorth() >= this.financialGoals[1].targetValue;

    // Update passive income goal
    this.financialGoals[2].currentValue = this.game.passiveIncome;
    this.financialGoals[2].achieved = this.game.passiveIncome >= this.financialGoals[2].targetValue;
  }

  getProgressPercentage(goal: any): number {
    if (goal.targetValue === 0) return 0;
    return Math.round((goal.currentValue / goal.targetValue) * 100);
  }

  getNetWorth(): number {
    const investmentValue = this.game.investments.reduce((sum, inv) => sum + inv.amount, 0);
    return this.game.cash + investmentValue - this.game.loanTotal;
  }

  getTotalPassiveIncome(): number {
    return this.game.passiveIncome;
  }

  getROI(): number {
    const totalInvested = this.game.investments.reduce((sum, inv) => sum + inv.amount, 0);
    if (totalInvested === 0) return 0;
    return (this.game.passiveIncome * 12 / totalInvested) * 100;
  }

  getTurnsToFreedom(): string {
    if (this.game.passiveIncome >= this.game.expenses) return '✅';
    
    const monthlyDeficit = this.game.expenses - this.game.passiveIncome;
    const monthlySavings = this.game.income - this.game.expenses;
    
    if (monthlySavings <= 0) return '∞';
    
    const turnsNeeded = Math.ceil(monthlyDeficit / (monthlySavings * 0.1)); // Assuming 10% yield
    return turnsNeeded > 100 ? '100+' : turnsNeeded.toString();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  exportChart() {
    // Create CSV data
    const headers = ['Âge', 'Liquidités', 'Revenus Totaux', 'Revenus Passifs', 'Dépenses'];
    const csvData: string[] = [headers.join(',')];
    
    this.game.turnHistory.forEach(turn => {
      const row = [
        turn.age.toString(),
        turn.cashAfter.toString(),
        (turn.income + turn.passiveIncome).toString(),
        turn.passiveIncome.toString(),
        turn.expenses.toString()
      ];
      csvData.push(row.join(','));
    });

    // Download CSV
    const csvContent = csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `cashflow-evolution-${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
