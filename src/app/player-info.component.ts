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
        <p-card header="Informations du Joueur">
            <ng-template pTemplate="content">
                <p>Nom: {{ game.name }}</p>
                <p>Âge: {{ game.age }}</p>
                <p [@financialChange]="cashState" class="financial-value">💰Cash: {{ game.cash }}€</p>
                <p [@financialChange]="incomeState" class="financial-value">📈Revenu: {{ game.income }}€</p>
                <p [@financialChange]="expensesState" class="financial-value">📉Dépenses: {{ game.expenses }}€</p>
                <p [@financialChange]="passiveIncomeState" class="financial-value">🏠Revenu Passif: {{ game.passiveIncome }}€</p>
                <p [@financialChange]="loanState" class="financial-value">🏦Emprunt: {{ game.loanTotal }}€</p>
                <div *ngIf="game.investments.length > 0">
                    <p class="mt-3 font-bold">📋 Passifs:</p>
                    <ul>
                        <li *ngFor="let investment of game.investments">
                            {{ investment.name }} — 💸 {{ investment.amount }}€ (Paiements annuels: {{ investment.yearlyPayment }}€)
                        </li>
                    </ul>
                </div>
            </ng-template>
        </p-card>
    `,
    styles: [`
        .financial-value {
            padding: 5px;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
    `]
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
