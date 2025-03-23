import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../shared/card/card.component';
import { ArticoloService, Articolo } from '../../services/articolo.service';
import { SHEET_ID } from 'src/app/constants';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  articoli: Articolo[] = [];

  constructor(private articoloService: ArticoloService) {}

  ngOnInit(): void {
    const sheetId = SHEET_ID;

    this.articoloService.getArticoliFromGoogleSheetsAPI(sheetId).subscribe({
      next: (data) => {
        this.articoli = data;
        console.log(this.articoli);
      },
      error: (error) => {
        console.error('Errore nel caricamento dei progetti', error);
      },
    });
  }
}
