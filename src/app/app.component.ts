import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StartupScreenComponent } from './startup-screen.component';
import { DashboardComponent } from './dashboard.component';
import { InvestmentComponent } from './investment.component';
import { RandomEventDialogComponent } from './random-event-dialog.component';
import { ButtonModule } from 'primeng/button';

const GAME_CONFIG = {
  jobs: [
    { label: 'Agriculteur', value: { minSalary: 2800, maxSalary: 3300, expenses: 2000 } },
    { label: 'Architecte', value: { minSalary: 4500, maxSalary: 5000, expenses: 2800 } },
    { label: 'Avocat', value: { minSalary: 5000, maxSalary: 5500, expenses: 3000 } },
    { label: 'Chef de projet', value: { minSalary: 4200, maxSalary: 4800, expenses: 2600 } },
    { label: 'Comptable', value: { minSalary: 3800, maxSalary: 4300, expenses: 2400 } },
    { label: 'Cuisinier', value: { minSalary: 3000, maxSalary: 3500, expenses: 2200 } },
    { label: 'Designer', value: { minSalary: 3500, maxSalary: 4000, expenses: 2200 } },
    { label: 'Développeur', value: { minSalary: 4800, maxSalary: 5300, expenses: 3000 } },
    { label: 'Economiste', value: { minSalary: 4500, maxSalary: 5000, expenses: 2700 } },
    { label: 'Enseignant', value: { minSalary: 3200, maxSalary: 3700, expenses: 2100 } },
    { label: 'Ingénieur', value: { minSalary: 4000, maxSalary: 5000, expenses: 2500 } },
    { label: 'Journaliste', value: { minSalary: 3200, maxSalary: 3700, expenses: 2100 } },
    { label: 'Médecin', value: { minSalary: 6000, maxSalary: 7000, expenses: 3500 } },
    { label: 'Pharmacien', value: { minSalary: 5000, maxSalary: 5500, expenses: 3000 } },
    { label: 'Plombier', value: { minSalary: 2800, maxSalary: 3300, expenses: 2000 } },
    { label: 'Professeur', value: { minSalary: 3000, maxSalary: 3500, expenses: 1800 } },
    { label: 'Psychologue', value: { minSalary: 3500, maxSalary: 4000, expenses: 2300 } },
    { label: 'Scientifique', value: { minSalary: 5500, maxSalary: 6000, expenses: 3200 } },
    { label: 'Technicien', value: { minSalary: 3000, maxSalary: 3500, expenses: 2000 } },
    { label: 'Vétérinaire', value: { minSalary: 4000, maxSalary: 4500, expenses: 2500 } }
  ],
  investments: [
    { name: 'Appartement', price: 2000, income: 200 },
    { name: 'Petite Entreprise', price: 5000, income: 500 },
    { name: 'Actions en Bourse', price: 3000, income: 300 }
  ],
  events: [
    { message: 'Réparation voiture: -500€', impact: -500 },
    { message: 'Bonus au travail: +1000€', impact: 1000 },
    { message: 'Taxe imprévue: -700€', impact: -700 }
  ]
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    StartupScreenComponent,
    DashboardComponent,
    InvestmentComponent,
    RandomEventDialogComponent,
    ButtonModule
  ],
  template: `
    <div class="container">
      <h1>Welcome to {{title}}!</h1>
      <!-- Startup screen: select job, age, starting money, and name -->
      <app-startup-screen [jobs]="jobs" (startup)="onStartup($event)"></app-startup-screen>
      <app-dashboard [cash]="cash" [income]="income" [expenses]="expenses" [passiveIncome]="passiveIncome"></app-dashboard>
      <app-investment [investments]="investments" [cash]="cash" (buyInvestment)="buyInvestment($event)"></app-investment>
      <p-button label="Tour Suivant" (click)="nextTurn()" class="mt-2"></p-button>
      <app-random-event-dialog [visible]="eventVisible" [message]="eventMessage" (visibleChange)="eventVisible = $event"></app-random-event-dialog>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: auto;
      text-align: center;
    }
    p-card {
      margin: 10px 0;
    }
    .mt-2 {
      margin-top: 1rem;
    }
  `]
})
export class AppComponent {
  title = 'Cashflow Game';
  cash = 5000;
  income = 3000;
  expenses = 2000;
  passiveIncome = 0;
  age: number = 0;
  jobs = GAME_CONFIG.jobs;
  investments = GAME_CONFIG.investments.slice();
  events = GAME_CONFIG.events;
  eventVisible = false;
  eventMessage = '';

  onStartup(settings: { job: any, age: number, startingMoney: number, name: string }) {
    if (settings && settings.job) {
      this.age = settings.age;
      this.cash = settings.startingMoney;
      const minSalary = settings.job.value.minSalary;
      const maxSalary = settings.job.value.maxSalary;
      this.income = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;
      this.expenses = settings.job.value.expenses;
      // You can also store the player's name if needed: settings.name
    }
  }

  buyInvestment(investment: any) {
    if (this.cash >= investment.price) {
      this.cash -= investment.price;
      this.passiveIncome += investment.income;
    }
  }

  nextTurn() {
    this.cash += this.income + this.passiveIncome - this.expenses;
    this.triggerRandomEvent();
    this.checkWinCondition();
  }

  triggerRandomEvent() {
    const event = this.events[Math.floor(Math.random() * this.events.length)];
    this.eventMessage = event.message;
    this.cash += event.impact;
    this.eventVisible = true;
  }

  checkWinCondition() {
    if (this.passiveIncome >= this.expenses) {
      this.eventMessage = 'Félicitations ! Vous avez atteint la liberté financière !';
      this.eventVisible = true;
    }
  }
}