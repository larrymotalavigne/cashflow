import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobSelectionComponent } from './job-selection.component';
import { DashboardComponent } from './dashboard.component';
import { InvestmentComponent } from './investment.component';
import { RandomEventDialogComponent } from './random-event-dialog.component';
import { ButtonModule } from 'primeng/button';

const GAME_CONFIG = {
  jobs: [
    { label: 'Ingénieur', value: { salary: 4000, expenses: 2500 } },
    { label: 'Professeur', value: { salary: 3000, expenses: 1800 } },
    { label: 'Médecin', value: { salary: 6000, expenses: 3500 } },
    { label: 'Avocat', value: { salary: 5000, expenses: 3000 } },
    { label: 'Architecte', value: { salary: 4500, expenses: 2800 } },
    { label: 'Journaliste', value: { salary: 3200, expenses: 2100 } },
    { label: 'Comptable', value: { salary: 3800, expenses: 2400 } },
    { label: 'Chef de projet', value: { salary: 4200, expenses: 2600 } },
    { label: 'Designer', value: { salary: 3500, expenses: 2200 } },
    { label: 'Développeur', value: { salary: 4800, expenses: 3000 } }
  ],
  investments: [
    { name: 'Appartement', price: 2000, income: 200 },
    { name: 'Petite Entreprise', price: 5000, income: 500 },
    { name: 'Actions en Bourse', price: 3000, income: 300 },
  ],
  events: [
    { message: 'Réparation voiture: -500€', impact: -500 },
    { message: 'Bonus au travail: +1000€', impact: 1000 },
    { message: 'Taxe imprévue: -700€', impact: -700 },
  ]
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    JobSelectionComponent,
    DashboardComponent,
    InvestmentComponent,
    RandomEventDialogComponent,
    ButtonModule
  ],
  template: `
    <div class="container">
      <h1>Welcome to {{title}}!</h1>
      <!-- Startup screen now allows selecting both job and age -->
      <app-job-selection [jobs]="jobs" (jobSelected)="onJobSelected($event)"></app-job-selection>
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

  onJobSelected(selection: { job: any, age: number }) {
    if (selection && selection.job) {
      this.age = selection.age;
      this.income = selection.job.value.salary;
      this.expenses = selection.job.value.expenses;
      this.cash += this.income - this.expenses;
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