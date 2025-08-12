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

@Component({
    selector: 'app-random-event-dialog',
    standalone: true,
    imports: [DialogModule, ButtonModule, NgForOf, NgIf, DropdownModule, FormsModule, InputTextModule, DividerModule],
    template: `
        <p-dialog #dialog [(visible)]="visible" [closable]="false" header="Événements aléatoires" [modal]="true" styleClass="w-75">
            <div *ngIf="randomEvents.length">
                <h3>Événements</h3>
                <div *ngFor="let event of randomEvents" class="mb-2">
                    <ng-container *ngIf="event.effect?.amount > 0">📈</ng-container>
                    <ng-container *ngIf="event.effect?.amount < 0">📉</ng-container>
                    {{ event.message }}
                    <span *ngIf="event.effect?.type" class="ml-2 text-sm text-gray-500">({{ event.effect.type }})</span>
                </div>
            </div>

            <div>
                <h3>Opportunités d'investissement</h3>

                <div *ngIf="investmentOpportunities.length; else noInvestments">
                    <!-- Filtering and Sorting Controls -->
                    <div class="flex flex-wrap gap-3 mb-3">
                        <div class="flex-grow-1">
                            <span class="p-input-icon-left w-full">
                                <i class="pi pi-search"></i>
                                <input type="text" pInputText [(ngModel)]="filterText" 
                                       placeholder="Rechercher par nom" class="w-full"
                                       (input)="applyFilters()"/>
                            </span>
                        </div>
                        <div>
                            <p-dropdown [options]="sortOptions" [(ngModel)]="selectedSortOption" 
                                        placeholder="Trier par" (onChange)="applyFilters()"
                                        [style]="{'min-width': '150px'}"></p-dropdown>
                        </div>
                        <div>
                            <p-dropdown [options]="typeOptions" [(ngModel)]="selectedType" 
                                        placeholder="Type d'investissement" (onChange)="applyFilters()"
                                        [style]="{'min-width': '180px'}"></p-dropdown>
                        </div>
                    </div>

                    <!-- Comparison Tool -->
                    <div *ngIf="comparisonMode" class="mb-3 p-3 border-1 surface-border border-round">
                        <div class="flex justify-content-between align-items-center mb-3">
                            <h4 class="m-0">Comparaison d'investissements</h4>
                            <p-button icon="pi pi-times" (click)="exitComparisonMode()" 
                                      styleClass="p-button-rounded p-button-text"></p-button>
                        </div>

                        <div class="grid">
                            <div *ngFor="let investment of selectedInvestments" class="col-12 md:col-6 lg:col-4">
                                <div class="p-3 border-1 surface-border border-round h-full">
                                    <h5>{{ investment.name }}</h5>
                                    <div class="grid">
                                        <div class="col-6">Prix:</div>
                                        <div class="col-6 font-bold">{{ investment.amount }}€</div>

                                        <div class="col-6">Revenu:</div>
                                        <div class="col-6 font-bold">{{ investment.income }}€</div>

                                        <div class="col-6">ROI:</div>
                                        <div class="col-6 font-bold">{{ (investment.income / investment.amount * 100).toFixed(2) }}%</div>

                                        <div class="col-6">Type:</div>
                                        <div class="col-6 font-bold">{{ investment.type }}</div>
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
                        <span *ngIf="comparisonMode" class="text-sm">
                            Sélectionnez des investissements pour les comparer
                        </span>
                    </div>

                    <p-divider></p-divider>

                    <div *ngFor="let investment of filteredInvestments"
                         class="mb-3 border p-3 grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4 items-start">
                        <div>
                            <div class="mb-2">
                                <div class="flex align-items-center">
                                    <div *ngIf="comparisonMode" class="mr-2">
                                        <input type="checkbox" [checked]="isInvestmentSelected(investment)" 
                                               (change)="toggleInvestmentSelection(investment)" />
                                    </div>
                                    <strong>{{ investment.name }}</strong>
                                </div>
                            </div>
                            <div class="flex align-items-center mb-1">
                                💰Prix: {{ investment.amount }} €
                            </div>
                            <div class="flex align-items-center mb-1">
                                📈Revenu mensuel: {{ investment.income }} €
                            </div>
                            <div class="flex align-items-center text-sm text-primary">
                                ROI: {{ (investment.income / investment.amount * 100).toFixed(2) }}%
                            </div>
                        </div>
                        <div class="flex flex-column gap-2">
                            <p-button label="✅ Acheter" (click)="buyInvestment(investment)" severity="success"  size="small"
                                      [disabled]="!gameService.canBuy(investment)"></p-button>
                            <p-button label="❌ Refuser" (click)="deleteInvestment(investment)" severity="danger"  size="small"></p-button>
                            <p-button label="💸 Emprunt {{ configService.loanRate * 100 }}%" (click)="buyInvestmentWithLoan(investment)"
                                      severity="info"  size="small"></p-button>
                            <p-button *ngIf="!comparisonMode" label="🔍 Comparer" (click)="addToComparison(investment)" 
                                      severity="secondary" size="small"></p-button>
                        </div>
                    </div>
                </div>
                <ng-template #noInvestments>
                    <p class="text-center text-sm text-gray-500 mt-2">Aucune opportunité d'investissement disponible.</p>
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

    // Filtering and sorting properties
    filterText: string = '';
    selectedSortOption: any = null;
    selectedType: any = null;
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
            this.applyFilters();
        } else {
            this.visibleChange.emit(false);
        }
    }

    close() {
        this.gameService.nextTurn();
        this.visibleChange.emit(false);
    }

    deleteInvestment(investment: Investment) {
        this.investmentOpportunities = this.investmentOpportunities.filter(i => i !== investment);
        this.applyFilters(); // Update filtered investments
        if (this.investmentOpportunities.length === 0) this.gameService.nextTurn();
    }

    buyInvestmentWithLoan(investment: any) {
        this.gameService.buyInvestmentWithLoan(investment);
        this.investmentOpportunities = this.investmentOpportunities.filter(i => i !== investment);
        this.applyFilters(); // Update filtered investments
        if (this.investmentOpportunities.length === 0) this.gameService.nextTurn();
    }

    buyInvestment(investment: any) {
        this.gameService.buyInvestment(investment);
        this.investmentOpportunities = this.investmentOpportunities.filter(i => i !== investment);
        this.applyFilters(); // Update filtered investments
        if (this.investmentOpportunities.length === 0) this.gameService.nextTurn();
    }

    // Update type options based on available investment types
    updateTypeOptions() {
        // Get unique investment types
        const types = new Set<string>();
        this.configService.investments.forEach(investment => {
            if (investment.type) {
                types.add(investment.type);
            }
        });

        // Convert to dropdown options
        this.typeOptions = [
            { label: 'Tous les types', value: null },
            ...Array.from(types).map(type => ({ label: type, value: type }))
        ];
    }

    // Apply filters and sorting to investments
    applyFilters() {
        // Start with all investment opportunities
        let filtered = [...this.investmentOpportunities];

        // Apply text filter
        if (this.filterText) {
            const searchText = this.filterText.toLowerCase();
            filtered = filtered.filter(investment => 
                investment.name.toLowerCase().includes(searchText)
            );
        }

        // Apply type filter
        if (this.selectedType) {
            filtered = filtered.filter(investment => 
                investment.type === this.selectedType
            );
        }

        // Apply sorting
        if (this.selectedSortOption) {
            switch (this.selectedSortOption) {
                case 'price-asc':
                    filtered.sort((a, b) => a.amount - b.amount);
                    break;
                case 'price-desc':
                    filtered.sort((a, b) => b.amount - a.amount);
                    break;
                case 'income-asc':
                    filtered.sort((a, b) => a.income - b.income);
                    break;
                case 'income-desc':
                    filtered.sort((a, b) => b.income - a.income);
                    break;
                case 'roi-asc':
                    filtered.sort((a, b) => (a.income / a.amount) - (b.income / b.amount));
                    break;
                case 'roi-desc':
                    filtered.sort((a, b) => (b.income / b.amount) - (a.income / a.amount));
                    break;
            }
        }

        this.filteredInvestments = filtered;
    }

    addToComparison(investment: Investment) {

    }

    toggleInvestmentSelection(investment: Investment) {

    }

    isInvestmentSelected(investment: Investment) {
        return true
    }

    removeFromComparison(investment: Investment) {


    }

    enterComparisonMode() {

    }

    exitComparisonMode() {

    }
}
