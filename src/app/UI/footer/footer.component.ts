import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { contactInfo, getMailtoLink, getTextWhatsapp } from 'src/app/text';

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
    getMailtoLink = getMailtoLink;
    getTextWhatsapp = getTextWhatsapp;

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
}
