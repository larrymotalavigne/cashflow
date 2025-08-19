import { Injectable, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameConfigService } from './game-config.service';
import { GameEvent, Investment } from './data';
import { ToastService } from './toast.service';

interface TurnHistoryEntry {
  turnNumber: number;
  age: number;
  cashBefore: number;
  cashAfter: number;
  income: number;
  expenses: number;
  passiveIncome: number;
  events: GameEvent[];
  investmentsPurchased: Investment[];
  date: string;
}

interface GameState {
  cash: number;
  income: number;
  expenses: number;
  passiveIncome: number;
  age: number;
  name: string;
  investments: Investment[];
  loanTotal: number;
  turnHistory: TurnHistoryEntry[];
  selectedOpportunitiesPerYear: { [year: number]: string[] };
}

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
  turnHistory: TurnHistoryEntry[] = [];
  currentTurn: number = 0;
  investmentsPurchasedThisTurn: Investment[] = [];
  selectedOpportunitiesPerYear: { [year: number]: string[] } = {};

  private readonly minRandomEvents = 1;
  private readonly maxRandomEvents = 3;
  private readonly minInvestmentOpportunities = 1;
  private readonly maxInvestmentOpportunities = 3;
  turnEnded = new EventEmitter<void>();
  stateChanged = new EventEmitter<void>();

  private toastService = inject(ToastService);

  constructor(private router: Router, private configService: GameConfigService) {
    // Try to load saved game state first
    if (this.loadGameState()) {
      console.log('Loaded saved game state');
    } else {
      // If no saved game state, initialize from navigation state
      const state = this.router.getCurrentNavigation()?.extras.state as any;
      if (state && state.startupSettings) {
        const settings = state.startupSettings;
        this.cash = settings.startingMoney;
        const minSalary = settings.job.minSalary;
        const maxSalary = settings.job.maxSalary;
        this.income = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;
        this.expenses = settings.job.expenses;
        this.age = settings.age;
        this.name = settings.name;

        // Save the initial game state
        this.saveGameState();
      } else {
        this.router.navigate(['']);
      }
    }
  }

  saveGameState(): void {
    const gameState: GameState = {
      cash: this.cash,
      income: this.income,
      expenses: this.expenses,
      passiveIncome: this.passiveIncome,
      age: this.age,
      name: this.name,
      investments: this.investments,
      loanTotal: this.loanTotal,
      turnHistory: this.turnHistory,
      selectedOpportunitiesPerYear: this.selectedOpportunitiesPerYear
    };

    localStorage.setItem('gameState', JSON.stringify(gameState));
    console.log('Game state saved');
  }

  loadGameState(): boolean {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
      try {
        const gameState: GameState = JSON.parse(savedState);
        this.cash = gameState.cash;
        this.income = gameState.income;
        this.expenses = gameState.expenses;
        this.passiveIncome = gameState.passiveIncome;
        this.age = gameState.age;
        this.name = gameState.name;
        this.investments = gameState.investments;
        this.loanTotal = gameState.loanTotal;
        this.turnHistory = gameState.turnHistory || [];
        this.selectedOpportunitiesPerYear = gameState.selectedOpportunitiesPerYear || {};
        this.currentTurn = this.turnHistory.length;
        return true;
      } catch (error) {
        console.error('Error loading game state:', error);
        return false;
      }
    }
    return false;
  }

  addTurnToHistory(cashBefore: number, cashAfter: number): void {
    this.currentTurn++;
    const turnEntry: TurnHistoryEntry = {
      turnNumber: this.currentTurn,
      age: this.age,
      cashBefore: cashBefore,
      cashAfter: cashAfter,
      income: this.income,
      expenses: this.expenses,
      passiveIncome: this.passiveIncome,
      events: [...this.randomEvents],
      investmentsPurchased: [...this.investmentsPurchasedThisTurn],
      date: new Date().toISOString()
    };

    this.turnHistory.push(turnEntry);
    this.investmentsPurchasedThisTurn = []; // Reset for next turn
  }

  nextTurn() {
    const cashBefore = this.cash;
    
    // Advance economic cycle
    this.configService.advanceEconomicCycle();
    
    // Calculate passive income with economic cycle modifiers
    this.passiveIncome = 0;
    this.investments.forEach(investment => {
      this.passiveIncome += this.configService.applyDifficultyToInvestmentReturn(investment.income);
    });
    
    const liabilityPayments = this.calculateLiabilityPayments(); // Calculate liability payments
    this.cash += this.income + this.passiveIncome - this.expenses - liabilityPayments; // Subtract liability payments
    console.log(`Next turn - ${this.cash} - ${this.income + this.passiveIncome - this.expenses - liabilityPayments}`)
    
    // Only trigger events based on difficulty settings
    if (this.configService.shouldTriggerEvent()) {
      this.showOpportunities();
    } else {
      // Still show investment opportunities even if no events
      this.randomEvents = [];
      this.showOpportunities();
    }

    // Apply economic cycle effects to events
    this.randomEvents.forEach(event => {
      if (event.effect?.type === 'cash') {
        const modifiedAmount = this.configService.applyEconomicCycleToEvent(event.effect.amount);
        this.cash += modifiedAmount;
        event.effect.amount = modifiedAmount; // Update for display
      } else if (event.effect?.type === 'expenses') {
        const modifiedAmount = this.configService.applyEconomicCycleToEvent(event.effect.amount);
        this.expenses += modifiedAmount;
        event.effect.amount = modifiedAmount; // Update for display
      }
    });

    this.checkWinCondition();
    this.age++;

    // Add turn to history
    this.addTurnToHistory(cashBefore, this.cash);

    // Save game state after turn
    this.saveGameState();

    this.turnEnded.emit();
    this.stateChanged.emit();
  }

  showOpportunities() {
    // Get selected opportunities for current year
    const currentYearSelected = this.selectedOpportunitiesPerYear[this.age] || [];

    // Get weighted random events, filtering out already selected ones
    this.randomEvents = this.getWeightedRandomEvents().filter(event => 
      !currentYearSelected.includes(event.message)
    );

    // Get random investments, filtering out already selected ones
    const availableInvestments = this.configService.investments.filter(investment => 
      !currentYearSelected.includes(investment.name)
    );
    const shuffledInvestments = [...availableInvestments].sort(() => 0.5 - Math.random());
    const numInvestments = Math.floor(Math.random() * (this.maxInvestmentOpportunities - this.minInvestmentOpportunities + 1)) + this.minInvestmentOpportunities;
    this.investmentOpportunities = shuffledInvestments.slice(0, Math.min(numInvestments, availableInvestments.length));

    this.eventVisible = true;
  }

  // Event probability weighting method
  private getWeightedRandomEvents(): GameEvent[] {
    const events = [...this.configService.events];
    const numEvents = Math.floor(Math.random() * (this.maxRandomEvents - this.minRandomEvents + 1)) + this.minRandomEvents;
    const selectedEvents: GameEvent[] = [];

    // Define probability weights based on effect type and amount
    const getEventWeight = (event: GameEvent): number => {
      // Base weight
      let weight = 1;

      // Adjust weight based on effect type and amount
      if (event.effect) {
        // Cash effects
        if (event.effect.type === 'cash') {
          // Positive cash events (less likely for larger amounts)
          if (event.effect.amount > 0) {
            if (event.effect.amount > 5000) weight = 0.2; // Very rare
            else if (event.effect.amount > 2000) weight = 0.5; // Rare
            else if (event.effect.amount > 1000) weight = 0.8; // Uncommon
            else weight = 1.2; // Common
          } 
          // Negative cash events (less likely for larger amounts)
          else {
            const absAmount = Math.abs(event.effect.amount);
            if (absAmount > 2000) weight = 0.3; // Rare
            else if (absAmount > 1000) weight = 0.7; // Uncommon
            else weight = 1.5; // Common
          }
        }
        // Expense effects (generally less common)
        else if (event.effect.type === 'expenses') {
          if (event.effect.amount > 1000) weight = 0.4; // Rare
          else weight = 0.8; // Uncommon
        }
      }

      return weight;
    };

    // Calculate total weight
    let totalWeight = 0;
    const weights: number[] = events.map(event => {
      const weight = getEventWeight(event);
      totalWeight += weight;
      return weight;
    });

    // Select events based on weights
    for (let i = 0; i < numEvents; i++) {
      if (events.length === 0) break;

      // Get random value between 0 and totalWeight
      let random = Math.random() * totalWeight;
      let index = 0;

      // Find the event that corresponds to this random value
      while (random > 0 && index < weights.length) {
        random -= weights[index];
        if (random <= 0) break;
        index++;
      }

      // If we somehow went past the end, use the last event
      if (index >= events.length) index = events.length - 1;

      // Add the selected event
      selectedEvents.push(events[index]);

      // Remove the selected event and its weight from the pools
      totalWeight -= weights[index];
      events.splice(index, 1);
      weights.splice(index, 1);
    }

    return selectedEvents;
  }

  checkWinCondition() {
    if (this.passiveIncome >= this.expenses) {
      this.eventMessage = 'Félicitations ! Vous avez atteint la liberté financière !';
      this.eventVisible = true;
      
      // Show victory toast notification
      this.toastService.success(
        '🎉 Victoire !',
        'Vous avez atteint l\'indépendance financière !',
        { persistent: true }
      );
    }
  }

  buyInvestment(investment: Investment) { // Updated method
    this.passiveIncome += investment.income;
    this.cash -= investment.amount;

    const newInvestment = {
      ...investment,
      name: investment.name,
      amount: investment.amount,
      yearlyPayment: investment.yearlyPayment || 0
    };

    this.investments.push(newInvestment);

    // Track investment for turn history
    this.investmentsPurchasedThisTurn.push(newInvestment);

    // Track selected opportunity for current year
    if (!this.selectedOpportunitiesPerYear[this.age]) {
      this.selectedOpportunitiesPerYear[this.age] = [];
    }
    this.selectedOpportunitiesPerYear[this.age].push(investment.name);

    // Show success toast notification
    this.toastService.success(
      'Investissement acheté !',
      `${investment.name} - ${investment.amount}€ (Revenu mensuel: ${investment.income}€)`
    );

    // Save game state after buying investment
    this.saveGameState();
    this.stateChanged.emit();
  }

  calculateLiabilityPayments(): number { // New method
    return this.investments.reduce((sum, l) => sum + ((l.yearlyPayment || 0) / 12), 0);
  }

  buyInvestmentWithLoan(investment: Investment) {
    const loanRate = this.configService.loanRate || 0.1;
    const loanAmount = investment.amount;
    const loanFee = loanAmount * loanRate;

    this.loanTotal += loanFee;
    this.passiveIncome += investment.income;

    const newInvestment = {
      ...investment,
      name: investment.name + ' (emprunt)',
      amount: loanAmount,
      yearlyPayment: ((investment.yearlyPayment || 0) + loanFee)
    };

    this.investments.push(newInvestment);

    // Track investment for turn history
    this.investmentsPurchasedThisTurn.push(newInvestment);

    // Show success toast notification for loan purchase
    this.toastService.info(
      'Investissement acheté avec emprunt !',
      `${investment.name} - Emprunt: ${loanAmount}€ (Frais: ${loanFee.toFixed(0)}€)`
    );

    // Save game state after buying investment with loan
    this.saveGameState();
    this.stateChanged.emit();
  }

  canBuy(investment: Investment) {
    return this.cash >= investment.amount;
  }

  // Investment portfolio management methods

  getInvestmentsByType(): Record<string, Investment[]> {
    const investmentsByType: Record<string, Investment[]> = {};

    this.investments.forEach(investment => {
      if (!investmentsByType[investment.type]) {
        investmentsByType[investment.type] = [];
      }
      investmentsByType[investment.type].push(investment);
    });

    return investmentsByType;
  }

  // Event history tracking methods

  getEventHistory(): { 
    events: GameEvent[]; 
    totalCashEffect: number; 
    totalExpensesEffect: number; 
    eventsByType: Record<string, number>;
  } {
    const history = {
      events: [] as GameEvent[],
      totalCashEffect: 0,
      totalExpensesEffect: 0,
      eventsByType: {} as Record<string, number>
    };

    // Extract events from turn history
    this.turnHistory.forEach(turn => {
      turn.events.forEach(event => {
        history.events.push(event);

        if (event.effect?.type === 'cash') {
          history.totalCashEffect += event.effect.amount;
        } else if (event.effect?.type === 'expenses') {
          history.totalExpensesEffect += event.effect.amount;
        }

        // Count events by type
        const effectType = event.effect?.type || 'unknown';
        if (!history.eventsByType[effectType]) {
          history.eventsByType[effectType] = 0;
        }
        history.eventsByType[effectType]++;
      });
    });

    return history;
  }

  getInvestmentStatistics(): { 
    totalInvested: number; 
    totalPassiveIncome: number; 
    roi: number; 
    countByType: Record<string, number>;
    incomeByType: Record<string, number>;
    yearlyPayments: number;
  } {
    const stats = {
      totalInvested: 0,
      totalPassiveIncome: 0,
      roi: 0,
      countByType: {} as Record<string, number>,
      incomeByType: {} as Record<string, number>,
      yearlyPayments: 0
    };

    this.investments.forEach(investment => {
      stats.totalInvested += investment.amount;
      stats.totalPassiveIncome += investment.income;
      stats.yearlyPayments += (investment.yearlyPayment || 0);

      // Count by type
      if (!stats.countByType[investment.type]) {
        stats.countByType[investment.type] = 0;
        stats.incomeByType[investment.type] = 0;
      }
      stats.countByType[investment.type]++;
      stats.incomeByType[investment.type] += investment.income;
    });

    // Calculate ROI (Return on Investment)
    if (stats.totalInvested > 0) {
      stats.roi = (stats.totalPassiveIncome / stats.totalInvested) * 100;
    }

    return stats;
  }

  goToStartup() {
    this.router.navigate(['/']);
  }

  startGame(selectedJob: any, age: number, startingMoney: number, name: string) {
    // Clear localStorage to start fresh
    localStorage.clear();

    const minSalary = selectedJob.minSalary;
    const maxSalary = selectedJob.maxSalary;

    const baseIncome = Math.floor(Math.random() * (maxSalary - minSalary + 1)) + minSalary;
    
    // Apply difficulty modifiers
    const income = this.configService.applyDifficultyToSalary(baseIncome);
    const expenses = this.configService.applyDifficultyToExpenses(selectedJob.expenses);
    const cash = this.configService.applyDifficultyToStartingCash(startingMoney);

    // Reset all game state properties
    this.cash = cash;
    this.income = income;
    this.expenses = expenses;
    this.age = age;
    this.name = name;
    this.passiveIncome = 0;
    this.investments = [];
    this.loanTotal = 0;

    // Save the initial game state
    this.saveGameState();

    this.router.navigate(['/game']);
  }
}
