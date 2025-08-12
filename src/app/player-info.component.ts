import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { inject } from '@angular/core';
import { GameService } from './game.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-player-info',
    standalone: true,
    imports: [CommonModule, CardModule],
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
            <p-card header="Informations du Joueur" class="shadow-lg">
                <ng-template pTemplate="content">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Personal Info Section -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <i class="pi pi-user mr-2 text-indigo-600"></i>
                                Informations Personnelles
                            </h3>
                            <div class="space-y-2">
                                <p class="text-gray-700"><span class="font-medium">Nom:</span> {{ game.name }}</p>
                                <p class="text-gray-700"><span class="font-medium">Âge:</span> {{ game.age }} ans</p>
                            </div>
                        </div>
                        
                        <!-- Financial Info Section -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <i class="pi pi-chart-line mr-2 text-green-600"></i>
                                Situation Financière
                            </h3>
                            <div class="space-y-3">
                                <div [@financialChange]="cashState" class="financial-value bg-green-100 rounded-md p-3 border-l-4 border-green-500">
                                    <p class="text-green-800 font-semibold">💰 Cash: {{ game.cash | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="incomeState" class="financial-value bg-blue-100 rounded-md p-3 border-l-4 border-blue-500">
                                    <p class="text-blue-800 font-semibold">📈 Revenu mensuel: {{ game.income | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="expensesState" class="financial-value bg-red-100 rounded-md p-3 border-l-4 border-red-500">
                                    <p class="text-red-800 font-semibold">📉 Dépenses mensuelles: {{ game.expenses | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="passiveIncomeState" class="financial-value bg-purple-100 rounded-md p-3 border-l-4 border-purple-500">
                                    <p class="text-purple-800 font-semibold">🏠 Revenu passif: {{ game.passiveIncome | number:'1.0-0' }}€</p>
                                </div>
                                <div [@financialChange]="loanState" class="financial-value bg-orange-100 rounded-md p-3 border-l-4 border-orange-500">
                                    <p class="text-orange-800 font-semibold">🏦 Emprunts: {{ game.loanTotal | number:'1.0-0' }}€</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Investments Section -->
                    <div *ngIf="game.investments.length > 0" class="mt-6 bg-indigo-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold text-indigo-800 mb-3 flex items-center">
                            <i class="pi pi-briefcase mr-2 text-indigo-600"></i>
                            Portfolio d'Investissements
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div *ngFor="let investment of game.investments" 
                                 class="bg-white rounded-md p-3 border border-indigo-200 shadow-sm">
                                <p class="font-semibold text-gray-800">{{ investment.name }}</p>
                                <p class="text-sm text-gray-600">Montant: {{ investment.amount | number:'1.0-0' }}€</p>
                                <p class="text-sm text-indigo-600">Paiements annuels: {{ investment.yearlyPayment | number:'1.0-0' }}€</p>
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
}
