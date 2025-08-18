import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Investment } from './data';
import { EnhancedInvestmentCardComponent } from './enhanced-investment-card.component';

@Component({
  selector: 'app-investment-carousel',
  standalone: true,
  imports: [CommonModule, ButtonModule, EnhancedInvestmentCardComponent],
  template: `
    <div class="investment-carousel-container relative">
      <!-- Mobile Carousel (visible on small screens) -->
      <div class="block md:hidden">
        <div class="relative">
          <!-- Carousel wrapper -->
          <div class="overflow-hidden rounded-lg" #carouselWrapper>
            <div 
              class="flex transition-transform duration-300 ease-in-out"
              [style.transform]="'translateX(' + (-currentIndex * 100) + '%)'"
              #carouselTrack
              (touchstart)="onTouchStart($event)"
              (touchmove)="onTouchMove($event)"
              (touchend)="onTouchEnd($event)"
              (mousedown)="onMouseStart($event)"
              (mousemove)="onMouseMove($event)"
              (mouseup)="onMouseEnd($event)"
              (mouseleave)="onMouseEnd($event)"
            >
              <div 
                *ngFor="let investment of investments; let i = index"
                class="w-full flex-shrink-0 px-2"
              >
                <app-enhanced-investment-card
                  [investment]="investment"
                  [comparisonMode]="comparisonMode"
                  [isSelected]="isSelected(investment)"
                  (buy)="onBuy($event)"
                  (buyWithLoan)="onBuyWithLoan($event)"
                  (reject)="onReject($event)"
                  (compare)="onCompare($event)"
                  (selectionChange)="onSelectionChange($event)">
                </app-enhanced-investment-card>
              </div>
            </div>
          </div>

          <!-- Navigation arrows -->
          <div *ngIf="investments.length > 1" class="absolute inset-y-0 left-0 flex items-center">
            <p-button
              icon="pi pi-chevron-left"
              (click)="previousCard()"
              [disabled]="currentIndex === 0"
              styleClass="p-button-rounded p-button-text p-button-sm navigation-button left-nav"
              [style.opacity]="currentIndex === 0 ? '0.5' : '1'">
            </p-button>
          </div>
          
          <div *ngIf="investments.length > 1" class="absolute inset-y-0 right-0 flex items-center">
            <p-button
              icon="pi pi-chevron-right"
              (click)="nextCard()"
              [disabled]="currentIndex === investments.length - 1"
              styleClass="p-button-rounded p-button-text p-button-sm navigation-button right-nav"
              [style.opacity]="currentIndex === investments.length - 1 ? '0.5' : '1'">
            </p-button>
          </div>

          <!-- Indicators -->
          <div *ngIf="investments.length > 1" class="flex justify-center mt-4 space-x-2">
            <button
              *ngFor="let investment of investments; let i = index"
              (click)="goToCard(i)"
              class="w-2 h-2 rounded-full transition-all duration-200"
              [class.bg-primary-500]="i === currentIndex"
              [class.bg-gray-300]="i !== currentIndex"
              [class.dark:bg-primary-400]="i === currentIndex"
              [class.dark:bg-gray-600]="i !== currentIndex">
            </button>
          </div>

          <!-- Card counter -->
          <div class="text-center mt-2 text-sm theme-text-muted">
            {{ currentIndex + 1 }} / {{ investments.length }}
          </div>
        </div>
      </div>

      <!-- Desktop Grid (visible on medium and larger screens) -->
      <div class="hidden md:block">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <app-enhanced-investment-card
            *ngFor="let investment of investments"
            [investment]="investment"
            [comparisonMode]="comparisonMode"
            [isSelected]="isSelected(investment)"
            (buy)="onBuy($event)"
            (buyWithLoan)="onBuyWithLoan($event)"
            (reject)="onReject($event)"
            (compare)="onCompare($event)"
            (selectionChange)="onSelectionChange($event)">
          </app-enhanced-investment-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .investment-carousel-container {
      user-select: none;
    }
    
    .navigation-button {
      background: rgba(255, 255, 255, 0.9) !important;
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      min-width: 40px !important;
      min-height: 40px !important;
      z-index: 10;
    }
    
    .navigation-button:hover:not([disabled]) {
      background: rgba(255, 255, 255, 1) !important;
      transform: scale(1.05);
    }
    
    .left-nav {
      margin-left: 8px;
    }
    
    .right-nav {
      margin-right: 8px;
    }
    
    .dark .navigation-button {
      background: rgba(0, 0, 0, 0.8) !important;
      color: white !important;
    }
    
    .dark .navigation-button:hover:not([disabled]) {
      background: rgba(0, 0, 0, 0.9) !important;
    }

    /* Touch-friendly indicators */
    .indicator-dot {
      min-width: 44px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      touch-action: manipulation;
    }

    /* Smooth scrolling for touch devices */
    .carousel-track {
      touch-action: pan-x;
      -webkit-overflow-scrolling: touch;
    }
  `]
})
export class InvestmentCarouselComponent implements OnInit, AfterViewInit {
  @Input() investments: Investment[] = [];
  @Input() comparisonMode: boolean = false;
  @Input() selectedInvestments: Investment[] = [];

  @Output() buy = new EventEmitter<Investment>();
  @Output() buyWithLoan = new EventEmitter<Investment>();
  @Output() reject = new EventEmitter<Investment>();
  @Output() compare = new EventEmitter<Investment>();
  @Output() selectionChange = new EventEmitter<{investment: Investment, selected: boolean}>();

