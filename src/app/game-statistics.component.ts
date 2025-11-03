import {Component, inject, OnInit, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {ChartModule} from 'primeng/chart';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {GameService} from './game.service';
import {TranslationService} from './translation.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-game-statistics',
    standalone: true,
    imports: [CommonModule, CardModule, ChartModule, ButtonModule, DialogModule],
    template: `
        <!-- Statistics Button -->
        <p-button icon="pi pi-chart-bar"
                  (click)="visible = true"
                  [outlined]="true"
                  [rounded]="true"
                  severity="info"
                  [pTooltip]="translationService.translate('statistics.title')"
                  tooltipPosition="bottom"
                  class="theme-shadow-sm hover:theme-shadow-md transition-all duration-200"></p-button>

        <!-- Statistics Dialog -->
        <p-dialog [(visible)]="visible"
                  [header]="translationService.translate('statistics.title')"
                  [modal]="true"
                  [closable]="true"
                  [draggable]="false"
                  [resizable]="false"
                  [style]="{width: '95vw', maxWidth: '1200px'}"
                  styleClass="theme-bg-card"
                  (onHide)="onDialogHide()">
            <div class="space-y-6">
                <!-- Summary Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <!-- Net Worth Card -->
                    <div class="theme-bg-muted rounded-lg p-4 theme-border border">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium theme-text-muted">{{ translationService.translate('statistics.netWorth') }}</span>
                            <i class="pi pi-wallet text-primary-500"></i>
                        </div>
                        <p class="text-2xl font-bold theme-text-primary">{{ getNetWorth() | number:'1.0-0' }}€</p>
                        <p class="text-xs theme-text-muted mt-1">{{ getNetWorthChange() }}</p>
                    </div>

                    <!-- Total Returns Card -->
                    <div class="theme-bg-muted rounded-lg p-4 theme-border border">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium theme-text-muted">{{ translationService.translate('statistics.totalReturns') }}</span>
                            <i class="pi pi-chart-line text-success-500"></i>
                        </div>
                        <p class="text-2xl font-bold theme-text-primary">{{ getTotalReturns() | number:'1.0-0' }}€</p>
                        <p class="text-xs theme-text-muted mt-1">{{ translationService.translate('statistics.fromInvestments') }}</p>
                    </div>

                    <!-- Average ROI Card -->
                    <div class="theme-bg-muted rounded-lg p-4 theme-border border">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium theme-text-muted">{{ translationService.translate('statistics.averageROI') }}</span>
                            <i class="pi pi-percentage text-accent-500"></i>
                        </div>
                        <p class="text-2xl font-bold theme-text-primary">{{ getAverageROI() }}%</p>
                        <p class="text-xs theme-text-muted mt-1">{{ translationService.translate('statistics.annual') }}</p>
                    </div>

                    <!-- Turns Played Card -->
                    <div class="theme-bg-muted rounded-lg p-4 theme-border border">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium theme-text-muted">{{ translationService.translate('statistics.turnsPlayed') }}</span>
                            <i class="pi pi-calendar text-secondary-500"></i>
                        </div>
                        <p class="text-2xl font-bold theme-text-primary">{{ game.turnHistory.length }}</p>
                        <p class="text-xs theme-text-muted mt-1">{{ game.age }} {{ translationService.translate('game.years') }}</p>
                    </div>
                </div>

                <!-- Charts Row 1 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <!-- Net Worth Evolution -->
                    <p-card [header]="translationService.translate('statistics.netWorthEvolution')" class="theme-shadow-md">
                        <p-chart type="line" [data]="netWorthChartData" [options]="chartOptions" class="w-full"></p-chart>
                    </p-card>

                    <!-- Income vs Expenses -->
                    <p-card [header]="translationService.translate('statistics.incomeVsExpenses')" class="theme-shadow-md">
                        <p-chart type="line" [data]="incomeExpensesChartData" [options]="chartOptions" class="w-full"></p-chart>
                    </p-card>
                </div>

                <!-- Charts Row 2 -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <!-- Investment Portfolio Distribution -->
                    <p-card [header]="translationService.translate('statistics.portfolioDistribution')" class="theme-shadow-md">
                        <p-chart type="doughnut" [data]="portfolioDistributionData" [options]="doughnutOptions" class="w-full"></p-chart>
                    </p-card>

                    <!-- Cash Flow Trend -->
                    <p-card [header]="translationService.translate('statistics.cashFlowTrend')" class="theme-shadow-md">
                        <p-chart type="bar" [data]="cashFlowChartData" [options]="barChartOptions" class="w-full"></p-chart>
                    </p-card>
                </div>

                <!-- Investment Performance Table -->
                <p-card [header]="translationService.translate('statistics.investmentPerformance')" class="theme-shadow-md">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b theme-border">
                                    <th class="text-left p-2 theme-text-primary">{{ translationService.translate('statistics.investment') }}</th>
                                    <th class="text-right p-2 theme-text-primary">{{ translationService.translate('statistics.amount') }}</th>
                                    <th class="text-right p-2 theme-text-primary">{{ translationService.translate('statistics.annualReturn') }}</th>
                                    <th class="text-right p-2 theme-text-primary">{{ translationService.translate('statistics.roi') }}</th>
                                    <th class="text-right p-2 theme-text-primary">{{ translationService.translate('statistics.paybackYears') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr *ngFor="let investment of game.investments" class="border-b theme-border hover:theme-bg-muted">
                                    <td class="p-2 theme-text-primary">{{ investment.name }}</td>
                                    <td class="text-right p-2 theme-text-primary">{{ investment.amount | number:'1.0-0' }}€</td>
                                    <td class="text-right p-2 text-success-600 dark:text-success-400">{{ investment.income | number:'1.0-0' }}€</td>
                                    <td class="text-right p-2 theme-text-primary font-semibold">{{ (investment.income / investment.amount * 100) | number:'1.1-1' }}%</td>
                                    <td class="text-right p-2 theme-text-muted">{{ (investment.amount / investment.income) | number:'1.1-1' }}</td>
                                </tr>
                            </tbody>
                            <tfoot *ngIf="game.investments.length > 0">
                                <tr class="font-semibold theme-bg-muted">
                                    <td class="p-2 theme-text-primary">{{ translationService.translate('statistics.total') }}</td>
                                    <td class="text-right p-2 theme-text-primary">{{ getTotalInvested() | number:'1.0-0' }}€</td>
                                    <td class="text-right p-2 text-success-600 dark:text-success-400">{{ getTotalReturns() | number:'1.0-0' }}€</td>
                                    <td class="text-right p-2 theme-text-primary">{{ getAverageROI() }}%</td>
                                    <td class="text-right p-2 theme-text-muted">{{ getAveragePayback() }}</td>
                                </tr>
                            </tfoot>
                        </table>
                        <div *ngIf="game.investments.length === 0" class="text-center py-8 theme-text-muted">
                            {{ translationService.translate('statistics.noInvestments') }}
                        </div>
                    </div>
                </p-card>
            </div>
        </p-dialog>
    `
})
export class GameStatisticsComponent implements OnInit, OnDestroy {
    game = inject(GameService);
    translationService = inject(TranslationService);

