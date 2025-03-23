import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CaptchaService } from 'src/app/services/captcha.service';

@Component({
  selector: 'app-captcha-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, InputTextModule, ButtonModule, FormsModule],
  templateUrl: './captcha-dialog.component.html',
  styleUrls: ['./captcha-dialog.component.css']
})
export class CaptchaDialogComponent {
  constructor(public captchaService: CaptchaService) {}
}
