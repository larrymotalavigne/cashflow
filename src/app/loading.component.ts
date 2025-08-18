import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'shimmer' | 'skeleton';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgClass],
  template: `
    <!-- Spinner variant -->
    <div *ngIf="variant === 'spinner'" 
         [ngClass]="getSpinnerClasses()"
         class="loading-spin rounded-full border-2 border-current border-t-transparent">
    </div>
    
    <!-- Dots variant -->
    <div *ngIf="variant === 'dots'" class="flex items-center justify-center space-x-1">
      <div *ngFor="let dot of dots; let i = index" 
           [ngClass]="getDotClasses()"
           [style.animation-delay]="(i * 0.15) + 's'"
           class="bg-current rounded-full animate-bounce">
      </div>
    </div>
    
    <!-- Pulse variant -->
    <div *ngIf="variant === 'pulse'" 
         [ngClass]="getPulseClasses()"
         class="bg-primary-200 dark:bg-primary-800 rounded animate-pulse-soft">
    </div>
    
    <!-- Shimmer variant -->
    <div *ngIf="variant === 'shimmer'" 
         [ngClass]="getShimmerClasses()"
         class="loading-shimmer rounded">
    </div>
    
    <!-- Skeleton variant -->
    <div *ngIf="variant === 'skeleton'" class="space-y-2">
      <div class="loading-shimmer rounded h-4 w-3/4"></div>
      <div class="loading-shimmer rounded h-4 w-1/2"></div>
      <div class="loading-shimmer rounded h-4 w-5/6"></div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
        opacity: 0.4;
      }
      50% {
        transform: translateY(-8px);
        opacity: 1;
      }
    }
    
    .animate-bounce {
      animation: bounce 1.4s ease-in-out infinite;
    }
  `]
})
export class LoadingComponent {
  @Input() variant: LoadingVariant = 'spinner';
  @Input() size: LoadingSize = 'md';
  @Input() message?: string;

  dots = Array(3).fill(0); // For dots animation

  getSpinnerClasses(): string {
    const baseClasses = 'text-primary-500';
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    return `${baseClasses} ${sizeClasses[this.size]}`;
  }

  getDotClasses(): string {
    const baseClasses = 'text-primary-500';
    const sizeClasses = {
      sm: 'w-1 h-1',
      md: 'w-1.5 h-1.5',
      lg: 'w-2 h-2',
      xl: 'w-3 h-3'
    };
    return `${baseClasses} ${sizeClasses[this.size]}`;
  }

  getPulseClasses(): string {
    const sizeClasses = {
      sm: 'w-16 h-4',
      md: 'w-24 h-6',
      lg: 'w-32 h-8',
      xl: 'w-48 h-12'
    };
    return sizeClasses[this.size];
  }

  getShimmerClasses(): string {
    const sizeClasses = {
      sm: 'w-16 h-4',
      md: 'w-24 h-6',
      lg: 'w-32 h-8',
      xl: 'w-48 h-12'
    };
    return sizeClasses[this.size];
  }
}

// Loading overlay component for full-screen loading states
@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [LoadingComponent],
  template: `
    <div class="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div class="theme-bg-card theme-shadow-xl rounded-2xl p-8 max-w-sm mx-4 text-center animate-slide-up">
        <div class="flex justify-center mb-4">
          <app-loading [variant]="variant" [size]="size"></app-loading>
        </div>
        <h3 *ngIf="title" class="text-lg font-semibold theme-text-card mb-2">{{ title }}</h3>
        <p *ngIf="message" class="theme-text-muted text-sm">{{ message }}</p>
      </div>
    </div>
  `
})
export class LoadingOverlayComponent {
  @Input() variant: LoadingVariant = 'spinner';
  @Input() size: LoadingSize = 'lg';
  @Input() title?: string = 'Chargement...';
  @Input() message?: string;
}

// Financial counter component with animated value changes
@Component({
  selector: 'app-financial-counter',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="font-mono text-right" [ngClass]="getValueClasses()">
      <span class="text-sm opacity-75">{{ currency }}</span>
      <span class="text-xl font-bold ml-1 tabular-nums">{{ displayValue }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    @keyframes valueChange {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
    
    .value-changed {
      animation: valueChange 0.3s ease-out;
    }
  `]
})
export class FinancialCounterComponent {
  @Input() value: number = 0;
  @Input() currency: string = '€';
  @Input() animate: boolean = true;
  
  private _previousValue: number = 0;
  private _isAnimating: boolean = false;
  
  get displayValue(): string {
    return this.formatNumber(this.value);
  }
  
  get isPositive(): boolean {
    return this.value > 0;
  }
  
  get isNegative(): boolean {
    return this.value < 0;
  }
  
  get hasChanged(): boolean {
    return this.value !== this._previousValue;
  }
  
  ngOnChanges(): void {
    if (this.animate && this.hasChanged && this._previousValue !== 0) {
      this._isAnimating = true;
      setTimeout(() => {
        this._isAnimating = false;
      }, 300);
    }
    this._previousValue = this.value;
  }
  
  getValueClasses(): string {
    let classes = '';
    
    if (this.isPositive) {
      classes += 'financial-positive ';
    } else if (this.isNegative) {
      classes += 'financial-negative ';
    } else {
      classes += 'financial-neutral ';
    }
    
    if (this._isAnimating) {
      classes += 'value-changed ';
    }
    
    return classes.trim();
  }
  
  private formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(value));
  }
}