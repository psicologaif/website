import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { contactInfo, getMailtoLink, getTextWhatsapp } from 'src/app/text';

@Component({
  selector: 'app-contatti',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.css'],
})
export class ContattiComponent {
  contactInfo = contactInfo;
  getMailtoLink = getMailtoLink;
  getTextWhatsapp = getTextWhatsapp;
}
