import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { GameConfigService } from './game-config.service';
import { GameService } from './game.service';
import { Select } from 'primeng/select';
import { IftaLabel } from 'primeng/iftalabel';
import { ThemeToggleComponent } from './theme-toggle.component';

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
        TooltipModule,
        Select,
        IftaLabel,
        ThemeToggleComponent
    ],
    template: `
        <div class="min-h-screen theme-bg-primary bg-gradient-to-br from-primary-50/50 to-secondary-50/30 dark:from-neutral-900/50 dark:to-primary-900/30 px-3 sm:px-4 py-4 sm:py-6 animate-fade-in">
            <!-- Theme Toggle - Positioned at top right -->
            <div class="fixed top-3 sm:top-4 right-3 sm:right-4 z-10">
                <app-theme-toggle></app-theme-toggle>
            </div>
            
            <div class="flex flex-col items-center justify-start sm:justify-center min-h-screen pt-16 sm:pt-0">
                <div class="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
                    <div class="text-center animate-slide-down">
                        <h1 class="text-2xl sm:text-4xl font-bold theme-text-primary mb-2 font-sans">Bienvenue dans le jeu</h1>
                        <h2 class="text-lg sm:text-2xl font-semibold text-primary-600 dark:text-primary-400">Cashflow</h2>
                        <p class="theme-text-muted mt-2 sm:mt-4 text-sm sm:text-base">Simulez votre parcours vers l'indépendance financière</p>
                    </div>
                    
                    <p-card header="Démarrage du jeu" class="theme-shadow-xl animate-slide-up">
                        <div class="space-y-3 sm:space-y-4">
                            <div>
                                <label class="block text-sm font-medium theme-text-primary mb-2">Métier</label>
                                <p-select id="job" [options]="jobs" [(ngModel)]="selectedJob" 
                                         placeholder="Sélectionnez un métier" class="w-full touch-manipulation">
                                    <ng-template let-job pTemplate="item">
                                        <div class="p-3 text-sm">{{ job.label }} ({{ job.value.minSalary }}€ - {{ job.value.maxSalary }}€)</div>
                                    </ng-template>
                                    <ng-template let-job pTemplate="selectedItem">
                                        <div class="text-sm">{{ job.label }} ({{ job.value.minSalary }}€ - {{ job.value.maxSalary }}€)</div>
                                    </ng-template>
                                    <ng-template #dropdownicon>
                                        <i class="pi pi-briefcase text-primary-500"></i>
                                    </ng-template>
                                </p-select>
                            </div>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <p-iftalabel>
                                    <p-inputNumber id="age" [(ngModel)]="age" mode="decimal" [min]="18" [max]="100" 
                                                  class="w-full touch-manipulation"></p-inputNumber>
                                    <label for="age" class="theme-text-primary text-sm">Âge</label>
                                </p-iftalabel>
                                <p-iftalabel>
                                    <p-inputNumber id="startingMoney" [(ngModel)]="startingMoney" mode="currency" 
                                                  currency="EUR" locale="fr-FR" class="w-full touch-manipulation"></p-inputNumber>
                                    <label for="startingMoney" class="theme-text-primary text-sm">Capital de départ</label>
                                </p-iftalabel>
                            </div>
                            
                            <p-iftalabel>
                                <div class="flex gap-2">
                                    <input id="name" type="text" pInputText [(ngModel)]="name" 
                                           class="flex-1 touch-manipulation" 
                                           style="min-height: 44px; font-size: 16px; padding-top: 20px;"/>
                                    <p-button icon="pi pi-refresh" (click)="generateRandomName()" 
                                             type="button" 
                                             class="p-button-outlined hover:scale-105 active:scale-95 transition-transform duration-200 touch-target"
                                             pTooltip="Générer un nom aléatoire"></p-button>
                                </div>
                                <label for="name" class="theme-text-primary text-sm">Nom du joueur</label>
                            </p-iftalabel>

                            <div class="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-3 sm:pt-4">
                                <p-button icon="pi pi-question-circle" label="Aide" (click)="showHelp = true" 
                                         class="p-button-outlined flex-1 hover:scale-105 active:scale-95 transition-transform duration-200 touch-target min-h-[48px]"></p-button>
                                <p-button label="Démarrer le jeu"
                                          (click)="gameService.startGame(selectedJob, age, startingMoney, name)"
                                          [disabled]="!selectedJob || !age || !startingMoney || !name"
                                          class="flex-1 hover:scale-105 active:scale-95 transition-transform duration-200 theme-shadow-md touch-target min-h-[48px]"></p-button>
                            </div>
                        </div>
                    </p-card>
                </div>
            </div>

            <p-dialog header="Aide et tutoriel" [(visible)]="showHelp" [style]="{width: '80vw'}" [modal]="true"
                      styleClass="theme-bg-card">
                <div class="theme-text-card space-y-4">
                    <div>
                        <h3 class="text-lg font-semibold theme-text-primary mb-2">Bienvenue dans Cashflow Game!</h3>
                        <p class="theme-text-muted">Ce jeu vous permet de simuler votre parcours financier, de l'emploi à l'indépendance financière.</p>
                    </div>

                    <div>
                        <h4 class="font-semibold theme-text-primary mb-2">Comment jouer:</h4>
                        <ol class="list-decimal list-inside space-y-1 theme-text-muted">
                            <li><strong class="theme-text-primary">Choisissez un métier</strong> - Chaque métier a un salaire différent qui détermine votre revenu mensuel.</li>
                            <li><strong class="theme-text-primary">Définissez votre âge</strong> - Votre âge influence le nombre de tours que vous aurez pour atteindre l'indépendance financière.</li>
                            <li><strong class="theme-text-primary">Capital de départ</strong> - C'est l'argent avec lequel vous commencez le jeu.</li>
                            <li><strong class="theme-text-primary">Nom</strong> - Entrez votre nom ou générez-en un aléatoirement.</li>
                        </ol>
                    </div>

                    <div>
                        <h4 class="font-semibold theme-text-primary mb-2">Objectif du jeu:</h4>
                        <p class="theme-text-muted">L'objectif est d'atteindre l'indépendance financière, c'est-à-dire lorsque vos revenus passifs dépassent vos dépenses.</p>
                    </div>

                    <div>
                        <h4 class="font-semibold theme-text-primary mb-2">Pendant le jeu:</h4>
                        <ul class="list-disc list-inside space-y-1 theme-text-muted">
                            <li>À chaque tour, vous recevez votre salaire et payez vos dépenses</li>
                            <li>Vous pouvez acheter des investissements pour générer des revenus passifs</li>
                            <li>Des événements aléatoires peuvent affecter vos finances</li>
                            <li>Suivez votre progression vers l'indépendance financière</li>
                        </ul>
                    </div>

                    <p class="text-center font-medium text-secondary-600 dark:text-secondary-400 mt-4">
                        Bonne chance dans votre parcours vers la liberté financière! 🚀
                    </p>
                </div>
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
