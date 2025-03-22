// footer.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { contactInfo, getMailtoLink, getTextWhatsapp } from 'src/app/text';
import { RecaptchaService } from 'src/app/services/recaptcha.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  currentUrl: string = '';
  isContactPage: boolean = false;
  private routerSubscription: Subscription | undefined;
  contactInfo = contactInfo;

  constructor(
    private router: Router,
    private recaptchaService: RecaptchaService
  ) {}

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.checkIfContactPage();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
        this.checkIfContactPage();
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkIfContactPage() {
    this.isContactPage = this.currentUrl === '/contatti';
  }

  onWhatsAppClick(): void {
    console.log('>>> Bottone WhatsApp cliccato');

    this.recaptchaService.executeRecaptcha('whatsapp', (token) => {
      console.log(
        '>>> Callback WhatsApp chiamata con token:',
        token ? 'presente' : 'assente'
      );

      const whatsappUrl = getTextWhatsapp();
      console.log('>>> Apertura WhatsApp URL:', whatsappUrl);

      try {
        window.open(whatsappUrl, '_blank');
        console.log('>>> WhatsApp window.open eseguito con successo');
      } catch (error) {
        console.error('>>> Errore durante apertura WhatsApp:', error);
      }
    });
  }

  onMailtoClick(): void {
    console.log('>>> Bottone Email cliccato');

    this.recaptchaService.executeRecaptcha('mailto', (token) => {
      console.log(
        '>>> Callback Email chiamata con token:',
        token ? 'presente' : 'assente'
      );

      const mailtoUrl = getMailtoLink();
      console.log('>>> Apertura Mailto URL:', mailtoUrl);

      try {
        window.location.href = mailtoUrl;
        console.log('>>> Mailto window.location.href eseguito con successo');
      } catch (error) {
        console.error('>>> Errore durante apertura Mailto:', error);
      }
    });
  }
}
