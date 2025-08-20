import { Component, computed } from '@angular/core';
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
import { TranslationService } from './translation.service';
import { Select } from 'primeng/select';
import { IftaLabel } from 'primeng/iftalabel';
import { ThemeToggleComponent } from './theme-toggle.component';
import { LanguageToggleComponent } from './language-toggle.component';
import {NgIf} from '@angular/common';
import {DifficultyLevel} from './data';

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
        ThemeToggleComponent,
        LanguageToggleComponent,
        NgIf
    ],
    template: `
        <div class="min-h-screen theme-bg-primary bg-gradient-to-br from-primary-50/50 to-secondary-50/30 dark:from-neutral-900/50 dark:to-primary-900/30 px-3 sm:px-4 py-4 sm:py-6 animate-fade-in">
            <!-- Theme and Language Toggles - Positioned at top right -->
            <div class="fixed top-3 sm:top-4 right-3 sm:right-4 z-10 flex gap-2">
                <app-language-toggle></app-language-toggle>
                <app-theme-toggle></app-theme-toggle>
            </div>
            
            <div class="flex flex-col items-center justify-start sm:justify-center min-h-screen pt-16 sm:pt-0">
                <div class="w-full max-w-sm sm:max-w-md space-y-4 sm:space-y-6">
                    <div class="text-center animate-slide-down">
                        <h1 class="text-2xl sm:text-4xl font-bold theme-text-primary mb-2 font-sans">{{ welcome() }}</h1>
                        <h2 class="text-lg sm:text-2xl font-semibold text-primary-600 dark:text-primary-400">Cashflow</h2>
                        <p class="theme-text-muted mt-2 sm:mt-4 text-sm sm:text-base">{{ tagline() }}</p>
                    </div>
                    
                    <!-- Resume Game Card -->
                    <p-card *ngIf="savedGameExists" [header]="translationService.translate('startup.resumeGame')" class="theme-shadow-xl animate-slide-up mb-4">
                        <div class="text-center space-y-4">
                            <p class="theme-text-muted">{{ translationService.translate('startup.continueWith') }} <strong class="theme-text-primary">{{ savedPlayerName }}</strong></p>
                            <p-button [label]="translationService.translate('startup.resumeGameButton')"
                                      (click)="resumeGame()"
                                      icon="pi pi-play"
                                      class="w-full hover:scale-105 active:scale-95 transition-transform duration-200 theme-shadow-md touch-target min-h-[48px]"></p-button>
                        </div>
                    </p-card>
                    
                    <p-card [header]="translationService.translate('startup.gameStart')" class="theme-shadow-xl animate-slide-up">
                        <div class="space-y-3 sm:space-y-4">
                            <div>
                                <label class="block text-sm font-medium theme-text-primary mb-2">{{ translationService.translate('startup.job') }}</label>
                                <p-select id="job" [options]="jobs()" [(ngModel)]="selectedJob" 
                                         [placeholder]="translationService.translate('startup.selectJob')" class="w-full touch-manipulation">
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

                            <div>
                                <label class="block text-sm font-medium theme-text-primary mb-2">{{ translationService.translate('startup.difficultyLevel') }}</label>
                                <p-select id="difficulty" [options]="difficultyLevels()" [(ngModel)]="selectedDifficulty" 
                                         optionLabel="label" optionValue="level"
                                         [placeholder]="translationService.translate('startup.selectDifficulty')" class="w-full touch-manipulation">
                                    <ng-template let-difficulty pTemplate="item">
                                        <div class="p-3">
                                            <div class="text-sm font-medium">{{ difficulty.label }}</div>
                                            <div class="text-xs theme-text-muted mt-1">{{ difficulty.description }}</div>
                                        </div>
                                    </ng-template>
                                    <ng-template let-difficulty pTemplate="selectedItem">
                                        <div class="text-sm">{{ difficulty.label }}</div>
                                    </ng-template>
                                    <ng-template #dropdownicon>
                                        <i class="pi pi-cog text-primary-500"></i>
                                    </ng-template>
                                </p-select>
                            </div>
                            
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <p-iftalabel>
                                    <p-inputNumber id="age" [(ngModel)]="age" mode="decimal" [min]="18" [max]="100" 
                                                  class="w-full touch-manipulation"></p-inputNumber>
                                    <label for="age" class="theme-text-primary text-sm">{{ translationService.translate('startup.age') }}</label>
                                </p-iftalabel>
                                <p-iftalabel>
                                    <p-inputNumber id="startingMoney" [(ngModel)]="startingMoney" mode="currency" 
                                                  currency="EUR" locale="fr-FR" class="w-full touch-manipulation"></p-inputNumber>
                                    <label for="startingMoney" class="theme-text-primary text-sm">{{ translationService.translate('startup.startingMoney') }}</label>
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
                                             [pTooltip]="translationService.translate('startup.generateName')"></p-button>
                                </div>
                                <label for="name" class="theme-text-primary text-sm">{{ translationService.translate('startup.playerName') }}</label>
                            </p-iftalabel>

                            <div class="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-3 sm:pt-4">
                                <p-button icon="pi pi-question-circle" [label]="translationService.translate('startup.help')" (click)="showHelp = true" outlined/>
                                <p-button [label]="translationService.translate('startup.startGame')"
                                          (click)="startNewGame()"
                                          [disabled]="!selectedJob || !age || !startingMoney || !name"/>
                            </div>
                        </div>
                    </p-card>
                </div>
            </div>

            <p-dialog [header]="translationService.translate('startup.helpTitle')" [(visible)]="showHelp" [style]="{width: '80vw'}" [modal]="true"
                      styleClass="theme-bg-card">
                <div class="theme-text-card space-y-4">
                    <div>
                        <h3 class="text-lg font-semibold theme-text-primary mb-2">{{ translationService.translate('startup.welcomeGame') }}</h3>
                        <p class="theme-text-muted">{{ translationService.translate('startup.gameDescription') }}</p>
                    </div>

                    <div>
                        <h4 class="font-semibold theme-text-primary mb-2">{{ translationService.translate('startup.howToPlay') }}</h4>
                        <ol class="list-decimal list-inside space-y-1 theme-text-muted">
                            <li>{{ translationService.translate('startup.step1') }}</li>
                            <li>{{ translationService.translate('startup.step2') }}</li>
                            <li>{{ translationService.translate('startup.step3') }}</li>
                            <li>{{ translationService.translate('startup.step4') }}</li>
                        </ol>
                    </div>

                    <div>
                        <h4 class="font-semibold theme-text-primary mb-2">{{ translationService.translate('startup.objective') }}</h4>
                        <p class="theme-text-muted">{{ translationService.translate('startup.objectiveDesc') }}</p>
                    </div>

                    <div>
                        <h4 class="font-semibold theme-text-primary mb-2">{{ translationService.translate('startup.duringGame') }}</h4>
                        <ul class="list-disc list-inside space-y-1 theme-text-muted">
                            <li>{{ translationService.translate('startup.gameStep1') }}</li>
                            <li>{{ translationService.translate('startup.gameStep2') }}</li>
                            <li>{{ translationService.translate('startup.gameStep3') }}</li>
                            <li>{{ translationService.translate('startup.gameStep4') }}</li>
                        </ul>
                    </div>

                    <p class="text-center font-medium text-secondary-600 dark:text-secondary-400 mt-4">
                        {{ translationService.translate('startup.goodLuck') }}
                    </p>
                </div>
            </p-dialog>
        </div>
    `
})
export class StartupScreenComponent {
    selectedJob: any = null;
    selectedDifficulty: DifficultyLevel = 'normal';
    age: number = 25;
    startingMoney: number = 5000;
    name: string = '';
    showHelp: boolean = false;
    savedGameExists: boolean = false;
    savedPlayerName: string = '';
    private readonly randomNames;

