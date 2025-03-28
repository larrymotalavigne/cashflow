import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {GameConfigService} from './game-config.service';
import {GameService} from './game.service';
import {Investment} from './data';

@Component({
    selector: 'app-random-event-dialog',
    standalone: true,
    imports: [DialogModule, ButtonModule, NgForOf, NgIf],
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
                    <div *ngFor="let investment of investmentOpportunities"
                         class="mb-3 border p-3 grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4 items-start">
                        <div>
                            <div class="mb-2"><strong>{{ investment.name }}</strong></div>
                            <div class="flex align-items-center mb-1">
                                💰Prix: {{ investment.amount }} €
                            </div>
                            <div class="flex align-items-center">
                                📈Revenu mensuel: {{ investment.income }} €
                            </div>
                        </div>
                        <div class="flex flex-column gap-2">
                            <p-button label="✅ Acheter" (click)="buyInvestment(investment)" severity="success"  size="small"
                                      [disabled]="gameService.canBuy(investment)"></p-button>
                            <p-button label="❌ Refuser" (click)="deleteInvestment(investment)" severity="danger"  size="small"></p-button>
                            <p-button label="💸 Emprunt {{ configService.loanRate * 100 }}%" (click)="buyInvestmentWithLoan(investment)"
                                      severity="info"  size="small"></p-button>
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

    constructor(public configService: GameConfigService, public gameService: GameService) {
    }

    private _visible: boolean = false;

    @Input()
    get visible(): boolean {
        return this._visible;
    }

    set visible(val: boolean) {
        this._visible = val;
        if (!val) {
            this.visibleChange.emit(false);
        }
    }

    close() {
        this.gameService.nextTurn();
        this.visibleChange.emit(false);
    }

    deleteInvestment(investment: Investment) {
        this.investmentOpportunities = this.investmentOpportunities.filter(i => i !== investment);
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
}