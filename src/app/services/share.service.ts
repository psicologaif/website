import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor() {}

  getArticleShareableLink(id: number): string {
    return `${window.location.origin}/blog/articolo/${id}`;
  }

  shareOnFacebook(url: string, title?: string): void {
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      '_blank'
    );
  }

  shareOnTwitter(url: string, text: string): void {
    const shareUrl = encodeURIComponent(url);
    const shareText = encodeURIComponent(text);
    window.open(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      '_blank'
    );
  }

  shareOnLinkedIn(url: string): void {
    const shareUrl = encodeURIComponent(url);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
      '_blank'
    );
  }

  shareOnWhatsApp(url: string, text: string): void {
    const shareUrl = encodeURIComponent(url);
    const shareText = encodeURIComponent(`${text}\n`);
    window.open(
      `https://api.whatsapp.com/send?text=${shareText}${shareUrl}`,
      '_blank'
    );
  }

  shareOnInstagram(url: string): void {
    this.copyToClipboard(url);
    alert('Link copiato. Apri Instagram e incolla il link per condividere.');
  }

  copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard
      .writeText(text)
      .then(() => {
      })
      .catch((err) => {
        console.error('Errore durante la copia: ', err);
      });
  }
}
