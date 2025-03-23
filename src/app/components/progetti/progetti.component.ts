import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleComponent } from '../shared/article/article.component';
import { ProgettoService, Progetto } from '../../services/progetto.service';
@Component({
  selector: 'app-progetti',
  standalone: true,
  imports: [CommonModule, ArticleComponent],
  templateUrl: './progetti.component.html',
  styleUrls: ['./progetti.component.css'],
})
export class ProgettiComponent implements OnInit {
  progetti: Progetto[] = [];

  constructor(private progettoService: ProgettoService) {}

  ngOnInit(): void {
    const sheetId = '16YkOe9v88Xh9uKgRV9-1ZNLxTmKveEZwMpGZH5u4LVc';

    this.progettoService.getProgettiDaGoogleSheetsAPI(sheetId).subscribe({
      next: (data) => {
        this.progetti = data;
        console.log(this.progetti);
      },
      error: (error) => {
        console.error('Errore nel caricamento dei progetti', error);
      },
    });
  }
}
