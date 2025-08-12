import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { GameConfigService } from './game-config.service';
import { GameService } from './game.service'; // Assuming GameService is imported from this path
import { Select } from 'primeng/select';
import { IftaLabel } from 'primeng/iftalabel';

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
        DialogModule,
        Select,
        IftaLabel
    ],
    template: `
        <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div class="w-full max-w-md space-y-6">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-gray-900 mb-2">Bienvenue dans le jeu</h1>
                    <h2 class="text-2xl font-semibold text-indigo-600">Cashflow</h2>
                    <p class="text-gray-600 mt-4">Simulez votre parcours vers l'indépendance financière</p>
                </div>
                
                <p-card header="Démarrage du jeu" class="shadow-lg">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Métier</label>
                            <p-select id="job" [options]="jobs" [(ngModel)]="selectedJob" 
                                     placeholder="Sélectionnez un métier" class="w-full">
                                <ng-template let-job pTemplate="item">
                                    <div class="p-2">{{ job.label }} ({{ job.value.minSalary }}€ - {{ job.value.maxSalary }}€)</div>
                                </ng-template>
                                <ng-template let-job pTemplate="selectedItem">
                                    <div>{{ job.label }} ({{ job.value.minSalary }}€ - {{ job.value.maxSalary }}€)</div>
                                </ng-template>
                                <ng-template #dropdownicon>
                                    <i class="pi pi-briefcase"></i>
                                </ng-template>
                            </p-select>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <p-iftalabel>
                                <p-inputNumber id="age" [(ngModel)]="age" mode="decimal" [min]="18" [max]="100" 
                                              class="w-full"></p-inputNumber>
                                <label for="age">Âge</label>
                            </p-iftalabel>
                            <p-iftalabel>
                                <p-inputNumber id="startingMoney" [(ngModel)]="startingMoney" mode="currency" 
                                              currency="EUR" locale="fr-FR" class="w-full"></p-inputNumber>
                                <label for="startingMoney">Capital de départ</label>
                            </p-iftalabel>
                        </div>
                        
                        <p-iftalabel>
                            <div class="flex gap-2">
                                <input id="name" type="text" pInputText [(ngModel)]="name" 
                                       placeholder="Nom du joueur" class="flex-1"/>
                                <p-button icon="pi pi-refresh" (click)="generateRandomName()" 
                                         type="button" class="p-button-outlined"></p-button>
                            </div>
                            <label for="name">Nom du joueur</label>
                        </p-iftalabel>

                        <div class="flex justify-between gap-4 pt-4">
                            <p-button icon="pi pi-question-circle" label="Aide" (click)="showHelp = true" 
                                     class="p-button-outlined flex-1"></p-button>
                            <p-button label="Démarrer le jeu"
                                      (click)="gameService.startGame(selectedJob, age, startingMoney, name)"
                                      [disabled]="!selectedJob || !age || !startingMoney || !name"
                                      class="flex-1"></p-button>
                        </div>
                    </div>
                </p-card>
            </div>

            <p-dialog header="Aide et tutoriel" [(visible)]="showHelp" [style]="{width: '80vw'}" [modal]="true">
                <h3>Bienvenue dans Cashflow Game!</h3>
                <p>Ce jeu vous permet de simuler votre parcours financier, de l'emploi à l'indépendance financière.</p>

                <h4>Comment jouer:</h4>
                <ol>
                    <li><strong>Choisissez un métier</strong> - Chaque métier a un salaire différent qui détermine votre revenu mensuel.</li>
                    <li><strong>Définissez votre âge</strong> - Votre âge influence le nombre de tours que vous aurez pour atteindre l'indépendance financière.</li>
                    <li><strong>Capital de départ</strong> - C'est l'argent avec lequel vous commencez le jeu.</li>
                    <li><strong>Nom</strong> - Entrez votre nom ou générez-en un aléatoirement.</li>
                </ol>

                <h4>Objectif du jeu:</h4>
                <p>L'objectif est d'atteindre l'indépendance financière, c'est-à-dire lorsque vos revenus passifs dépassent vos dépenses.</p>

                <h4>Pendant le jeu:</h4>
                <ul>
                    <li>À chaque tour, vous recevez votre salaire et payez vos dépenses</li>
                    <li>Vous pouvez acheter des investissements pour générer des revenus passifs</li>
                    <li>Des événements aléatoires peuvent affecter vos finances</li>
                    <li>Suivez votre progression vers l'indépendance financière</li>
                </ul>

                <p>Bonne chance dans votre parcours vers la liberté financière!</p>
            </p-dialog>
        </div>
    `
})
export class StartupScreenComponent {
    jobs: any[] = []; // Expect to receive this via @Input() from the parent or via routing initialization.
    selectedJob: any = null;
    age: number = 25;
    startingMoney: number = 5000;
    name: string = '';
    showHelp: boolean = false;
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
