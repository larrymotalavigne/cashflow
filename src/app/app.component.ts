import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RouterOutlet} from '@angular/router';
import { ToastComponent } from './toast.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        RouterOutlet,
        ToastComponent,
        ConfirmationDialogComponent
    ],
    template: `
        <router-outlet></router-outlet>
        <app-toast-container></app-toast-container>
        <app-confirmation-dialogs></app-confirmation-dialogs>`,
})
export class AppComponent {
}