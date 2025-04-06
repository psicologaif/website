import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tooltip, TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-chi-sono',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './chi-sono.component.html',
  styleUrls: ['./chi-sono.component.css'],
})
export class ChiSonoComponent implements OnInit {
  tooltipOptions = {
    showDelay: 1,
    autoHide: true,
    hideDelay: 1,
    tooltipEvent: 'focus' as const,
    tooltipPosition: 'top' as const,
  };

  constructor() {}

  ngOnInit(): void {}

  focusElement(event: Event): void {
    event.stopPropagation();

    const element = event.currentTarget as HTMLElement;
    element.focus();
  }
}
