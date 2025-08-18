import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { Investment } from './data';

export interface InvestmentFilter {
  searchText: string;
  types: string[];
  roiRange: [number, number];
  priceRange: [number, number];
  incomeRange: [number, number];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  showAffordableOnly: boolean;
  showHighROIOnly: boolean;
}

@Component({
  selector: 'app-advanced-investment-filter',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    InputTextModule, 
    DropdownModule, 
    MultiSelectModule, 
    SliderModule, 
    ButtonModule, 
    CheckboxModule, 
    CardModule,
    TooltipModule
  ],
  template: `
    <p-card class="advanced-filter theme-bg-card theme-shadow-md">
      <ng-template pTemplate="header">
        <div class="flex justify-content-between align-items-center p-3">
          <h4 class="m-0 theme-text-card flex items-center">
            <i class="pi pi-filter mr-2 text-primary-600 dark:text-primary-400"></i>
            Filtres Avancés
          </h4>
          <div class="flex gap-2">
            <p-button 
              icon="pi pi-refresh" 
              (click)="resetFilters()" 
              class="p-button-outlined p-button-sm"
              pTooltip="Réinitialiser les filtres">
            </p-button>
            <p-button 
              [icon]="isExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" 
              (click)="toggleExpanded()" 
              class="p-button-text p-button-sm"
              [pTooltip]="isExpanded ? 'Réduire' : 'Développer'">
            </p-button>
          </div>
        </div>
      </ng-template>
      
      <ng-template pTemplate="content">
        <!-- Quick Search & Basic Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">Recherche</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-search"></i>
              <input 
                type="text" 
                pInputText 
                [(ngModel)]="currentFilter.searchText" 
                (input)="onFilterChange()"
                placeholder="Nom de l'investissement" 
                class="w-full">
            </span>
          </div>

          <!-- Types -->
          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">Types d'investissement</label>
            <p-multiSelect 
              [options]="typeOptions" 
              [(ngModel)]="currentFilter.types"
              (onChange)="onFilterChange()"
              placeholder="Sélectionner types"
              [showClear]="true"
              class="w-full">
            </p-multiSelect>
          </div>

          <!-- Sort -->
          <div>
            <label class="block text-sm font-medium theme-text-primary mb-2">Trier par</label>
            <div class="flex gap-2">
              <p-dropdown 
                [options]="sortOptions" 
                [(ngModel)]="currentFilter.sortBy" 
                (onChange)="onFilterChange()"
                class="flex-1">
              </p-dropdown>
              <p-button 
                [icon]="currentFilter.sortDirection === 'asc' ? 'pi pi-sort-amount-up' : 'pi pi-sort-amount-down'"
                (click)="toggleSortDirection()"
                class="p-button-outlined"
                [pTooltip]="currentFilter.sortDirection === 'asc' ? 'Croissant' : 'Décroissant'">
              </p-button>
            </div>
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="flex flex-wrap gap-3 mb-4">
          <p-button 
            [label]="'Abordables (' + affordableCount + ')'" 
            icon="pi pi-money-bill"
            (click)="toggleAffordableFilter()"
            [styleClass]="currentFilter.showAffordableOnly ? 'p-button-success p-button-sm' : 'p-button-outlined p-button-sm'"
            pTooltip="Afficher uniquement les investissements que vous pouvez acheter">
          </p-button>
          
          <p-button 
            [label]="'Haut ROI (' + highROICount + ')'" 
            icon="pi pi-chart-line"
            (click)="toggleHighROIFilter()"
            [styleClass]="currentFilter.showHighROIOnly ? 'p-button-warning p-button-sm' : 'p-button-outlined p-button-sm'"
            pTooltip="Afficher uniquement les investissements avec ROI > 15%">
          </p-button>

          <span class="text-sm theme-text-muted flex items-center">
            {{ filteredCount }} / {{ totalCount }} investissements
          </span>
        </div>

        <!-- Advanced Filters (Expandable) -->
        <div *ngIf="isExpanded" class="advanced-filters animate-slide-down">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- ROI Range -->
            <div>
              <label class="block text-sm font-medium theme-text-primary mb-2">
                ROI ({{ currentFilter.roiRange[0] }}% - {{ currentFilter.roiRange[1] }}%)
              </label>
              <p-slider 
                [(ngModel)]="currentFilter.roiRange" 
                (onSlideEnd)="onFilterChange()"
                [range]="true" 
                [min]="0" 
                [max]="50"
                [step]="1">
              </p-slider>
            </div>

            <!-- Price Range -->
            <div>
              <label class="block text-sm font-medium theme-text-primary mb-2">
                Prix ({{ formatCurrency(currentFilter.priceRange[0]) }} - {{ formatCurrency(currentFilter.priceRange[1]) }})
              </label>
              <p-slider 
                [(ngModel)]="currentFilter.priceRange" 
                (onSlideEnd)="onFilterChange()"
                [range]="true" 
                [min]="0" 
                [max]="maxPrice"
                [step]="1000">
              </p-slider>
            </div>

            <!-- Income Range -->
            <div>
              <label class="block text-sm font-medium theme-text-primary mb-2">
                Revenu mensuel ({{ formatCurrency(currentFilter.incomeRange[0]) }} - {{ formatCurrency(currentFilter.incomeRange[1]) }})
              </label>
              <p-slider 
                [(ngModel)]="currentFilter.incomeRange" 
                (onSlideEnd)="onFilterChange()"
                [range]="true" 
                [min]="0" 
                [max]="maxIncome"
                [step]="50">
              </p-slider>
            </div>
          </div>

          <!-- Save/Load Filter Presets -->
          <div class="mt-4 pt-4 border-t theme-border">
            <h5 class="theme-text-primary mb-2">Préréglages de filtres</h5>
            <div class="flex flex-wrap gap-2">
              <p-button 
                label="Débutant" 
                (click)="loadPreset('beginner')"
                class="p-button-outlined p-button-sm"
                pTooltip="Investissements sûrs et abordables">
              </p-button>
              <p-button 
                label="Intermédiaire" 
                (click)="loadPreset('intermediate')"
                class="p-button-outlined p-button-sm"
                pTooltip="Équilibre risque/rendement">
              </p-button>
              <p-button 
                label="Aggressif" 
                (click)="loadPreset('aggressive')"
                class="p-button-outlined p-button-sm"
                pTooltip="Hauts rendements, plus de risque">
              </p-button>
              <p-button 
                label="Immobilier" 
                (click)="loadPreset('property')"
                class="p-button-outlined p-button-sm"
                pTooltip="Focus sur l'immobilier">
              </p-button>
            </div>
          </div>
        </div>
      </ng-template>
    </p-card>
  `,
  styles: [`
    .advanced-filter {
      margin-bottom: 1rem;
    }

    .advanced-filters {
      padding-top: 1rem;
      border-top: 1px solid var(--color-border);
    }

    /* Custom slider styling */
    :host ::ng-deep .p-slider .p-slider-range {
      background: var(--color-primary);
    }

    :host ::ng-deep .p-slider .p-slider-handle {
      background: var(--color-primary);
      border-color: var(--color-primary);
    }

    /* Animation */
    .animate-slide-down {
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class AdvancedInvestmentFilterComponent implements OnInit {
  @Input() investments: Investment[] = [];
  @Input() userCash: number = 0;
  @Output() filterChange = new EventEmitter<Investment[]>();

  currentFilter: InvestmentFilter = {
    searchText: '',
    types: [],
    roiRange: [0, 50],
    priceRange: [0, 100000],
    incomeRange: [0, 5000],
    sortBy: 'roi-desc',
    sortDirection: 'desc',
    showAffordableOnly: false,
    showHighROIOnly: false
  };

  isExpanded = false;
  filteredInvestments: Investment[] = [];
  
  // Computed values
  totalCount = 0;
  filteredCount = 0;
  affordableCount = 0;
  highROICount = 0;
  maxPrice = 100000;
  maxIncome = 5000;

  // Options
  typeOptions: any[] = [];
  sortOptions = [
    { label: 'ROI (décroissant)', value: 'roi-desc' },
    { label: 'ROI (croissant)', value: 'roi-asc' },
    { label: 'Prix (décroissant)', value: 'price-desc' },
    { label: 'Prix (croissant)', value: 'price-asc' },
    { label: 'Revenu (décroissant)', value: 'income-desc' },
    { label: 'Revenu (croissant)', value: 'income-asc' },
    { label: 'Nom (A-Z)', value: 'name-asc' },
    { label: 'Nom (Z-A)', value: 'name-desc' }
  ];

  ngOnInit() {
    this.updateOptions();
    this.applyFilters();
  }

  ngOnChanges() {
    this.updateOptions();
    this.applyFilters();
  }

  private updateOptions() {
    if (this.investments.length === 0) return;

    // Update type options
    const types = [...new Set(this.investments.map(inv => inv.type))];
    this.typeOptions = types.map(type => ({ label: type, value: type }));

    // Update ranges based on available investments
    this.maxPrice = Math.max(...this.investments.map(inv => inv.amount));
    this.maxIncome = Math.max(...this.investments.map(inv => inv.income));
    
    // Update current filter ranges if they're at default values
    if (this.currentFilter.priceRange[1] === 100000) {
      this.currentFilter.priceRange = [0, this.maxPrice];
    }
    if (this.currentFilter.incomeRange[1] === 5000) {
      this.currentFilter.incomeRange = [0, this.maxIncome];
    }

    this.totalCount = this.investments.length;
  }

  onFilterChange() {
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.investments];

    // Text search
    if (this.currentFilter.searchText) {
      const searchText = this.currentFilter.searchText.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.name.toLowerCase().includes(searchText)
      );
    }

    // Type filter
    if (this.currentFilter.types.length > 0) {
      filtered = filtered.filter(inv => 
        this.currentFilter.types.includes(inv.type)
      );
    }

    // ROI range filter
    filtered = filtered.filter(inv => {
      const roi = (inv.income * 12 / inv.amount) * 100;
      return roi >= this.currentFilter.roiRange[0] && roi <= this.currentFilter.roiRange[1];
    });

    // Price range filter
    filtered = filtered.filter(inv => 
      inv.amount >= this.currentFilter.priceRange[0] && 
      inv.amount <= this.currentFilter.priceRange[1]
    );

    // Income range filter
    filtered = filtered.filter(inv => 
      inv.income >= this.currentFilter.incomeRange[0] && 
      inv.income <= this.currentFilter.incomeRange[1]
    );

    // Affordable only filter
    if (this.currentFilter.showAffordableOnly) {
      filtered = filtered.filter(inv => inv.amount <= this.userCash);
    }

    // High ROI only filter
    if (this.currentFilter.showHighROIOnly) {
      filtered = filtered.filter(inv => {
        const roi = (inv.income * 12 / inv.amount) * 100;
        return roi > 15;
      });
    }

    // Sorting
    this.sortInvestments(filtered);

    // Update counts
    this.filteredCount = filtered.length;
    this.affordableCount = this.investments.filter(inv => inv.amount <= this.userCash).length;
    this.highROICount = this.investments.filter(inv => {
      const roi = (inv.income * 12 / inv.amount) * 100;
      return roi > 15;
    }).length;

    this.filteredInvestments = filtered;
    this.filterChange.emit(filtered);
  }

  private sortInvestments(investments: Investment[]) {
    const [criteria, direction] = this.currentFilter.sortBy.split('-');
    
    investments.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (criteria) {
        case 'roi':
          aValue = (a.income * 12 / a.amount) * 100;
          bValue = (b.income * 12 / b.amount) * 100;
          break;
        case 'price':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'income':
          aValue = a.income;
          bValue = b.income;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (direction === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });
  }

  toggleSortDirection() {
    this.currentFilter.sortDirection = this.currentFilter.sortDirection === 'asc' ? 'desc' : 'asc';
    // Update sortBy to reflect new direction
    const criteria = this.currentFilter.sortBy.split('-')[0];
    this.currentFilter.sortBy = `${criteria}-${this.currentFilter.sortDirection}`;
    this.onFilterChange();
  }

  toggleAffordableFilter() {
    this.currentFilter.showAffordableOnly = !this.currentFilter.showAffordableOnly;
    this.onFilterChange();
  }

  toggleHighROIFilter() {
    this.currentFilter.showHighROIOnly = !this.currentFilter.showHighROIOnly;
    this.onFilterChange();
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  resetFilters() {
    this.currentFilter = {
      searchText: '',
      types: [],
      roiRange: [0, 50],
      priceRange: [0, this.maxPrice],
      incomeRange: [0, this.maxIncome],
      sortBy: 'roi-desc',
      sortDirection: 'desc',
      showAffordableOnly: false,
      showHighROIOnly: false
    };
    this.onFilterChange();
  }

  loadPreset(preset: string) {
    switch (preset) {
      case 'beginner':
        this.currentFilter = {
          ...this.currentFilter,
          roiRange: [0, 15],
          priceRange: [0, 50000],
          showAffordableOnly: true,
          showHighROIOnly: false,
          sortBy: 'roi-asc'
        };
        break;
      
      case 'intermediate':
        this.currentFilter = {
          ...this.currentFilter,
          roiRange: [8, 25],
          priceRange: [10000, this.maxPrice],
          showAffordableOnly: false,
          showHighROIOnly: false,
          sortBy: 'roi-desc'
        };
        break;
      
      case 'aggressive':
        this.currentFilter = {
          ...this.currentFilter,
          roiRange: [15, 50],
          showAffordableOnly: false,
          showHighROIOnly: true,
          sortBy: 'roi-desc'
        };
        break;
      
      case 'property':
        this.currentFilter = {
          ...this.currentFilter,
          types: ['Immobilier'],
          sortBy: 'income-desc'
        };
        break;
    }
    
    this.onFilterChange();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}