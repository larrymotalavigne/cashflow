import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RandomEventDialogComponent} from './random-event-dialog.component';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {PlayerInfoComponent} from './player-info.component';
import {GameService} from './game.service';
import {ProgressChartComponent} from './progress-chart.component';
import {InvestmentComparisonChartComponent} from './investment-comparison-chart.component';
import {DragDropPortfolioComponent} from './drag-drop-portfolio.component';
import {ToolbarModule} from 'primeng/toolbar';
import {ThemeToggleComponent} from './theme-toggle.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {TranslationService} from './translation.service';

@Component({
    selector: 'app-game-panels',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule, 
        RandomEventDialogComponent, 
        ButtonModule, 
        CardModule, 
        PlayerInfoComponent, 
        ProgressChartComponent, 
        InvestmentComparisonChartComponent, 
        DragDropPortfolioComponent, 
        ToolbarModule, 
        ThemeToggleComponent
    ],
    animations: [
        trigger('panelExpand', [
            state('collapsed', style({
                height: '0px',
                opacity: '0',
                overflow: 'hidden'
            })),
            state('expanded', style({
                height: '*',
                opacity: '1',
                overflow: 'visible'
            })),
            transition('collapsed <=> expanded', [
                animate('300ms ease-in-out')
            ])
        ]),
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
            <div class="flex align-items-center justify-between w-full relative">
                <!-- Left side: Back button -->
                <div class="flex align-items-center">
                    <button (click)="this.game.goToStartup()"
                            class="p-button p-button-text p-0 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus-visible rounded-lg p-3 min-h-[44px] min-w-[44px] touch-manipulation">
                        <i class="pi pi-arrow-left text-lg sm:text-xl theme-text-primary"></i>
                    </button>
                </div>
                
                <!-- Center: Logo and Title -->
                <div class="absolute left-1/2 transform -translate-x-1/2 flex align-items-center gap-2">
                    <img src="logo.svg" alt="Logo" class="w-8 h-8 sm:w-10 sm:h-10">
                    <span class="text-lg sm:text-xl font-semibold theme-text-primary">{{ translationService.translate('game.dashboard') }}</span>
                </div>
                
                <!-- Right side: Theme toggle -->
                <div class="flex align-items-center">
                    <app-theme-toggle></app-theme-toggle>
                </div>
            </div>
        </p-toolbar>
        
        <div class="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 min-h-screen theme-bg-primary bg-gradient-to-br from-primary-50/50 to-secondary-50/30 dark:from-neutral-900/50 dark:to-primary-900/30 
                    touch-pan-y overscroll-contain" 
             (touchstart)="onTouchStart($event)" 
             (touchmove)="onTouchMove($event)" 
             (touchend)="onTouchEnd($event)">
            
            <div class="space-y-4 sm:space-y-6 animate-fade-in">
                
                <!-- Essential Info Panel (Always Visible) -->
                <div class="w-full max-w-4xl mx-auto">
                    <p-card header="Vue d'ensemble" class="theme-shadow-lg theme-bg-card">
                        <ng-template pTemplate="content">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Quick Stats -->
                                <div class="theme-bg-muted rounded-lg p-4 theme-border border">
                                    <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center">
                                        <i class="pi pi-user mr-2 text-primary-600 dark:text-primary-400"></i>
                                        {{ game.name }}, {{ game.age }} ans
                                    </h3>
                                    <div class="space-y-3">
                                        <div class="flex justify-between items-center">
                                            <span class="theme-text-muted">💰 Cash</span>
                                            <span class="font-semibold text-success-600 dark:text-success-400">{{ game.cash | number:'1.0-0' }}€</span>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <span class="theme-text-muted">📈 Revenu net</span>
                                            <span class="font-semibold" [class]="(game.income - game.expenses) >= 0 ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'">
                                                {{ (game.income - game.expenses) | number:'1.0-0' }}€
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Quick Actions -->
                                <div class="theme-bg-muted rounded-lg p-4 theme-border border">
                                    <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center">
                                        <i class="pi pi-cog mr-2 text-secondary-600 dark:text-secondary-400"></i>
                                        Actions Rapides
                                    </h3>
                                    <div class="flex flex-col gap-4">
                                        <p-button label="Voir les opportunités"
                                                  (click)="this.game.showOpportunities()"
                                                  class="w-full p-button-outlined"
                                                  icon="pi pi-search"></p-button>
                                        <p-button label="Passer le tour"
                                                  (click)="this.game.nextTurn()"
                                                  class="w-full"
                                                  icon="pi pi-step-forward"></p-button>
                                    </div>
                                </div>
                            </div>
                        </ng-template>
                    </p-card>
                </div>
                
                <!-- Panel Toggle Buttons -->
                <div class="flex flex-wrap gap-3 justify-center">
                    <p-button 
                        [label]="'Détails Financiers ' + (showFinancialDetails ? '🔼' : '🔽')"
                        (click)="togglePanel('financial')"
                        [class]="showFinancialDetails ? 'p-button-outlined' : ''"
                        icon="pi pi-chart-line"
                        size="small"></p-button>
                    
                    <p-button 
                        [label]="'Analyses & Charts ' + (showAnalytics ? '🔼' : '🔽')"
                        (click)="togglePanel('analytics')"
                        [class]="showAnalytics ? 'p-button-outlined' : ''"
                        icon="pi pi-chart-bar"
                        size="small"></p-button>
                    
                    <p-button 
                        [label]="'Portfolio ' + (showPortfolio ? '🔼' : '🔽')"
                        (click)="togglePanel('portfolio')"
                        [class]="showPortfolio ? 'p-button-outlined' : ''"
                        icon="pi pi-briefcase"
                        size="small"></p-button>
                </div>
                
                <!-- Financial Details Panel -->
                <div [@panelExpand]="showFinancialDetails ? 'expanded' : 'collapsed'">
                    <app-player-info *ngIf="showFinancialDetails"></app-player-info>
                </div>
                
                <!-- Analytics Panel -->
                <div [@panelExpand]="showAnalytics ? 'expanded' : 'collapsed'">
                    <div *ngIf="showAnalytics" class="space-y-4">
                        <app-progress-chart></app-progress-chart>
                        <app-investment-comparison-chart></app-investment-comparison-chart>
                    </div>
                </div>
                
                <!-- Portfolio Panel -->
                <div [@panelExpand]="showPortfolio ? 'expanded' : 'collapsed'">
                    <app-drag-drop-portfolio *ngIf="showPortfolio"></app-drag-drop-portfolio>
                </div>
            </div>
            
            <app-random-event-dialog [visible]="this.game.eventVisible" [message]="this.game.eventMessage"
                                     [investmentOpportunities]="this.game.investmentOpportunities"
                                     [randomEvents]="this.game.randomEvents"
                                     (visibleChange)="this.game.eventVisible = $event"></app-random-event-dialog>
        </div>
    `
})
export class GamePanelsComponent {
    game = inject(GameService);
    translationService = inject(TranslationService);
    
    // Panel visibility states
    showFinancialDetails = false;
    showAnalytics = false;
    showPortfolio = false;
    
    private startX: number = 0;
    private startY: number = 0;
    private isScrolling: boolean = false;
    private isRefreshing: boolean = false;
    private pullDistance: number = 0;
    private readonly maxPullDistance: number = 120;

    togglePanel(panel: 'financial' | 'analytics' | 'portfolio') {
        switch (panel) {
            case 'financial':
                this.showFinancialDetails = !this.showFinancialDetails;
                break;
            case 'analytics':
                this.showAnalytics = !this.showAnalytics;
                break;
            case 'portfolio':
                this.showPortfolio = !this.showPortfolio;
                break;
        }
    }

    onTouchStart(event: TouchEvent) {
        this.startX = event.touches[0].clientX;
        this.startY = event.touches[0].clientY;
        this.isScrolling = false;
    }

    onTouchMove(event: TouchEvent) {
        if (!this.startX || !this.startY) return;

        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;
        
        const diffX = this.startX - currentX;
        const diffY = this.startY - currentY;

        // Check if at top of page for pull-to-refresh
        const isAtTop = window.scrollY === 0;
        
        if (isAtTop && diffY < 0 && Math.abs(diffY) > Math.abs(diffX)) {
            // Pull down gesture at top of page
            event.preventDefault();
            this.pullDistance = Math.min(Math.abs(diffY), this.maxPullDistance);
            
            // Visual feedback could be added here
            if (this.pullDistance > 60) {
                // Indicate ready to refresh
                document.body.style.setProperty('--pull-distance', `${this.pullDistance}px`);
            }
        } else if (Math.abs(diffY) > Math.abs(diffX)) {
            // Regular vertical scrolling
            this.isScrolling = true;
        }
    }

    onTouchEnd(event: TouchEvent) {
        // Handle pull-to-refresh
        if (this.pullDistance > 60 && !this.isRefreshing) {
            this.triggerRefresh();
        }

        // Reset pull distance
        this.pullDistance = 0;
        document.body.style.removeProperty('--pull-distance');

        if (!this.startX || !this.startY || this.isScrolling) {
            this.resetTouchState();
            return;
        }

        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;
        
        const diffX = this.startX - endX;
        const diffY = this.startY - endY;

        // Minimum swipe distance (50px)
        const minSwipeDistance = 50;

        // Horizontal swipe detection
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                // Swipe left - could navigate to next section
                this.game.showOpportunities();
            } else {
                // Swipe right - could go back
                this.game.goToStartup();
            }
        }

        this.resetTouchState();
    }

    private triggerRefresh() {
        if (this.isRefreshing) return;
        
        this.isRefreshing = true;
        
        // Simulate refresh with game state update
        setTimeout(() => {
            // Refresh game data - could call specific refresh methods
            this.game.showOpportunities();
            this.isRefreshing = false;
        }, 1500);
    }

    private resetTouchState() {
        this.startX = 0;
        this.startY = 0;
        this.isScrolling = false;
    }
}