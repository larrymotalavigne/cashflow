import {Injectable} from '@angular/core';
import {GameEvent, Investment, Job, DifficultyConfig, EconomicCycleConfig, DifficultyLevel, EconomicCycle} from './data';
import {TranslationService} from './translation.service';

@Injectable({
    providedIn: 'root'
})
export class GameConfigService {
    constructor(private translationService: TranslationService) {}
    jobs: Job[] = [
        { label: 'Agriculteur', value: { minSalary: 20000, maxSalary: 25000, expenses: 18000 } },
        { label: 'Aide-soignant', value: { minSalary: 19000, maxSalary: 23000, expenses: 17000 } },
        { label: 'Agent d\'entretien', value: { minSalary: 18000, maxSalary: 22000, expenses: 16000 } },
        { label: 'Architecte', value: { minSalary: 35000, maxSalary: 50000, expenses: 30000 } },
        { label: 'Avocat', value: { minSalary: 45000, maxSalary: 80000, expenses: 40000 } },
        { label: 'Boulanger', value: { minSalary: 20000, maxSalary: 25000, expenses: 18000 } },
        { label: 'Caissier', value: { minSalary: 18000, maxSalary: 22000, expenses: 16000 } },
        { label: 'Cariste', value: { minSalary: 20000, maxSalary: 25000, expenses: 18000 } },
        { label: 'Charpentier', value: { minSalary: 22000, maxSalary: 28000, expenses: 20000 } },
        { label: 'Chef de projet', value: { minSalary: 35000, maxSalary: 45000, expenses: 32000 } },
        { label: 'Chauffeur poids lourd', value: { minSalary: 24000, maxSalary: 30000, expenses: 22000 } },
        { label: 'Coiffeur', value: { minSalary: 19000, maxSalary: 23000, expenses: 17000 } },
        { label: 'Comptable', value: { minSalary: 30000, maxSalary: 40000, expenses: 25000 } },
        { label: 'Cuisinier', value: { minSalary: 22000, maxSalary: 28000, expenses: 20000 } },
        { label: 'Développeur', value: { minSalary: 35000, maxSalary: 50000, expenses: 30000 } },
        { label: 'Electricien', value: { minSalary: 23000, maxSalary: 30000, expenses: 20000 } },
        { label: 'Employé de bureau', value: { minSalary: 22000, maxSalary: 28000, expenses: 20000 } },
        { label: 'Enseignant', value: { minSalary: 27000, maxSalary: 35000, expenses: 23000 } },
        { label: 'Facteur', value: { minSalary: 22000, maxSalary: 27000, expenses: 20000 } },
        { label: 'Ingénieur', value: { minSalary: 40000, maxSalary: 55000, expenses: 35000 } },
        { label: 'Infirmier', value: { minSalary: 26000, maxSalary: 32000, expenses: 24000 } },
        { label: 'Journaliste', value: { minSalary: 28000, maxSalary: 40000, expenses: 26000 } },
        { label: 'Magasinier', value: { minSalary: 20000, maxSalary: 25000, expenses: 18000 } },
        { label: 'Maçon', value: { minSalary: 22000, maxSalary: 28000, expenses: 20000 } },
        { label: 'Médecin', value: { minSalary: 60000, maxSalary: 90000, expenses: 50000 } },
        { label: 'Ouvrier du bâtiment', value: { minSalary: 22000, maxSalary: 28000, expenses: 20000 } },
        { label: 'Pharmacien', value: { minSalary: 45000, maxSalary: 60000, expenses: 40000 } },
        { label: 'Plombier', value: { minSalary: 25000, maxSalary: 32000, expenses: 22000 } },
        { label: 'Policier', value: { minSalary: 23000, maxSalary: 30000, expenses: 21000 } },
        { label: 'Serveur', value: { minSalary: 19000, maxSalary: 23000, expenses: 17000 } },
        { label: 'Secrétaire', value: { minSalary: 21000, maxSalary: 26000, expenses: 19000 } },
        { label: 'Soudeur', value: { minSalary: 23000, maxSalary: 28000, expenses: 20000 } },
        { label: 'Technicien', value: { minSalary: 28000, maxSalary: 35000, expenses: 25000 } },
        { label: 'Vendeur', value: { minSalary: 20000, maxSalary: 25000, expenses: 18000 } },
        { label: 'SMIC', value: { minSalary: 20000, maxSalary: 20000, expenses: 18000 } },
        { label: 'SMIC x2', value: { minSalary: 40000, maxSalary: 40000, expenses: 30000 } },
        { label: 'SMIC x3', value: { minSalary: 60000, maxSalary: 60000, expenses: 42000 } }
    ];

