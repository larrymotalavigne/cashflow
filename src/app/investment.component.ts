import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-investment',
    standalone: true,
    imports: [TableModule, ButtonModule],
    template: `
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
          <td>
            <p-button label="Acheter" (click)="buy(investment)" [disabled]="cash < investment.price"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
  `
})
export class InvestmentComponent {
    @Input() investments: any[] = [];
    @Input() cash: number = 0;
    @Output() buyInvestment = new EventEmitter<any>();

    buy(investment: any) {
        this.buyInvestment.emit(investment);
    }
}