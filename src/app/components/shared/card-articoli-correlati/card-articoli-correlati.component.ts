import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card-articoli-correlati',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './card-articoli-correlati.component.html',
  styleUrls: ['./card-articoli-correlati.component.css'],
})
export class CardArticoliCorrelatiComponent {
  @Input() titolo: string = '';
  @Input() sottotitolo: string = '';
  @Input() imageUrl: string = '';
  @Input() articoloId!: number;

  goTo(articoloId: number) {
    window.location.href = `/blog/articolo/${articoloId}`;
  }
}
