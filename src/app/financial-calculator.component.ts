import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";
import { TabViewModule } from "primeng/tabview";
import { TooltipModule } from "primeng/tooltip";
import { SliderModule } from "primeng/slider";
import { ChartModule } from "primeng/chart";
import { SelectModule } from "primeng/select";
import { FinancialCounterComponent } from "./loading.component";

interface CalculationResult {
  result: number;
  breakdown: { label: string; value: number }[];
  chart?: any;
}

@Component({
  selector: "app-financial-calculator",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputNumberModule,
    TabViewModule,
    TooltipModule,
    SliderModule,
    ChartModule,
    SelectModule,
    FinancialCounterComponent,
  ],
  template: `
    <p-card class="financial-calculator theme-bg-card theme-shadow-lg">
      <ng-template pTemplate="header">
        <div class="flex justify-content-between align-items-center p-3">
          <h3 class="m-0 theme-text-card flex items-center">
            <i
              class="pi pi-calculator mr-2 text-primary-600 dark:text-primary-400"
            ></i>
            Calculateurs Financiers
          </h3>
          <p-button
            icon="pi pi-refresh"
            (click)="resetAll()"
            class="p-button-outlined p-button-sm"
            pTooltip="Réinitialiser tous les calculateurs"
          >
          </p-button>
        </div>
      </ng-template>

      <ng-template pTemplate="content">
        <p-tabView>
          <!-- ROI Calculator -->
          <p-tabPanel header="Calculateur ROI" leftIcon="pi pi-chart-line">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="calculator-inputs">
                <h4 class="theme-text-primary mb-4">
                  Paramètres d'investissement
                </h4>

                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Montant initial (€)
                    </label>
                    <p-inputNumber
                      [(ngModel)]="roiCalc.initialAmount"
                      (onInput)="calculateROI()"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      [min]="0"
                      class="w-full"
                    >
                    </p-inputNumber>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Revenus mensuels (€)
                    </label>
                    <p-inputNumber
                      [(ngModel)]="roiCalc.monthlyIncome"
                      (onInput)="calculateROI()"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      [min]="0"
                      class="w-full"
                    >
                    </p-inputNumber>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Durée (années): {{ roiCalc.years }}
                    </label>
                    <p-slider
                      [(ngModel)]="roiCalc.years"
                      (onSlideEnd)="calculateROI()"
                      [min]="1"
                      [max]="30"
                      [step]="1"
                    >
                    </p-slider>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Coûts annuels (€)
                    </label>
                    <p-inputNumber
                      [(ngModel)]="roiCalc.annualCosts"
                      (onInput)="calculateROI()"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      [min]="0"
                      class="w-full"
                    >
                    </p-inputNumber>
                  </div>
                </div>
              </div>

              <div class="calculator-results">
                <h4 class="theme-text-primary mb-4">Résultats</h4>

                <div class="space-y-4">
                  <div class="result-card p-4 theme-bg-muted rounded-lg">
                    <div class="text-center">
                      <div
                        class="text-2xl font-bold mb-2"
                        [ngClass]="getROIColorClass(roiResult.result)"
                      >
                        {{ roiResult.result.toFixed(2) }}%
                      </div>
                      <div class="text-sm theme-text-muted">ROI Annuel</div>
                    </div>
                  </div>

                  <div class="breakdown space-y-2">
                    <div
                      *ngFor="let item of roiResult.breakdown"
                      class="flex justify-between items-center p-2 theme-bg-card rounded"
                    >
                      <span class="text-sm theme-text-primary">{{
                        item.label
                      }}</span>
                      <app-financial-counter
                        [value]="item.value"
                        [animate]="false"
                        class="text-sm font-medium"
                      >
                      </app-financial-counter>
                    </div>
                  </div>

                  <div
                    class="interpretation p-3 rounded-lg"
                    [ngClass]="getROIInterpretationClass(roiResult.result)"
                  >
                    <div class="text-sm font-medium mb-1">
                      {{ getROIInterpretation(roiResult.result).title }}
                    </div>
                    <div class="text-xs">
                      {{ getROIInterpretation(roiResult.result).description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </p-tabPanel>

          <!-- Payback Period Calculator -->
          <p-tabPanel header="Temps de Rentabilité" leftIcon="pi pi-clock">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="calculator-inputs">
                <h4 class="theme-text-primary mb-4">
                  Paramètres d'investissement
                </h4>

                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Investissement initial (€)
                    </label>
                    <p-inputNumber
                      [(ngModel)]="paybackCalc.investment"
                      (onInput)="calculatePayback()"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      [min]="0"
                      class="w-full"
                    >
                    </p-inputNumber>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Cash-flow mensuel (€)
                    </label>
                    <p-inputNumber
                      [(ngModel)]="paybackCalc.monthlyCashFlow"
                      (onInput)="calculatePayback()"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      class="w-full"
                    >
                    </p-inputNumber>
                  </div>
                </div>
              </div>

              <div class="calculator-results">
                <h4 class="theme-text-primary mb-4">Période de Rentabilité</h4>

                <div class="text-center space-y-4">
                  <div class="result-card p-6 theme-bg-muted rounded-lg">
                    <div class="text-3xl font-bold theme-text-primary mb-2">
                      {{ paybackResult.result.toFixed(1) }}
                    </div>
                    <div class="text-sm theme-text-muted">mois</div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 text-center">
                    <div class="p-3 theme-bg-card rounded">
                      <div class="text-lg font-semibold theme-text-primary">
                        {{ (paybackResult.result / 12).toFixed(1) }}
                      </div>
                      <div class="text-xs theme-text-muted">années</div>
                    </div>
                    <div class="p-3 theme-bg-card rounded">
                      <div class="text-lg font-semibold theme-text-primary">
                        {{ Math.floor(paybackResult.result / 12) }}a
                        {{ Math.round(paybackResult.result % 12) }}m
                      </div>
                      <div class="text-xs theme-text-muted">détaillé</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </p-tabPanel>

          <!-- Compound Interest Calculator -->
          <p-tabPanel header="Intérêts Composés" leftIcon="pi pi-chart-bar">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="calculator-inputs">
                <h4 class="theme-text-primary mb-4">Paramètres d'épargne</h4>

                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Capital initial (€)
                    </label>
                    <p-inputNumber
                      [(ngModel)]="compoundCalc.principal"
                      (onInput)="calculateCompound()"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      [min]="0"
                      class="w-full"
                    >
                    </p-inputNumber>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Épargne mensuelle (€)
                    </label>
                    <p-inputNumber
                      [(ngModel)]="compoundCalc.monthlyContribution"
                      (onInput)="calculateCompound()"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      [min]="0"
                      class="w-full"
                    >
                    </p-inputNumber>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Taux d'intérêt annuel (%): {{ compoundCalc.interestRate }}
                    </label>
                    <p-slider
                      [(ngModel)]="compoundCalc.interestRate"
                      (onSlideEnd)="calculateCompound()"
                      [min]="0.1"
                      [max]="15"
                      [step]="0.1"
                    >
                    </p-slider>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Durée (années): {{ compoundCalc.years }}
                    </label>
                    <p-slider
                      [(ngModel)]="compoundCalc.years"
                      (onSlideEnd)="calculateCompound()"
                      [min]="1"
                      [max]="40"
                      [step]="1"
                    >
                    </p-slider>
                  </div>
                </div>
              </div>

              <div class="calculator-results">
                <h4 class="theme-text-primary mb-4">Projection</h4>

                <div class="space-y-4">
                  <div
                    class="result-card p-4 theme-bg-muted rounded-lg text-center"
                  >
                    <div
                      class="text-2xl font-bold text-success-600 dark:text-success-400 mb-1"
                    >
                      {{ formatCurrency(compoundResult.result) }}
                    </div>
                    <div class="text-sm theme-text-muted">Valeur finale</div>
                  </div>

                  <div class="breakdown space-y-2">
                    <div
                      *ngFor="let item of compoundResult.breakdown"
                      class="flex justify-between items-center p-2 theme-bg-card rounded"
                    >
                      <span class="text-sm theme-text-primary">{{
                        item.label
                      }}</span>
                      <span class="text-sm font-medium theme-text-primary">{{
                        formatCurrency(item.value)
                      }}</span>
                    </div>
                  </div>

                  <div *ngIf="compoundResult.chart" class="chart-container">
                    <p-chart
                      type="line"
                      [data]="compoundResult.chart"
                      [options]="chartOptions"
                      height="200px"
                    >
                    </p-chart>
                  </div>
                </div>
              </div>
            </div>
          </p-tabPanel>

          <!-- Loan Calculator -->
          <p-tabPanel
            header="Calculateur d'Emprunt"
            leftIcon="pi pi-credit-card"
          >
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="calculator-inputs">
                <h4 class="theme-text-primary mb-4">Paramètres de l'emprunt</h4>

                <div class="space-y-4">
                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Montant emprunté (€)
                    </label>
                    <p-inputNumber
                      [(ngModel)]="loanCalc.amount"
                      (onInput)="calculateLoan()"
                      mode="currency"
                      currency="EUR"
                      locale="fr-FR"
                      [min]="0"
                      class="w-full"
                    >
                    </p-inputNumber>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Taux d'intérêt annuel (%): {{ loanCalc.interestRate }}
                    </label>
                    <p-slider
                      [(ngModel)]="loanCalc.interestRate"
                      (onSlideEnd)="calculateLoan()"
                      [min]="0.5"
                      [max]="12"
                      [step]="0.1"
                    >
                    </p-slider>
                  </div>

                  <div>
                    <label
                      class="block text-sm font-medium theme-text-primary mb-2"
                    >
                      Durée (années): {{ loanCalc.years }}
                    </label>
                    <p-slider
                      [(ngModel)]="loanCalc.years"
                      (onSlideEnd)="calculateLoan()"
                      [min]="1"
                      [max]="30"
                      [step]="1"
                    >
                    </p-slider>
                  </div>
                </div>
              </div>

              <div class="calculator-results">
                <h4 class="theme-text-primary mb-4">Détails de l'emprunt</h4>

                <div class="space-y-4">
                  <div
                    class="result-card p-4 theme-bg-muted rounded-lg text-center"
                  >
                    <div class="text-2xl font-bold theme-text-primary mb-1">
                      {{ formatCurrency(loanResult.result) }}
                    </div>
                    <div class="text-sm theme-text-muted">Mensualité</div>
                  </div>

                  <div class="breakdown space-y-2">
                    <div
                      *ngFor="let item of loanResult.breakdown"
                      class="flex justify-between items-center p-2 theme-bg-card rounded"
                    >
                      <span class="text-sm theme-text-primary">{{
                        item.label
                      }}</span>
                      <span class="text-sm font-medium theme-text-primary">{{
                        formatCurrency(item.value)
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </p-tabPanel>
        </p-tabView>
      </ng-template>
    </p-card>
  `,
  styles: [
    `
      .financial-calculator {
        max-width: 1200px;
        margin: 0 auto;
      }

      .calculator-inputs,
      .calculator-results {
        min-height: 400px;
      }

      .result-card {
        border: 1px solid var(--color-border);
      }

      .breakdown {
        max-height: 300px;
        overflow-y: auto;
      }

      .chart-container {
        height: 200px;
      }

      /* Custom slider styling */
      :host ::ng-deep .p-slider .p-slider-range {
        background: var(--color-primary);
      }

      :host ::ng-deep .p-slider .p-slider-handle {
        background: var(--color-primary);
        border-color: var(--color-primary);
      }

      .interpretation {
        border: 1px solid var(--color-border);
      }
    `,
  ],
})
export class FinancialCalculatorComponent implements OnInit {
  // ROI Calculator
  roiCalc = {
    initialAmount: 100000,
    monthlyIncome: 800,
    years: 10,
    annualCosts: 2000,
  };
  roiResult: CalculationResult = { result: 0, breakdown: [] };

