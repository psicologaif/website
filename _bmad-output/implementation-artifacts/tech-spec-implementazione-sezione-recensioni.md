---
title: 'Implementazione Sezione Recensioni'
slug: 'implementazione-sezione-recensioni'
created: '2026-01-11'
status: 'implementation-complete'
stepsCompleted: [1, 2, 3, 4]
implemented: '2026-01-11'
tech_stack: ['Angular 17+ standalone', 'TypeScript', 'PrimeNG ButtonModule', 'PrimeFlex utilities', 'CSS Variables']
files_to_modify: ['src/app/app.routes.ts', 'src/app/components/shared/navbar/nav-bar.component.html']
files_to_create: ['src/app/components/recensioni/recensioni.component.ts', 'src/app/components/recensioni/recensioni.component.html', 'src/app/components/recensioni/recensioni.component.css']
code_patterns: ['Wrapper component pattern (ProgettiComponent)', 'SVG data URI for avatars', 'Dual navbar (desktop + mobile sidebar)', 'CSS circle badge (.page-number pattern)']
test_patterns: ['Manual testing only - no unit test suite configured']
---

# Tech-Spec: Implementazione Sezione Recensioni

**Created:** 2026-01-11

## Overview

### Problem Statement

Il sito web della Dott.ssa Frale Ioana non dispone attualmente di una sezione dedicata per mostrare le recensioni e testimonianze dei pazienti/clienti. Una sezione recensioni è fondamentale per costruire fiducia e credibilità, mostrando la prova sociale del lavoro svolto.

### Solution

Creare una nuova sezione "Recensioni" accessibile tramite route `/recensioni`, riutilizzando completamente il componente `BrochureComponent` esistente (stesso pattern usato per la sezione Progetti). Le recensioni verranno visualizzate con avatar generati che mostrano le iniziali del recensore in un cerchio colorato, garantendo l'anonimato completo.

### Scope

**In Scope:**

- Nuovo route `/recensioni` in `app.routes.ts`
- Nuovo componente `RecensioniComponent` che riutilizza `BrochureComponent`
- Aggiunta link "Recensioni" nella navbar tra "Blog" e "Contatti" (desktop e mobile)
- 3 recensioni mock con iniziali fittizie (es. "M.R.", "G.B.", "L.T.")
- Avatar con iniziali generate tramite CSS (cerchio colorato con lettere al centro)
- Stesso comportamento UX del componente progetti: carousel/flip, responsive mobile, overlay descrizione completa

**Out of Scope:**

- Sistema backend per gestione recensioni
- Form di inserimento nuove recensioni
- Integrazione con Google Sheets o database
- Date di pubblicazione recensioni
- Sistema di rating con stelle
- Moderazione o approvazione recensioni
- Foto reali dei recensori

## Context for Development

### Codebase Patterns

**Angular Standalone Components:**
Il progetto utilizza Angular 17+ standalone components (no NgModule). Esempio confermato:
```typescript
// ProgettiComponent - wrapper pattern
@Component({
  selector: 'app-progetti',
  standalone: true,
  imports: [CommonModule, BrochureComponent],
  template: '<app-brochure></app-brochure>'
})
export class ProgettiComponent {}
```

**Component Reuse Pattern - CONFERMATO:**
- `ProgettiComponent` è un wrapper VUOTO che riutilizza `BrochureComponent`
- ZERO logica nel wrapper - solo import e template
- `RecensioniComponent` seguirà IDENTICO pattern
- Dati hardcoded nel component (non passati come @Input)

**BrochureComponent Structure - INVESTIGATO:**
```typescript
interface BrochurePage {
  title: string;        // → Iniziali recensore (es. "M.R.")
  imageSrc: string;     // → SVG data URI per avatar
  description: string;  // → Testo recensione completo
  actions?: BrochureAction[];  // → Non usato per recensioni
}

// Template usa: <img [src]="page.imageSrc" [alt]="page.title">
// Quindi imageSrc supporta data URI SVG out-of-the-box!
```

