import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { GameConfigService } from './game-config.service';
import { GameService } from './game.service'; // Assuming GameService is imported from this path
import { Select } from 'primeng/select';
import {InputIcon} from 'primeng/inputicon';
import {IconField} from 'primeng/iconfield';
import {IftaLabel} from 'primeng/iftalabel';

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
        Select,
        InputIcon,
        IconField,
        IftaLabel
    ],
    template: `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh;">
            <h1>Bienvenue dans le jeu Cashflow</h1>
            <p-card header="Démarrage du jeu">
                <p-select id="job" [options]="jobs" [(ngModel)]="selectedJob" placeholder="Sélectionnez un métier">
                    <ng-template let-job pTemplate="item">
                        <div>{{ job.label }} ({{ job.value.minSalary }}€ - {{ job.value.maxSalary }}€)</div>
                    </ng-template>
                    <ng-template let-job pTemplate="selectedItem">
                        <div>{{ job.label }} ({{ job.value.minSalary }}€ - {{ job.value.maxSalary }}€)</div>
                    </ng-template>
                    <ng-template #dropdownicon>
                        <i class="pi pi-briefcase"></i>
                    </ng-template>
                </p-select>
                <p-iftalabel>
                    <p-inputNumber id="age" [(ngModel)]="age" mode="decimal" [min]="18" [max]="100"></p-inputNumber>
                    <label for="age">Age</label>
                </p-iftalabel>
                <p-iftalabel>
                    <p-inputNumber id="startingMoney" [(ngModel)]="startingMoney" mode="currency" currency="EUR"
                                   locale="fr-FR"></p-inputNumber>
                    <label for="startingMoney">Capital de départ</label>
                </p-iftalabel>
                <p-iftalabel>
                    <input id="name" type="text" pInputText [(ngModel)]="name" placeholder="Nom du joueur"/>
                    <label for="name">Nom</label>
                    <p-button icon="pi pi-refresh" (click)="generateRandomName()" type="button"></p-button>
                </p-iftalabel>

                <p-button label="Démarrer le jeu"
                          (click)="gameService.startGame(selectedJob, age, startingMoney, name)"
                          class="mt-2"
                          [disabled]="!selectedJob || !age || !startingMoney || !name"></p-button>
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

    constructor(private router: Router, private configService: GameConfigService, public gameService: GameService) {
        this.jobs = this.configService.jobs;
        this.randomNames = this.configService.randomNames;
    }

    generateRandomName() {
        const randomIndex = Math.floor(Math.random() * this.randomNames.length);
        this.name = this.randomNames[randomIndex];
    }
}