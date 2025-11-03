import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { inject } from '@angular/core';
import { GameService } from './game.service';
import { GameConfigService } from './game-config.service';
import { TranslationService } from './translation.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-player-info',
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    animations: [
        trigger('financialChange', [
            state('increase', style({
                backgroundColor: 'rgba(0, 255, 0, 0.2)',
                transform: 'scale(1.05)'
            })),
            state('decrease', style({
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                transform: 'scale(1.05)'
            })),
            state('normal', style({
                backgroundColor: 'transparent',
                transform: 'scale(1)'
            })),
            transition('* => increase', [
                animate('300ms ease-out')
            ]),
            transition('* => decrease', [
                animate('300ms ease-out')
            ]),
            transition('increase => normal', [
                animate('500ms ease-in')
            ]),
            transition('decrease => normal', [
                animate('500ms ease-in')
            ])
        ])
    ],
    template: `
        <div class="w-full max-w-4xl mx-auto mb-6">
            <p-card [header]="translationService.translate('game.playerInfo')" class="theme-shadow-lg theme-bg-card">
                <ng-template pTemplate="content">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Personal Info Section -->
                        <div class="theme-bg-muted rounded-lg p-4 theme-border border">
                            <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center">
                                <i class="pi pi-user mr-2 text-primary-600 dark:text-primary-400"></i>
                                {{ translationService.translate('game.personalInfo') }}
                            </h3>
                            <div class="space-y-2">
                                <p class="theme-text-primary"><span class="font-medium">{{ translationService.translate('game.name') }}:</span> {{ game.name }}</p>
                                <p class="theme-text-primary"><span class="font-medium">{{ translationService.translate('game.age') }}:</span> {{ game.age }} {{ translationService.translate('game.years') }}</p>
                            </div>
                        </div>
                        
                        <!-- Financial Info Section -->
                        <div class="theme-bg-muted rounded-lg p-4 theme-border border">
                            <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center justify-between">
                                <div class="flex items-center">
                                    <i class="pi pi-chart-line mr-2 text-secondary-600 dark:text-secondary-400"></i>
                                    {{ translationService.translate('game.financialSituation') }}
                                </div>
                                <p-button
                                    [label]="isYearlyView ? translationService.translate('game.yearly') : translationService.translate('game.monthly')"
                                    (click)="toggleView()"
                                    class="p-button-sm p-button-outlined"
                                    [icon]="isYearlyView ? 'pi pi-calendar' : 'pi pi-clock'"
                                    size="small">
                                </p-button>
                            </h3>
                            <div class="space-y-3">
                                <div [@financialChange]="cashState" class="financial-value bg-success-100 dark:bg-success-900/20 rounded-md p-3 border-l-4 border-success-500 dark:border-success-400">
                                    <p class="text-success-800 dark:text-success-200 font-semibold">💰 {{ translationService.translate('game.cash') }}: {{ game.cash | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="incomeState" class="financial-value bg-primary-100 dark:bg-primary-900/20 rounded-md p-3 border-l-4 border-primary-500 dark:border-primary-400">
                                    <p class="text-primary-800 dark:text-primary-200 font-semibold">📈 {{ translationService.translate('game.income') }} {{ isYearlyView ? translationService.translate('game.annualPeriod') : translationService.translate('game.monthlyPeriod') }}: {{ getDisplayIncome() | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="expensesState" class="financial-value bg-error-100 dark:bg-error-900/20 rounded-md p-3 border-l-4 border-error-500 dark:border-error-400">
                                    <p class="text-error-800 dark:text-error-200 font-semibold">📉 {{ translationService.translate('game.expenses') }} {{ isYearlyView ? translationService.translate('game.annualPeriod') : translationService.translate('game.monthlyPeriod') }}: {{ getDisplayExpenses() | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="passiveIncomeState" class="financial-value bg-accent-100 dark:bg-accent-900/20 rounded-md p-3 border-l-4 border-accent-500 dark:border-accent-400">
                                    <p class="text-accent-800 dark:text-accent-200 font-semibold">🏠 {{ translationService.translate('game.passiveIncome') }} {{ isYearlyView ? translationService.translate('game.annualPeriod') : translationService.translate('game.monthlyPeriod') }}: {{ getDisplayPassiveIncome() | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="loanState" class="financial-value bg-warning-100 dark:bg-warning-900/20 rounded-md p-3 border-l-4 border-warning-500 dark:border-warning-400">
                                    <p class="text-warning-800 dark:text-warning-200 font-semibold">🏦 {{ translationService.translate('game.loans') }}: {{ game.loanTotal | number:'1.0-0' }}€</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Economic Cycle Section -->
                    <div class="mt-6 theme-bg-muted rounded-lg p-4 theme-border border">
                        <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center">
                            <i class="pi pi-chart-bar mr-2 text-secondary-600 dark:text-secondary-400"></i>
                            {{ translationService.translate('game.economicCycle') }}
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="theme-bg-card rounded-md p-3 theme-border border theme-shadow-sm">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="font-semibold theme-text-card">{{ translationService.translate('game.currentPhase') }}</span>
                                    <span class="px-2 py-1 rounded text-xs font-medium"
                                          [class]="configService.currentEconomicCycle === 'recession' ? 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-200' :
                                                   configService.currentEconomicCycle === 'recovery' ? 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-200' :
                                                   configService.currentEconomicCycle === 'expansion' ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-200' :
                                                   'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-200'">
                                        {{ configService.getCurrentEconomicCycleConfig().label }}
                                    </span>
                                </div>
                                <p class="text-sm theme-text-muted mb-2">{{ configService.getCurrentEconomicCycleConfig().description }}</p>
                                <p class="text-sm font-medium theme-text-card">
                                    📅 {{ translationService.translate('game.turnsRemaining') }}: {{ configService.economicCycleTurnsRemaining }}
                                </p>
                            </div>
                            <div class="theme-bg-card rounded-md p-3 theme-border border theme-shadow-sm">
                                <span class="font-semibold theme-text-card block mb-2">{{ translationService.translate('game.currentEffects') }}</span>
                                <div class="space-y-1 text-sm">
                                    <p class="theme-text-muted">
                                        📈 {{ translationService.translate('game.returns') }}: {{ (configService.getCurrentEconomicCycleConfig().effects.investmentReturnMultiplier * 100 - 100).toFixed(0) }}%
                                    </p>
                                    <p class="theme-text-muted">
                                        🏢 {{ translationService.translate('game.jobSecurity') }}: {{ (configService.getCurrentEconomicCycleConfig().effects.jobSecurityFactor * 100 - 100).toFixed(0) }}%
                                    </p>
                                    <p class="theme-text-muted">
                                        ⚡ {{ translationService.translate('game.events') }}: {{ (configService.getCurrentEconomicCycleConfig().effects.eventSeverityMultiplier * 100 - 100).toFixed(0) }}%
                                    </p>
                                    <p class="theme-text-muted">
                                        💰 {{ translationService.translate('game.inflation') }}: {{ (configService.getCurrentEconomicCycleConfig().effects.inflationRate * 100).toFixed(1) }}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Investments Section -->
                    <div *ngIf="game.investments.length > 0" class="mt-6 theme-bg-muted rounded-lg p-4 theme-border border">
                        <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center">
                            <i class="pi pi-briefcase mr-2 text-primary-600 dark:text-primary-400"></i>
                            {{ translationService.translate('game.investmentPortfolio') }}
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div *ngFor="let investment of game.investments"
                                 class="theme-bg-card rounded-md p-3 theme-border border theme-shadow-sm">
                                <p class="font-semibold theme-text-card">{{ investment.name }}</p>
                                <p class="text-sm theme-text-muted">{{ translationService.translate('game.amount') }}: {{ investment.amount | number:'1.0-0' }}€</p>
                                <p class="text-sm text-primary-600 dark:text-primary-400">
                                    {{ isYearlyView ? translationService.translate('game.annualRevenue') : translationService.translate('game.monthlyPeriod') }}:
                                    {{ isYearlyView ? (investment.income | number:'1.0-0') : (investment.income / 12 | number:'1.0-0') }}€
                                </p>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-card>
        </div>
    `
})
export class PlayerInfoComponent implements OnInit, OnDestroy {
    game = inject(GameService);
    configService = inject(GameConfigService);
    translationService = inject(TranslationService);

