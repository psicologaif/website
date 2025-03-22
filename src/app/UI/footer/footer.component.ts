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

  onWhatsAppClick(event: Event): void {
    event.preventDefault();

    this.recaptchaService.executeRecaptcha('whatsapp', () => {
      window.open(getTextWhatsapp(), '_blank');
    });
  }

  onMailtoClick(event: Event): void {
    event.preventDefault();

    this.recaptchaService.executeRecaptcha('mailto', () => {
      window.location.href = getMailtoLink();
    });
  }
}
