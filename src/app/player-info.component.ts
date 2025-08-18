import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { inject } from '@angular/core';
import { GameService } from './game.service';
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
            <p-card header="Informations du Joueur" class="theme-shadow-lg theme-bg-card">
                <ng-template pTemplate="content">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Personal Info Section -->
                        <div class="theme-bg-muted rounded-lg p-4 theme-border border">
                            <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center">
                                <i class="pi pi-user mr-2 text-primary-600 dark:text-primary-400"></i>
                                Informations Personnelles
                            </h3>
                            <div class="space-y-2">
                                <p class="theme-text-primary"><span class="font-medium">Nom:</span> {{ game.name }}</p>
                                <p class="theme-text-primary"><span class="font-medium">Âge:</span> {{ game.age }} ans</p>
                            </div>
                        </div>
                        
                        <!-- Financial Info Section -->
                        <div class="theme-bg-muted rounded-lg p-4 theme-border border">
                            <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center justify-between">
                                <div class="flex items-center">
                                    <i class="pi pi-chart-line mr-2 text-secondary-600 dark:text-secondary-400"></i>
                                    Situation Financière
                                </div>
                                <p-button 
                                    [label]="isYearlyView ? 'Annuel' : 'Mensuel'" 
                                    (click)="toggleView()" 
                                    class="p-button-sm p-button-outlined"
                                    [icon]="isYearlyView ? 'pi pi-calendar' : 'pi pi-clock'"
                                    size="small">
                                </p-button>
                            </h3>
                            <div class="space-y-3">
                                <div [@financialChange]="cashState" class="financial-value bg-success-100 dark:bg-success-900/20 rounded-md p-3 border-l-4 border-success-500 dark:border-success-400">
                                    <p class="text-success-800 dark:text-success-200 font-semibold">💰 Cash: {{ game.cash | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="incomeState" class="financial-value bg-primary-100 dark:bg-primary-900/20 rounded-md p-3 border-l-4 border-primary-500 dark:border-primary-400">
                                    <p class="text-primary-800 dark:text-primary-200 font-semibold">📈 Revenu {{ isYearlyView ? 'annuel' : 'mensuel' }}: {{ getDisplayIncome() | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="expensesState" class="financial-value bg-error-100 dark:bg-error-900/20 rounded-md p-3 border-l-4 border-error-500 dark:border-error-400">
                                    <p class="text-error-800 dark:text-error-200 font-semibold">📉 Dépenses {{ isYearlyView ? 'annuelles' : 'mensuelles' }}: {{ getDisplayExpenses() | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="passiveIncomeState" class="financial-value bg-accent-100 dark:bg-accent-900/20 rounded-md p-3 border-l-4 border-accent-500 dark:border-accent-400">
                                    <p class="text-accent-800 dark:text-accent-200 font-semibold">🏠 Revenu passif {{ isYearlyView ? 'annuel' : 'mensuel' }}: {{ getDisplayPassiveIncome() | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="loanState" class="financial-value bg-warning-100 dark:bg-warning-900/20 rounded-md p-3 border-l-4 border-warning-500 dark:border-warning-400">
                                    <p class="text-warning-800 dark:text-warning-200 font-semibold">🏦 Emprunts: {{ game.loanTotal | number:'1.0-0' }}€</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Investments Section -->
                    <div *ngIf="game.investments.length > 0" class="mt-6 theme-bg-muted rounded-lg p-4 theme-border border">
                        <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center">
                            <i class="pi pi-briefcase mr-2 text-primary-600 dark:text-primary-400"></i>
                            Portfolio d'Investissements
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div *ngFor="let investment of game.investments" 
                                 class="theme-bg-card rounded-md p-3 theme-border border theme-shadow-sm">
                                <p class="font-semibold theme-text-card">{{ investment.name }}</p>
                                <p class="text-sm theme-text-muted">Montant: {{ investment.amount | number:'1.0-0' }}€</p>
                                <p class="text-sm text-primary-600 dark:text-primary-400">Paiements annuels: {{ investment.yearlyPayment | number:'1.0-0' }}€</p>
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
