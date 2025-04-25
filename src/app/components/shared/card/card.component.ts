import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext'; // Aggiungi questo
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShareService } from 'src/app/services/share.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DialogModule,
    RouterModule,
    InputTextModule,
    TooltipModule,
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CardComponent {
  @Input() header: string = '';
  @Input() subheader: string = '';
  @Input() imageUrl: string = '';
  @Input() description: string = '';
  @Input() projectId?: number;
  @Input() date?: Date;
  visible: boolean = false;

  tooltipOptions = {
    showDelay: 150,
    autoHide: true,
    hideDelay: 1000,
    tooltipEvent: 'focus' as const,
    tooltipPosition: 'right' as const,
  };

  constructor(private shareService: ShareService) {}

  shareOnFacebook() {
    this.shareService.shareOnFacebook(this.getShareableLink(), this.header);
  }

  shareOnTwitter() {
    this.shareService.shareOnTwitter(
      this.getShareableLink(),
      `${this.header} - ${this.subheader}`
    );
  }

  shareOnLinkedIn() {
    this.shareService.shareOnLinkedIn(this.getShareableLink());
  }

  shareOnWhatsApp() {
    this.shareService.shareOnWhatsApp(
      this.getShareableLink(),
      `${this.header} - ${this.subheader}`
    );
  }

  shareOnInstagram() {
    this.shareService.shareOnInstagram(this.getShareableLink());
  }

  getShareableLink(): string {
    if (this.projectId) {
      return this.shareService.getArticleShareableLink(this.projectId);
    }
    return window.location.href;
  }

  copyLink() {
    this.shareService.copyToClipboard(this.getShareableLink());
  }

  truncateDescription(text: string, limit: number = 150): string {
    if (!text) return '';

    if (text.length <= limit) {
      return text;
    }

    return text.substring(0, limit) + ' ...';
  }
}
