export type EffectType = 'cash' | 'expenses';

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