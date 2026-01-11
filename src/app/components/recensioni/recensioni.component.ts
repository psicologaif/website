import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BrochureComponent } from '../shared/brochure/brochure.component';

@Component({
  selector: 'app-recensioni',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: '../shared/brochure/brochure.component.html',
  styleUrls: ['../shared/brochure/brochure.component.css'],
})
export class RecensioniComponent extends BrochureComponent {
  override pages = [
    {
      title: 'M.R.',
      imageSrc: this.generateAvatarSVG('M.R.', '#4A90E2'),
      description:
        "Grazie dottoressa, la ringrazione davvero tanto ❤️. Non vedo l'ora di raccontarle un botto di cose! Decidere di intraprendere un percorso psicologico per me è stata una decisione difficile da prendere, però piano piano ho visto dei cambiamenti, specialmente per l'ansia (non mi sarei mai aspettata che degli esercizi potessero fare così tanto!). Quindi per me è già una grande conquista. Spero di migliorare ulteriormente, quando esco dal suo studio sono sempre di buon umore!",
    },
    {
      title: 'G.B.',
      imageSrc: this.generateAvatarSVG('G.B.', '#7B68EE'),
      description:
        'Veramente grazie di cuore per ciò che abbiamo realizzato insieme. Si, perchè se non era per te ora nulla sarebbe stato così. Sei stata, come ti accennavo sempre negli ultimi incontri, una salvezza per me e te ne sarò per sempre grata 🤍',
    },
    {
      title: 'L.T.',
      imageSrc: this.generateAvatarSVG('L.T.', '#50C878'),
      description:
        'Da questo percorso insieme porterò con me tutte le consapevolezze e la forza che ho costruito anche grazie a te. Grazie di cuore perchè sto vivendo con serenità e so che senza il tuo aiuto non sarebbe stato lo stesso. Grazie, davvero, per essere stata una guida per me e per avermi accompagnata fino a qui 💛',
    },
    {
      title: 'T.C.',
      imageSrc: this.generateAvatarSVG('T.C.', '#FFD700'),
      description:
        "Grazie Dottoressa per il colloquio di oggi, già non devo l'ora di rivederla la prossima settimana :) Grazie ancora e buona giornata!",
    },
    {
      title: 'P.N.',
      imageSrc: this.generateAvatarSVG('P.N.', '#FFA500'),
      description:
        'Le sedute con lei sono un  grande dono, è come se stessi imparando a conoscere una nuova me, sicuramente migliore, è un grande percorso di crescita! grazie infinite!',
    },
    {
      title: 'G.A.',
      imageSrc: this.generateAvatarSVG('G.A.', '#7B58EE'),
      description:
        "Buongiorno Dottoressa, la volevo ringraziare perchè ripetere la tecnica che mi ha insegnato mi ha aiutata tanto. Ho capito che, come in ogni cosa, può esserci un'altra prospettiva di vedere le situazioni. Oggi ho cercato di viverla con più serenità quindi grazie! Mi è stata d'aiuto!",
    },
    {
      title: 'C.L.',
      imageSrc: this.generateAvatarSVG('C.L.', '#50C471'),
      description:
        "Salve Dottoressa, volevo dirle che alla fine ieri sono andata in università e ho fatto l'esame, è andato molto bene, sono riuscita a gestire meglio la mia ansia soprattutto il giorno prima dell'esame scacciando i miei pensieri intrusivi. Sicuramente devo fare ancora tanto lavoro, però sono contenta di quello che stiamo facendo insieme, grazie.",
    },
    {
      title: 'F.S.',
      imageSrc: this.generateAvatarSVG('F.S.', '#4B29EE'),
      description:
        "Durante le sedute porto a casa tante parole, piene di significato su cui riflettere. Da quando vengo da lei, è come se tutto intorno a me avesse ripreso a bollire! Ogni colore, profumo è più intenso e bello! Mi sento non più un'anima vagante, al contrario, ho la percezione di trovarmi al posto giusto in un contesto che non mi spaventa più come prima! Grazie per l'opportunità che mi sta dando di crescita, grazie per il dono dell'ascolto, dell'affetto, di stima. Grazie per essere una guida capace di rendere ogni difficoltà un esercizio di logica privo di devastazione interiore. Grazie! ❤️",
    },
    {
      title: 'S.L.',
      imageSrc: this.generateAvatarSVG('S.L.', '#7A58FE'),
      description:
        "Dopo ogni seduta sento di ritrovare me stesso e di poter affrontare tutto!",
    },
    {
      title: 'D.G.',
      imageSrc: this.generateAvatarSVG('D.G.', '#30S772'),
      description:
        "Parlarne con lei mi ha fatto stare decisamente meglio nei giorni a venire, quindi la ringrazio! ☺️",
    },
  ];

  private generateAvatarSVG(initials: string, color: string): string {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="120" fill="${color}"/>
        <text x="200" y="220" font-family="Arial, sans-serif" font-size="80" font-weight="bold"
              fill="white" text-anchor="middle">${initials}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.trim())}`;
  }
}
