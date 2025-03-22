import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { contactInfo, getMailtoLink, getTextWhatsapp } from 'src/app/text';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, DialogModule, InputTextModule, ButtonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  currentUrl: string = '';
  isContactPage: boolean = false;
  private routerSubscription: Subscription | undefined;
  contactInfo = contactInfo;
  getMailtoLink = getMailtoLink;
  getTextWhatsapp = getTextWhatsapp;
  showCaptcha: boolean = false;
  captchaQuestion: string = '';
  captchaAnswer: number = 0;
  userAnswer: number | null = null;
  captchaType: 'whatsapp' | 'email' | null = null;

  constructor(private router: Router) {}

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

  openWhatsApp(event: Event): void {
    event.preventDefault();
    this.showSimpleCaptcha('whatsapp');
  }

  openEmail(event: Event): void {
    event.preventDefault();
    this.showSimpleCaptcha('email');
  }

  private showSimpleCaptcha(type: 'whatsapp' | 'email'): void {
    this.captchaType = type;

    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    this.captchaQuestion = `Quanto fa ${num1} + ${num2}?`;
    this.captchaAnswer = num1 + num2;
    this.userAnswer = null;
    this.showCaptcha = true;
  }

  verifyCaptcha(): void {
    if (this.userAnswer === this.captchaAnswer) {
      this.showCaptcha = false;

      if (this.captchaType === 'whatsapp') {
        window.open(this.getTextWhatsapp(), '_blank');
      } else if (this.captchaType === 'email') {
        window.location.href = this.getMailtoLink();
      }
    } else {
      alert('Risposta non corretta. Riprova.');
      this.userAnswer = null;
    }
  }
}