    investments: Investment[] = [
        { name: 'Appartement T2 à Lyon', amount: 180000, income: 7500, type: 'real_estate' },
        { name: 'Commerce de proximité', amount: 90000, income: 9000, type: 'business' },
        { name: 'Portefeuille d\'actions CAC 40', amount: 25000, income: 1000, type: 'capital' },
        { name: 'Maison de ville à Lille', amount: 220000, income: 9600, type: 'real_estate' },
        { name: 'Villa en bord de mer', amount: 450000, income: 24000, type: 'real_estate' },
        { name: 'Immeuble de rapport à Rouen', amount: 350000, income: 30000, type: 'real_estate' },
        { name: 'Local commercial à Bordeaux', amount: 280000, income: 17000, type: 'real_estate' },
        { name: 'Terrain constructible en Île-de-France', amount: 150000, income: 0, type: 'real_estate' },
        { name: 'Parts de SCPI', amount: 10000, income: 500, type: 'fund' },
        { name: 'Plateforme de crowdfunding', amount: 5000, income: 300, type: 'fund' },
        { name: 'Société non cotée', amount: 20000, income: 1500, type: 'business' },
        { name: 'Fonds immobilier européen', amount: 15000, income: 800, type: 'fund' },
        { name: 'ETF secteur technologique', amount: 12000, income: 600, type: 'capital' },
        { name: 'Actions entreprises du CAC Mid 60', amount: 18000, income: 900, type: 'capital' },
        { name: 'Actions start-up biotech', amount: 15000, income: 1200, type: 'capital' },
        { name: 'Fonds indiciel S&P 500', amount: 10000, income: 700, type: 'fund' },
        { name: 'Obligations d’État', amount: 5000, income: 200, type: 'fund' },
        { name: 'Obligations d’entreprise', amount: 7000, income: 300, type: 'fund' },
        { name: 'Bitcoin et cryptos', amount: 5000, income: 0, type: 'crypto' },
        { name: 'Fonds de private equity', amount: 30000, income: 2500, type: 'fund' },
        { name: 'Capital-risque', amount: 25000, income: 2000, type: 'capital' },
        { name: 'Fonds de pension diversifié', amount: 15000, income: 700, type: 'fund' },
        { name: 'Société cotée en bourse', amount: 22000, income: 1100, type: 'capital' },
        { name: 'Actions de croissance', amount: 20000, income: 1000, type: 'capital' },
        { name: 'Actions de valeur', amount: 18000, income: 900, type: 'capital' },
        { name: 'Fonds obligataire', amount: 8000, income: 400, type: 'fund' },
        { name: 'Fonds diversifié international', amount: 15000, income: 750, type: 'fund' },
        { name: 'Résidence seniors en gestion locative', amount: 300000, income: 22000, type: 'real_estate' }
    ];

    events: GameEvent[] = [
        {message: 'Réparation voiture: -500€', effect: {type: 'cash', amount: -500}},
        {message: 'Bonus au travail: +1000€', effect: {type: 'cash', amount: 1000}},
        {message: 'Taxe imprévue: -700€', effect: {type: 'cash', amount: -700}},
        {message: 'Promotion au travail: +2000€', effect: {type: 'cash', amount: 2000}},
        {message: 'Investissement réussi: +1500€', effect: {type: 'cash', amount: 1500}},
        {message: 'Frais médicaux: -1200€', effect: {type: 'expenses', amount: 1200}},
        {message: 'Déménagement: -800€', effect: {type: 'cash', amount: -800}},
        {message: 'Réduction d\'impôts: +600€', effect: {type: 'cash', amount: 600}},
        {message: 'Amende de stationnement: -100€', effect: {type: 'cash', amount: -100}},
        {message: 'Prime d\'année: +2500€', effect: {type: 'cash', amount: 2500}},
        {message: 'Réparation maison: -900€', effect: {type: 'cash', amount: -900}},
        {message: 'Panne d\'ascenseur: -400€', effect: {type: 'cash', amount: -400}},
        {message: 'Remboursement bancaire: +800€', effect: {type: 'cash', amount: 800}},
        {message: 'Frais de scolarité: -1500€', effect: {type: 'expenses', amount: 1500}},
        {message: 'Héritage: +5000€', effect: {type: 'cash', amount: 5000}},
        {message: 'Dividende d\'actions: +700€', effect: {type: 'cash', amount: 700}},
        {message: 'Frais juridiques: -1100€', effect: {type: 'expenses', amount: 1100}},
        {message: 'Vente d\'actifs: +1300€', effect: {type: 'cash', amount: 1300}},
        {message: 'Rachat d\'entreprise: -3000€', effect: {type: 'cash', amount: -3000}},
        {message: 'Gains de loterie: +10000€', effect: {type: 'cash', amount: 10000}},
        {message: 'Dépenses imprévues: -600€', effect: {type: 'cash', amount: -600}},
        {message: 'Rénovation: -2000€', effect: {type: 'cash', amount: -2000}},
        {message: 'Aide gouvernementale: +900€', effect: {type: 'cash', amount: 900}},
        {message: 'Perte sur investissement: -2500€', effect: {type: 'cash', amount: -2500}},
        {message: 'Frais de voyage: -750€', effect: {type: 'cash', amount: -750}},
        {message: 'Prime exceptionnelle: +3000€', effect: {type: 'cash', amount: 3000}},
        {message: 'Cadeau d\'entreprise: +400€', effect: {type: 'cash', amount: 400}},
        {message: 'Erreur comptable: -650€', effect: {type: 'cash', amount: -650}},
        {message: 'Fonds de roulement: +1200€', effect: {type: 'cash', amount: 1200}},
        {message: 'Crise économique: -3500€', effect: {type: 'cash', amount: -3500}}
    ];

