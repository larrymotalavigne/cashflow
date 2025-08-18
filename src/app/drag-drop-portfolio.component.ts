import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationDialogService } from './confirmation-dialog.service';
import { ToastService } from './toast.service';
import { GameService } from './game.service';
import { Investment } from './data';

interface InvestmentGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  investments: Investment[];
  totalValue: number;
  totalIncome: number;
}

@Component({
  selector: 'app-drag-drop-portfolio',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TooltipModule],
  template: `
    <p-card class="theme-bg-card theme-shadow-lg">
      <ng-template pTemplate="header">
        <div class="flex justify-content-between align-items-center p-3">
          <h3 class="m-0 theme-text-card">🎯 Gestion de Portfolio (Glisser-Déposer)</h3>
          <div class="flex gap-2">
            <p-button 
              icon="pi pi-refresh" 
              (click)="refreshPortfolio()" 
              class="p-button-outlined p-button-sm"
              pTooltip="Actualiser le portfolio">
            </p-button>
            <p-button 
              icon="pi pi-sort-alpha-down" 
              (click)="autoSortByType()" 
              class="p-button-outlined p-button-sm"
              pTooltip="Trier automatiquement par type">
            </p-button>
          </div>
        </div>
      </ng-template>
      
      <ng-template pTemplate="content">
        <div *ngIf="investmentGroups.length === 0" class="text-center p-6">
          <div class="text-6xl mb-4">📊</div>
          <h4 class="theme-text-primary mb-2">Aucun investissement</h4>
          <p class="theme-text-muted">Achetez des investissements pour commencer à gérer votre portfolio.</p>
        </div>

        <div *ngIf="investmentGroups.length > 0" class="portfolio-manager">
          <!-- Portfolio Overview -->
          <div class="mb-4 p-3 theme-bg-muted rounded-lg">
            <h4 class="theme-text-primary mb-3 flex items-center">
              <i class="pi pi-chart-pie mr-2 text-primary-600 dark:text-primary-400"></i>
              Vue d'ensemble du Portfolio
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ getTotalPortfolioValue() | currency:'EUR':'symbol':'1.0-0' }}</div>
                <div class="text-sm theme-text-muted">Valeur totale</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-success-600 dark:text-success-400">{{ getTotalMonthlyIncome() | currency:'EUR':'symbol':'1.0-0' }}</div>
                <div class="text-sm theme-text-muted">Revenus mensuels</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-accent-600 dark:text-accent-400">{{ getPortfolioROI().toFixed(1) }}%</div>
                <div class="text-sm theme-text-muted">ROI moyen</div>
              </div>
            </div>
          </div>

          <!-- Drag & Drop Groups -->
          <div class="investment-groups grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <div 
              *ngFor="let group of investmentGroups" 
              class="investment-group"
              [style.border-left-color]="group.color">
              
              <div class="group-header p-3 rounded-t-lg" [style.background-color]="group.color + '20'">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{{ group.icon }}</span>
                    <h4 class="theme-text-primary font-semibold">{{ group.name }}</h4>
                    <span class="text-xs theme-bg-card px-2 py-1 rounded-full theme-text-muted">
                      {{ group.investments.length }}
                    </span>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-bold theme-text-primary">{{ group.totalValue | currency:'EUR':'symbol':'1.0-0' }}</div>
                    <div class="text-xs theme-text-muted">+{{ group.totalIncome | currency:'EUR':'symbol':'1.0-0' }}/mois</div>
                  </div>
                </div>
              </div>

              <div 
                class="investment-drop-zone min-h-32 p-3 theme-bg-card rounded-b-lg border-2 border-dashed transition-colors duration-200"
                [attr.data-group-id]="group.id"
                (dragover)="onDragOver($event)"
                (drop)="onDrop($event, group.id)"
                [ngClass]="{'drag-over': isDragOver}">
                
                <div 
                  *ngFor="let investment of group.investments; trackBy: trackByInvestmentName"
                  class="investment-item mb-2 p-3 theme-bg-muted rounded-lg theme-shadow-sm cursor-move hover:theme-shadow-md transition-all duration-200"
                  draggable="true"
                  [attr.data-investment]="investment.name"
                  [attr.data-group]="group.id"
                  (dragstart)="onDragStart($event, investment, group.id)"
                  (dragend)="onDragEnd($event)">
                  
                  <div class="flex justify-between items-start">
                    <div class="flex-1 min-w-0">
                      <h5 class="theme-text-primary font-semibold text-sm truncate mb-1">{{ investment.name }}</h5>
                      <div class="flex items-center justify-between text-xs">
                        <span class="theme-text-muted">{{ investment.amount | currency:'EUR':'symbol':'1.0-0' }}</span>
                        <span class="text-success-600 dark:text-success-400 font-medium">+{{ investment.income | currency:'EUR':'symbol':'1.0-0' }}/mois</span>
                      </div>
                      <div class="mt-1">
                        <span class="text-xs font-medium" [ngClass]="getROIClass(investment)">
                          ROI: {{ getInvestmentROI(investment).toFixed(1) }}%
                        </span>
                      </div>
                    </div>
                    
                    <div class="flex-shrink-0 ml-2">
                      <button 
                        (click)="sellInvestment(investment)"
                        class="p-1 rounded hover:bg-error-100 dark:hover:bg-error-900/20 text-error-600 dark:text-error-400 transition-colors"
                        [pTooltip]="'Vendre ' + investment.name">
                        <i class="pi pi-times text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div *ngIf="group.investments.length === 0" 
                     class="text-center py-6 theme-text-muted">
                  <i class="pi pi-inbox text-2xl mb-2 opacity-50"></i>
                  <p class="text-sm">Glissez des investissements ici</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="mt-6 p-4 theme-bg-muted rounded-lg">
            <h4 class="theme-text-primary mb-2 flex items-center">
              <i class="pi pi-info-circle mr-2 text-primary-600 dark:text-primary-400"></i>
              Instructions
            </h4>
            <ul class="text-sm theme-text-muted space-y-1">
              <li>• <strong>Glisser-déposer</strong> : Déplacez les investissements entre les catégories</li>
              <li>• <strong>Réorganiser</strong> : Changez l'ordre au sein d'une même catégorie</li>
              <li>• <strong>Vendre</strong> : Cliquez sur ✕ pour vendre un investissement</li>
              <li>• <strong>Tri automatique</strong> : Utilisez le bouton de tri pour organiser par type</li>
            </ul>
          </div>
        </div>
      </ng-template>
    </p-card>
  `,
  styles: [`
    .portfolio-manager {
      min-height: 400px;
    }

    .investment-group {
      border-left: 4px solid;
      border-radius: 8px;
      overflow: hidden;
    }

    .investment-drop-zone {
      min-height: 120px;
    }

    .investment-drop-zone.cdk-drop-list-dragging {
      background-color: var(--color-primary) !important;
      opacity: 0.1;
    }

    .investment-item.cdk-drag-dragging {
      opacity: 0.7;
      transform: rotate(2deg);
    }

    .investment-item.cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .investment-preview {
      max-width: 200px;
    }

    /* Hover states for drop zones */
    .cdk-drop-list-receiving {
      background-color: var(--color-success) !important;
      opacity: 0.2;
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
      background: var(--color-muted);
      border: 2px dashed var(--color-border);
      border-radius: 4px;
      height: 60px;
    }
  `]
})
export class DragDropPortfolioComponent implements OnInit {
  private gameService = inject(GameService);
  private confirmationService = inject(ConfirmationDialogService);
  private toastService = inject(ToastService);

