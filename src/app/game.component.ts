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
import {ConfirmationDialogService} from './confirmation-dialog.service';
import {CommonModule} from '@angular/common';
import {ExportService} from './export.service';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {TooltipModule} from 'primeng/tooltip';
import {GameStatisticsComponent} from './game-statistics.component';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule, FormsModule, RandomEventDialogComponent, ButtonModule, CardModule, PlayerInfoComponent, ProgressChartComponent, InvestmentComparisonChartComponent, DragDropPortfolioComponent, ToolbarModule, ThemeToggleComponent, MenuModule, TooltipModule, GameStatisticsComponent],
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
        <!-- Loading Overlay -->
        <div *ngIf="game.isLoading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div class="theme-bg-card rounded-lg p-6 theme-shadow-xl flex flex-col items-center gap-4">
                <i class="pi pi-spin pi-spinner text-4xl text-primary-500"></i>
                <span class="theme-text-primary font-semibold">{{ translationService.translate('common.loading') }}</span>
            </div>
        </div>

        <p-toolbar class="theme-bg-card theme-shadow-md border-b-2 border-primary-200 dark:border-primary-800 relative overflow-hidden">
            <!-- Animated gradient border -->
            <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"></div>

            <div class="flex align-items-center justify-between w-full relative">
                <!-- Left side: Back button -->
                <div class="flex align-items-center">
                    <button (click)="goBack()"
                            class="p-button p-button-text p-0 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 focus-visible rounded-xl p-3 min-h-[44px] min-w-[44px] touch-manipulation transition-all duration-200 hover:scale-105">
                        <i class="pi pi-arrow-left text-lg sm:text-xl theme-text-primary"></i>
                    </button>
                </div>

                <!-- Center: Logo and Title -->
                <div class="absolute left-1/2 transform -translate-x-1/2 flex align-items-center gap-3">
                    <div class="relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-md opacity-50"></div>
                        <div class="relative bg-gradient-to-br from-primary-500 to-secondary-500 p-2 rounded-full">
                            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <span class="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">{{ translationService.translate('game.dashboard') }}</span>
                </div>

                <!-- Right side: Statistics, Export button and Theme toggle -->
                <div class="flex align-items-center gap-2">
                    <app-game-statistics></app-game-statistics>
                    <p-button icon="pi pi-download"
                              (click)="exportMenu.toggle($event)"
                              [outlined]="true"
                              [rounded]="true"
                              severity="secondary"
                              [pTooltip]="translationService.translate('game.export.title')"
                              tooltipPosition="bottom"
                              class="theme-shadow-sm hover:theme-shadow-md transition-all duration-200"></p-button>
                    <p-menu #exportMenu [model]="exportMenuItems" [popup]="true" styleClass="w-64"></p-menu>
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
    confirmationService = inject(ConfirmationDialogService);
    exportService = inject(ExportService);

    exportMenuItems: MenuItem[] = [
        {
            label: this.translationService.translate('game.export.csv'),
            icon: 'pi pi-file',
            command: () => this.exportService.exportToCSV()
        },
        {
            label: this.translationService.translate('game.export.summary'),
            icon: 'pi pi-file-edit',
            command: () => this.exportService.exportSummaryReport()
        },
        {
            label: this.translationService.translate('game.export.json'),
            icon: 'pi pi-code',
            command: () => this.exportService.exportToJSON()
        }
    ];

    private startX: number = 0;
    private startY: number = 0;
    private isScrolling: boolean = false;
    private isRefreshing: boolean = false;
    private pullDistance: number = 0;
    private readonly maxPullDistance: number = 120;

    async goBack() {
        const result = await this.confirmationService.confirmWarning(
            this.translationService.translate('dialogs.confirmBackTitle'),
            this.translationService.translate('dialogs.confirmBackMessage'),
            this.translationService.translate('common.confirm')
        );

        if (result.confirmed) {
            this.game.goToStartup();
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
                // Swipe left - show opportunities
                this.game.showOpportunities();
            }
            // Removed swipe right navigation to prevent accidental game loss
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