    randomNames: string[] = [
        'Alexandre', 'Benjamin', 'Camille', 'Charles', 'Damien', 'Emilie', 'Fabien', 'Gabriel', 'Hugo', 'Isabelle',
        'Julien', 'Kevin', 'Laurent', 'Marine', 'Nicolas', 'Olivier', 'Pierre', 'Quentin', 'Romain', 'Sophie',
        'Thomas', 'Ugo', 'Valérie', 'William', 'Xavier', 'Yann', 'Zoé', 'Adrien', 'Bruno', 'Chloé',
        'David', 'Elodie', 'Fabrice', 'Gauthier', 'Helene', 'Ibrahim', 'Jade', 'Kévin', 'Léa', 'Mathieu',
        'Noémie', 'Ophélie', 'Pascal', 'Roxane', 'Stéphane', 'Thierry', 'Ulysse', 'Véronique', 'Willy', 'Xenia',
        'Yasmine', 'Zacharie', 'Amélie', 'Benoît', 'Céline', 'Dorian', 'Estelle', 'Florian', 'Gaëlle', 'Honoré',
        'Inès', 'Jérémy', 'Karine', 'Ludovic', 'Mélanie', 'Noé', 'Océane', 'Paul', 'Renaud', 'Samuel',
        'Tania', 'Ursule', 'Victor', 'Wanda', 'Xander', 'Yseult', 'Zohra', 'Alexia', 'Boris', 'Cédric',
        'Dimitri', 'Elise', 'Flavien', 'Géraldine', 'Hervé', 'Iris', 'Josselin', 'Khalil', 'Léna', 'Maxime',
        'Nathalie', 'Oumar', 'Perrine', 'Raphaël', 'Solène', 'Tristan', 'Ulrich', 'Vianney', 'Yvan', 'Zélie'
    ];

    getTranslatedJobs(): Job[] {
        return this.jobs.map(job => ({
            ...job,
            label: this.translationService.translate(`jobs.${job.label}`)
        }));
    }

    loanRate: number = 0.1; // 10% interest

    difficultyConfigs: DifficultyConfig[] = [
        {
            level: 'easy',
            label: 'Facile',
            description: 'Pour les débutants - salaires plus élevés, dépenses réduites, événements moins fréquents',
            modifiers: {
                salaryMultiplier: 1.3,
                expenseMultiplier: 0.8,
                investmentReturnMultiplier: 1.2,
                eventFrequency: 0.7,
                startingCashMultiplier: 1.5,
                loanInterestMultiplier: 0.8
            }
        },
        {
            level: 'normal',
            label: 'Normal',
            description: 'Équilibré - expérience de jeu standard',
            modifiers: {
                salaryMultiplier: 1.0,
                expenseMultiplier: 1.0,
                investmentReturnMultiplier: 1.0,
                eventFrequency: 1.0,
                startingCashMultiplier: 1.0,
                loanInterestMultiplier: 1.0
            }
        },
        {
            level: 'hard',
            label: 'Difficile',
            description: 'Pour les joueurs expérimentés - dépenses plus élevées, revenus réduits',
            modifiers: {
                salaryMultiplier: 0.8,
                expenseMultiplier: 1.2,
                investmentReturnMultiplier: 0.9,
                eventFrequency: 1.3,
                startingCashMultiplier: 0.7,
                loanInterestMultiplier: 1.2
            }
        },
        {
            level: 'expert',
            label: 'Expert',
            description: 'Défi ultime - conditions très difficiles, événements fréquents',
            modifiers: {
                salaryMultiplier: 0.7,
                expenseMultiplier: 1.4,
                investmentReturnMultiplier: 0.8,
                eventFrequency: 1.5,
                startingCashMultiplier: 0.5,
                loanInterestMultiplier: 1.4
            }
        }
    ];

