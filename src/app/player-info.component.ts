import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { inject } from '@angular/core';
import {GameService} from './game.service';

@Component({
    selector: 'app-player-info',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
        <p-card header="Informations du Joueur">
            <ng-template pTemplate="content">
                <p>Nom: {{ game.name }}</p>
                <p>Âge: {{ game.age }}</p>
                <p>💰Cash: {{ game.cash }}€</p>
                <p>📈Revenu: {{ game.income }}€</p>
                <p>📉Dépenses: {{ game.expenses }}€</p>
                <p>🏠Revenu Passif: {{ game.passiveIncome }}€</p>
                <p>🏦Emprunt: {{ game.loanTotal }}€</p>
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
    `
})
export class PlayerInfoComponent {
    game = inject(GameService);
}