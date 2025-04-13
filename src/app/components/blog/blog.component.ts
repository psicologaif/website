import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../shared/card/card.component';
import { ArticoloService, Articolo } from '../../services/articolo.service';
import { SHEET_ID } from 'src/app/constants';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, InputTextModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent implements OnInit {
  articoli: Articolo[] = [];
  articoliFiltrati: Articolo[] = [];
  searchText: string = '';
  loading: boolean = true;
  error: string | null = null;

  constructor(private articoloService: ArticoloService) {}

  ngOnInit(): void {
    this.caricaArticoli();
  }

  caricaArticoli(): void {
    const sheetId = SHEET_ID;
    this.loading = true;

    this.articoloService.getArticoliFromGoogleSheetsAPI(sheetId).subscribe({
      next: (data) => {
        this.articoli = data;
        this.articoliFiltrati = [...this.articoli];
        this.loading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento degli articoli', error);
        this.error =
          'Si è verificato un errore durante il caricamento degli articoli. Riprova più tardi.';
        this.loading = false;
      },
    });
  }

  filtraArticoli(): void {
    if (!this.searchText || !this.searchText.trim()) {
      this.articoliFiltrati = [...this.articoli];
      return;
    }

    const searchTerms = this.searchText.toLowerCase().trim();
    this.articoliFiltrati = this.articoli.filter(
      (articolo) =>
        (articolo.titolo &&
          articolo.titolo.toLowerCase().includes(searchTerms)) ||
        (articolo.sottotitolo &&
          articolo.sottotitolo.toLowerCase().includes(searchTerms)) ||
        (articolo.descrizione &&
          articolo.descrizione.toLowerCase().includes(searchTerms))
    );
  }
}
