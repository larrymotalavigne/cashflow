import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InvestmentComponent } from './investment.component';
import {NgForOf, NgIf} from '@angular/common';

@Component({
    selector: 'app-random-event-dialog',
    standalone: true,
    imports: [DialogModule, ButtonModule, InvestmentComponent, NgForOf, NgIf],
    template: `
    <p-dialog [(visible)]="visible" header="Événements aléatoires" [modal]="true" styleClass="w-75">
      <div *ngIf="randomEvents.length">
        <h3>Événements ({{ totalImpact() }})</h3>
        <ul>
          <li *ngFor="let event of randomEvents">
            <ng-container *ngIf="event.impact > 0">
              <i class="pi pi-plus-circle text-green-500" style="margin-right: 0.5rem;"></i>
            </ng-container>
            <ng-container *ngIf="event.impact < 0">
              <i class="pi pi-minus-circle text-red-500" style="margin-right: 0.5rem;"></i>
            </ng-container>
            {{ event.message }}
          </li>
        </ul>
      </div>

      <div *ngIf="investmentOpportunities.length">
        <h3>Opportunités d'investissement</h3>
        <app-investment [investments]="investmentOpportunities"></app-investment>
      </div>

      <p-footer>
        <p-button label="OK" (click)="close()"></p-button>
      </p-footer>
    </p-dialog>
  `
})
export class RandomEventDialogComponent {
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

    @Input() message: string = '';
    @Input() randomEvents: any[] = [];
    @Input() investmentOpportunities: any[] = [];
    @Output() visibleChange = new EventEmitter<boolean>();

    close() {
        this.visibleChange.emit(false);
    }

    totalImpact(): number {
        return this.randomEvents.reduce((sum, event) => sum + (event.impact || 0), 0);
    }
}