  investmentGroups: InvestmentGroup[] = [];
  isDragOver = false;
  private draggedInvestment: Investment | null = null;
  private sourceGroupId: string | null = null;

  private readonly defaultGroups = [
    { id: 'immobilier', name: 'Immobilier', icon: '🏠', color: '#22c55e' },
    { id: 'actions', name: 'Actions', icon: '📈', color: '#3b82f6' },
    { id: 'obligations', name: 'Obligations', icon: '📋', color: '#8b5cf6' },
    { id: 'crypto', name: 'Crypto', icon: '₿', color: '#f59e0b' },
    { id: 'matieres', name: 'Matières Premières', icon: '🥇', color: '#ef4444' },
    { id: 'business', name: 'Business', icon: '💼', color: '#06b6d4' },
    { id: 'autres', name: 'Autres', icon: '💰', color: '#6b7280' }
  ];

  ngOnInit() {
    this.initializeGroups();
    this.organizeInvestments();

    // Listen for game state changes
    this.gameService.stateChanged.subscribe(() => {
      this.organizeInvestments();
    });
  }

  private initializeGroups() {
    this.investmentGroups = this.defaultGroups.map(group => ({
      ...group,
      investments: [],
      totalValue: 0,
      totalIncome: 0
    }));
  }

  private organizeInvestments() {
    // Reset all groups
    this.investmentGroups.forEach(group => {
      group.investments = [];
      group.totalValue = 0;
      group.totalIncome = 0;
    });

    // Organize investments by type
    this.gameService.investments.forEach(investment => {
      const groupId = this.getGroupIdFromType(investment.type);
      const group = this.investmentGroups.find(g => g.id === groupId);
      
      if (group) {
        group.investments.push(investment);
        group.totalValue += investment.amount;
        group.totalIncome += investment.income;
      }
    });

    // Remove empty groups (optional - keep all for drag/drop targets)
    // this.investmentGroups = this.investmentGroups.filter(group => group.investments.length > 0);
  }

