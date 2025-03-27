import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {GameConfigService} from './game-config.service';
import {Select} from 'primeng/select';

@Component({
    selector: 'app-startup-screen',
    standalone: true,
    imports: [
        FormsModule,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        CardModule,
        Select
    ],
    template: `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;">
            <h1>Bienvenue dans le jeu Cashflow</h1>
            <p-card header="Démarrage du jeu">
                <div class="p-field">
                    <label for="job"><i class="pi pi-briefcase"></i> Choisissez un métier</label>
                    <p-select id="job" [options]="jobs" [(ngModel)]="selectedJob" placeholder="Sélectionnez un métier">
                        <ng-template let-job pTemplate="item">
                            <div>{{ job.label }} ({{ job.value.minSalary }}€ - {{ job.value.maxSalary }}€)</div>
                        </ng-template>
                        <ng-template let-job pTemplate="selectedItem">
                            <div>{{ job.label }} ({{ job.value.minSalary }}€ - {{ job.value.maxSalary }}€)</div>
                        </ng-template>
                    </p-select>
                </div>
                <div class="p-field">
                    <label for="age"><i class="pi pi-calendar"></i> Âge</label>
                    <p-inputNumber id="age" [(ngModel)]="age" mode="decimal" [min]="18" [max]="100"></p-inputNumber>
                </div>
                <div class="p-field">
                    <label for="startingMoney"><i class="pi pi-money-bill"></i> Capital de départ</label>
                    <p-inputNumber id="startingMoney" [(ngModel)]="startingMoney" mode="currency" currency="EUR" locale="fr-FR"></p-inputNumber>
                </div>
                <div class="p-field">
                    <label for="name"><i class="pi pi-user"></i> Nom</label>
                    <div class="p-inputgroup">
                        <input id="name" type="text" pInputText [(ngModel)]="name" placeholder="Nom du joueur"/>
                        <p-button icon="pi pi-refresh" (click)="generateRandomName()" type="button"></p-button>
                    </div>
                </div>
                <p-button label="Démarrer le jeu" (click)="startGame()" class="mt-2" [disabled]="!selectedJob || !age || !startingMoney || !name"></p-button>
            </p-card>
        </div>
    `,
    styles: [`
        .p-field { margin-bottom: 1rem; }
        .mt-2 { margin-top: 1rem; }
    `]
})
export class StartupScreenComponent {
    jobs: any[] = []; // Expect to receive this via @Input() from the parent or via routing initialization.
    selectedJob: any = null;
    age: number = 25;
    startingMoney: number = 5000;
    name: string = '';
    private readonly randomNames;

    constructor(private router: Router, private configService: GameConfigService) {
        this.jobs = this.configService.jobs;
        this.randomNames = this.configService.randomNames;
    }

    generateRandomName() {
        const randomIndex = Math.floor(Math.random() * this.randomNames.length);
        this.name = this.randomNames[randomIndex];
    }

    startGame() {
        localStorage.clear();
        if (this.selectedJob && this.age && this.startingMoney && this.name) {
            // Navigate to /game, passing startup settings in the router state.
            this.router.navigate(['/game'], { state: { startupSettings: { job: this.selectedJob, age: this.age, startingMoney: this.startingMoney, name: this.name } } });
        } else {
            alert('Veuillez remplir tous les champs.');
        }
    }
}