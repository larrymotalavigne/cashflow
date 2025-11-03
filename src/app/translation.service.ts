import { Injectable, signal } from '@angular/core';

export type Language = 'fr' | 'en';

export interface Translations {
  [key: string]: string | Translations;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly LANGUAGE_KEY = 'cashflow-language';
  
  // Current language signal
  language = signal<Language>('fr');
  
  // Translation dictionaries
  private translations: Record<Language, Translations> = {
    fr: {
      common: {
        welcome: 'Bienvenue dans le jeu',
        cashflow: 'Cashflow',
        help: 'Aide',
        start: 'Démarrer le jeu',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        close: 'Fermer',
        yes: 'Oui',
        no: 'Non',
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        warning: 'Attention',
        continue: 'Continuer',
        back: 'Retour'
      },
      dialogs: {
        confirmBackTitle: 'Retour au menu',
        confirmBackMessage: 'Êtes-vous sûr de vouloir retourner au menu principal ? Votre progression sera sauvegardée automatiquement.',
        confirmRejectTitle: 'Rejeter l\'opportunité',
        confirmRejectMessage: 'Êtes-vous sûr de vouloir rejeter cette opportunité d\'investissement ?',
        purchaseSuccessTitle: 'Achat réussi !',
        purchaseSuccessMessage: 'Votre investissement a été ajouté à votre portfolio',
        loanPurchaseTitle: 'Achat avec emprunt',
        loanPurchaseMessage: 'Investissement acheté avec un emprunt'
      },
      startup: {
        welcome: 'Bienvenue',
        tagline: 'Simulez votre parcours vers l\'indépendance financière',
        gameStart: 'Démarrage du jeu',
        job: 'Métier',
        selectJob: 'Sélectionnez un métier',
        age: 'Âge',
        startingMoney: 'Capital de départ',
        playerName: 'Nom du joueur',
        generateRandomName: 'Générer un nom aléatoire',
        generateName: 'Générer un nom aléatoire',
        help: 'Aide',
        startGame: 'Démarrer le jeu',
        helpTitle: 'Aide et tutoriel',
        helpTutorial: 'Aide et tutoriel',
        welcomeTitle: 'Bienvenue dans Cashflow Game!',
        welcomeGame: 'Bienvenue dans Cashflow Game!',
        welcomeDesc: 'Ce jeu vous permet de simuler votre parcours financier, de l\'emploi à l\'indépendance financière.',
        gameDescription: 'Ce jeu vous permet de simuler votre parcours financier, de l\'emploi à l\'indépendance financière.',
        howToPlay: 'Comment jouer:',
        step1: 'Choisissez un métier - Chaque métier a un salaire différent qui détermine votre revenu mensuel.',
        step2: 'Définissez votre âge - Votre âge influence le nombre de tours que vous aurez pour atteindre l\'indépendance financière.',
        step3: 'Capital de départ - C\'est l\'argent avec lequel vous commencez le jeu.',
        step4: 'Nom - Entrez votre nom ou générez-en un aléatoirement.',
        objective: 'Objectif du jeu:',
        objectiveDesc: 'L\'objectif est d\'atteindre l\'indépendance financière, c\'est-à-dire lorsque vos revenus passifs dépassent vos dépenses.',
        duringGame: 'Pendant le jeu:',
        gameStep1: 'À chaque tour, vous recevez votre salaire et payez vos dépenses',
        gameStep2: 'Vous pouvez acheter des investissements pour générer des revenus passifs',
        gameStep3: 'Des événements aléatoires peuvent affecter vos finances',
        gameStep4: 'Suivez votre progression vers l\'indépendance financière',
        goodLuck: 'Bonne chance dans votre parcours vers la liberté financière! 🚀',
        resumeGame: 'Reprendre la partie',
        continueWith: 'Continuer avec',
        resumeGameButton: 'Reprendre la partie',
        difficultyLevel: 'Niveau de difficulté',
        selectDifficulty: 'Choisir la difficulté',
        difficulties: {
          easy: {
            label: 'Facile',
            description: 'Pour les débutants - salaires plus élevés, dépenses réduites, événements moins fréquents'
          },
          normal: {
            label: 'Normal',
            description: 'Équilibré - expérience de jeu standard'
          },
          hard: {
            label: 'Difficile',
            description: 'Pour les joueurs expérimentés - dépenses plus élevées, revenus réduits'
          },
          expert: {
            label: 'Expert',
            description: 'Défi ultime - conditions très difficiles, événements fréquents'
          }
        }
      },
      game: {
        dashboard: 'Cashflow',
        seeOpportunities: 'Voir les opportunités',
        playerInfo: 'Informations du joueur',
        cash: 'Liquidités',
        income: 'Revenus',
        expenses: 'Dépenses',
        passiveIncome: 'Revenus passifs',
        age: 'Âge',
        turn: 'Tour',
        investments: 'Investissements',
        portfolio: 'Portefeuille',
        progress: 'Progression',
        financialGoal: 'Objectif financier',
        personalInfo: 'Informations Personnelles',
        financialSituation: 'Situation Financière',
        name: 'Nom',
        years: 'ans',
        monthly: 'Mensuel',
        yearly: 'Annuel',
        annualPeriod: 'annuel',
        monthlyPeriod: 'mensuel',
        loans: 'Emprunts',
        economicCycle: 'Cycle Économique',
        currentPhase: 'Phase Actuelle',
        turnsRemaining: 'Tours restants',
        currentEffects: 'Effets Actuels',
        returns: 'Rendements',
        jobSecurity: 'Sécurité emploi',
        events: 'Événements',
        inflation: 'Inflation',
        investmentPortfolio: 'Portfolio d\'Investissements',
        amount: 'Montant',
        annualPayments: 'Paiements annuels',
        annualRevenue: 'Revenu annuel',
        victoryMessage: 'Félicitations ! Vous avez atteint la liberté financière !',
        export: {
          title: 'Exporter les données',
          csv: 'Exporter l\'historique (CSV)',
          summary: 'Exporter le rapport de synthèse (TXT)',
          json: 'Exporter les données complètes (JSON)'
        }
      },
      statistics: {
        title: 'Statistiques et analyses',
        netWorth: 'Valeur nette',
        netWorthEvolution: 'Évolution de la valeur nette',
        totalReturns: 'Rendements totaux',
        fromInvestments: 'des investissements',
        averageROI: 'ROI moyen',
        annual: 'Annuel',
        turnsPlayed: 'Tours joués',
        incomeVsExpenses: 'Revenus vs dépenses',
        portfolioDistribution: 'Répartition du portfolio',
        cashFlowTrend: 'Tendance du cash-flow',
        cashFlow: 'Cash-flow',
        investmentPerformance: 'Performance des investissements',
        investment: 'Investissement',
        amount: 'Montant',
        annualReturn: 'Rendement annuel',
        roi: 'ROI',
        paybackYears: 'Rentabilité (années)',
        total: 'Total',
        noInvestments: 'Aucun investissement pour le moment'
      },
      investments: {
        title: 'Opportunités d\'investissement',
        buy: 'Acheter',
        sell: 'Vendre',
        buyWithCash: 'Acheter comptant',
        buyWithLoan: 'Acheter à crédit',
        monthlyReturn: 'Rendement mensuel',
        cost: 'Coût',
        loan: 'Prêt',
        portfolio: 'Portefeuille',
        noInvestments: 'Aucun investissement dans votre portefeuille',
        events: 'Événements',
        opportunities: 'Opportunités d\'investissement',
        noOpportunities: 'Aucune opportunité d\'investissement disponible.',
        showAdvancedFilters: 'Afficher les filtres avancés',
        hideAdvancedFilters: 'Masquer les filtres avancés',
        compareInvestments: 'Comparer des investissements',
        comparison: 'Comparaison d\'investissements',
        selectToCompare: 'Sélectionnez des investissements pour les comparer',
        remove: 'Retirer',
        nextYear: 'Année suivante',
        price: 'Prix',
        income: 'Revenu',
        roi: 'ROI',
        type: 'Type',
        riskLevels: {
          veryHigh: 'Très élevé',
          high: 'Élevé',
          medium: 'Moyen',
          low: 'Faible'
        },
        riskTooltips: {
          veryHigh: 'Risque très élevé - Rendements très variables',
          high: 'Risque élevé - Rendements volatils',
          medium: 'Risque modéré - Équilibre risque/rendement',
          low: 'Risque faible - Rendements stables'
        },
        monthlyLabel: 'Mensuel',
        yearlyLabel: 'Annuel',
        paybackPeriod: 'Rentabilité',
        months: 'mois',
        performance: 'Performance',
        performanceRatings: {
          excellent: 'Excellent',
          good: 'Bon',
          fair: 'Correct',
          poor: 'Faible'
        },
        actions: {
          buy: 'Acheter',
          insufficientFunds: 'Fonds insuffisants',
          buyWithCash: 'Acheter avec vos liquidités',
          loan: 'Emprunt',
          loanTooltip: 'Acheter avec un emprunt (frais',
          reject: 'Refuser',
          rejectTooltip: 'Rejeter cette opportunité',
          compare: 'Comparer',
          compareTooltip: 'Ajouter à la comparaison'
        }
      },
      events: {
        randomEvent: 'Événement aléatoire',
        continue: 'Continuer'
      },
      jobs: {
        'Agriculteur': 'Agriculteur',
        'Aide-soignant': 'Aide-soignant',
        'Agent d\'entretien': 'Agent d\'entretien',
        'Architecte': 'Architecte',
        'Avocat': 'Avocat',
        'Boulanger': 'Boulanger',
        'Caissier': 'Caissier',
        'Cariste': 'Cariste',
        'Charpentier': 'Charpentier',
        'Chef de projet': 'Chef de projet',
        'Chauffeur poids lourd': 'Chauffeur poids lourd',
        'Coiffeur': 'Coiffeur',
        'Comptable': 'Comptable',
        'Cuisinier': 'Cuisinier',
        'Développeur': 'Développeur',
        'Electricien': 'Electricien',
        'Employé de bureau': 'Employé de bureau',
        'Enseignant': 'Enseignant',
        'Facteur': 'Facteur',
        'Ingénieur': 'Ingénieur',
        'Infirmier': 'Infirmier',
        'Journaliste': 'Journaliste',
        'Magasinier': 'Magasinier',
        'Maçon': 'Maçon',
        'Médecin': 'Médecin',
        'Ouvrier du bâtiment': 'Ouvrier du bâtiment',
        'Pharmacien': 'Pharmacien',
        'Plombier': 'Plombier',
        'Policier': 'Policier',
        'Serveur': 'Serveur',
        'Secrétaire': 'Secrétaire',
        'Soudeur': 'Soudeur',
        'Technicien': 'Technicien',
        'Vendeur': 'Vendeur',
        'SMIC': 'SMIC',
        'SMIC x2': 'SMIC x2',
        'SMIC x3': 'SMIC x3'
      },
      accessibility: {
        toggleTheme: 'Basculer le thème',
        toggleLanguage: 'Changer de langue',
        toggleHighContrast: 'Mode contraste élevé',
        toggleScreenReader: 'Support lecteur d\'écran',
        skipToContent: 'Aller au contenu principal',
        skipToNavigation: 'Aller à la navigation',
        screenReaderEnabled: 'Lecteur d\'écran activé',
        highContrastEnabled: 'Mode contraste élevé activé',
        reducedMotionEnabled: 'Mouvement réduit activé',
        keyboardNavigationEnabled: 'Navigation clavier activée'
      }
    },
    en: {
      common: {
        welcome: 'Welcome to the game',
        cashflow: 'Cashflow',
        help: 'Help',
        start: 'Start game',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        yes: 'Yes',
        no: 'No',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        continue: 'Continue',
        back: 'Back'
      },
      dialogs: {
        confirmBackTitle: 'Back to Menu',
        confirmBackMessage: 'Are you sure you want to return to the main menu? Your progress will be saved automatically.',
        confirmRejectTitle: 'Reject Opportunity',
        confirmRejectMessage: 'Are you sure you want to reject this investment opportunity?',
        purchaseSuccessTitle: 'Purchase Successful!',
        purchaseSuccessMessage: 'Your investment has been added to your portfolio',
        loanPurchaseTitle: 'Purchase with Loan',
        loanPurchaseMessage: 'Investment purchased with a loan'
      },
      startup: {
        welcome: 'Welcome',
        tagline: 'Simulate your journey to financial independence',
        gameStart: 'Game Setup',
        job: 'Job',
        selectJob: 'Select a job',
        age: 'Age',
        startingMoney: 'Starting Capital',
        playerName: 'Player Name',
        generateRandomName: 'Generate random name',
        generateName: 'Generate random name',
        help: 'Help',
        startGame: 'Start game',
        helpTitle: 'Help and tutorial',
        helpTutorial: 'Help and tutorial',
        welcomeTitle: 'Welcome to Cashflow Game!',
        welcomeGame: 'Welcome to Cashflow Game!',
        welcomeDesc: 'This game allows you to simulate your financial journey from employment to financial independence.',
        gameDescription: 'This game allows you to simulate your financial journey from employment to financial independence.',
        howToPlay: 'How to play:',
        step1: 'Choose a job - Each job has a different salary that determines your monthly income.',
        step2: 'Set your age - Your age influences the number of turns you will have to reach financial independence.',
        step3: 'Starting capital - This is the money you start the game with.',
        step4: 'Name - Enter your name or generate one randomly.',
        objective: 'Game objective:',
        objectiveDesc: 'The goal is to achieve financial independence, which means your passive income exceeds your expenses.',
        duringGame: 'During the game:',
        gameStep1: 'Each turn, you receive your salary and pay your expenses',
        gameStep2: 'You can buy investments to generate passive income',
        gameStep3: 'Random events can affect your finances',
        gameStep4: 'Track your progress towards financial independence',
        goodLuck: 'Good luck on your journey to financial freedom! 🚀',
        resumeGame: 'Resume Game',
        continueWith: 'Continue with',
        resumeGameButton: 'Resume Game',
        difficultyLevel: 'Difficulty Level',
        selectDifficulty: 'Select Difficulty',
        difficulties: {
          easy: {
            label: 'Easy',
            description: 'For beginners - higher salaries, reduced expenses, less frequent events'
          },
          normal: {
            label: 'Normal',
            description: 'Balanced - standard game experience'
          },
          hard: {
            label: 'Hard',
            description: 'For experienced players - higher expenses, reduced income'
          },
          expert: {
            label: 'Expert',
            description: 'Ultimate challenge - very difficult conditions, frequent events'
          }
        }
      },
      game: {
        dashboard: 'Cashflow',
        seeOpportunities: 'See opportunities',
        playerInfo: 'Player information',
        cash: 'Cash',
        income: 'Income',
        expenses: 'Expenses',
        passiveIncome: 'Passive income',
        age: 'Age',
        turn: 'Turn',
        investments: 'Investments',
        portfolio: 'Portfolio',
        progress: 'Progress',
        financialGoal: 'Financial goal',
        personalInfo: 'Personal Information',
        financialSituation: 'Financial Situation',
        name: 'Name',
        years: 'years old',
        monthly: 'Monthly',
        yearly: 'Yearly',
        annualPeriod: 'yearly',
        monthlyPeriod: 'monthly',
        loans: 'Loans',
        economicCycle: 'Economic Cycle',
        currentPhase: 'Current Phase',
        turnsRemaining: 'Turns remaining',
        currentEffects: 'Current Effects',
        returns: 'Returns',
        jobSecurity: 'Job security',
        events: 'Events',
        inflation: 'Inflation',
        investmentPortfolio: 'Investment Portfolio',
        amount: 'Amount',
        annualPayments: 'Annual payments',
        annualRevenue: 'Annual income',
        victoryMessage: 'Congratulations! You have achieved financial freedom!',
        export: {
          title: 'Export data',
          csv: 'Export history (CSV)',
          summary: 'Export summary report (TXT)',
          json: 'Export complete data (JSON)'
        }
      },
      statistics: {
        title: 'Statistics & Analysis',
        netWorth: 'Net Worth',
        netWorthEvolution: 'Net Worth Evolution',
        totalReturns: 'Total Returns',
        fromInvestments: 'from investments',
        averageROI: 'Average ROI',
        annual: 'Annual',
        turnsPlayed: 'Turns Played',
        incomeVsExpenses: 'Income vs Expenses',
        portfolioDistribution: 'Portfolio Distribution',
        cashFlowTrend: 'Cash Flow Trend',
        cashFlow: 'Cash Flow',
        investmentPerformance: 'Investment Performance',
        investment: 'Investment',
        amount: 'Amount',
        annualReturn: 'Annual Return',
        roi: 'ROI',
        paybackYears: 'Payback (years)',
        total: 'Total',
        noInvestments: 'No investments yet'
      },
      investments: {
        title: 'Investment opportunities',
        buy: 'Buy',
        sell: 'Sell',
        buyWithCash: 'Buy with cash',
        buyWithLoan: 'Buy with loan',
        monthlyReturn: 'Monthly return',
        cost: 'Cost',
        loan: 'Loan',
        portfolio: 'Portfolio',
        noInvestments: 'No investments in your portfolio',
        events: 'Events',
        opportunities: 'Investment Opportunities',
        noOpportunities: 'No investment opportunities available.',
        showAdvancedFilters: 'Show advanced filters',
        hideAdvancedFilters: 'Hide advanced filters',
        compareInvestments: 'Compare investments',
        comparison: 'Investment Comparison',
        selectToCompare: 'Select investments to compare',
        remove: 'Remove',
        nextYear: 'Next Year',
        price: 'Price',
        income: 'Income',
        roi: 'ROI',
        type: 'Type',
        riskLevels: {
          veryHigh: 'Very High',
          high: 'High',
          medium: 'Medium',
          low: 'Low'
        },
        riskTooltips: {
          veryHigh: 'Very high risk - Highly variable returns',
          high: 'High risk - Volatile returns',
          medium: 'Moderate risk - Balanced risk/return',
          low: 'Low risk - Stable returns'
        },
        monthlyLabel: 'Monthly',
        yearlyLabel: 'Yearly',
        paybackPeriod: 'Payback',
        months: 'months',
        performance: 'Performance',
        performanceRatings: {
          excellent: 'Excellent',
          good: 'Good',
          fair: 'Fair',
          poor: 'Poor'
        },
        actions: {
          buy: 'Buy',
          insufficientFunds: 'Insufficient funds',
          buyWithCash: 'Buy with your cash',
          loan: 'Loan',
          loanTooltip: 'Buy with a loan (fee',
          reject: 'Reject',
          rejectTooltip: 'Reject this opportunity',
          compare: 'Compare',
          compareTooltip: 'Add to comparison'
        }
      },
      events: {
        randomEvent: 'Random event',
        continue: 'Continue'
      },
      jobs: {
        'Agriculteur': 'Farmer',
        'Aide-soignant': 'Care Assistant',
        'Agent d\'entretien': 'Maintenance Worker',
        'Architecte': 'Architect',
        'Avocat': 'Lawyer',
        'Boulanger': 'Baker',
        'Caissier': 'Cashier',
        'Cariste': 'Forklift Operator',
        'Charpentier': 'Carpenter',
        'Chef de projet': 'Project Manager',
        'Chauffeur poids lourd': 'Truck Driver',
        'Coiffeur': 'Hairdresser',
        'Comptable': 'Accountant',
        'Cuisinier': 'Cook',
        'Développeur': 'Developer',
        'Electricien': 'Electrician',
        'Employé de bureau': 'Office Employee',
        'Enseignant': 'Teacher',
        'Facteur': 'Mailman',
        'Ingénieur': 'Engineer',
        'Infirmier': 'Nurse',
        'Journaliste': 'Journalist',
        'Magasinier': 'Warehouse Worker',
        'Maçon': 'Mason',
        'Médecin': 'Doctor',
        'Ouvrier du bâtiment': 'Construction Worker',
        'Pharmacien': 'Pharmacist',
        'Plombier': 'Plumber',
        'Policier': 'Police Officer',
        'Serveur': 'Waiter',
        'Secrétaire': 'Secretary',
        'Soudeur': 'Welder',
        'Technicien': 'Technician',
        'Vendeur': 'Salesperson',
        'SMIC': 'Minimum Wage',
        'SMIC x2': 'Minimum Wage x2',
        'SMIC x3': 'Minimum Wage x3'
      },
      accessibility: {
        toggleTheme: 'Toggle theme',
        toggleLanguage: 'Change language',
        toggleHighContrast: 'High contrast mode',
        toggleScreenReader: 'Screen reader support',
        skipToContent: 'Skip to main content',
        skipToNavigation: 'Skip to navigation',
        screenReaderEnabled: 'Screen reader enabled',
        highContrastEnabled: 'High contrast mode enabled',
        reducedMotionEnabled: 'Reduced motion enabled',
        keyboardNavigationEnabled: 'Keyboard navigation enabled'
      }
    }
  };

