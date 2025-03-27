import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-player-info',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
    <p-card header="Informations du Joueur">
      <ng-template pTemplate="content">
        <p>Nom: {{ name }}</p>
        <p>Âge: {{ age }}</p>
        <p>Cash: {{ cash }}€</p>
        <p>Revenu: {{ income }}€</p>
        <p>Dépenses: {{ expenses }}€</p>
        <p>Revenu Passif: {{ passiveIncome }}€</p>
      </ng-template>
    </p-card>
  `
})
export class PlayerInfoComponent {
    @Input() name: string = '';
    @Input() age: number = 0;
    @Input() cash: number = 0;
    @Input() income: number = 0;
    @Input() expenses: number = 0;
    @Input() passiveIncome: number = 0;
}