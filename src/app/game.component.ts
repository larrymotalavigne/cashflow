import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RandomEventDialogComponent} from './random-event-dialog.component';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {PlayerInfoComponent} from './player-info.component';
import {GameService} from './game.service';
import { ProgressChartComponent } from './progress-chart.component';
import { InvestmentComparisonChartComponent } from './investment-comparison-chart.component';
import { DragDropPortfolioComponent } from './drag-drop-portfolio.component';
import { FinancialCalculatorComponent } from './financial-calculator.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ThemeToggleComponent } from './theme-toggle.component';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [FormsModule, RandomEventDialogComponent, ButtonModule, CardModule, PlayerInfoComponent, ProgressChartComponent, InvestmentComparisonChartComponent, DragDropPortfolioComponent, FinancialCalculatorComponent, ToolbarModule, ThemeToggleComponent],
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
        <p-toolbar class="theme-bg-card theme-shadow-sm border-b theme-border">
            <div class="flex align-items-center justify-between w-full">
                <div class="flex align-items-center gap-3">
                    <button (click)="this.game.goToStartup()" 
                            class="p-button p-button-text p-0 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus-visible rounded-lg p-2">
                        <i class="pi pi-arrow-left text-xl theme-text-primary"></i>
                    </button>
                    <span class="text-xl font-semibold theme-text-primary">Tableau de Bord</span>
                </div>
                <app-theme-toggle></app-theme-toggle>
            </div>
        </p-toolbar>
        <div class="w-full max-w-6xl mx-auto p-4 min-h-screen theme-bg-primary bg-gradient-to-br from-primary-50/50 to-secondary-50/30 dark:from-neutral-900/50 dark:to-primary-900/30">
            <div class="space-y-6 animate-fade-in">
                <app-player-info/>
                <app-progress-chart/>
                <app-investment-comparison-chart/>
                <app-drag-drop-portfolio/>
                <div class="text-center">
                    <p-button label="Voir les opportunités" 
                              (click)="this.game.showOpportunities()" 
                              class="p-button-lg theme-shadow-lg hover:theme-shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
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
