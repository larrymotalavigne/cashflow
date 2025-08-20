export type EffectType = 'cash' | 'expenses';
export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'expert';
export type EconomicCycle = 'recession' | 'recovery' | 'expansion' | 'peak';
export type InvestmentSector = 'technology' | 'healthcare' | 'real_estate' | 'finance' | 'energy' | 'consumer_goods' | 'utilities' | 'telecommunications' | 'industrials' | 'materials';
export type TaxBracket = 'low' | 'medium' | 'high' | 'very_high';
export type RetirementAccountType = '401k' | 'ira' | 'roth_ira' | 'pension';

export interface GameEvent {
    message: string;
    effect: {
        type: EffectType;
        amount: number;
    };
}

export interface Investment {
    name: string;
    amount: number;
    income: number;
    yearlyPayment?: number;
    type: 'capital' | 'real_estate' | 'business' | 'crypto' | 'fund';
    // Risk assessment properties for task 1.3
    volatility?: number; // Volatility factor (0-1, higher = more volatile)
    riskScore?: number; // Overall risk score (1-10, higher = riskier)
    riskCategory?: 'low' | 'medium' | 'high' | 'very_high';
    // Dynamic pricing properties for task 1.4
    basePrice?: number; // Original base price before market adjustments
    marketMultiplier?: number; // Current market condition multiplier
    priceHistory?: number[]; // Historical price changes
    // Investment sector properties for task 1.6
    sector?: InvestmentSector; // Economic sector classification
    sectorRiskMultiplier?: number; // Sector-specific risk multiplier (0.5-2.0)
    sectorReturnMultiplier?: number; // Sector-specific return multiplier (0.7-1.5)
    sectorVolatility?: number; // Additional volatility from sector-specific factors
}

export interface Job {
    label: string;
    value: {
        minSalary: number;
        maxSalary: number;
        expenses: number;
    };
}

export interface DifficultyConfig {
    level: DifficultyLevel;
    label: string;
    description: string;
    modifiers: {
        salaryMultiplier: number;
        expenseMultiplier: number;
        investmentReturnMultiplier: number;
        eventFrequency: number;
        startingCashMultiplier: number;
        loanInterestMultiplier: number;
    };
}

export interface EconomicCycleConfig {
    cycle: EconomicCycle;
    label: string;
    description: string;
    duration: number; // in turns
    effects: {
        investmentReturnMultiplier: number;
        jobSecurityFactor: number;
        eventSeverityMultiplier: number;
        inflationRate: number;
    };
}

// Tax system interfaces for Task 1.7
export interface TaxBracketConfig {
    bracket: TaxBracket;
    label: string;
    minIncome: number;
    maxIncome?: number; // undefined for highest bracket
    taxRate: number; // as decimal (0.1 = 10%)
    capitalGainsRate: number; // tax rate for investment gains
    dividendTaxRate: number; // tax rate for dividend income
}

export interface TaxCalculation {
    grossIncome: number;
    taxableIncome: number;
    incomeTax: number;
    capitalGainsTax: number;
    dividendTax: number;
    totalTax: number;
    netIncome: number;
    effectiveTaxRate: number;
    bracket: TaxBracket;
}

// Retirement planning interfaces for Task 1.8
export interface RetirementAccount {
    type: RetirementAccountType;
    balance: number;
    contributions: number; // annual contributions
    maxContribution: number; // annual limit
    taxDeferred: boolean; // true for 401k/traditional IRA, false for Roth
    employerMatch?: number; // employer matching percentage for 401k
    vestingPeriod?: number; // years until fully vested
    withdrawalAge: number; // minimum age for penalty-free withdrawal
}

export interface RetirementPlan {
    targetRetirementAge: number;
    currentRetirementSavings: number;
    monthlyRetirementGoal: number;
    accounts: RetirementAccount[];
    projectedBalance: number;
    onTrack: boolean;
}