    // Computed signals for reactive translations
    welcome = computed(() => this.translationService.translate('startup.welcome'));
    tagline = computed(() => this.translationService.translate('startup.tagline'));
    gameStart = computed(() => this.translationService.translate('startup.gameStart'));
    job = computed(() => this.translationService.translate('startup.job'));
    selectJob = computed(() => this.translationService.translate('startup.selectJob'));
    age_label = computed(() => this.translationService.translate('startup.age'));
    startingMoney_label = computed(() => this.translationService.translate('startup.startingMoney'));
    playerName = computed(() => this.translationService.translate('startup.playerName'));
    generateName = computed(() => this.translationService.translate('startup.generateName'));
    help = computed(() => this.translationService.translate('startup.help'));
    startGame = computed(() => this.translationService.translate('startup.startGame'));
    jobs = computed(() => this.configService.getTranslatedJobs());
    difficultyLevels = computed(() => this.configService.difficultyConfigs);

    constructor(private router: Router, private configService: GameConfigService, public gameService: GameService, public translationService: TranslationService) {
        this.randomNames = this.configService.randomNames;
        this.checkForSavedGame();
    }

    checkForSavedGame(): void {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            try {
                const gameState = JSON.parse(savedState);
                this.savedGameExists = true;
                this.savedPlayerName = gameState.name || 'Joueur';
            } catch (error) {
                console.error('Error checking saved game:', error);
                this.savedGameExists = false;
            }
        }
    }

    resumeGame(): void {
        this.router.navigate(['/game']);
    }

    generateRandomName() {
        const randomIndex = Math.floor(Math.random() * this.randomNames.length);
        this.name = this.randomNames[randomIndex];
    }

    startNewGame() {
        // Set the selected difficulty before starting the game
        this.configService.setDifficulty(this.selectedDifficulty);
        // Start the game with the selected parameters
        this.gameService.startGame(this.selectedJob, this.age, this.startingMoney, this.name);
    }
}
