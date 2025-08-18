import { Routes } from '@angular/router';
import { StartupScreenComponent } from './startup-screen.component';
import { GamePanelsComponent } from './game-panels.component';

export const routes: Routes = [
    { path: '', component: StartupScreenComponent },
    { path: 'game', component: GamePanelsComponent }
];