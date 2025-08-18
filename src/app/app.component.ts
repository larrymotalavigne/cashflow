import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RouterOutlet} from '@angular/router';
import { ToastComponent } from './toast.component';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { PwaInstallButtonComponent } from './pwa-install-button.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        RouterOutlet,
        ToastComponent,
        ConfirmationDialogComponent,
        PwaInstallButtonComponent
    ],
    template: `
        <div class="fixed top-4 right-4 z-50">
            <app-pwa-install-button></app-pwa-install-button>
        </div>
        <router-outlet></router-outlet>
        <app-toast-container></app-toast-container>
        <app-confirmation-dialogs></app-confirmation-dialogs>`,
})
export class AppComponent {
}