  // Payback Calculator
  paybackCalc = {
    investment: 50000,
    monthlyCashFlow: 400,
  };
  paybackResult: CalculationResult = { result: 0, breakdown: [] };

  // Compound Interest Calculator
  compoundCalc = {
    principal: 10000,
    monthlyContribution: 500,
    interestRate: 7,
    years: 20,
  };
  compoundResult: CalculationResult = { result: 0, breakdown: [] };

  // Loan Calculator
  loanCalc = {
    amount: 200000,
    interestRate: 3.5,
    years: 25,
  };
  loanResult: CalculationResult = { result: 0, breakdown: [] };

  chartOptions: any = {};

  ngOnInit() {
    this.initializeChartOptions();
    this.calculateAll();
  }

  private initializeChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Années",
          },
        },
        y: {
          title: {
            display: true,
            text: "Montant (€)",
          },
          ticks: {
            callback: (value: any) => this.formatCurrency(value),
          },
        },
      },
    };
  }

  calculateROI() {
    const { initialAmount, monthlyIncome, years, annualCosts } = this.roiCalc;

    const totalIncome = monthlyIncome * 12 * years;
    const totalCosts = annualCosts * years;
    const netIncome = totalIncome - totalCosts;
    const roi = ((netIncome / initialAmount) * 100) / years;

    this.roiResult = {
      result: roi,
      breakdown: [
        { label: "Revenus totaux", value: totalIncome },
        { label: "Coûts totaux", value: totalCosts },
        { label: "Bénéfice net", value: netIncome },
        { label: "Investissement initial", value: initialAmount },
      ],
    };
  }

  calculatePayback() {
    const { investment, monthlyCashFlow } = this.paybackCalc;

    if (monthlyCashFlow <= 0) {
      this.paybackResult = { result: 0, breakdown: [] };
      return;
    }

    const months = investment / monthlyCashFlow;

    this.paybackResult = {
      result: months,
      breakdown: [
        { label: "Investissement", value: investment },
        { label: "Cash-flow mensuel", value: monthlyCashFlow },
      ],
    };
  }

  calculateCompound() {
    const { principal, monthlyContribution, interestRate, years } =
      this.compoundCalc;

    const monthlyRate = interestRate / 100 / 12;
    const months = years * 12;

    // Future value of principal
    const principalFV = principal * Math.pow(1 + monthlyRate, months);

    // Future value of monthly contributions (annuity)
    const contributionsFV =
      monthlyContribution *
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    const totalValue = principalFV + contributionsFV;
    const totalContributions = principal + monthlyContribution * months;
    const interestEarned = totalValue - totalContributions;

    // Generate chart data
    const chartData = this.generateCompoundChart();

    this.compoundResult = {
      result: totalValue,
      breakdown: [
        { label: "Capital initial", value: principal },
        { label: "Contributions totales", value: monthlyContribution * months },
        { label: "Intérêts gagnés", value: interestEarned },
        { label: "Total investi", value: totalContributions },
      ],
      chart: chartData,
    };
  }

  calculateLoan() {
    const { amount, interestRate, years } = this.loanCalc;

    const monthlyRate = interestRate / 100 / 12;
    const months = years * 12;

    const monthlyPayment =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - amount;

    this.loanResult = {
      result: monthlyPayment,
      breakdown: [
        { label: "Montant emprunté", value: amount },
        { label: "Total à rembourser", value: totalPayment },
        { label: "Intérêts totaux", value: totalInterest },
        { label: "Durée (mois)", value: months },
      ],
    };
  }

  private generateCompoundChart(): any {
    const { principal, monthlyContribution, interestRate, years } =
      this.compoundCalc;
    const monthlyRate = interestRate / 100 / 12;

    const labels: string[] = [];
    const principalData: number[] = [];
    const contributionsData: number[] = [];
    const interestData: number[] = [];

    for (let year = 0; year <= years; year++) {
      const months = year * 12;
      labels.push(year.toString());

      // Principal growth
      const principalValue = principal * Math.pow(1 + monthlyRate, months);
      principalData.push(principalValue);

      // Contributions value
      const contributionsValue =
        year === 0
          ? 0
          : monthlyContribution *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      contributionsData.push(contributionsValue);

      // Interest earned
      const totalContributions = principal + monthlyContribution * months;
      const totalValue = principalValue + contributionsValue;
      interestData.push(Math.max(0, totalValue - totalContributions));
    }

    return {
      labels,
      datasets: [
        {
          label: "Capital initial",
          data: principalData,
          borderColor: "#3b82f6",
          backgroundColor: "#3b82f620",
          fill: false,
        },
        {
          label: "Contributions",
          data: contributionsData,
          borderColor: "#22c55e",
          backgroundColor: "#22c55e20",
          fill: false,
        },
        {
          label: "Intérêts",
          data: interestData,
          borderColor: "#f59e0b",
          backgroundColor: "#f59e0b20",
          fill: false,
        },
      ],
    };
  }

  calculateAll() {
    this.calculateROI();
    this.calculatePayback();
    this.calculateCompound();
    this.calculateLoan();
  }

  resetAll() {
    this.roiCalc = {
      initialAmount: 100000,
      monthlyIncome: 800,
      years: 10,
      annualCosts: 2000,
    };

    this.paybackCalc = {
      investment: 50000,
      monthlyCashFlow: 400,
    };

    this.compoundCalc = {
      principal: 10000,
      monthlyContribution: 500,
      interestRate: 7,
      years: 20,
    };

    this.loanCalc = {
      amount: 200000,
      interestRate: 3.5,
      years: 25,
    };

    this.calculateAll();
  }

  getROIColorClass(roi: number): string {
    if (roi > 10) return "text-success-600 dark:text-success-400";
    if (roi > 5) return "text-primary-600 dark:text-primary-400";
    if (roi > 0) return "text-warning-600 dark:text-warning-400";
    return "text-error-600 dark:text-error-400";
  }

  getROIInterpretationClass(roi: number): string {
    if (roi > 10)
      return "bg-success-100 dark:bg-success-900/20 border-success-500";
    if (roi > 5)
      return "bg-primary-100 dark:bg-primary-900/20 border-primary-500";
    if (roi > 0)
      return "bg-warning-100 dark:bg-warning-900/20 border-warning-500";
    return "bg-error-100 dark:bg-error-900/20 border-error-500";
  }

  getROIInterpretation(roi: number): { title: string; description: string } {
    if (roi > 15)
      return {
        title: "🚀 Excellent investissement",
        description: "ROI très élevé, mais vérifiez les risques associés.",
      };
    if (roi > 10)
      return {
        title: "✅ Très bon investissement",
        description: "ROI solide, bien au-dessus de la moyenne du marché.",
      };
    if (roi > 5)
      return {
        title: "👍 Bon investissement",
        description: "ROI correct, comparable aux investissements standards.",
      };
    if (roi > 0)
      return {
        title: "⚠️ Investissement marginal",
        description: "ROI faible, considérez d'autres opportunités.",
      };
    return {
      title: "❌ Investissement non rentable",
      description: "ROI négatif, évitez cet investissement.",
    };
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  protected readonly Math = Math;
}
