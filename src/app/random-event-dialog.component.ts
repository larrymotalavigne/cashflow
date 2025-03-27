import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-random-event-dialog',
    standalone: true,
    imports: [DialogModule, ButtonModule],
    template: `
    <p-dialog [(visible)]="visible" header="Événement" [modal]="true">
      <p>{{ message }}</p>
      <p-footer>
        <p-button label="OK" (click)="close()"></p-button>
      </p-footer>
    </p-dialog>
  `
})
export class RandomEventDialogComponent {
    @Input() visible: boolean = false;
    @Input() message: string = '';
    @Output() visibleChange = new EventEmitter<boolean>();

    close() {
        this.visibleChange.emit(false);
    }
}