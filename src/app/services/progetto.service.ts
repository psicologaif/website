import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map} from 'rxjs';

export interface Progetto {
  id: number;
  titolo: string;
  sottotitolo: string;
  immagine: string;
  descrizione: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProgettoService {
  constructor(private http: HttpClient) {}

  getProgettiDaGoogleSheetsAPI(sheetId: string): Observable<Progetto[]> {
    const apiKey = (window as any).env?.API_KEY_GOOGLE_SHEETS || '';
    console.log(apiKey);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/articoli?key=${apiKey}`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        const headers = response.values[0];
        return response.values.slice(1).map((row: any[], index: number) => {
          const project: any = { id: index + 1 };

          headers.forEach((header: string, i: number) => {
            project[this.normalizeHeader(header)] = row[i] || '';
          });

          return project as Progetto;
        });
      })
    );
  }

  private parseCSVRow(row: string): string[] {
    // Gestione base delle virgolette e virgole in CSV
    const result = [];
    let insideQuotes = false;
    let currentValue = '';

    for (let i = 0; i < row.length; i++) {
      const char = row[i];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        result.push(currentValue);
        currentValue = '';
      } else {
        currentValue += char;
      }
    }

    result.push(currentValue);
    return result;
  }

  private normalizeHeader(header: string): string {
    // Rimuovi virgolette e normalizza il nome dell'header
    return header.replace(/^"(.*)"$/, '$1').toLowerCase();
  }
}
