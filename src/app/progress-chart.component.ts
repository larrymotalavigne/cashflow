import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { GameService } from './game.service';

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule, ChartModule],
  template: `<p-chart type="line" [data]="chartData" [options]="chartOptions"></p-chart>`
})
export class ProgressChartComponent {
  private game = inject(GameService);

  chartData = {
    labels: [] as string[],
    datasets: [
      {
        label: 'Cash',
        data: [] as number[],
        fill: false,
        tension: 0.4
      },
      {
        label: 'Revenu',
        data: [] as number[],
        fill: false,
        tension: 0.4
      },
      {
        label: 'Dépenses',
        data: [] as number[],
        fill: false,
        tension: 0.4
      }
    ]
  };

  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Évolution financière annuelle'
      }
    }
  };

  constructor() {
    this.updateData(); // initial

    this.game.turnEnded.subscribe(() => {
      this.updateData();
    });
  }

  updateData() {
    const yearLabel = `Âge ${this.game.age}`;

    const labels = [...this.chartData.labels, yearLabel];

    const cashData = [...this.chartData.datasets[0].data, this.game.cash];
    const revenuData = [...this.chartData.datasets[1].data, this.game.income + this.game.passiveIncome];
    const depensesData = [...this.chartData.datasets[2].data, this.game.expenses];

    this.chartData = {
      ...this.chartData,
      labels,
      datasets: [
        {
          ...this.chartData.datasets[0],
          data: cashData
        },
        {
          ...this.chartData.datasets[1],
          data: revenuData
        },
        {
          ...this.chartData.datasets[2],
          data: depensesData
        }
      ]
    };
  }
}
