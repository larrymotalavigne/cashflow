import {Component, inject, Input} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {GameService} from './game.service';
import {NgIf} from '@angular/common';

@Component({
    selector: 'app-investment',
    standalone: true,
    imports: [TableModule, ButtonModule, NgIf],
    template: `
        <ng-container *ngIf="investments.length > 0; else noInvestments">
            <p-table [value]="investments">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Nom</th>
                        <th>Prix</th>
                        <th>Revenu Passif</th>
                        <th>Action</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-investment>
                    <tr>
                        <td>{{ investment.name }}</td>
                        <td>{{ investment.price }}€</td>
                        <td>{{ investment.income }}€</td>
                        <td class="p-2">
                            <p-button label="Accepter" (click)="buy(investment)" [disabled]="this.game.cash < investment.price" class="p-mr-2"></p-button>
                            <p-button label="Refuser" (click)="reject(investment)" severity="danger"></p-button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </ng-container>

        <ng-template #noInvestments>
            <p>Aucune opportunité d'investissement disponible pour le moment.</p>
        </ng-template>
    `
})
export class InvestmentComponent {
    @Input() investments: any[] = [];
    game = inject(GameService);

    buy(investment: any) {
        this.game.addInvestment(investment);
        this.investments = this.investments.filter(i => i !== investment);
    }

    reject(investment: any) {
        this.investments = this.investments.filter(i => i !== investment);
    }
}