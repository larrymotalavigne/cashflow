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
        <div class="w-full max-w-6xl mx-auto p-4 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div class="space-y-6">
                <app-player-info/>
                <app-progress-chart/>
                <div class="text-center">
                    <p-button label="Voir les opportunités" 
                              (click)="this.game.showOpportunities()" 
                              class="p-button-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                              icon="pi pi-search"></p-button>
                </div>
            </div>
            <app-random-event-dialog [visible]="this.game.eventVisible" [message]="this.game.eventMessage"
                                     [investmentOpportunities]="this.game.investmentOpportunities"
                                     [randomEvents]="this.game.randomEvents"
                                     (visibleChange)="this.game.eventVisible = $event"></app-random-event-dialog>
        </div>
    `
})
export class GameComponent {
    game = inject(GameService);
}
