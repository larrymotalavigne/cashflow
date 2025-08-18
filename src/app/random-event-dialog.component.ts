import {Component, EventEmitter, Input, Output} from '@angular/core';
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
import {EnhancedInvestmentCardComponent} from './enhanced-investment-card.component';
import {AdvancedInvestmentFilterComponent} from './advanced-investment-filter.component';

@Component({
    selector: 'app-random-event-dialog',
    standalone: true,
    imports: [DialogModule, ButtonModule, NgForOf, NgIf, DropdownModule, FormsModule, InputTextModule, DividerModule, EnhancedInvestmentCardComponent, AdvancedInvestmentFilterComponent],
    template: `
        <p-dialog #dialog [(visible)]="visible" [closable]="false" header="Événements aléatoires" [modal]="true" styleClass="w-75 theme-bg-card">
            <div *ngIf="randomEvents.length" class="mb-4">
                <h3 class="theme-text-card mb-3">Événements</h3>
                <div *ngFor="let event of randomEvents" class="mb-2 theme-bg-muted p-3 rounded-lg theme-border border">
                    <ng-container *ngIf="event.effect?.amount > 0">📈</ng-container>
                    <ng-container *ngIf="event.effect?.amount < 0">📉</ng-container>
                    <span class="theme-text-card">{{ event.message }}</span>
                    <span *ngIf="event.effect?.type" class="ml-2 text-sm theme-text-muted">({{ event.effect.type }})</span>
                </div>
            </div>

            <div>
                <h3 class="theme-text-card mb-3">Opportunités d'investissement</h3>

                <div *ngIf="investmentOpportunities.length; else noInvestments">
                    <!-- Advanced Filtering Component -->
                    <app-advanced-investment-filter
                        [investments]="investmentOpportunities"
                        [userCash]="gameService.cash"
                        (filterChange)="onAdvancedFilterChange($event)">
                    </app-advanced-investment-filter>

                    <!-- Comparison Tool -->
                    <div *ngIf="comparisonMode" class="mb-3 p-3 theme-border border rounded-lg theme-bg-muted">
                        <div class="flex justify-content-between align-items-center mb-3">
                            <h4 class="m-0 theme-text-primary">Comparaison d'investissements</h4>
                            <p-button icon="pi pi-times" (click)="exitComparisonMode()" 
                                      styleClass="p-button-rounded p-button-text"></p-button>
                        </div>

                        <div class="grid">
                            <div *ngFor="let investment of selectedInvestments" class="col-12 md:col-6 lg:col-4">
                                <div class="p-3 theme-border border rounded-lg h-full theme-bg-card theme-shadow-sm">
                                    <h5 class="theme-text-card">{{ investment.name }}</h5>
                                    <div class="grid">
                                        <div class="col-6 theme-text-muted">Prix:</div>
                                        <div class="col-6 font-bold theme-text-card">{{ investment.amount }}€</div>

                                        <div class="col-6 theme-text-muted">Revenu:</div>
                                        <div class="col-6 font-bold theme-text-card">{{ investment.income }}€</div>

                                        <div class="col-6 theme-text-muted">ROI:</div>
                                        <div class="col-6 font-bold theme-text-card">{{ (investment.income / investment.amount * 100).toFixed(2) }}%</div>

                                        <div class="col-6 theme-text-muted">Type:</div>
                                        <div class="col-6 font-bold theme-text-card">{{ investment.type }}</div>
                                    </div>
                                    <div class="mt-3">
                                        <p-button label="Retirer" (click)="removeFromComparison(investment)" 
                                                  styleClass="p-button-sm p-button-outlined"></p-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-content-between align-items-center mb-3">
                        <p-button *ngIf="!comparisonMode" label="Comparer des investissements" 
                                  icon="pi pi-chart-bar" (click)="enterComparisonMode()"
                                  [disabled]="selectedInvestments.length < 2"></p-button>
                        <span *ngIf="comparisonMode" class="text-sm theme-text-muted">
                            Sélectionnez des investissements pour les comparer
                        </span>
                    </div>

                    <p-divider></p-divider>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <app-enhanced-investment-card 
                            *ngFor="let investment of filteredInvestments"
                            [investment]="investment"
                            [comparisonMode]="comparisonMode"
                            [isSelected]="isInvestmentSelected(investment)"
                            (buy)="buyInvestment($event)"
                            (buyWithLoan)="buyInvestmentWithLoan($event)"
                            (reject)="deleteInvestment($event)"
                            (compare)="addToComparison($event)"
                            (selectionChange)="onInvestmentSelectionChange($event)">
                        </app-enhanced-investment-card>
                    </div>
                </div>
                <ng-template #noInvestments>
                    <p class="text-center text-sm theme-text-muted mt-2">Aucune opportunité d'investissement disponible.</p>
                </ng-template>
            </div>
            <ng-template #footer>
                <p-button label="Next Year" (click)="close()"></p-button>
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

    // Filtered investments from advanced filter
    filteredInvestments: Investment[] = [];

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
        } else {
            this.visibleChange.emit(false);
        }
    }

    close() {
        this.gameService.nextTurn();
        this.visibleChange.emit(false);
    }

    onAdvancedFilterChange(filtered: Investment[]) {
        this.filteredInvestments = filtered;
    }

    deleteInvestment(investment: Investment) {
        this.investmentOpportunities = this.investmentOpportunities.filter(i => i !== investment);
        // The advanced filter will automatically update when investmentOpportunities changes
        if (this.investmentOpportunities.length === 0) this.gameService.nextTurn();
    }

    buyInvestmentWithLoan(investment: any) {
        this.gameService.buyInvestmentWithLoan(investment);
        this.investmentOpportunities = this.investmentOpportunities.filter(i => i !== investment);
        if (this.investmentOpportunities.length === 0) this.gameService.nextTurn();
    }

    buyInvestment(investment: any) {
        this.gameService.buyInvestment(investment);
        this.investmentOpportunities = this.investmentOpportunities.filter(i => i !== investment);
        if (this.investmentOpportunities.length === 0) this.gameService.nextTurn();
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