  private getGroupIdFromType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'Immobilier': 'immobilier',
      'Actions': 'actions',
      'Obligations': 'obligations',
      'Crypto': 'crypto',
      'Matières premières': 'matieres',
      'Business': 'business'
    };
    return typeMap[type] || 'autres';
  }

  private getTypeFromGroupId(groupId: string): string {
    const groupMap: { [key: string]: string } = {
      'immobilier': 'Immobilier',
      'actions': 'Actions',
      'obligations': 'Obligations',
      'crypto': 'Crypto',
      'matieres': 'Matières premières',
      'business': 'Business',
      'autres': 'Autres'
    };
    return groupMap[groupId] || 'Autres';
  }

  onDragStart(event: DragEvent, investment: Investment, groupId: string) {
    this.draggedInvestment = investment;
    this.sourceGroupId = groupId;
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', investment.name);
    }

    // Add visual feedback
    const element = event.target as HTMLElement;
    element.classList.add('dragging');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.isDragOver = true;
  }

  onDrop(event: DragEvent, targetGroupId: string) {
    event.preventDefault();
    this.isDragOver = false;

    if (!this.draggedInvestment || !this.sourceGroupId) {
      return;
    }

    // Find source and target groups
    const sourceGroup = this.investmentGroups.find(g => g.id === this.sourceGroupId);
    const targetGroup = this.investmentGroups.find(g => g.id === targetGroupId);

    if (!sourceGroup || !targetGroup) {
      return;
    }

    // If dropping in the same group, do nothing
    if (this.sourceGroupId === targetGroupId) {
      return;
    }

    // Remove from source group
    const investmentIndex = sourceGroup.investments.findIndex(inv => inv.name === this.draggedInvestment!.name);
    if (investmentIndex > -1) {
      const investment = sourceGroup.investments.splice(investmentIndex, 1)[0];
      
      // Update investment type
      const newType = this.getTypeFromGroupId(targetGroupId);
      investment.type = newType;
      
      // Add to target group
      targetGroup.investments.push(investment);
      
      // Update group totals
      this.updateGroupTotals();

      // Show success message
      this.toastService.success(
        'Investissement déplacé',
        `${investment.name} a été déplacé vers ${newType}`
      );
    }

    // Clean up
    this.draggedInvestment = null;
    this.sourceGroupId = null;
  }

  onDragEnd(event: DragEvent) {
    // Remove visual feedback
    const element = event.target as HTMLElement;
    element.classList.remove('dragging');
    
    this.isDragOver = false;
    this.draggedInvestment = null;
    this.sourceGroupId = null;
  }

  private updateGroupTotals() {
    this.investmentGroups.forEach(group => {
      group.totalValue = group.investments.reduce((sum, inv) => sum + inv.amount, 0);
      group.totalIncome = group.investments.reduce((sum, inv) => sum + inv.income, 0);
    });
  }


  async sellInvestment(investment: Investment) {
    const result = await this.confirmationService.confirmDanger(
      'Vendre l\'investissement',
      `Êtes-vous sûr de vouloir vendre "${investment.name}" ?`,
      'Vendre'
    );

    if (result.confirmed) {
      // Remove from game service investments
      const index = this.gameService.investments.findIndex(inv => inv.name === investment.name);
      if (index > -1) {
        // Add sale proceeds to cash (simplified - could add selling fees)
        this.gameService.cash += investment.amount * 0.9; // 90% of original value
        this.gameService.passiveIncome -= investment.income;
        this.gameService.investments.splice(index, 1);
        
        // Save game state
        this.gameService.saveGameState();
        this.gameService.stateChanged.emit();

        this.toastService.success(
          'Investissement vendu',
          `${investment.name} vendu pour ${(investment.amount * 0.9).toFixed(0)}€`
        );
      }
    }
  }

  refreshPortfolio() {
    this.organizeInvestments();
    this.toastService.info('Portfolio actualisé', 'Les données ont été mises à jour');
  }

  autoSortByType() {
    this.organizeInvestments();
    this.toastService.info('Portfolio trié', 'Les investissements ont été organisés par type');
  }

  getTotalPortfolioValue(): number {
    return this.investmentGroups.reduce((sum, group) => sum + group.totalValue, 0);
  }

  getTotalMonthlyIncome(): number {
    return this.investmentGroups.reduce((sum, group) => sum + group.totalIncome, 0);
  }

  getPortfolioROI(): number {
    const totalValue = this.getTotalPortfolioValue();
    const totalIncome = this.getTotalMonthlyIncome();
    return totalValue > 0 ? (totalIncome * 12 / totalValue) * 100 : 0;
  }

  getInvestmentROI(investment: Investment): number {
    return investment.amount > 0 ? (investment.income * 12 / investment.amount) * 100 : 0;
  }

  getROIClass(investment: Investment): string {
    const roi = this.getInvestmentROI(investment);
    if (roi > 15) return 'text-success-600 dark:text-success-400';
    if (roi > 8) return 'text-primary-600 dark:text-primary-400';
    if (roi > 0) return 'text-warning-600 dark:text-warning-400';
    return 'text-error-600 dark:text-error-400';
  }

  trackByInvestmentName(index: number, investment: Investment): string {
    return investment.name;
  }
}