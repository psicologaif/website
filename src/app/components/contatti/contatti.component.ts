import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contactInfo, getMailtoLink, getTextWhatsapp } from 'src/app/text';
import { CaptchaService } from 'src/app/services/captcha.service';
import { CaptchaDialogComponent } from '../shared/captcha-dialog/captcha-dialog.component';
@Component({
  selector: 'app-contatti',
  standalone: true,
  imports: [CommonModule, CaptchaDialogComponent],
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css'],
})
export class ContattiComponent {
  contactInfo = contactInfo;
  getMailtoLink = getMailtoLink;
  getTextWhatsapp = getTextWhatsapp;

  constructor(public captchaService: CaptchaService) {}

  openWhatsApp(event: Event): void {
    event.preventDefault();
    this.captchaService.showSimpleCaptcha('whatsapp');
  }

  openEmail(event: Event): void {
    event.preventDefault();
    this.captchaService.showSimpleCaptcha('email');
  }
}
