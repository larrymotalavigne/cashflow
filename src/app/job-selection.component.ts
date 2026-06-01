import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-job-selection",
  standalone: true,
  imports: [FormsModule, SelectModule, ButtonModule],
  template: `
    <p-select
      [options]="jobs"
      [(ngModel)]="selectedJob"
      placeholder="Choisissez un métier"
    ></p-select>
    <p-button label="Démarrer" (click)="startGame()" class="mt-2"></p-button>
  `,
})
export class JobSelectionComponent {
  @Input() jobs: any[] = [];
  @Output() jobSelected = new EventEmitter<any>();

  selectedJob: any = null;

  startGame() {
    this.jobSelected.emit(this.selectedJob);
  }
}