  @ViewChild('carouselWrapper', { static: false }) carouselWrapper!: ElementRef;
  @ViewChild('carouselTrack', { static: false }) carouselTrack!: ElementRef;

  currentIndex = 0;

  // Touch/mouse interaction properties
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private isDragging = false;
  private startTime = 0;
  private initialTransform = 0;

  ngOnInit() {
    // Initialize carousel at first card
    this.currentIndex = 0;
  }

  ngAfterViewInit() {
    // Auto-advance carousel on mobile for better UX (optional)
    // this.startAutoAdvance();
  }

  // Navigation methods
  nextCard() {
    if (this.currentIndex < this.investments.length - 1) {
      this.currentIndex++;
    }
  }

  previousCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  goToCard(index: number) {
    if (index >= 0 && index < this.investments.length) {
      this.currentIndex = index;
    }
  }

  // Touch event handlers
  onTouchStart(event: TouchEvent) {
    this.startInteraction(event.touches[0].clientX, event.touches[0].clientY);
  }

  onTouchMove(event: TouchEvent) {
    this.moveInteraction(event.touches[0].clientX, event.touches[0].clientY);
    if (this.isDragging) {
      event.preventDefault(); // Prevent scrolling while swiping
    }
  }

  onTouchEnd(event: TouchEvent) {
    this.endInteraction();
  }

  // Mouse event handlers (for desktop testing)
  onMouseStart(event: MouseEvent) {
    this.startInteraction(event.clientX, event.clientY);
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.moveInteraction(event.clientX, event.clientY);
      event.preventDefault();
    }
  }

  onMouseEnd(event: MouseEvent) {
    this.endInteraction();
  }

  private startInteraction(clientX: number, clientY: number) {
    this.startX = clientX;
    this.startY = clientY;
    this.startTime = Date.now();
    this.initialTransform = -this.currentIndex * 100;
  }

  private moveInteraction(clientX: number, clientY: number) {
    this.currentX = clientX;
    
    if (!this.isDragging) {
      const deltaX = Math.abs(clientX - this.startX);
      const deltaY = Math.abs(clientY - this.startY);
      
      // Only start dragging if horizontal movement is dominant
      if (deltaX > deltaY && deltaX > 10) {
        this.isDragging = true;
      }
    }

    if (this.isDragging) {
      const deltaX = clientX - this.startX;
      const containerWidth = this.carouselWrapper.nativeElement.clientWidth;
      const dragPercentage = (deltaX / containerWidth) * 100;
      
      // Apply transform with resistance at boundaries
      let newTransform = this.initialTransform + dragPercentage;
      
      // Add resistance at boundaries
      if (newTransform > 0) {
        newTransform = newTransform * 0.3; // Resistance when trying to go before first card
      } else if (newTransform < -(this.investments.length - 1) * 100) {
        const overflow = newTransform + (this.investments.length - 1) * 100;
        newTransform = -(this.investments.length - 1) * 100 + (overflow * 0.3);
      }

      this.carouselTrack.nativeElement.style.transform = `translateX(${newTransform}%)`;
      this.carouselTrack.nativeElement.style.transition = 'none';
    }
  }

  private endInteraction() {
    if (this.isDragging) {
      const deltaX = this.currentX - this.startX;
      const deltaTime = Date.now() - this.startTime;
      const velocity = Math.abs(deltaX) / Math.max(deltaTime, 1);

      // Determine if we should snap to next/previous card
      const containerWidth = this.carouselWrapper.nativeElement.clientWidth;
      const threshold = containerWidth * 0.3; // 30% of container width
      
      // Reset transition
      this.carouselTrack.nativeElement.style.transition = 'transform 0.3s ease-in-out';

      // Check if swipe distance or velocity is sufficient
      if (Math.abs(deltaX) > threshold || velocity > 0.5) {
        if (deltaX > 0 && this.currentIndex > 0) {
          // Swipe right - go to previous card
          this.previousCard();
        } else if (deltaX < 0 && this.currentIndex < this.investments.length - 1) {
          // Swipe left - go to next card
          this.nextCard();
        } else {
          // Snap back to current card
          this.carouselTrack.nativeElement.style.transform = `translateX(${-this.currentIndex * 100}%)`;
        }
      } else {
        // Snap back to current card
        this.carouselTrack.nativeElement.style.transform = `translateX(${-this.currentIndex * 100}%)`;
      }

      this.isDragging = false;
    }
  }

  private getCurrentTransform(): number {
    const matrix = window.getComputedStyle(this.carouselTrack.nativeElement).transform;
    if (matrix === 'none') return 0;
    
    const values = matrix.split('(')[1].split(')')[0].split(',');
    return parseFloat(values[4]) || 0;
  }

  // Event handlers for investment card actions
  isSelected(investment: Investment): boolean {
    return this.selectedInvestments.some(inv => inv.name === investment.name);
  }

  onBuy(investment: Investment) {
    this.buy.emit(investment);
  }

  onBuyWithLoan(investment: Investment) {
    this.buyWithLoan.emit(investment);
  }

  onReject(investment: Investment) {
    this.reject.emit(investment);
  }

  onCompare(investment: Investment) {
    this.compare.emit(investment);
  }

  onSelectionChange(event: {investment: Investment, selected: boolean}) {
    this.selectionChange.emit(event);
  }
}