import {Component, EventEmitter, Input, Output, inject} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {GameConfigService} from './game-config.service';
import {GameService} from './game.service';
import {Investment} from './data';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {DividerModule} from 'primeng/divider';
import {AdvancedInvestmentFilterComponent} from './advanced-investment-filter.component';
import {InvestmentCarouselComponent} from './investment-carousel.component';
import {TranslationService} from './translation.service';

@Component({
    selector: 'app-random-event-dialog',
    standalone: true,
    imports: [DialogModule, ButtonModule, NgForOf, NgIf, DropdownModule, FormsModule, InputTextModule, DividerModule, AdvancedInvestmentFilterComponent, InvestmentCarouselComponent],
    template: `
        <p-dialog #dialog [(visible)]="visible" [closable]="false" [header]="getYearTitle()" [modal]="true" styleClass="w-75 theme-bg-card">
            <div *ngIf="randomEvents.length" class="mb-4">
                <h3 class="theme-text-card mb-3">{{ translationService.translate('investments.events') }}</h3>
                <div *ngFor="let event of randomEvents" class="mb-2 theme-bg-muted p-3 rounded-lg theme-border border">
                    <ng-container *ngIf="event.effect?.amount > 0">📈</ng-container>
                    <ng-container *ngIf="event.effect?.amount < 0">📉</ng-container>
                    <span class="theme-text-card">{{ event.message }}</span>
                    <span *ngIf="event.effect?.type" class="ml-2 text-sm theme-text-muted">({{ event.effect.type }})</span>
                </div>
            </div>

            <div>
                <h3 class="theme-text-card mb-3">{{ translationService.translate('investments.opportunities') }}</h3>

                <div *ngIf="investmentOpportunities.length; else noInvestments">
                    <!-- Toggle button for advanced filters -->
                    <div class="mb-3">
                        <p-button
                            [label]="showAdvancedFilters ? translationService.translate('investments.hideAdvancedFilters') : translationService.translate('investments.showAdvancedFilters')"
                            icon="pi pi-filter"
                            (click)="showAdvancedFilters = !showAdvancedFilters"
                            styleClass="p-button-outlined p-button-sm"></p-button>
                    </div>
                    
                    <!-- Advanced Filtering Component -->
                    <div *ngIf="showAdvancedFilters">
                        <app-advanced-investment-filter
                            [investments]="investmentOpportunities"
                            [userCash]="gameService.cash"
                            (filterChange)="onAdvancedFilterChange($event)">
                        </app-advanced-investment-filter>
                    </div>

                    <!-- Comparison Tool -->
                    <div *ngIf="comparisonMode" class="mb-3 p-3 theme-border border rounded-lg theme-bg-muted">
                        <div class="flex justify-content-between align-items-center mb-3">
                            <h4 class="m-0 theme-text-primary">{{ translationService.translate('investments.comparison') }}</h4>
                            <p-button icon="pi pi-times" (click)="exitComparisonMode()"
                                      styleClass="p-button-rounded p-button-text"></p-button>
                        </div>

                        <div class="grid">
                            <div *ngFor="let investment of selectedInvestments" class="col-12 md:col-6 lg:col-4">
                                <div class="p-3 theme-border border rounded-lg h-full theme-bg-card theme-shadow-sm">
                                    <h5 class="theme-text-card">{{ investment.name }}</h5>
                                    <div class="grid">
                                        <div class="col-6 theme-text-muted">{{ translationService.translate('investments.price') }}:</div>
                                        <div class="col-6 font-bold theme-text-card">{{ investment.amount }}€</div>

                                        <div class="col-6 theme-text-muted">{{ translationService.translate('investments.income') }}:</div>
                                        <div class="col-6 font-bold theme-text-card">{{ investment.income }}€</div>

                                        <div class="col-6 theme-text-muted">{{ translationService.translate('investments.roi') }}:</div>
                                        <div class="col-6 font-bold theme-text-card">{{ (investment.income / investment.amount * 100).toFixed(2) }}%</div>

                                        <div class="col-6 theme-text-muted">{{ translationService.translate('investments.type') }}:</div>
                                        <div class="col-6 font-bold theme-text-card">{{ investment.type }}</div>
                                    </div>
                                    <div class="mt-3">
                                        <p-button [label]="translationService.translate('investments.remove')" (click)="removeFromComparison(investment)"
                                                  styleClass="p-button-sm p-button-outlined"></p-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-content-between align-items-center mb-3">
                        <p-button *ngIf="!comparisonMode" [label]="translationService.translate('investments.compareInvestments')"
                                  icon="pi pi-chart-bar" (click)="enterComparisonMode()"
                                  [disabled]="selectedInvestments.length < 2"></p-button>
                        <span *ngIf="comparisonMode" class="text-sm theme-text-muted">
                            {{ translationService.translate('investments.selectToCompare') }}
                        </span>
                    </div>

                    <p-divider></p-divider>

                    <app-investment-carousel
                        [investments]="filteredInvestments"
                        [comparisonMode]="comparisonMode"
                        [selectedInvestments]="selectedInvestments"
                        (buy)="buyInvestment($event)"
                        (buyWithLoan)="buyInvestmentWithLoan($event)"
                        (reject)="deleteInvestment($event)"
                        (compare)="addToComparison($event)"
                        (selectionChange)="onInvestmentSelectionChange($event)">
                    </app-investment-carousel>
                </div>
                <ng-template #noInvestments>
                    <p class="text-center text-sm theme-text-muted mt-2">{{ translationService.translate('investments.noOpportunities') }}</p>
                </ng-template>
            </div>
            <ng-template #footer>
                <div class="flex justify-content-center w-full">
                    <p-button
                        [label]="translationService.translate('investments.nextYear')"
                        (click)="close()"
                        styleClass="w-full md:w-auto min-h-[48px] touch-manipulation p-button-lg"
                        icon="pi pi-arrow-right"></p-button>
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class RandomEventDialogComponent {
    @Input() message: string = '';
    @Input() randomEvents: any[] = [];
    @Input() investmentOpportunities: any[] = [];
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() investmentAction = new EventEmitter<{ investment: any, action: 'buy' | 'reject' | 'loan' }>();

    translationService = inject(TranslationService);

    // Filtered investments from advanced filter
    filteredInvestments: Investment[] = [];

    // Show/hide advanced filters toggle
    showAdvancedFilters: boolean = false;

    // Comparison tool properties
    comparisonMode: boolean = false;
    selectedInvestments: Investment[] = [];

    // Options for dropdowns
    sortOptions = [
        { label: 'Prix (croissant)', value: 'price-asc' },
        { label: 'Prix (décroissant)', value: 'price-desc' },
        { label: 'Revenu (croissant)', value: 'income-asc' },
        { label: 'Revenu (décroissant)', value: 'income-desc' },
        { label: 'ROI (croissant)', value: 'roi-asc' },
        { label: 'ROI (décroissant)', value: 'roi-desc' }
    ];

    typeOptions: any[] = [];

    constructor(public configService: GameConfigService, public gameService: GameService) {
        // Initialize type options from available investment types
        this.updateTypeOptions();
    }

    updateTypeOptions() {
        // Get unique investment types from config service
        const uniqueTypes = [...new Set(this.configService.investments.map(inv => inv.type))];
        this.typeOptions = uniqueTypes.map(type => ({ label: type, value: type }));
    }

    private _visible: boolean = false;

    @Input()
    get visible(): boolean {
        return this._visible;
    }

    set visible(val: boolean) {
        this._visible = val;
        if (val) {
            // When dialog becomes visible, initialize filtered investments
            this.filteredInvestments = [...this.investmentOpportunities];
            // Reset advanced filters to hidden by default
            this.showAdvancedFilters = false;
        } else {
            this.visibleChange.emit(false);
        }
    }

    close() {
        this.gameService.nextTurn();
        this.visibleChange.emit(false);
    }

    getYearTitle(): string {
        // Calculate current year based on starting year (2024) + current turn
        const currentYear = 2024 + this.gameService.currentTurn;
        return `${currentYear} Events`;
    }

    onAdvancedFilterChange(filtered: Investment[]) {
        this.filteredInvestments = filtered;
    }

    deleteInvestment(investment: Investment) {
        this.investmentOpportunities = this.investmentOpportunities.filter(i => i !== investment);
        // The advanced filter will automatically update when investmentOpportunities changes
        if (this.investmentOpportunities.length === 0) {
            this.visibleChange.emit(false);
        }
    }

    buyInvestmentWithLoan(investment: any) {
        this.gameService.buyInvestmentWithLoan(investment);
        this.investmentOpportunities = this.investmentOpportunities.filter(i => i !== investment);
        if (this.investmentOpportunities.length === 0) {
            this.visibleChange.emit(false);
        }
    }

    buyInvestment(investment: any) {
        this.gameService.buyInvestment(investment);
        this.investmentOpportunities = this.investmentOpportunities.filter(i => i !== investment);
        if (this.investmentOpportunities.length === 0) {
            this.visibleChange.emit(false);
        }
    }

    addToComparison(investment: Investment) {
        if (!this.selectedInvestments.find(inv => inv.name === investment.name)) {
            this.selectedInvestments.push(investment);
        }
    }

    onInvestmentSelectionChange(event: {investment: Investment, selected: boolean}) {
        if (event.selected) {
            this.addToComparison(event.investment);
        } else {
            this.removeFromComparison(event.investment);
        }
    }

    toggleInvestmentSelection(investment: Investment) {
        const index = this.selectedInvestments.findIndex(inv => inv.name === investment.name);
        if (index > -1) {
            this.selectedInvestments.splice(index, 1);
        } else {
            this.selectedInvestments.push(investment);
        }
    }

    isInvestmentSelected(investment: Investment) {
        return this.selectedInvestments.some(inv => inv.name === investment.name);
    }

    removeFromComparison(investment: Investment) {
        this.selectedInvestments = this.selectedInvestments.filter(inv => inv.name !== investment.name);
    }

    enterComparisonMode() {
        this.comparisonMode = true;
        this.selectedInvestments = [];
    }

    exitComparisonMode() {
        this.comparisonMode = false;
        this.selectedInvestments = [];
    }
}