  constructor() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY) as Language;
    if (savedLanguage) {
      this.language.set(savedLanguage);
    }
  }

  setLanguage(language: Language): void {
    this.language.set(language);
    localStorage.setItem(this.LANGUAGE_KEY, language);
  }

  toggleLanguage(): void {
    const current = this.language();
    this.setLanguage(current === 'fr' ? 'en' : 'fr');
  }

  // Get translation by key path (e.g., 'common.welcome' or 'startup.tagline')
  translate(key: string): string {
    const keys = key.split('.');
    let current: any = this.translations[this.language()];
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        console.warn(`Translation key not found: ${key} for language ${this.language()}`);
        return key; // Return the key itself if translation not found
      }
    }
    
    return typeof current === 'string' ? current : key;
  }

  // Shorthand method for translation (commonly used as 't')
  t(key: string): string {
    return this.translate(key);
  }

  // Get current language label
  getLanguageLabel(): string {
    return this.language() === 'fr' ? 'Français' : 'English';
  }

  // Get current language flag/icon
  getLanguageIcon(): string {
    return 'pi pi-flag';
  }

  // Add or update translations dynamically
  addTranslations(language: Language, translations: Partial<Translations>): void {
    const currentTranslations = this.translations[language] as Translations;
    this.translations[language] = {
      ...currentTranslations,
      ...translations
    } as Translations;
  }

  // Get all available languages
  getAvailableLanguages(): { code: Language; label: string; icon: string }[] {
    return [
      { code: 'fr', label: 'Français', icon: '🇫🇷' },
      { code: 'en', label: 'English', icon: '🇬🇧' }
    ];
  }

  // Format currency based on current language
  formatCurrency(amount: number): string {
    const locale = this.language() === 'fr' ? 'fr-FR' : 'en-US';
    const currency = this.language() === 'fr' ? 'EUR' : 'USD';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Format numbers based on current language
  formatNumber(value: number): string {
    const locale = this.language() === 'fr' ? 'fr-FR' : 'en-US';
    return new Intl.NumberFormat(locale).format(value);
  }
}