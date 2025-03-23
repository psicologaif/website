import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SHEET_ID } from '../constants';

export interface Articolo {
  id: number;
  titolo: string;
  sottotitolo: string;
  immagine: string;
  descrizione: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArticoloService {
  constructor(private http: HttpClient) {}

  getArticoliFromGoogleSheetsAPI(sheetId: string): Observable<Articolo[]> {
    const apiKey =
      (window as any).env?.API_KEY_GOOGLE_SHEETS ||
      '';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/articoli?key=${apiKey}`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        const headers = response.values[0];
        return response.values.slice(1).map((row: any[], index: number) => {
          const project: any = { id: index + 1 };

          headers.forEach((header: string, i: number) => {
            project[this.normalizeHeader(header)] = row[i] || '';
          });

          return project as Articolo;
        });
      })
    );
  }

  private normalizeHeader(header: string): string {
    return header.replace(/^"(.*)"$/, '$1').toLowerCase();
  }

  getArticolo(id: string): Observable<Articolo> {
    const sheetId = SHEET_ID;

    return this.getArticoliFromGoogleSheetsAPI(sheetId).pipe(
      map((progetti) => {
        const progetto = progetti.find((p) => p.id.toString() === id);
        if (!progetto) {
          throw new Error('Articolo non trovato');
        }
        return progetto;
      })
    );
  }
}
