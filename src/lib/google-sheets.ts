/**
 * Google Sheets Integration for Blog Articles and Reviews
 *
 * REQUIRED COLUMN NAMES in Google Sheet (case-insensitive):
 *
 * Tab "articoli":
 * - titolo (article title)
 * - sottotitolo (subtitle)
 * - immagine (image URL)
 * - descrizione (description/intro text)
 * - data (date in format YYYY-MM-DD or similar)
 * - sottotitolo1, testo1 (optional section 1)
 * - sottotitolo2, testo2 (optional section 2)
 * - sottotitolo3, testo3 (optional section 3)
 * - sottotitoloconclusione, testoconclusione (optional conclusion)
 *
 * Tab "recensioni":
 * - nome (reviewer initials, e.g., "M.R.")
 * - recensione (review text)
 * - voto (rating, 1-5)
 * - data (date in format YYYY-MM-DD or similar)
 */

/**
 * Parse a date string that may be in DD/MM/YYYY (Italian) or YYYY-MM-DD (ISO) format.
 */
export function parseDate(dateStr: string): Date {
  if (!dateStr) return new Date(NaN);
  const trimmed = dateStr.trim();
  // DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyy = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  // Fallback to native parsing (handles ISO, US, etc.)
  return new Date(trimmed);
}

/**
 * Format a date string to Italian locale (e.g. "15 gennaio 2024").
 */
export function formatDate(dateStr: string): string {
  const date = parseDate(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
}

const SHEET_ID = import.meta.env.PUBLIC_GOOGLE_SHEETS_ID;
const API_KEY = import.meta.env.PUBLIC_GOOGLE_SHEETS_API_KEY || "";

export interface Articolo {
  titolo: string;
  sottotitolo: string;
  immagine: string;
  descrizione: string;
  sottotitolo1?: string;
  testo1?: string;
  sottotitolo2?: string;
  testo2?: string;
  sottotitolo3?: string;
  testo3?: string;
  sottotitoloconclusione?: string;
  testoconclusione?: string;
  data: string;
}

/**
 * Convert a string to a URL-safe slug. Handles Italian diacritics.
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Strip HTML tags from a string and collapse whitespace. Useful for meta tags.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export interface Recensione {
  nome: string;
  recensione: string;
  voto: number;
  data: string;
}

async function fetchSheetData<T>(tabName: string): Promise<T[]> {
  if (!API_KEY) {
    console.warn(
      `GOOGLE_SHEETS_API_KEY not set, returning empty data for ${tabName}`,
    );
    return [];
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${tabName}?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google Sheets API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    if (rows.length === 0) return [];

    // First row is headers
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Map rows to objects with case-insensitive header matching
    return dataRows.map((row: string[]) => {
      const obj: any = {};
      headers.forEach((header: string, index: number) => {
        // Normalize header: lowercase and trim whitespace
        const normalizedHeader = header.toLowerCase().trim();
        obj[normalizedHeader] = row[index] || "";
      });
      return obj as T;
    });
  } catch (error) {
    console.error(`Failed to fetch ${tabName}:`, error);
    return [];
  }
}

export async function fetchArticoli(): Promise<Articolo[]> {
  const articoli = await fetchSheetData<Articolo>("articoli");

  // Sort by date descending
  return articoli.sort((a, b) => {
    const dateA = parseDate(a.data).getTime();
    const dateB = parseDate(b.data).getTime();
    return dateB - dateA;
  });
}

export async function fetchArticoliWithSlugs(): Promise<(Articolo & { slug: string })[]> {
  const articoli = await fetchArticoli();
  const slugCounts = new Map<string, number>();

  return articoli.map((articolo) => {
    const base = slugify(articolo.titolo);
    const count = slugCounts.get(base) || 0;
    const slug = count > 0 ? `${base}-${count}` : base;
    slugCounts.set(base, count + 1);
    return { ...articolo, slug };
  });
}

export async function fetchRecensioni(): Promise<Recensione[]> {
  const recensioni = await fetchSheetData<Recensione>("recensioni");

  // Sort by date descending
  return recensioni.sort((a, b) => {
    const dateA = parseDate(a.data).getTime();
    const dateB = parseDate(b.data).getTime();
    return dateB - dateA;
  });
}
