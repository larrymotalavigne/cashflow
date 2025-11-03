import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RouterOutlet} from '@angular/router';
import {ToastComponent} from './toast.component';
import {ConfirmationDialogComponent} from './confirmation-dialog.component';
import {PwaInstallPromptComponent} from './pwa-install-prompt.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        RouterOutlet,
        ToastComponent,
        ConfirmationDialogComponent,
        PwaInstallPromptComponent
    ],
    template: `
        <router-outlet></router-outlet>
        <app-toast-container></app-toast-container>
        <app-confirmation-dialogs></app-confirmation-dialogs>
        <app-pwa-install-prompt></app-pwa-install-prompt>`,
})
export class AppComponent {
}