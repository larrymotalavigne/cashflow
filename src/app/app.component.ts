import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        FormsModule,
        ButtonModule,
        RouterOutlet
    ],
    template: `
        <router-outlet></router-outlet>`,
})
export class AppComponent {
}