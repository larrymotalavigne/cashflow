import { Routes } from '@angular/router';
import { StartupScreenComponent } from './startup-screen.component';

export const routes: Routes = [
    { path: '', component: StartupScreenComponent },
    { 
        path: 'game', 
        loadComponent: () => import('./game-panels.component').then(m => m.GamePanelsComponent)
    }
];