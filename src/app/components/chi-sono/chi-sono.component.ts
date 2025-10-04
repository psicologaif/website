import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tooltip, TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-chi-sono',
  standalone: true,
  imports: [CommonModule, TooltipModule],
  templateUrl: './chi-sono.component.html',
  styleUrls: ['./chi-sono.component.css'],
})
export class ChiSonoComponent {
  showContent: boolean = false;

  constructor() {}

  toggleContent(): void {
    this.showContent = !this.showContent;
  }
}
