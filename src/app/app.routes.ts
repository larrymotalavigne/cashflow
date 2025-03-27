import { Routes } from '@angular/router';
import { StartupScreenComponent } from './startup-screen.component';
import { GameComponent } from './game.component';

export const routes: Routes = [
    { path: '', component: StartupScreenComponent },
    { path: 'game', component: GameComponent }
];