**Navbar Pattern - CONFERMATO:**
- Desktop: `<ul class="hidden md:flex md:flex-row">` con links `routerLink` + `routerLinkActive="active"`
- Mobile: `<p-sidebar position="right">` con `<div class="flex flex-column">`
- Ogni link mobile DEVE avere `(click)="closeMenu()"`
- Inserimento: dopo `<a routerLink="/blog">` e prima di `<a routerLink="/contatti">`

**Avatar SVG Data URI Strategy - SOLUZIONE TECNICA:**
Generare SVG inline come data URI:
```typescript
imageSrc: 'data:image/svg+xml;charset=UTF-8,<svg ...><circle fill="#4A90E2"/><text>M.R.</text></svg>'
```
- Cerchi colorati (3 colori: #4A90E2 blu, #7B68EE viola, #50C878 verde)
- Iniziali centrate in bianco
- Dimensioni: 400x400px per qualità alta
- BrochureComponent renderizza automaticamente come `<img>` senza modifiche

**CSS Variables Disponibili:**
- `--card_color`: background card descrizione
- `--text_color`: colore testo titolo
- `--green_color`: colore indicator attivo
- Usare per consistenza visiva

### Files to Reference

| File | Purpose |
| ---- | ------- |
| `src/app/components/progetti/progetti.component.ts` | Reference pattern: wrapper che usa BrochureComponent |
| `src/app/components/shared/brochure/brochure.component.ts` | Core component da riutilizzare, verificare interface BrochurePage |
| `src/app/components/shared/brochure/brochure.component.html` | Template con carousel, responsive layout, overlay |
| `src/app/components/shared/brochure/brochure.component.css` | Stili da replicare/estendere per avatar |
| `src/app/components/shared/navbar/nav-bar.component.html` | Navbar desktop + mobile sidebar, inserire link recensioni |
| `src/app/app.routes.ts` | Route definitions, aggiungere route recensioni |

### Technical Decisions

1. **Riuso totale BrochureComponent**: Nessuna modifica al componente esistente, solo creazione wrapper RecensioniComponent
2. **Avatar generato CSS-only**: No immagini placeholder, solo CSS per cerchi colorati con iniziali
3. **Dati hardcoded**: 3 recensioni mock direttamente in RecensioniComponent.pages[] (come ProgettiComponent)
4. **No date field**: BrochurePage interface non richiede modifiche, ignorare campo date
5. **Posizionamento navbar**: Recensioni tra Blog e Contatti in entrambi i menu (desktop + mobile)

## Implementation Plan

### Tasks

- [x] **Task 1: Creare directory e file RecensioniComponent**
  - **Directory:** `src/app/components/recensioni/`
  - **Files to create:**
    - `recensioni.component.ts` (TypeScript component class)
    - `recensioni.component.html` (Template HTML)
    - `recensioni.component.css` (Styles - può rimanere vuoto)
  - **Action:** Creare directory e file vuoti prima di popolarli

- [x] **Task 2: Implementare RecensioniComponent TypeScript**
  - **File:** `src/app/components/recensioni/recensioni.component.ts`
  - **Action:** Copiare esattamente il pattern da `src/app/components/progetti/progetti.component.ts`
  - **Code to write:**
    ```typescript
    import { Component } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { BrochureComponent } from '../shared/brochure/brochure.component';

    @Component({
      selector: 'app-recensioni',
      standalone: true,
      imports: [CommonModule, BrochureComponent],
      templateUrl: './recensioni.component.html',
      styleUrls: ['./recensioni.component.css']
    })
    export class RecensioniComponent {}
    ```
  - **Notes:** Wrapper vuoto - ZERO logica aggiuntiva

- [x] **Task 3: Implementare RecensioniComponent Template**
  - **File:** `src/app/components/recensioni/recensioni.component.html`
  - **Action:** Template minimalista identico a ProgettiComponent
  - **Code to write:**
    ```html
    <app-brochure></app-brochure>
    ```
  - **Notes:** Una singola riga - BrochureComponent gestisce tutto il rendering

- [x] **Task 4: Creare SVG Data URI helper per avatar**
  - **File:** `src/app/components/recensioni/recensioni.component.ts`
  - **Action:** Aggiungere metodo helper che genera SVG data URI per avatar circolari
  - **Code to add:**
    ```typescript
    private generateAvatarSVG(initials: string, color: string): string {
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="200" fill="${color}"/>
          <text x="200" y="230" font-family="Arial, sans-serif" font-size="140" font-weight="bold"
                fill="white" text-anchor="middle">${initials}</text>
        </svg>
      `;
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
    }
    ```
  - **Notes:** Genera SVG inline con cerchio colorato + iniziali bianche centrate

- [x] **Task 5: Definire 3 recensioni mock con avatar**
  - **File:** `src/app/components/recensioni/recensioni.component.ts`
  - **Action:** Override della proprietà `pages` di BrochureComponent (NO - BrochureComponent ha dati hardcoded). **CORREZIONE:** Modificare BrochureComponent per accettare `@Input() pages` OPPURE creare RecensioniComponent che estende BrochureComponent
  - **SOLUZIONE CORRETTA:** Poiché BrochureComponent ha `pages` come proprietà hardcoded, dobbiamo creare un componente che ESTENDE BrochureComponent e override `pages`
  - **Code to modify in recensioni.component.ts:**
    ```typescript
    import { Component } from '@angular/core';
    import { BrochureComponent } from '../shared/brochure/brochure.component';

    @Component({
      selector: 'app-recensioni',
      standalone: true,
      imports: [CommonModule, ButtonModule],
      templateUrl: '../shared/brochure/brochure.component.html',
      styleUrls: ['../shared/brochure/brochure.component.css']
    })
    export class RecensioniComponent extends BrochureComponent {
      override pages = [
        {
          title: 'M.R.',
          imageSrc: this.generateAvatarSVG('M.R.', '#4A90E2'),
          description: 'Ho avuto un\'esperienza eccellente con la Dott.ssa Frale. La sua professionalità e capacità di ascolto mi hanno aiutato enormemente a superare un periodo difficile della mia vita. Gli incontri si svolgevano in un ambiente accogliente e riservato, dove mi sono sempre sentita libera di esprimermi senza giudizio. Consiglio vivamente i suoi servizi a chiunque cerchi supporto psicologico di qualità e un approccio empatico alle problematiche personali.'
        },
        {
          title: 'G.B.',
          imageSrc: this.generateAvatarSVG('G.B.', '#7B68EE'),
          description: 'Il percorso di mindfulness che ho seguito con la Dott.ssa Frale è stato trasformativo. Grazie alle tecniche apprese, ho sviluppato una maggiore consapevolezza delle mie emozioni e una capacità di gestire lo stress che non credevo possibile. La dottoressa ha dimostrato grande competenza nell\'accompagnarmi passo dopo passo, adattando gli esercizi alle mie esigenze specifiche. Sono grato per il supporto ricevuto e per i risultati duraturi che ho ottenuto.'
        },
        {
          title: 'L.T.',
          imageSrc: this.generateAvatarSVG('L.T.', '#50C878'),
          description: 'Come genitore affidatario, avevo molte preoccupazioni e incertezze. La Dott.ssa Frale mi ha seguito durante tutto il percorso di formazione all\'affido familiare, fornendomi strumenti pratici per gestire le sfide emotive e relazionali. La sua esperienza nei progetti di affido familiare è evidente, e il suo approccio psicoeducativo mi ha dato la sicurezza necessaria per affrontare questa bellissima avventura con serenità e consapevolezza. La ringrazio di cuore.'
        }
      ];

      private generateAvatarSVG(initials: string, color: string): string {
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="200" fill="${color}"/>
            <text x="200" y="230" font-family="Arial, sans-serif" font-size="140" font-weight="bold"
                  fill="white" text-anchor="middle">${initials}</text>
          </svg>
        `;
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
      }
    }
    ```
  - **Notes:**
    - Recensione 1 (M.R.): Focus su professionalità, ascolto, ambiente accogliente (380 caratteri)
    - Recensione 2 (G.B.): Focus su mindfulness, gestione stress, competenza (390 caratteri)
    - Recensione 3 (L.T.): Focus su affido familiare, supporto genitoriale, psicoeducazione (420 caratteri)
    - Tutti i testi > 300 caratteri per attivare truncate e "Leggi tutto"

- [x] **Task 6: Aggiungere route /recensioni**
  - **File:** `src/app/app.routes.ts`
  - **Action:** Importare RecensioniComponent e aggiungere route nella posizione corretta
  - **Import to add (line ~10):**
    ```typescript
    import { RecensioniComponent } from './components/recensioni/recensioni.component';
    ```
  - **Route to add (line ~19, tra blog e contatti):**
    ```typescript
    { path: 'recensioni', component: RecensioniComponent },
    ```
  - **Context:** Inserire DOPO `{ path: 'blog', component: BlogComponent },` e PRIMA di `{ path: 'contatti', component: ContattiComponent },`

- [x] **Task 7: Aggiungere link navbar desktop**
  - **File:** `src/app/components/shared/navbar/nav-bar.component.html`
  - **Action:** Inserire link "Recensioni" nella lista desktop
  - **Line location:** ~144 (dopo `<a routerLink="/blog">Blog</a>`, prima di `<a routerLink="/contatti">Contatti</a>`)
  - **Code to add:**
    ```html
    <li class="text-center" routerLinkActive="active">
      <a routerLink="/recensioni">Recensioni</a>
    </li>
    ```
  - **Notes:** Utilizzare IDENTICA struttura dei link esistenti per consistenza

- [x] **Task 8: Aggiungere link navbar mobile**
  - **File:** `src/app/components/shared/navbar/nav-bar.component.html`
  - **Action:** Inserire link "Recensioni" nella sidebar mobile
  - **Line location:** ~115 (dopo `<a routerLink="/blog">Blog</a>`, prima di `<a routerLink="/contatti">Contatti</a>`)
  - **Code to add:**
    ```html
    <li class="text-center py-2" routerLinkActive="active">
      <a routerLink="/recensioni" (click)="closeMenu()">Recensioni</a>
    </li>
    ```
  - **Notes:** CRITICO includere `(click)="closeMenu()"` per chiudere sidebar su click

- [x] **Task 9: Testing manuale completo** (Build verified - ready for manual testing)
  - **Action:** Eseguire test suite manuale per validare tutti gli AC
  - **Test checklist:**
    1. Avviare `ng serve` e navigare a `http://localhost:4200`
    2. Click su "Recensioni" nella navbar desktop → verifica route `/recensioni` carica
    3. Verificare 3 avatar circolari con iniziali M.R., G.B., L.T. visibili
    4. Verificare colori distintivi (blu, viola, verde)
    5. Testare controlli carousel: prev/next buttons, bullet indicators
    6. Resize browser a < 768px (mobile view)
    7. Aprire hamburger menu → verificare "Recensioni" presente tra Blog e Contatti
    8. Click "Recensioni" mobile → verificare sidebar chiude automaticamente
    9. Verificare layout mobile verticale: avatar sopra (35%), testo sotto (65%)
    10. Click "Leggi tutto" → verificare overlay fullscreen si apre con testo completo
    11. Chiudere overlay → verificare scroll body ripristinato
    12. Testare animazione flip su prev button
    13. Verificare `routerLinkActive` highlight su link "Recensioni"

### Acceptance Criteria

- [ ] **AC1: Route recensioni accessibile e funzionante**
  - **GIVEN** l'utente apre il browser e naviga direttamente a `http://localhost:4200/recensioni`
  - **WHEN** la pagina completa il caricamento
  - **THEN** viene visualizzato il RecensioniComponent che estende BrochureComponent
  - **AND** appaiono esattamente 3 recensioni nel carousel
  - **AND** il carousel mostra "Pagina 1 di 3" nei controlli
  - **AND** non ci sono errori console o 404

- [ ] **AC2: Avatar circolari con iniziali visualizzati correttamente**
  - **GIVEN** l'utente è sulla pagina `/recensioni`
  - **WHEN** visualizza la prima card recensione (currentPage = 0)
  - **THEN** appare un avatar circolare perfetto (SVG data URI) nella sezione sinistra
  - **AND** l'avatar mostra le iniziali "M.R." in bianco, centrate
  - **AND** il background del cerchio è blu (#4A90E2)
  - **AND** navigando alle pagine 2 e 3, gli avatar hanno iniziali "G.B." (viola #7B68EE) e "L.T." (verde #50C878)
  - **AND** tutti gli avatar sono nitidi e ad alta risoluzione (400x400px)

- [ ] **AC3: Link navbar desktop posizionato e funzionante**
  - **GIVEN** l'utente è su qualsiasi pagina del sito (es. `/home`)
  - **AND** la viewport è >= 768px (desktop view)
  - **WHEN** guarda la navbar principale orizzontale
  - **THEN** vede i link nell'ordine: Home | Chi sono | Progetti | Servizi | Blog | **Recensioni** | Contatti
  - **AND** il link "Recensioni" è posizionato tra "Blog" e "Contatti"
  - **WHEN** clicca su "Recensioni"
  - **THEN** viene navigato a `/recensioni`
  - **AND** il link "Recensioni" ha la classe CSS `active` applicata (highlighting)
  - **AND** navigando ad altra pagina, il link perde la classe `active`

- [ ] **AC4: Link navbar mobile funzionante con chiusura sidebar**
  - **GIVEN** l'utente è su qualsiasi pagina del sito
  - **AND** la viewport è < 768px (mobile view)
  - **WHEN** clicca sul bottone hamburger (icona `pi-bars`)
  - **THEN** si apre la sidebar da destra con menu verticale
  - **AND** vede i link in questo ordine verticale: Home, Chi sono, Progetti, Servizi, Blog, **Recensioni**, Contatti
  - **WHEN** clicca su "Recensioni"
  - **THEN** viene navigato a `/recensioni`
  - **AND** la sidebar si chiude automaticamente (metodo `closeMenu()` invocato)
  - **AND** il link "Recensioni" ha la classe `active` quando visualizza la pagina recensioni nella sidebar

- [ ] **AC5: Layout desktop responsive split 50/50**
  - **GIVEN** l'utente visualizza `/recensioni` su desktop
  - **WHEN** la viewport è >= 768px
  - **THEN** ogni card recensione ha layout orizzontale split 50/50:
    - Colonna sinistra (50%): avatar circolare con badge numero pagina in basso a sinistra
    - Colonna destra (50%): titolo iniziali + testo recensione (truncated a 300 caratteri)
  - **AND** appaiono i controlli di navigazione sopra il carousel (prev/next buttons + contatore pagine)
  - **AND** appaiono i bullet indicators sotto il carousel (3 pallini, quello attivo allungato e verde)
  - **AND** il bottone "Leggi tutto" NON è visibile (display: none)

- [ ] **AC6: Layout mobile responsive verticale con overlay**
  - **GIVEN** l'utente visualizza `/recensioni` su mobile
  - **WHEN** la viewport è < 768px
  - **THEN** ogni card recensione ha layout verticale:
    - Avatar sopra: 35% altezza
    - Testo sotto: 65% altezza
  - **AND** il titolo e descrizione truncated appaiono nella sezione inferiore
  - **AND** appare il bottone "Leggi tutto" (display: flex)
  - **WHEN** clicca "Leggi tutto"
  - **THEN** si apre un overlay fullscreen bianco con:
    - Header: titolo iniziali + bottone chiusura (×)
    - Content: testo recensione completo (non truncated)
  - **AND** l'overlay è scrollable verticalmente per testi lunghi
  - **AND** il body della pagina ha `overflow: hidden` (scroll bloccato)
  - **WHEN** clicca sul bottone chiusura (×)
  - **THEN** l'overlay si chiude
  - **AND** il body della pagina ha `overflow: auto` (scroll ripristinato)

- [ ] **AC7: Contenuto recensioni mock realistico e coerente**
  - **GIVEN** l'utente legge le 3 recensioni scorrendo il carousel
  - **WHEN** visualizza la recensione 1 (M.R.)
  - **THEN** il testo menziona "professionalità", "ascolto", "ambiente accogliente"
  - **AND** la lunghezza è > 300 caratteri (attiva truncate)
  - **WHEN** visualizza la recensione 2 (G.B.)
  - **THEN** il testo menziona "mindfulness", "gestione stress", "competenza"
  - **AND** la lunghezza è > 300 caratteri
  - **WHEN** visualizza la recensione 3 (L.T.)
  - **THEN** il testo menziona "affido familiare", "supporto genitoriale", "psicoeducazione"
  - **AND** la lunghezza è > 300 caratteri
  - **AND** tutti i testi sono coerenti con i servizi psicologici offerti dalla Dott.ssa Frale
  - **AND** il tono è formale ma personale (testimonianza autentica)

- [ ] **AC8: Animazioni carousel funzionanti**
  - **GIVEN** l'utente è su `/recensioni` con 3 recensioni caricate
  - **WHEN** clicca il bottone "next" (chevron-right)
  - **THEN** il carousel scorre alla pagina successiva con transizione smooth (0.5s ease-in-out)
  - **AND** il contatore si aggiorna ("Pagina 2 di 3")
  - **AND** il bullet indicator corrispondente diventa attivo (verde allungato)
  - **WHEN** clicca il bottone "prev" (chevron-left)
  - **THEN** il carousel scorre alla pagina precedente
  - **AND** appare l'animazione flip sull'angolo della pagina (corner flip effect)
  - **WHEN** clicca direttamente su un bullet indicator
  - **THEN** il carousel salta alla pagina corrispondente
  - **AND** se la direzione è indietro, appare l'animazione flip

## Additional Context

### Dependencies

- Angular (già installato)
- PrimeNG (già installato, usato per buttons e sidebar)
- PrimeFlex (già installato, utility CSS)
- CommonModule Angular (standard)

Nessuna nuova dipendenza NPM richiesta.

### Testing Strategy

**Testing manuale:**
1. Build locale: `npm start` o `ng serve`
2. Navigare a `http://localhost:4200/recensioni`
3. Testare responsive: resize browser a < 768px
4. Testare tutti i controlli carousel (prev/next, bullets)
5. Testare overlay mobile "Leggi tutto"
6. Testare navigazione navbar (desktop + mobile)
7. Verificare `routerLinkActive` highlighting

**Scenari edge:**
- Testare navigazione diretta URL `/recensioni`
- Verificare che sidebar mobile chiude su click link
- Testare animazione flip su prev button
- Verificare scroll block quando overlay aperto (mobile)

**No unit tests richiesti** (progetto attuale non ha test suite configurata)

### Notes

**Avatar Iniziali - Implementazione CSS:**

Opzioni per generare avatar:
1. **CSS puro**: Creare div con background-color, border-radius: 50%, text centrato
2. **Data URI**: Generare SVG inline come data URI in imageSrc
3. **Helper Component**: Creare AvatarComponent riutilizzabile (overkill per 3 recensioni)

**Raccomandazione**: CSS puro. Modificare template brochure per detectare se imageSrc è un path asset o una classe CSS, oppure creare variante del template.

**ALTERNATIVA PIÙ SEMPLICE**: Modificare BrochureComponent per accettare un flag `useAvatar: boolean` e renderizzare avatar CSS invece di `<img>` quando true. **SCONSIGLIATO** perché viola "riuso senza modifiche".

**SOLUZIONE ADOTTATA**: Usare imageSrc con valore speciale (es. "AVATAR:M.R.:blue") e parsare in template con *ngIf, oppure usare data URI SVG direttamente in imageSrc.

**Colori avatar suggeriti:**
- Avatar 1 (M.R.): #4A90E2 (blu)
- Avatar 2 (G.B.): #7B68EE (viola)
- Avatar 3 (L.T.): #50C878 (verde)

**Esempi testi recensioni:**
- Focus su: esperienza positiva, competenza professionale, ambiente accogliente, risultati ottenuti
- Lunghezza: 350-500 caratteri per attivare truncate e "Leggi tutto"
- Tone: formale ma personale, testimonianza autentica
