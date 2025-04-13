import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Articolo, ArticoloService } from 'src/app/services/articolo.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { SHEET_ID } from 'src/app/constants';
import { ShareService } from 'src/app/services/share.service';
import { TooltipModule } from 'primeng/tooltip';
import { CardArticoliCorrelatiComponent } from "../shared/card-articoli-correlati/card-articoli-correlati.component";

@Component({
  selector: 'app-articolo',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    TooltipModule,
    RouterModule,
    CardArticoliCorrelatiComponent
],
  templateUrl: './articolo.component.html',
  styleUrls: ['./articolo.component.css'],
})
export class ArticoloComponent implements OnInit {
  articolo: Articolo | null = null;
  loading: boolean = true;
  error: string | null = null;
  tuttiArticoli: Articolo[] = [];
  articoliCorrelati : Articolo[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articoloService: ArticoloService,
    private shareService: ShareService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  tooltipOptions = {
    showDelay: 150,
    autoHide: true,
    hideDelay: 1000,
    tooltipEvent: 'focus' as const,
    tooltipPosition: 'right' as const,
  };

  ngOnInit() {
    this.articoloService.getArticoliFromGoogleSheetsAPI(SHEET_ID).subscribe({
      next: (articoli) => {
        this.tuttiArticoli = articoli;
        this.articoliCorrelati = this.tuttiArticoli.filter((a) => a.id !== this.articolo?.id);

        this.route.params.subscribe((params) => {
          const id = params['id'];
          this.caricaArticolo(id);
        });
      },
      error: (err) => {
        this.error = 'Impossibile caricare gli articoli';
        this.loading = false;
        console.error('Errore nel caricamento degli articoli', err);
      },
    });
  }

  caricaArticolo(id: string) {
    this.loading = true;
    this.error = null;

    const idNumerico = parseInt(id, 10);
    this.articolo = this.tuttiArticoli.find((a) => a.id === idNumerico) || null;

    if (this.articolo) {
      this.loading = false;
      this.titleService.setTitle(`${this.articolo.titolo} - Nome del Tuo Sito`);
      this.metaService.updateTag({
        name: 'description',
        content: this.articolo.descrizione,
      });
    } else {
      this.articoloService.getArticolo(id).subscribe({
        next: (articolo) => {
          this.articolo = articolo;
          this.loading = false;

          if (articolo) {
            this.titleService.setTitle(
              `${articolo.titolo} - Nome del Tuo Sito`
            );
            this.metaService.updateTag({
              name: 'description',
              content: articolo.descrizione,
            });
          }
        },
        error: (err) => {
          this.error = "Impossibile caricare l'articolo";
          this.loading = false;
          console.error("Errore nel caricamento dell'articolo", err);
        },
      });
    }
  }

  navigaArticoloPrecedente() {
    if (!this.articolo || this.articolo.id <= 1) return;

    const articoliOrdinati = [...this.tuttiArticoli].sort(
      (a, b) => a.id - b.id
    );
    const indiceCorrente = articoliOrdinati.findIndex(
      (a) => a.id === this.articolo!.id
    );

    if (indiceCorrente > 0) {
      const articoloPrecedente = articoliOrdinati[indiceCorrente - 1];
      this.router.navigate(['/blog/articolo', articoloPrecedente.id]);
    }
  }

  navigaArticoloSuccessivo() {
    if (!this.articolo) return;

    // Trova l'articolo con ID immediatamente superiore
    const articoliOrdinati = [...this.tuttiArticoli].sort(
      (a, b) => a.id - b.id
    );
    const indiceCorrente = articoliOrdinati.findIndex(
      (a) => a.id === this.articolo!.id
    );

    if (indiceCorrente < articoliOrdinati.length - 1) {
      const articoloSuccessivo = articoliOrdinati[indiceCorrente + 1];
      this.router.navigate(['/blog/articolo', articoloSuccessivo.id]);
    }
  }

  esisteArticoloPrecedente(): boolean {
    if (!this.articolo) return false;

    const articoliOrdinati = [...this.tuttiArticoli].sort(
      (a, b) => a.id - b.id
    );
    const indiceCorrente = articoliOrdinati.findIndex(
      (a) => a.id === this.articolo!.id
    );
    return indiceCorrente > 0;
  }

  esisteArticoloSuccessivo(): boolean {
    if (!this.articolo) return false;

    const articoliOrdinati = [...this.tuttiArticoli].sort(
      (a, b) => a.id - b.id
    );
    const indiceCorrente = articoliOrdinati.findIndex(
      (a) => a.id === this.articolo!.id
    );
    return indiceCorrente < articoliOrdinati.length - 1;
  }

  shareOnFacebook() {
    this.shareService.shareOnFacebook(
      this.getShareableLink(),
      this.articolo?.titolo || ''
    );
  }

  shareOnTwitter() {
    this.shareService.shareOnTwitter(
      this.getShareableLink(),
      `${this.articolo?.titolo || ''} - ${this.articolo?.sottotitolo || ''}`
    );
  }

  shareOnLinkedIn() {
    this.shareService.shareOnLinkedIn(this.getShareableLink());
  }

  shareOnWhatsApp() {
    this.shareService.shareOnWhatsApp(
      this.getShareableLink(),
      `${this.articolo?.titolo || ''} - ${this.articolo?.sottotitolo || ''}`
    );
  }

  shareOnInstagram() {
    this.shareService.shareOnInstagram(this.getShareableLink());
  }

  getShareableLink(): string {
    if (this.articolo?.id) {
      return this.shareService.getArticleShareableLink(this.articolo.id);
    }
    return window.location.href;
  }

  copyLink() {
    this.shareService.copyToClipboard(this.getShareableLink());
  }
}
