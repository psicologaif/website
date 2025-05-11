import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor(private meta: Meta) {}

  // Metodo per impostare i meta tag per un articolo
  setArticleMetaTags(article: {
    id: number;
    title: string;
    subtitle?: string;
    imageUrl: string;
    description?: string;
  }): void {
    // Rimuovi i meta tag esistenti per evitare duplicati
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('property="og:url"');
    this.meta.removeTag('name="twitter:title"');
    this.meta.removeTag('name="twitter:description"');
    this.meta.removeTag('name="twitter:image"');
    this.meta.removeTag('name="twitter:card"');

    const url = this.getArticleShareableLink(article.id);
    const description = article.subtitle || article.description || '';

    // Aggiungi Open Graph meta tags
    this.meta.addTag({ property: 'og:title', content: article.title });
    this.meta.addTag({ property: 'og:description', content: description });
    this.meta.addTag({ property: 'og:image', content: article.imageUrl });
    this.meta.addTag({ property: 'og:url', content: url });
    this.meta.addTag({ property: 'og:type', content: 'article' });

    // Aggiungi Twitter Card meta tags
    this.meta.addTag({ name: 'twitter:title', content: article.title });
    this.meta.addTag({ name: 'twitter:description', content: description });
    this.meta.addTag({ name: 'twitter:image', content: article.imageUrl });
    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
  }

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
      .then(() => {})
      .catch((err) => {
        console.error('Errore durante la copia: ', err);
      });
  }
}
