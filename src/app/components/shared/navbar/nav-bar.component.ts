import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { contactInfo, getTextWhatsapp, getMailtoLink } from 'src/app/text';
import { SidebarModule } from 'primeng/sidebar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    NgOptimizedImage,
    SidebarModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  contactInfo = contactInfo;
  getMailtoLink = getMailtoLink;
  getTextWhatsapp = getTextWhatsapp;

  constructor(private router: Router) {}

  menuVisible: boolean = false;

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  closeMenu() {
    this.menuVisible = false;
  }

  isContactPage() {
    return this.router.url === '/contatti';
  }
}