    // Toggle state for monthly/yearly view
    isYearlyView = false;

    // Animation states
    cashState = 'normal';
    incomeState = 'normal';
    expensesState = 'normal';
    passiveIncomeState = 'normal';
    loanState = 'normal';

    // Previous values
    previousCash = 0;
    previousIncome = 0;
    previousExpenses = 0;
    previousPassiveIncome = 0;
    previousLoanTotal = 0;

    // Subscription to game state changes
    private gameSubscription: Subscription | null = null;

    ngOnInit() {
        // Initialize previous values
        this.previousCash = this.game.cash;
        this.previousIncome = this.game.income;
        this.previousExpenses = this.game.expenses;
        this.previousPassiveIncome = this.game.passiveIncome;
        this.previousLoanTotal = this.game.loanTotal;

        // Subscribe to game state changes
        this.gameSubscription = this.game.stateChanged.subscribe(() => {
            this.checkForChanges();
        });
    }

    ngOnDestroy() {
        // Unsubscribe to prevent memory leaks
        if (this.gameSubscription) {
            this.gameSubscription.unsubscribe();
            this.gameSubscription = null;
        }
    }

    private checkForChanges() {
        // Check for changes in cash
        if (this.game.cash > this.previousCash) {
            this.cashState = 'increase';
            setTimeout(() => this.cashState = 'normal', 1000);
        } else if (this.game.cash < this.previousCash) {
            this.cashState = 'decrease';
            setTimeout(() => this.cashState = 'normal', 1000);
        }

        // Check for changes in income
        if (this.game.income > this.previousIncome) {
            this.incomeState = 'increase';
            setTimeout(() => this.incomeState = 'normal', 1000);
        } else if (this.game.income < this.previousIncome) {
            this.incomeState = 'decrease';
            setTimeout(() => this.incomeState = 'normal', 1000);
        }

        // Check for changes in expenses
        if (this.game.expenses > this.previousExpenses) {
            this.expensesState = 'increase';
            setTimeout(() => this.expensesState = 'normal', 1000);
        } else if (this.game.expenses < this.previousExpenses) {
            this.expensesState = 'decrease';
            setTimeout(() => this.expensesState = 'normal', 1000);
        }

        // Check for changes in passive income
        if (this.game.passiveIncome > this.previousPassiveIncome) {
            this.passiveIncomeState = 'increase';
            setTimeout(() => this.passiveIncomeState = 'normal', 1000);
        } else if (this.game.passiveIncome < this.previousPassiveIncome) {
            this.passiveIncomeState = 'decrease';
            setTimeout(() => this.passiveIncomeState = 'normal', 1000);
        }

        // Check for changes in loan total
        if (this.game.loanTotal > this.previousLoanTotal) {
            this.loanState = 'increase';
            setTimeout(() => this.loanState = 'normal', 1000);
        } else if (this.game.loanTotal < this.previousLoanTotal) {
            this.loanState = 'decrease';
            setTimeout(() => this.loanState = 'normal', 1000);
        }

        // Update previous values
        this.previousCash = this.game.cash;
        this.previousIncome = this.game.income;
        this.previousExpenses = this.game.expenses;
        this.previousPassiveIncome = this.game.passiveIncome;
        this.previousLoanTotal = this.game.loanTotal;
    }

    toggleView() {
        this.isYearlyView = !this.isYearlyView;
    }

    getDisplayIncome(): number {
        // Game service stores yearly values, so divide by 12 for monthly view
        return this.isYearlyView ? this.game.income : Math.round(this.game.income / 12);
    }

    getDisplayExpenses(): number {
        // Game service stores yearly values, so divide by 12 for monthly view
        return this.isYearlyView ? this.game.expenses : Math.round(this.game.expenses / 12);
    }

    getDisplayPassiveIncome(): number {
        // Game service stores yearly values, so divide by 12 for monthly view
        return this.isYearlyView ? this.game.passiveIncome : Math.round(this.game.passiveIncome / 12);
    }
}
