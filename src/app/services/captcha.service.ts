import { Injectable } from '@angular/core';
import { getMailtoLink, getTextWhatsapp } from 'src/app/text';

@Injectable({
  providedIn: 'root',
})
export class CaptchaService {
  showCaptcha: boolean = false;
  captchaQuestion: string = '';
  captchaAnswer: number = 0;
  userAnswer: number | null = null;
  captchaType: 'whatsapp' | 'email' | null = null;
  getMailtoLink = getMailtoLink;
  getTextWhatsapp = getTextWhatsapp;

  constructor() {}

  showSimpleCaptcha(type: 'whatsapp' | 'email'): void {
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
