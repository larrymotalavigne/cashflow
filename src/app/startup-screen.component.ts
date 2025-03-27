import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-startup-screen',
    standalone: true,
    imports: [
        FormsModule,
        DropdownModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        CardModule
    ],
    template: `
        <p-card header="Démarrage du jeu">
            <div class="p-field">
                <label for="job"><i class="pi pi-briefcase"></i> Choisissez un métier</label>
                <p-dropdown id="job" [options]="jobs" [(ngModel)]="selectedJob" placeholder="Sélectionnez un métier">
                    <ng-template let-job pTemplate="item">
                        <div>{{ job.label }} ({{ job.value.minSalary }} - {{ job.value.maxSalary }} €)</div>
                    </ng-template>
                    <ng-template let-job pTemplate="selectedItem">
                        <div>{{ job.label }} ({{ job.value.minSalary }} - {{ job.value.maxSalary }} €)</div>
                    </ng-template>
                </p-dropdown>
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
                    <p-button icon="pi pi-refresh" (onClick)="generateRandomName()"></p-button>
                </div>
            </div>
            <p-button label="Démarrer le jeu" (onClick)="startGame()" class="mt-2"
                      [disabled]="!selectedJob || !age || !startingMoney || !name"></p-button>
        </p-card>
    `,
    styles: [`
    .p-field {
      margin-bottom: 1rem;
    }
    .mt-2 {
      margin-top: 1rem;
    }
  `]
})
export class StartupScreenComponent {
    @Input() jobs: any[] = [];
    @Output() startup = new EventEmitter<{ job: any, age: number, startingMoney: number, name: string }>();

    selectedJob: any = null;
    age: number = 18;
    startingMoney: number = 5000;
    name: string = '';

    private randomNames = ['Alex', 'Jordan', 'Charlie', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Cameron', 'Jamie', 'Dakota'];

    generateRandomName() {
        const randomIndex = Math.floor(Math.random() * this.randomNames.length);
        this.name = this.randomNames[randomIndex];
    }

    startGame() {
        if (this.selectedJob && this.age && this.startingMoney && this.name) {
            this.startup.emit({
                job: this.selectedJob,
                age: this.age,
                startingMoney: this.startingMoney,
                name: this.name
            });
        } else {
            alert('Veuillez remplir tous les champs.');
        }
    }
}