    economicCycles: EconomicCycleConfig[] = [
        {
            cycle: 'recession',
            label: 'Récession',
            description: 'Période économique difficile avec baisse des investissements',
            duration: 8,
            effects: {
                investmentReturnMultiplier: 0.6,
                jobSecurityFactor: 0.7,
                eventSeverityMultiplier: 1.4,
                inflationRate: 0.02
            }
        },
        {
            cycle: 'recovery',
            label: 'Reprise',
            description: 'Sortie de récession avec amélioration progressive',
            duration: 6,
            effects: {
                investmentReturnMultiplier: 0.8,
                jobSecurityFactor: 0.9,
                eventSeverityMultiplier: 1.1,
                inflationRate: 0.015
            }
        },
        {
            cycle: 'expansion',
            label: 'Expansion',
            description: 'Croissance économique favorable aux investissements',
            duration: 10,
            effects: {
                investmentReturnMultiplier: 1.3,
                jobSecurityFactor: 1.2,
                eventSeverityMultiplier: 0.8,
                inflationRate: 0.025
            }
        },
        {
            cycle: 'peak',
            label: 'Pic',
            description: 'Apogée économique mais instabilité croissante',
            duration: 4,
            effects: {
                investmentReturnMultiplier: 1.5,
                jobSecurityFactor: 1.0,
                eventSeverityMultiplier: 1.2,
                inflationRate: 0.035
            }
        }
    ];

    currentDifficulty: DifficultyLevel = 'normal';
    currentEconomicCycle: EconomicCycle = 'expansion';
    economicCycleTurnsRemaining: number = 10;

    setDifficulty(difficulty: DifficultyLevel): void {
        this.currentDifficulty = difficulty;
    }

    getCurrentDifficultyConfig(): DifficultyConfig {
        return this.difficultyConfigs.find(config => config.level === this.currentDifficulty) || this.difficultyConfigs[1];
    }

    getCurrentEconomicCycleConfig(): EconomicCycleConfig {
        return this.economicCycles.find(cycle => cycle.cycle === this.currentEconomicCycle) || this.economicCycles[2];
    }

    applyDifficultyToSalary(baseSalary: number): number {
        const difficultyConfig = this.getCurrentDifficultyConfig();
        return Math.round(baseSalary * difficultyConfig.modifiers.salaryMultiplier);
    }

    applyDifficultyToExpenses(baseExpenses: number): number {
        const difficultyConfig = this.getCurrentDifficultyConfig();
        return Math.round(baseExpenses * difficultyConfig.modifiers.expenseMultiplier);
    }

    applyDifficultyToInvestmentReturn(baseReturn: number): number {
        const difficultyConfig = this.getCurrentDifficultyConfig();
        const economicConfig = this.getCurrentEconomicCycleConfig();
        return Math.round(baseReturn * difficultyConfig.modifiers.investmentReturnMultiplier * economicConfig.effects.investmentReturnMultiplier);
    }

    applyDifficultyToStartingCash(baseCash: number): number {
        const difficultyConfig = this.getCurrentDifficultyConfig();
        return Math.round(baseCash * difficultyConfig.modifiers.startingCashMultiplier);
    }

    shouldTriggerEvent(): boolean {
        const difficultyConfig = this.getCurrentDifficultyConfig();
        const baseChance = 0.3; // 30% base chance per turn
        return Math.random() < (baseChance * difficultyConfig.modifiers.eventFrequency);
    }

    applyEconomicCycleToEvent(eventAmount: number): number {
        const economicConfig = this.getCurrentEconomicCycleConfig();
        return Math.round(eventAmount * economicConfig.effects.eventSeverityMultiplier);
    }

    advanceEconomicCycle(): void {
        this.economicCycleTurnsRemaining--;
        if (this.economicCycleTurnsRemaining <= 0) {
            // Cycle through economic phases
            const currentIndex = this.economicCycles.findIndex(cycle => cycle.cycle === this.currentEconomicCycle);
            const nextIndex = (currentIndex + 1) % this.economicCycles.length;
            this.currentEconomicCycle = this.economicCycles[nextIndex].cycle;
            this.economicCycleTurnsRemaining = this.economicCycles[nextIndex].duration;
        }
    }
}