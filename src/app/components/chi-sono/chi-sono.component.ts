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
  @ViewChild('tooltip') tooltip!: Tooltip;
  isMobile: boolean = false;
  showTooltip: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
  }

  focusElement(event: MouseEvent): void {
    event.stopPropagation();

    if (this.isMobile) {
      this.showTooltip = !this.showTooltip;
    }
  }
}
