import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-job-selection',
    standalone: true,
    imports: [FormsModule, DropdownModule, ButtonModule],
    template: `
    <p-dropdown [options]="jobs" [(ngModel)]="selectedJob" placeholder="Choisissez un métier"></p-dropdown>
    <p-button label="Démarrer" (click)="startGame()" class="mt-2"></p-button>
  `
})
export class JobSelectionComponent {
    @Input() jobs: any[] = [];
    @Output() jobSelected = new EventEmitter<any>();

    selectedJob: any = null;

    startGame() {
        this.jobSelected.emit(this.selectedJob);
    }
}