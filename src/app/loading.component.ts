import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {NgClass, NgIf} from '@angular/common';

export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';
export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'shimmer' | 'skeleton';

@Component({
  selector: 'app-loading',
  standalone: true,
    imports: [NgClass, NgIf],
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
    imports: [LoadingComponent, NgIf],
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
    <div class="financial-counter font-mono text-right" [ngClass]="getValueClasses()">
      <span class="currency text-sm opacity-75">{{ currency }}</span>
      <span class="value text-xl font-bold ml-1 tabular-nums" [attr.data-value]="animatedValue">
        {{ displayValue }}
      </span>
      <div *ngIf="showDifference && difference !== 0" 
           class="difference text-xs mt-1 transition-opacity duration-300"
           [ngClass]="getDifferenceClasses()">
        {{ difference > 0 ? '+' : '' }}{{ formatNumber(difference) }}{{ currency }}
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    
    .financial-counter {
      position: relative;
      overflow: hidden;
    }
    
    @keyframes countUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes countDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
    
    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 5px currentColor;
      }
      50% {
        box-shadow: 0 0 15px currentColor;
      }
    }
    
    .value-increased {
      animation: countUp 0.6s ease-out, pulse 0.3s ease-out 0.1s;
    }
    
    .value-decreased {
      animation: countDown 0.6s ease-out, pulse 0.3s ease-out 0.1s;
    }
    
    .value-glow {
      animation: glow 1s ease-in-out;
    }
    
    .difference {
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    /* Digital display effect */
    .digital-style .value {
      font-family: 'Courier New', monospace;
      background: rgba(0, 0, 0, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
      letter-spacing: 1px;
    }
    
    /* Smooth number transitions */
    .value {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `]
})
export class FinancialCounterComponent implements OnChanges, OnInit {
  @Input() value: number = 0;
  @Input() currency: string = '€';
  @Input() animate: boolean = true;
  @Input() showDifference: boolean = false;
  @Input() animationDuration: number = 1000;
  @Input() digitalStyle: boolean = false;
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() decimals: number = 0;
  @Input() glowOnChange: boolean = false;
  
  animatedValue: number = 0;
  private _previousValue: number = 0;
  private _animationState: 'idle' | 'increasing' | 'decreasing' = 'idle';
  private _animationFrame?: number;
  
  get displayValue(): string {
    return this.prefix + this.formatNumber(this.animatedValue) + this.suffix;
  }
  
  get difference(): number {
    return this.value - this._previousValue;
  }
  
  get isPositive(): boolean {
    return this.animatedValue > 0;
  }
  
  get isNegative(): boolean {
    return this.animatedValue < 0;
  }
  
  get hasChanged(): boolean {
    return this.value !== this._previousValue;
  }
  
  ngOnInit(): void {
    this.animatedValue = this.value;
    this._previousValue = this.value;
  }
  
  ngOnChanges(changes: any): void {
    if (changes.value && !changes.value.firstChange) {
      if (this.animate) {
        this.animateToValue(this.value);
      } else {
        this.animatedValue = this.value;
      }
    }
  }
  
  private animateToValue(targetValue: number): void {
    const startValue = this.animatedValue;
    const difference = targetValue - startValue;
    
    if (Math.abs(difference) < 0.01) {
      this.animatedValue = targetValue;
      return;
    }
    
    // Set animation state
    this._animationState = difference > 0 ? 'increasing' : 'decreasing';
    
    const startTime = performance.now();
    const duration = Math.min(this.animationDuration, Math.abs(difference) * 10); // Adaptive duration
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      this.animatedValue = startValue + (difference * easeOutCubic);
      
      if (progress < 1) {
        this._animationFrame = requestAnimationFrame(animate);
      } else {
        this.animatedValue = targetValue;
        this._previousValue = targetValue;
        this._animationState = 'idle';
        
        // Cancel any ongoing animation
        if (this._animationFrame) {
          cancelAnimationFrame(this._animationFrame);
        }
      }
    };
    
    this._animationFrame = requestAnimationFrame(animate);
  }
  
  getValueClasses(): string {
    let classes = '';
    
    if (this.digitalStyle) {
      classes += 'digital-style ';
    }
    
    if (this.isPositive) {
      classes += 'financial-positive ';
    } else if (this.isNegative) {
      classes += 'financial-negative ';
    } else {
      classes += 'financial-neutral ';
    }
    
    if (this._animationState === 'increasing') {
      classes += 'value-increased ';
    } else if (this._animationState === 'decreasing') {
      classes += 'value-decreased ';
    }
    
    if (this.glowOnChange && this._animationState !== 'idle') {
      classes += 'value-glow ';
    }
    
    return classes.trim();
  }
  
  getDifferenceClasses(): string {
    if (this.difference > 0) {
      return 'text-success-600 dark:text-success-400';
    } else if (this.difference < 0) {
      return 'text-error-600 dark:text-error-400';
    }
    return 'theme-text-muted';
  }
  
  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals
    }).format(Math.abs(value));
  }
  
  ngOnDestroy(): void {
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame);
    }
  }
}