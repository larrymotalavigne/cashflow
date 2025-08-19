export type EffectType = 'cash' | 'expenses';
export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'expert';
export type EconomicCycle = 'recession' | 'recovery' | 'expansion' | 'peak';

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