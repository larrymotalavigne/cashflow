import {Injectable, inject} from '@angular/core';
import {GameService} from './game.service';
import {TranslationService} from './translation.service';

export interface ExportData {
    playerName: string;
    finalAge: number;
    finalCash: number;
    finalIncome: number;
    finalPassiveIncome: number;
    totalInvestments: number;
    totalTurns: number;
    winCondition: boolean;
    exportDate: string;
}

@Injectable({
    providedIn: 'root'
})
export class ExportService {
    private gameService = inject(GameService);
    private translationService = inject(TranslationService);

    /**
     * Export game history to CSV format
     */
    exportToCSV(): void {
        const history = this.gameService.turnHistory;
        if (history.length === 0) {
            console.warn('No turn history to export');
            return;
        }

        // CSV Headers
        const headers = [
            'Turn',
            'Age',
            'Cash Before',
            'Cash After',
            'Income',
            'Expenses',
            'Passive Income',
            'Net Cash Flow',
            'Events',
            'Investments Purchased',
            'Date'
        ];

        // Convert history to CSV rows
        const rows = history.map(entry => [
            entry.turnNumber,
            entry.age,
            entry.cashBefore,
            entry.cashAfter,
            entry.income,
            entry.expenses,
            entry.passiveIncome,
            entry.cashAfter - entry.cashBefore,
            entry.events.map(e => e.message).join('; '),
            entry.investmentsPurchased.map(i => i.name).join('; '),
            entry.date
        ]);

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell =>
                typeof cell === 'string' && cell.includes(',')
                    ? `"${cell.replace(/"/g, '""')}"`
                    : cell
            ).join(','))
        ].join('\n');

        // Download the CSV file
        this.downloadFile(csvContent, `cashflow-history-${this.gameService.name}-${new Date().toISOString()}.csv`, 'text/csv');
    }

    /**
     * Export game summary report as text file
     */
    exportSummaryReport(): void {
        const report = this.generateSummaryReport();
        this.downloadFile(report, `cashflow-summary-${this.gameService.name}-${new Date().toISOString()}.txt`, 'text/plain');
    }

    /**
     * Export complete game data as JSON
     */
    exportToJSON(): void {
        const exportData: ExportData = {
            playerName: this.gameService.name,
            finalAge: this.gameService.age,
            finalCash: this.gameService.cash,
            finalIncome: this.gameService.income,
            finalPassiveIncome: this.gameService.passiveIncome,
            totalInvestments: this.gameService.investments.length,
            totalTurns: this.gameService.turnHistory.length,
            winCondition: this.gameService.passiveIncome > this.gameService.expenses,
            exportDate: new Date().toISOString()
        };

        const jsonContent = JSON.stringify({
            summary: exportData,
            turnHistory: this.gameService.turnHistory,
            investments: this.gameService.investments,
            retirementAccounts: this.gameService.retirementAccounts
        }, null, 2);

        this.downloadFile(jsonContent, `cashflow-complete-${this.gameService.name}-${new Date().toISOString()}.json`, 'application/json');
    }

    /**
     * Generate a formatted summary report
     */
    private generateSummaryReport(): string {
        const game = this.gameService;
        const history = game.turnHistory;
        const wonGame = game.passiveIncome > game.expenses;

        const report = `
╔════════════════════════════════════════════════════════════════╗
║              CASHFLOW GAME - FINANCIAL SUMMARY                 ║
╚════════════════════════════════════════════════════════════════╝

Player Information
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Name: ${game.name}
  Final Age: ${game.age} years
  Game Status: ${wonGame ? '🏆 ACHIEVED FINANCIAL FREEDOM!' : '⏳ In Progress'}
  Total Turns Played: ${history.length}
  Report Generated: ${new Date().toLocaleString()}

Financial Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cash on Hand: €${game.cash.toLocaleString()}
  Monthly Income: €${game.income.toLocaleString()}
  Monthly Expenses: €${game.expenses.toLocaleString()}
  Monthly Passive Income: €${game.passiveIncome.toLocaleString()}
  Net Monthly Cash Flow: €${(game.income + game.passiveIncome - game.expenses).toLocaleString()}

  Income Coverage Ratio: ${((game.passiveIncome / game.expenses) * 100).toFixed(1)}%
  ${wonGame ? '  ✓ Passive income exceeds expenses!' : '  ✗ Passive income does not yet cover expenses'}

Investment Portfolio
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Investments: ${game.investments.length}
  Total Investment Value: €${game.investments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
  Total Monthly Returns: €${game.investments.reduce((sum, inv) => sum + inv.income, 0).toLocaleString()}

  Investment Breakdown:
${game.investments.map(inv => `    • ${inv.name} - €${inv.amount.toLocaleString()} (€${inv.income}/month)`).join('\n')}

Performance Statistics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Starting Cash: €${history.length > 0 ? history[0].cashBefore.toLocaleString() : '0'}
  Current Cash: €${game.cash.toLocaleString()}
  Net Worth Change: €${(game.cash - (history.length > 0 ? history[0].cashBefore : 0)).toLocaleString()}

  Average Cash Flow per Turn: €${history.length > 0 ? Math.round(history.reduce((sum, entry) => sum + (entry.cashAfter - entry.cashBefore), 0) / history.length).toLocaleString() : '0'}
  Total Investments Purchased: ${history.reduce((sum, entry) => sum + entry.investmentsPurchased.length, 0)}
  Total Random Events: ${history.reduce((sum, entry) => sum + entry.events.length, 0)}

Retirement Planning
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Retirement Accounts: ${game.retirementAccounts.length}
  Total Retirement Savings: €${game.retirementAccounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
  ${game.retirementPlan ? `Target Retirement Age: ${game.retirementPlan.targetAge}` : 'No retirement plan set'}

Turn-by-Turn History (Last 10 Turns)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${history.slice(-10).map(entry => `
  Turn ${entry.turnNumber} (Age ${entry.age})
  ────────────────────────────────────────────
    Cash: €${entry.cashBefore.toLocaleString()} → €${entry.cashAfter.toLocaleString()} (${entry.cashAfter > entry.cashBefore ? '+' : ''}€${(entry.cashAfter - entry.cashBefore).toLocaleString()})
    Income: €${entry.income.toLocaleString()} | Expenses: €${entry.expenses.toLocaleString()} | Passive: €${entry.passiveIncome.toLocaleString()}
    ${entry.events.length > 0 ? `Events: ${entry.events.map(e => e.message).join(', ')}` : 'Events: None'}
    ${entry.investmentsPurchased.length > 0 ? `Purchased: ${entry.investmentsPurchased.map(i => i.name).join(', ')}` : 'Purchases: None'}
`).join('\n')}

${wonGame ? `
╔════════════════════════════════════════════════════════════════╗
║  🎉 CONGRATULATIONS ON ACHIEVING FINANCIAL FREEDOM! 🎉         ║
║                                                                ║
║  You have successfully built a passive income stream that     ║
║  exceeds your monthly expenses. You are now financially free!  ║
╚════════════════════════════════════════════════════════════════╝
` : `
╔════════════════════════════════════════════════════════════════╗
║  Keep building your passive income to achieve financial freedom ║
║  Current goal: €${game.expenses}/month in passive income              ║
║  You're ${((game.passiveIncome / game.expenses) * 100).toFixed(1)}% of the way there!                    ║
╚════════════════════════════════════════════════════════════════╝
`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
End of Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        return report;
    }

    /**
     * Helper method to download a file
     */
    private downloadFile(content: string, filename: string, mimeType: string): void {
        const blob = new Blob([content], {type: mimeType});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}
