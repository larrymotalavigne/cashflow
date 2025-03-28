import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RandomEventDialogComponent} from './random-event-dialog.component';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {PlayerInfoComponent} from './player-info.component';
import {GameService} from './game.service';
import { ProgressChartComponent } from './progress-chart.component';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [FormsModule, RandomEventDialogComponent, ButtonModule, CardModule, PlayerInfoComponent, ProgressChartComponent, ToolbarModule],
    template: `
        <p-toolbar class="surface-0 shadow-2">
            <div class="flex align-items-center gap-3">
                <button (click)="this.game.goToStartup()" class="p-button p-button-text p-0">
                    <i class="pi pi-arrow-left text-xl"></i>
                </button>
                <span class="text-xl font-medium">Tableau de Bord</span>
            </div>
        </p-toolbar>
        <div class="container">
            <app-player-info/>
            <app-progress-chart/>
            <p-button label="Voir les opportunités" (click)="this.game.showOpportunities()" class="mt-2"></p-button>
            <app-random-event-dialog [visible]="this.game.eventVisible" [message]="this.game.eventMessage"
                                     [investmentOpportunities]="this.game.investmentOpportunities"
                                     [randomEvents]="this.game.randomEvents"
                                     (visibleChange)="this.game.eventVisible = $event"></app-random-event-dialog>
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
}