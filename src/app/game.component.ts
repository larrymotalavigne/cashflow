import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DashboardComponent} from './dashboard.component';
import {RandomEventDialogComponent} from './random-event-dialog.component';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {PlayerInfoComponent} from './player-info.component';
import {GameService} from './game.service';
import { ProgressChartComponent } from './progress-chart.component';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [FormsModule, DashboardComponent, RandomEventDialogComponent, ButtonModule, CardModule, PlayerInfoComponent, ProgressChartComponent],
    template: `
        <div class="container">
            <app-player-info [name]="name" [age]="age" [cash]="cash" [income]="income" [expenses]="expenses"
                             [passiveIncome]="passiveIncome"></app-player-info>
            <app-dashboard [cash]="cash" [income]="income" [expenses]="expenses" [passiveIncome]="passiveIncome"></app-dashboard>
            <app-progress-chart></app-progress-chart>
            <p-button label="Année Suivante" (click)="nextTurn()" class="mt-2"></p-button>
            <app-random-event-dialog [visible]="eventVisible" [message]="eventMessage"
                                     [investmentOpportunities]="investmentOpportunities"
                                     [randomEvents]="randomEvents"
                                     (visibleChange)="eventVisible = $event"></app-random-event-dialog>
        </div>
    `,
    styles: [`
        .container {
            max-width: 600px;
            margin: auto;
            text-align: center;
        }

        .mt-2 {
            margin-top: 1rem;
        }
    `]
})
export class GameComponent {
    game = inject(GameService);

    get cash() {
        return this.game.cash;
    }

    get income() {
        return this.game.income;
    }

    get expenses() {
        return this.game.expenses;
    }

    get passiveIncome() {
        return this.game.passiveIncome;
    }

    get age() {
        return this.game.age;
    }

    get name() {
        return this.game.name;
    }

    get eventVisible() {
        return this.game.eventVisible;
    }

    set eventVisible(val: boolean) {
        this.game.eventVisible = val;
    }

    get eventMessage() {
        return this.game.eventMessage;
    }

    get investmentOpportunities() {
        return this.game.investmentOpportunities;
    }

    get randomEvents() {
        return this.game.randomEvents;
    }

    nextTurn() {
        this.game.nextTurn();
    }
}