    visible = false;
    netWorthChartData: any;
    incomeExpensesChartData: any;
    portfolioDistributionData: any;
    cashFlowChartData: any;
    chartOptions: any;
    doughnutOptions: any;
    barChartOptions: any;

    private subscription: Subscription | null = null;

    ngOnInit() {
        this.initializeCharts();

        // Subscribe to game state changes to update charts
        this.subscription = this.game.stateChanged.subscribe(() => {
            if (this.visible) {
                this.updateCharts();
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onDialogHide() {
        // Update charts when dialog is closed and reopened
        this.updateCharts();
    }

    initializeCharts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color') || '#333';
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#666';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#ddd';

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        this.doughnutOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };

        this.barChartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        this.updateCharts();
    }

    updateCharts() {
        const history = this.game.turnHistory;

        // Net Worth Evolution
        const labels = history.map(h => `${this.translationService.translate('game.turn')} ${h.turnNumber}`);
        const netWorthData = history.map(h => h.cashAfter);

        this.netWorthChartData = {
            labels: labels,
            datasets: [
                {
                    label: this.translationService.translate('statistics.netWorth'),
                    data: netWorthData,
                    fill: true,
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.2)',
                    tension: 0.4
                }
            ]
        };

        // Income vs Expenses
        const incomeData = history.map(h => h.income / 12); // Monthly
        const expensesData = history.map(h => h.expenses / 12); // Monthly
        const passiveIncomeData = history.map(h => h.passiveIncome / 12); // Monthly

        this.incomeExpensesChartData = {
            labels: labels,
            datasets: [
                {
                    label: this.translationService.translate('game.income'),
                    data: incomeData,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    tension: 0.4
                },
                {
                    label: this.translationService.translate('game.expenses'),
                    data: expensesData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    tension: 0.4
                },
                {
                    label: this.translationService.translate('game.passiveIncome'),
                    data: passiveIncomeData,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    tension: 0.4
                }
            ]
        };

        // Portfolio Distribution
        const typeDistribution: {[key: string]: number} = {};
        this.game.investments.forEach(inv => {
            typeDistribution[inv.type] = (typeDistribution[inv.type] || 0) + inv.amount;
        });

        this.portfolioDistributionData = {
            labels: Object.keys(typeDistribution),
            datasets: [
                {
                    data: Object.values(typeDistribution),
                    backgroundColor: ['#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'],
                    hoverBackgroundColor: ['#0284c7', '#16a34a', '#d97706', '#7c3aed', '#dc2626', '#0891b2']
                }
            ]
        };

        // Cash Flow Trend (last 10 turns)
        const recentHistory = history.slice(-10);
        const cashFlowLabels = recentHistory.map(h => `${this.translationService.translate('game.turn')} ${h.turnNumber}`);
        const cashFlowData = recentHistory.map(h => h.cashAfter - h.cashBefore);

        this.cashFlowChartData = {
            labels: cashFlowLabels,
            datasets: [
                {
                    label: this.translationService.translate('statistics.cashFlow'),
                    data: cashFlowData,
                    backgroundColor: cashFlowData.map(v => v >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'),
                    borderColor: cashFlowData.map(v => v >= 0 ? '#22c55e' : '#ef4444'),
                    borderWidth: 1
                }
            ]
        };
    }

    getNetWorth(): number {
        return this.game.cash;
    }

    getNetWorthChange(): string {
        const history = this.game.turnHistory;
        if (history.length === 0) return '+0€';

        const first = history[0].cashBefore;
        const current = this.game.cash;
        const change = current - first;
        const sign = change >= 0 ? '+' : '';

        return `${sign}${change.toLocaleString()}€`;
    }

    getTotalInvested(): number {
        return this.game.investments.reduce((sum, inv) => sum + inv.amount, 0);
    }

    getTotalReturns(): number {
        return this.game.investments.reduce((sum, inv) => sum + inv.income, 0);
    }

    getAverageROI(): string {
        const total = this.getTotalInvested();
        if (total === 0) return '0.0';

        const returns = this.getTotalReturns();
        return ((returns / total) * 100).toFixed(1);
    }

    getAveragePayback(): string {
        const total = this.getTotalInvested();
        const returns = this.getTotalReturns();

        if (returns === 0) return '-';
        return (total / returns).toFixed(1);
    }
}
