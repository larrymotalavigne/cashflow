import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GameConfigService } from './game-config.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  cash = 0;
  income = 0;
  expenses = 0;
  passiveIncome = 0;
  age = 0;
  name = '';
  eventVisible = false;
  eventMessage = '';
  investmentOpportunities: any[] = [];
  randomEvents: any[] = [];

  private readonly minRandomEvents = 1;
  private readonly maxRandomEvents = 3;
  private readonly minInvestmentOpportunities = 1;
  private readonly maxInvestmentOpportunities = 3;
  turnEnded = new EventEmitter<void>();

  constructor(private router: Router, private configService: GameConfigService) {
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    if (state && state.startupSettings) {
      const settings = state.startupSettings;
      this.cash = settings.startingMoney;
      const minSalary = settings.job.minSalary;
      const maxSalary = settings.job.maxSalary;
      let storedIncome = localStorage.getItem('income');
      if (storedIncome) {
        this.income = parseInt(storedIncome, 10);
      } else {
        this.income = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;
        localStorage.setItem('income', this.income.toString());
      }
      this.expenses = settings.job.expenses;
      this.age = settings.age;
      this.name = settings.name;
    } else {
      this.router.navigate(['']);
    }
  }

  nextTurn() {
    this.cash += this.income + this.passiveIncome - this.expenses;
    this.triggerRandomEvent();
    this.checkWinCondition();
    this.age++;
    this.turnEnded.emit();
  }

  triggerRandomEvent() {
    const shuffledEvents = [...this.configService.events].sort(() => 0.5 - Math.random());
    const shuffledInvestments = [...this.configService.investments].sort(() => 0.5 - Math.random());
    const numEvents = Math.floor(Math.random() * (this.maxRandomEvents - this.minRandomEvents + 1)) + this.minRandomEvents;
    const numInvestments = Math.floor(Math.random() * (this.maxInvestmentOpportunities - this.minInvestmentOpportunities + 1)) + this.minInvestmentOpportunities;
    this.randomEvents = shuffledEvents.slice(0, numEvents);
    this.investmentOpportunities = shuffledInvestments.slice(0, numInvestments);
    this.eventVisible = true;
  }

  checkWinCondition() {
    if (this.passiveIncome >= this.expenses) {
      this.eventMessage = 'Félicitations ! Vous avez atteint la liberté financière !';
      this.eventVisible = true;
    }
  }

  addInvestment(investment: any) {
    this.passiveIncome += investment.income;
    this.cash -= investment.price;
  }
}
