import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GameConfigService } from './game-config.service';
import { GameEvent, Investment } from './data';

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
  investmentOpportunities: Investment[] = [];
  randomEvents: GameEvent[] = [];
  investments: Investment[] = [];
  loanTotal: number = 0;

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
    const liabilityPayments = this.calculateLiabilityPayments(); // Calculate liability payments
    this.cash += this.income + this.passiveIncome - this.expenses - liabilityPayments; // Subtract liability payments
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

    // Apply effects from random events
    this.randomEvents.forEach(event => {
      if (event.effect?.type === 'cash') {
        this.cash += event.effect.amount;
      } else if (event.effect?.type === 'expenses') {
        this.expenses += event.effect.amount;
      }
    });

    this.eventVisible = true;
  }

  checkWinCondition() {
    if (this.passiveIncome >= this.expenses) {
      this.eventMessage = 'Félicitations ! Vous avez atteint la liberté financière !';
      this.eventVisible = true;
    }
  }

  buyInvestment(investment: Investment) { // Updated method
    this.passiveIncome += investment.income;
    this.cash -= investment.amount;
    this.investments.push({
      ...investment,
      name: investment.name,
      amount: investment.amount,
      yearlyPayment: investment.yearlyPayment || 0
    });
  }

  calculateLiabilityPayments(): number { // New method
    return this.investments.reduce((sum, l) => sum + (l.yearlyPayment || 0), 0);
  }

  buyInvestmentWithLoan(investment: Investment) {
    const loanRate = this.configService.loanRate || 0.1;
    const loanAmount = investment.amount;
    const loanFee = loanAmount * loanRate;

    this.loanTotal += loanFee;
    this.passiveIncome += investment.income;

    this.investments.push({
      ...investment,
      name: investment.name + ' (emprunt)',
      amount: loanAmount,
      yearlyPayment: (investment.yearlyPayment || 0) + loanFee
    });
  }

  canBuy(investment: Investment) {
    return this.cash >= investment.amount;
  }
}
