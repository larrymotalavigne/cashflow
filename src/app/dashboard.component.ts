import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CardModule],
    template: `
    <p-card>
      <ng-template pTemplate="title">
        Tableau Financier
      </ng-template>
      <ng-template pTemplate="content">
        <p>💰 Cash: {{ cash }}€</p>
        <p>📈 Revenu: {{ income }}€</p>
        <p>📉 Dépenses: {{ expenses }}€</p>
        <p>🏠 Revenu Passif: {{ passiveIncome }}€</p>
      </ng-template>
    </p-card>
  `
})
export class DashboardComponent {
    @Input() cash: number = 0;
    @Input() income: number = 0;
    @Input() expenses: number = 0;
    @Input() passiveIncome: number = 0;
}