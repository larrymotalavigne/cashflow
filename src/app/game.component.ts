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
import {TranslationService} from './translation.service';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [FormsModule, RandomEventDialogComponent, ButtonModule, CardModule, PlayerInfoComponent, ProgressChartComponent, InvestmentComparisonChartComponent, DragDropPortfolioComponent, ToolbarModule, ThemeToggleComponent],
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
                <app-player-info/>
                <app-progress-chart/>
                <app-investment-comparison-chart/>
                <app-drag-drop-portfolio/>
                <div class="text-center pb-4">
                    <p-button label="Voir les opportunités"
                              (click)="this.game.showOpportunities()"
                              class="p-button-lg theme-shadow-lg hover:theme-shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 
                                     min-h-[48px] px-6 sm:px-8 touch-manipulation"
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
    translationService = inject(TranslationService);
    
    private startX: number = 0;
    private startY: number = 0;
    private isScrolling: boolean = false;
    private isRefreshing: boolean = false;
    private pullDistance: number = 0;
    private readonly maxPullDistance: number = 120;

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
