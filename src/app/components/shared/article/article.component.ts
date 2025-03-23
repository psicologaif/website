import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent {
  @Input() header: string = '';
  @Input() subheader: string = '';
  @Input() imageUrl: string = '';
  @Input() description: string = '';
  @Input() projectId?: number;
}
