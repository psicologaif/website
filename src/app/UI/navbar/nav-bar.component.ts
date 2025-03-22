import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { contactInfo, getTextWhatsapp, getMailtoLink } from 'src/app/text';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule, NgOptimizedImage],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  contactInfo = contactInfo;
  getMailtoLink = getMailtoLink;
  getTextWhatsapp = getTextWhatsapp;

  menuVisible = false;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
}
