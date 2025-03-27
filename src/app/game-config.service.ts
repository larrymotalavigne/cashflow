import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GameConfigService {
    jobs = [
        { label: 'Agriculteur', value: { minSalary: 25000, maxSalary: 30000, expenses: 20000 } },
        { label: 'Architecte', value: { minSalary: 35000, maxSalary: 45000, expenses: 28000 } },
        { label: 'Avocat', value: { minSalary: 40000, maxSalary: 55000, expenses: 30000 } },
        { label: 'Chef de projet', value: { minSalary: 35000, maxSalary: 45000, expenses: 28000 } },
        { label: 'Comptable', value: { minSalary: 30000, maxSalary: 40000, expenses: 25000 } },
        { label: 'Cuisinier', value: { minSalary: 25000, maxSalary: 30000, expenses: 20000 } },
        { label: 'Designer', value: { minSalary: 28000, maxSalary: 35000, expenses: 22000 } },
        { label: 'Développeur', value: { minSalary: 35000, maxSalary: 50000, expenses: 30000 } },
        { label: 'Economiste', value: { minSalary: 35000, maxSalary: 45000, expenses: 28000 } },
        { label: 'Enseignant', value: { minSalary: 30000, maxSalary: 40000, expenses: 25000 } },
        { label: 'Ingénieur', value: { minSalary: 40000, maxSalary: 55000, expenses: 35000 } },
        { label: 'Journaliste', value: { minSalary: 30000, maxSalary: 40000, expenses: 25000 } },
        { label: 'Médecin', value: { minSalary: 60000, maxSalary: 80000, expenses: 45000 } },
        { label: 'Pharmacien', value: { minSalary: 45000, maxSalary: 55000, expenses: 35000 } },
        { label: 'Plombier', value: { minSalary: 25000, maxSalary: 30000, expenses: 20000 } },
        { label: 'Professeur', value: { minSalary: 28000, maxSalary: 38000, expenses: 24000 } },
        { label: 'Psychologue', value: { minSalary: 30000, maxSalary: 40000, expenses: 25000 } },
        { label: 'Scientifique', value: { minSalary: 40000, maxSalary: 50000, expenses: 30000 } },
        { label: 'Technicien', value: { minSalary: 25000, maxSalary: 30000, expenses: 20000 } },
        { label: 'Vétérinaire', value: { minSalary: 30000, maxSalary: 40000, expenses: 25000 } }
    ];

    investments = [
        { name: 'Appartement', price: 2000, income: 200 },
        { name: 'Petite Entreprise', price: 5000, income: 500 },
        { name: 'Actions en Bourse', price: 3000, income: 300 },
        { name: 'Maison de ville', price: 150000, income: 12000 },
        { name: 'Villa', price: 300000, income: 20000 },
        { name: 'Immeuble de rapport', price: 500000, income: 35000 },
        { name: 'Local commercial', price: 250000, income: 18000 },
        { name: 'Terrain constructible', price: 100000, income: 0 },
        { name: 'SCPI', price: 10000, income: 600 },
        { name: 'Crowdfunding immobilier', price: 5000, income: 300 },
        { name: 'Société de private equity', price: 20000, income: 1500 },
        { name: 'Fonds immobilier', price: 15000, income: 1000 },
        { name: 'ETF Immobilier', price: 12000, income: 900 },
        { name: 'Actions Blue Chip', price: 20000, income: 1500 },
        { name: 'Actions Technologiques', price: 18000, income: 1400 },
        { name: 'Actions Biotech', price: 15000, income: 1200 },
        { name: 'Fonds indiciel', price: 10000, income: 800 },
        { name: "Obligations d'État", price: 5000, income: 300 },
        { name: "Obligations d'entreprise", price: 7000, income: 500 },
        { name: 'Crypto-monnaies', price: 3000, income: 0 },
        { name: 'Private equity fund', price: 25000, income: 1800 },
        { name: 'Capital risque', price: 20000, income: 1600 },
        { name: 'Fonds de pension', price: 10000, income: 700 },
        { name: 'Société cotée', price: 22000, income: 1700 },
        { name: 'Actions de croissance', price: 15000, income: 1300 },
        { name: 'Actions de valeur', price: 18000, income: 1400 },
        { name: 'Actions européennes', price: 20000, income: 1600 },
        { name: 'Actions mondiales', price: 25000, income: 1900 },
        { name: 'Fonds obligataire', price: 8000, income: 600 },
        { name: 'Fonds diversifié', price: 12000, income: 900 },
        { name: 'Immobilier de luxe', price: 1000000, income: 60000 },
        { name: 'Parking', price: 50000, income: 2500 },
        { name: 'Résidence seniors', price: 300000, income: 22000 }
    ];

    events = [
        { message: 'Réparation voiture: -500€', impact: -500 },
        { message: 'Bonus au travail: +1000€', impact: 1000 },
        { message: 'Taxe imprévue: -700€', impact: -700 },
        { message: 'Promotion au travail: +2000€', impact: 2000 },
        { message: 'Investissement réussi: +1500€', impact: 1500 },
        { message: 'Frais médicaux: -1200€', impact: -1200 },
        { message: 'Déménagement: -800€', impact: -800 },
        { message: 'Réduction d\'impôts: +600€', impact: 600 },
        { message: 'Amende de stationnement: -100€', impact: -100 },
        { message: 'Prime d\'année: +2500€', impact: 2500 },
        { message: 'Réparation maison: -900€', impact: -900 },
        { message: 'Panne d\'ascenseur: -400€', impact: -400 },
        { message: 'Remboursement bancaire: +800€', impact: 800 },
        { message: 'Frais de scolarité: -1500€', impact: -1500 },
        { message: 'Héritage: +5000€', impact: 5000 },
        { message: 'Dividende d\'actions: +700€', impact: 700 },
        { message: 'Frais juridiques: -1100€', impact: -1100 },
        { message: 'Vente d\'actifs: +1300€', impact: 1300 },
        { message: 'Rachat d\'entreprise: -3000€', impact: -3000 },
        { message: 'Gains de loterie: +10000€', impact: 10000 },
        { message: 'Dépenses imprévues: -600€', impact: -600 },
        { message: 'Rénovation: -2000€', impact: -2000 },
        { message: 'Aide gouvernementale: +900€', impact: 900 },
        { message: 'Perte sur investissement: -2500€', impact: -2500 },
        { message: 'Frais de voyage: -750€', impact: -750 },
        { message: 'Prime exceptionnelle: +3000€', impact: 3000 },
        { message: 'Cadeau d\'entreprise: +400€', impact: 400 },
        { message: 'Erreur comptable: -650€', impact: -650 },
        { message: 'Fonds de roulement: +1200€', impact: 1200 },
        { message: 'Crise économique: -3500€', impact: -3500 }
    ];

    randomNames = [
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
}