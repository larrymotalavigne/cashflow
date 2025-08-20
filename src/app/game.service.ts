import { Injectable, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameConfigService } from './game-config.service';
import { GameEvent, Investment, InvestmentSector, TaxCalculation, RetirementAccount, RetirementPlan, TaxBracket, RetirementAccountType } from './data';
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
  // Inflation tracking properties for task 1.5
  baseIncome: number; // Original income before inflation adjustments
  baseExpenses: number; // Original expenses before inflation adjustments
  cumulativeInflation: number; // Cumulative inflation factor since game start
  // Tax system properties for task 1.7
  lastTaxCalculation?: TaxCalculation;
  yearlyTaxesPaid: number;
  // Retirement planning properties for task 1.8
  retirementAccounts: RetirementAccount[];
  retirementPlan?: RetirementPlan;
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
  // Inflation tracking properties for task 1.5
  baseIncome: number = 0; // Original income before inflation adjustments
  baseExpenses: number = 0; // Original expenses before inflation adjustments
  cumulativeInflation: number = 1.0; // Cumulative inflation factor since game start
  // Tax system properties for task 1.7
  lastTaxCalculation?: TaxCalculation;
  yearlyTaxesPaid: number = 0;
  // Retirement planning properties for task 1.8
  retirementAccounts: RetirementAccount[] = [];
  retirementPlan?: RetirementPlan;

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
        
        // Initialize inflation tracking for task 1.5
        this.baseIncome = this.income;
        this.baseExpenses = this.expenses;
        this.cumulativeInflation = 1.0;
        
        // Initialize tax and retirement systems for tasks 1.7 and 1.8
        this.yearlyTaxesPaid = 0;
        this.retirementAccounts = this.initializeRetirementAccounts();
        this.retirementPlan = this.createInitialRetirementPlan();

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
      selectedOpportunitiesPerYear: this.selectedOpportunitiesPerYear,
      // Include inflation tracking for task 1.5
      baseIncome: this.baseIncome,
      baseExpenses: this.baseExpenses,
      cumulativeInflation: this.cumulativeInflation,
      // Include tax and retirement data for tasks 1.7 and 1.8
      lastTaxCalculation: this.lastTaxCalculation,
      yearlyTaxesPaid: this.yearlyTaxesPaid,
      retirementAccounts: this.retirementAccounts,
      retirementPlan: this.retirementPlan
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
        // Load inflation tracking for task 1.5 (with fallbacks for backward compatibility)
        this.baseIncome = gameState.baseIncome || this.income;
        this.baseExpenses = gameState.baseExpenses || this.expenses;
        this.cumulativeInflation = gameState.cumulativeInflation || 1.0;
        // Load tax and retirement data for tasks 1.7 and 1.8 (with fallbacks for backward compatibility)
        this.lastTaxCalculation = gameState.lastTaxCalculation;
        this.yearlyTaxesPaid = gameState.yearlyTaxesPaid || 0;
        this.retirementAccounts = gameState.retirementAccounts || this.initializeRetirementAccounts();
        this.retirementPlan = gameState.retirementPlan || this.createInitialRetirementPlan();
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
    
    // Apply inflation modeling (Task 1.5)
    const currentCycle = this.configService.getCurrentEconomicCycleConfig();
    if (currentCycle && currentCycle.effects.inflationRate) {
      const inflationRate = currentCycle.effects.inflationRate;
      this.cumulativeInflation *= (1 + inflationRate);
      
      // Apply cumulative inflation to base salary and expenses
      this.income = Math.round(this.baseIncome * this.cumulativeInflation);
      this.expenses = Math.round(this.baseExpenses * this.cumulativeInflation);
      
      console.log(`Inflation applied: ${(inflationRate * 100).toFixed(1)}%, cumulative: ${((this.cumulativeInflation - 1) * 100).toFixed(1)}%`);
      console.log(`Income adjusted to: $${this.income}, Expenses adjusted to: $${this.expenses}`);
    }
    
    // Calculate passive income with economic cycle modifiers and volatility (Task 1.3)
    this.passiveIncome = 0;
    this.investments.forEach(investment => {
      let baseReturn = this.configService.applyDifficultyToInvestmentReturn(investment.income);
      
      // Apply sector-specific return multiplier (Task 1.6)
      if (investment.sectorReturnMultiplier) {
        baseReturn *= investment.sectorReturnMultiplier;
      }
      
      // Apply volatility modeling to investment returns
      if (investment.volatility) {
        baseReturn = this.applyVolatilityToReturn(investment, baseReturn);
      }
      
      this.passiveIncome += baseReturn;
    });
    
    // Update market prices for all investments (Task 1.4)
    this.updateMarketPrices();
    
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

    // Apply tax calculations (Task 1.7)
    const capitalGains = Math.max(0, this.passiveIncome * 0.3); // Estimate 30% of passive income as capital gains
    const dividendIncome = Math.max(0, this.passiveIncome * 0.7); // Estimate 70% as dividend income
    const taxCalculation = this.calculateTaxes(this.income, capitalGains, dividendIncome);
    
    // Deduct taxes from cash
    this.cash -= taxCalculation.totalTax;
    this.yearlyTaxesPaid = taxCalculation.totalTax;
    this.lastTaxCalculation = taxCalculation;
    
    console.log(`Taxes calculated: Income Tax: $${taxCalculation.incomeTax.toFixed(2)}, Capital Gains Tax: $${taxCalculation.capitalGainsTax.toFixed(2)}, Total Tax: $${taxCalculation.totalTax.toFixed(2)}`);
    
    // Update retirement projections (Task 1.8)
    this.updateRetirementProjections();
    
    // Apply age-based investment restrictions for retirement accounts
    if (this.age >= 50) {
      // Allow catch-up contributions for 401k
      const account401k = this.retirementAccounts.find(acc => acc.type === '401k');
      if (account401k) {
        account401k.maxContribution = 30500; // Increased limit for 50+
      }
    }

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
    
    // Initialize risk assessment and dynamic pricing for investment opportunities
    this.investmentOpportunities = shuffledInvestments
      .slice(0, Math.min(numInvestments, availableInvestments.length))
      .map(investment => this.initializeInvestmentRisk(investment))
      .map(investment => this.applyDynamicPricing(investment));

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

  // Risk Assessment System - Task 1.3
  
  /**
   * Calculate risk score for an investment based on type and volatility
   */
  calculateRiskScore(investment: Investment): number {
    let baseRisk = 1;
    
    // Base risk by investment type
    switch (investment.type) {
      case 'capital': baseRisk = 2; break; // Stocks are moderate risk
      case 'real_estate': baseRisk = 3; break; // Real estate moderate-low risk
      case 'business': baseRisk = 6; break; // Business investments are higher risk
      case 'crypto': baseRisk = 9; break; // Crypto is very high risk
      case 'fund': baseRisk = 2; break; // Funds are moderate risk
    }
    
    // Adjust based on volatility if present
    if (investment.volatility) {
      baseRisk += investment.volatility * 4; // Scale volatility (0-1) to risk points (0-4)
    }
    
    // Ensure risk score is between 1-10
    return Math.min(Math.max(baseRisk, 1), 10);
  }
  
  /**
   * Determine risk category based on risk score
   */
  getRiskCategory(riskScore: number): 'low' | 'medium' | 'high' | 'very_high' {
    if (riskScore <= 3) return 'low';
    if (riskScore <= 5) return 'medium';
    if (riskScore <= 7) return 'high';
    return 'very_high';
  }
  
  /**
   * Apply volatility modeling to investment returns
   */
  applyVolatilityToReturn(investment: Investment, baseReturn: number): number {
    if (!investment.volatility) return baseReturn;
    
    // Generate random market movement based on volatility
    const marketMovement = (Math.random() - 0.5) * 2; // Range: -1 to 1
    const volatilityEffect = marketMovement * investment.volatility;
    
    // Apply volatility effect (can be positive or negative)
    const adjustedReturn = baseReturn * (1 + volatilityEffect);
    
    // Ensure return doesn't go negative (minimum 10% of original)
    return Math.max(adjustedReturn, baseReturn * 0.1);
  }
  
  /**
   * Assign investment sector based on name and type (Task 1.6)
   */
  private assignInvestmentSector(investment: Investment): InvestmentSector {
    const name = investment.name.toLowerCase();
    
    // Technology sector keywords
    if (name.includes('tech') || name.includes('software') || name.includes('ai') || 
        name.includes('digital') || name.includes('internet') || name.includes('cloud') ||
        name.includes('startup tech') || name.includes('application')) {
      return 'technology';
    }
    
    // Healthcare sector keywords
    if (name.includes('health') || name.includes('medical') || name.includes('pharma') || 
        name.includes('biotech') || name.includes('hospital') || name.includes('clinic')) {
      return 'healthcare';
    }
    
    // Real estate sector
    if (investment.type === 'real_estate' || name.includes('real estate') || 
        name.includes('property') || name.includes('apartment') || name.includes('duplex') ||
        name.includes('immobilier')) {
      return 'real_estate';
    }
    
    // Finance sector keywords
    if (name.includes('bank') || name.includes('finance') || name.includes('insurance') || 
        name.includes('credit') || name.includes('investment') || name.includes('fund')) {
      return 'finance';
    }
    
    // Energy sector keywords
    if (name.includes('energy') || name.includes('oil') || name.includes('gas') || 
        name.includes('solar') || name.includes('wind') || name.includes('electric')) {
      return 'energy';
    }
    
    // Consumer goods sector keywords
    if (name.includes('retail') || name.includes('consumer') || name.includes('food') || 
        name.includes('restaurant') || name.includes('clothing') || name.includes('goods')) {
      return 'consumer_goods';
    }
    
    // Utilities sector keywords
    if (name.includes('utility') || name.includes('water') || name.includes('electric') || 
        name.includes('power') || name.includes('infrastructure')) {
      return 'utilities';
    }
    
    // Telecommunications sector keywords
    if (name.includes('telecom') || name.includes('mobile') || name.includes('network') || 
        name.includes('communication')) {
      return 'telecommunications';
    }
    
    // Industrials sector keywords
    if (name.includes('industrial') || name.includes('manufacturing') || name.includes('construction') || 
        name.includes('machinery') || name.includes('transport')) {
      return 'industrials';
    }
    
    // Materials sector keywords
    if (name.includes('materials') || name.includes('mining') || name.includes('metals') || 
        name.includes('chemicals') || name.includes('steel')) {
      return 'materials';
    }
    
    // Default assignment based on investment type
    switch (investment.type) {
      case 'crypto': return 'technology';
      case 'business': return 'consumer_goods';
      case 'capital': return 'finance';
      default: return 'finance';
    }
  }

  /**
   * Get sector-specific properties for risk and return calculations (Task 1.6)
   */
  private getSectorProperties(sector: InvestmentSector): {
    sectorRiskMultiplier: number;
    sectorReturnMultiplier: number;
    sectorVolatility: number;
  } {
    switch (sector) {
      case 'technology':
        return { sectorRiskMultiplier: 1.5, sectorReturnMultiplier: 1.3, sectorVolatility: 0.2 };
      case 'healthcare':
        return { sectorRiskMultiplier: 1.2, sectorReturnMultiplier: 1.15, sectorVolatility: 0.1 };
      case 'real_estate':
        return { sectorRiskMultiplier: 0.8, sectorReturnMultiplier: 1.1, sectorVolatility: 0.05 };
      case 'finance':
        return { sectorRiskMultiplier: 1.1, sectorReturnMultiplier: 1.05, sectorVolatility: 0.15 };
      case 'energy':
        return { sectorRiskMultiplier: 1.4, sectorReturnMultiplier: 1.2, sectorVolatility: 0.25 };
      case 'consumer_goods':
        return { sectorRiskMultiplier: 0.9, sectorReturnMultiplier: 1.0, sectorVolatility: 0.08 };
      case 'utilities':
        return { sectorRiskMultiplier: 0.6, sectorReturnMultiplier: 0.9, sectorVolatility: 0.03 };
      case 'telecommunications':
        return { sectorRiskMultiplier: 1.0, sectorReturnMultiplier: 1.0, sectorVolatility: 0.12 };
      case 'industrials':
        return { sectorRiskMultiplier: 1.1, sectorReturnMultiplier: 1.08, sectorVolatility: 0.15 };
      case 'materials':
        return { sectorRiskMultiplier: 1.3, sectorReturnMultiplier: 1.12, sectorVolatility: 0.18 };
      default:
        return { sectorRiskMultiplier: 1.0, sectorReturnMultiplier: 1.0, sectorVolatility: 0.1 };
    }
  }

  /**
   * Initialize risk properties for investments
   */
  initializeInvestmentRisk(investment: Investment): Investment {
    const riskScore = this.calculateRiskScore(investment);
    const riskCategory = this.getRiskCategory(riskScore);
    
    // Assign sector based on investment name and type (Task 1.6)
    const sector = this.assignInvestmentSector(investment);
    const sectorProperties = this.getSectorProperties(sector);
    
    // Set volatility based on investment type if not already set
    let volatility = investment.volatility;
    if (!volatility) {
      switch (investment.type) {
        case 'capital': volatility = 0.3; break;
        case 'real_estate': volatility = 0.15; break;
        case 'business': volatility = 0.5; break;
        case 'crypto': volatility = 0.8; break;
        case 'fund': volatility = 0.2; break;
        default: volatility = 0.3;
      }
    }
    
    // Apply sector-specific volatility (Task 1.6)
    const totalVolatility = volatility + (sectorProperties.sectorVolatility || 0);
    
    return {
      ...investment,
      riskScore,
      riskCategory,
      volatility: totalVolatility,
      basePrice: investment.basePrice || investment.amount,
      marketMultiplier: investment.marketMultiplier || 1.0,
      priceHistory: investment.priceHistory || [],
      // Add sector-specific properties (Task 1.6)
      sector,
      sectorRiskMultiplier: sectorProperties.sectorRiskMultiplier,
      sectorReturnMultiplier: sectorProperties.sectorReturnMultiplier,
      sectorVolatility: sectorProperties.sectorVolatility
    };
  }

  // Dynamic Pricing System - Task 1.4
  
  /**
   * Get current market conditions based on economic cycle and other factors
   */
  getCurrentMarketConditions(): {
    condition: 'bull' | 'bear' | 'neutral' | 'volatile';
    multiplier: number;
    description: string;
  } {
    const currentCycle = this.configService.getCurrentEconomicCycleConfig();
    const difficultyConfig = this.configService.getCurrentDifficultyConfig();
    
    // Base market condition on economic cycle
    let condition: 'bull' | 'bear' | 'neutral' | 'volatile';
    let baseMultiplier = 1.0;
    let description = '';
    
    switch (currentCycle.cycle) {
      case 'expansion':
        condition = 'bull';
        baseMultiplier = 1.2;
        description = 'Marché haussier - Les investissements sont plus chers';
        break;
      case 'peak':
        condition = 'volatile';
        baseMultiplier = 1.15;
        description = 'Marché volatile - Prices fluctuent fortement';
        break;
      case 'recession':
        condition = 'bear';
        baseMultiplier = 0.8;
        description = 'Marché baissier - Opportunités à prix réduits';
        break;
      case 'recovery':
        condition = 'neutral';
        baseMultiplier = 0.95;
        description = 'Marché en récupération - Prices normalisés';
        break;
      default:
        condition = 'neutral';
        baseMultiplier = 1.0;
        description = 'Conditions de marché neutres';
    }
    
    // Add some randomness to market conditions
    const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
    const finalMultiplier = baseMultiplier * randomFactor;
    
    return { condition, multiplier: finalMultiplier, description };
  }
  
  /**
   * Apply dynamic pricing to an investment based on market conditions
   */
  applyDynamicPricing(investment: Investment): Investment {
    const marketConditions = this.getCurrentMarketConditions();
    const basePrice = investment.basePrice || investment.amount;
    
    // Apply market multiplier
    let dynamicMultiplier = marketConditions.multiplier;
    
    // Adjust multiplier based on investment type sensitivity to market
    switch (investment.type) {
      case 'crypto':
        // Crypto is highly sensitive to market conditions
        dynamicMultiplier = 1 + ((dynamicMultiplier - 1) * 2);
        break;
      case 'capital':
        // Stocks are moderately sensitive
        dynamicMultiplier = 1 + ((dynamicMultiplier - 1) * 1.5);
        break;
      case 'business':
        // Business investments are moderately sensitive
        dynamicMultiplier = 1 + ((dynamicMultiplier - 1) * 1.2);
        break;
      case 'real_estate':
        // Real estate is less sensitive to short-term market changes
        dynamicMultiplier = 1 + ((dynamicMultiplier - 1) * 0.8);
        break;
      case 'fund':
        // Funds are moderately sensitive
        dynamicMultiplier = 1 + ((dynamicMultiplier - 1) * 1.1);
        break;
    }
    
    // Calculate new price
    const newPrice = Math.round(basePrice * dynamicMultiplier);
    
    // Update price history
    const priceHistory = investment.priceHistory || [];
    priceHistory.push(newPrice);
    if (priceHistory.length > 10) {
      priceHistory.shift(); // Keep only last 10 price points
    }
    
    return {
      ...investment,
      amount: newPrice,
      marketMultiplier: dynamicMultiplier,
      priceHistory
    };
  }
  
  /**
   * Simulate market price movements for existing investments
   */
  updateMarketPrices(): void {
    this.investments.forEach(investment => {
      if (investment.basePrice && investment.priceHistory) {
        const updatedInvestment = this.applyDynamicPricing(investment);
        // Update the investment's current market value for display purposes
        investment.marketMultiplier = updatedInvestment.marketMultiplier;
        investment.priceHistory = updatedInvestment.priceHistory;
      }
    });
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

  // Tax system methods for Task 1.7

  private getTaxBrackets(): { bracket: TaxBracket; minIncome: number; maxIncome?: number; taxRate: number; capitalGainsRate: number; dividendTaxRate: number; }[] {
    return [
      { bracket: 'low', minIncome: 0, maxIncome: 50000, taxRate: 0.12, capitalGainsRate: 0.0, dividendTaxRate: 0.0 },
      { bracket: 'medium', minIncome: 50000, maxIncome: 100000, taxRate: 0.22, capitalGainsRate: 0.15, dividendTaxRate: 0.15 },
      { bracket: 'high', minIncome: 100000, maxIncome: 200000, taxRate: 0.32, capitalGainsRate: 0.15, dividendTaxRate: 0.20 },
      { bracket: 'very_high', minIncome: 200000, taxRate: 0.37, capitalGainsRate: 0.20, dividendTaxRate: 0.20 }
    ];
  }

  calculateTaxes(grossIncome: number, capitalGains: number, dividendIncome: number): TaxCalculation {
    const brackets = this.getTaxBrackets();
    let incomeTax = 0;
    let remainingIncome = grossIncome;
    let currentBracket: TaxBracket = 'low';

    // Progressive tax calculation
    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const taxableInThisBracket = bracket.maxIncome 
        ? Math.min(remainingIncome, bracket.maxIncome - bracket.minIncome)
        : remainingIncome;

      if (taxableInThisBracket > 0) {
        incomeTax += taxableInThisBracket * bracket.taxRate;
        currentBracket = bracket.bracket;
      }

      if (bracket.maxIncome) {
        remainingIncome -= taxableInThisBracket;
      }
    }

    // Find applicable bracket for capital gains and dividend taxes
    const applicableBracket = brackets.find(b => 
      grossIncome >= b.minIncome && (!b.maxIncome || grossIncome <= b.maxIncome)
    ) || brackets[brackets.length - 1];

    const capitalGainsTax = capitalGains * applicableBracket.capitalGainsRate;
    const dividendTax = dividendIncome * applicableBracket.dividendTaxRate;
    const totalTax = incomeTax + capitalGainsTax + dividendTax;
    const netIncome = grossIncome + capitalGains + dividendIncome - totalTax;
    const effectiveTaxRate = (grossIncome + capitalGains + dividendIncome) > 0 
      ? totalTax / (grossIncome + capitalGains + dividendIncome) 
      : 0;

    return {
      grossIncome,
      taxableIncome: grossIncome,
      incomeTax,
      capitalGainsTax,
      dividendTax,
      totalTax,
      netIncome,
      effectiveTaxRate,
      bracket: currentBracket
    };
  }

  // Retirement planning methods for Task 1.8

  private initializeRetirementAccounts(): RetirementAccount[] {
    return [
      {
        type: '401k',
        balance: 0,
        contributions: 0,
        maxContribution: 23000, // 2024 limit
        taxDeferred: true,
        employerMatch: 0.03, // 3% employer match
        vestingPeriod: 3,
        withdrawalAge: 59.5
      }
    ];
  }

  private createInitialRetirementPlan(): RetirementPlan {
    return {
      targetRetirementAge: 65,
      currentRetirementSavings: 0,
      monthlyRetirementGoal: this.expenses * 0.8, // 80% of current expenses
      accounts: this.retirementAccounts,
      projectedBalance: 0,
      onTrack: false
    };
  }

  contributeToRetirement(accountType: RetirementAccountType, amount: number): boolean {
    const account = this.retirementAccounts.find(acc => acc.type === accountType);
    if (!account) return false;

    const remainingContributionRoom = account.maxContribution - account.contributions;
    const actualContribution = Math.min(amount, remainingContributionRoom, this.cash);

    if (actualContribution > 0) {
      account.contributions += actualContribution;
      account.balance += actualContribution;
      this.cash -= actualContribution;

      // Add employer match for 401k
      if (accountType === '401k' && account.employerMatch) {
        const employerMatch = Math.min(actualContribution * account.employerMatch, this.income * account.employerMatch);
        account.balance += employerMatch;
      }

      return true;
    }
    return false;
  }

  canWithdrawFromRetirement(accountType: RetirementAccountType): boolean {
    const account = this.retirementAccounts.find(acc => acc.type === accountType);
    if (!account) return false;

    return this.age >= account.withdrawalAge;
  }

  withdrawFromRetirement(accountType: RetirementAccountType, amount: number): boolean {
    if (!this.canWithdrawFromRetirement(accountType)) return false;

    const account = this.retirementAccounts.find(acc => acc.type === accountType);
    if (!account || account.balance < amount) return false;

    account.balance -= amount;
    
    // Apply tax implications for traditional accounts
    if (account.taxDeferred) {
      const taxCalculation = this.calculateTaxes(amount, 0, 0);
      this.cash += amount - taxCalculation.incomeTax;
      this.yearlyTaxesPaid += taxCalculation.incomeTax;
    } else {
      this.cash += amount; // Roth withdrawals are tax-free
    }

    return true;
  }

  updateRetirementProjections(): void {
    if (!this.retirementPlan) return;

    const yearsToRetirement = Math.max(0, this.retirementPlan.targetRetirementAge - this.age);
    const totalContributions = this.retirementAccounts.reduce((sum, acc) => sum + acc.contributions, 0);
    const currentBalance = this.retirementAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    
    // Simple projection with 7% annual return
    const annualReturn = 0.07;
    const projectedBalance = currentBalance * Math.pow(1 + annualReturn, yearsToRetirement) +
      (totalContributions * (Math.pow(1 + annualReturn, yearsToRetirement) - 1) / annualReturn);

    this.retirementPlan.projectedBalance = projectedBalance;
    this.retirementPlan.currentRetirementSavings = currentBalance;

    // Check if on track (using 4% withdrawal rule)
    const requiredBalance = this.retirementPlan.monthlyRetirementGoal * 12 / 0.04;
    this.retirementPlan.onTrack = projectedBalance >= requiredBalance;
  }
}
