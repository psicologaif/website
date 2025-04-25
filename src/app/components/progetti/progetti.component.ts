import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrochureComponent } from "../shared/brochure/brochure.component";

@Component({
  selector: 'app-progetti',
  standalone: true,
  imports: [CommonModule, BrochureComponent],
  templateUrl: './progetti.component.html',
  styleUrls: ['./progetti.component.css'],
})
export class ProgettiComponent {

}
