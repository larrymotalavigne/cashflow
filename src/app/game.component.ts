import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RandomEventDialogComponent} from './random-event-dialog.component';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {PlayerInfoComponent} from './player-info.component';
import {GameService} from './game.service';
import { ProgressChartComponent } from './progress-chart.component';
import { ToolbarModule } from 'primeng/toolbar';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [FormsModule, RandomEventDialogComponent, ButtonModule, CardModule, PlayerInfoComponent, ProgressChartComponent, ToolbarModule],
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
            width: 90%;
            max-width: 1200px;
            margin: auto;
            text-align: center;
            padding: 1rem;
        }

        .mt-2 {
            margin-top: 1rem;
        }

        /* Small devices (phones) */
        @media (max-width: 576px) {
            .container {
                width: 95%;
                padding: 0.5rem;
            }
        }

        /* Medium devices (tablets) */
        @media (min-width: 577px) and (max-width: 992px) {
            .container {
                width: 85%;
                padding: 0.75rem;
            }
        }

        /* Large devices (desktops) */
        @media (min-width: 993px) {
            .container {
                width: 80%;
                max-width: 1200px;
            }
        }
    `]
})
export class GameComponent {
    game = inject(GameService);
}
