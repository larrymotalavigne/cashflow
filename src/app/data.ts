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
}

export interface Job {
    label: string;
    value: {
        minSalary: number;
        maxSalary: number;
        expenses: number;
    };
}