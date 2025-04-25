import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servizi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servizi.component.html',
  styleUrls: ['./servizi.component.css'],
})
export class ServiziComponent {
  servizi = [
    {
      img: 'assets/img/consulenza-psicologica.jpeg',
      titolo: 'Consulenza psicologica',
      sottoTitolo:
        'Ti capita di sentirti solo nei tuoi pensieri, come se gli altri non ti ascoltassero davvero?',
      descrizione:
        'Attraverso un ascolto attivo, empatico e senza giudizio, ti offro uno spazio riservato in cui poter esprimere liberamente i tuoi pensieri, emozioni e preoccupazioni.',
    },
    {
      img: 'assets/img/psicoterapia.jpeg',
      titolo: 'Psicoterapia',
      sottoTitolo:
        'Hai la sensazione di essere bloccato in un circolo vizioso di pensieri e non sai come uscirne?',
      descrizione:
        "Un viaggio speciale che ti offre l'opportunità di esplorarti, identificare le tue trappole mentali, comprendere l'origine dei tuoi pensieri, delle tue emozioni e dei tuoi comportamenti per aiutarti a sviluppare strumenti sani attraverso cui migliorare il tuo benessere.",
    },
    {
      img: 'assets/img/crescita-personale.jpeg',
      titolo: 'Crescita personale',
      sottoTitolo:
        'Vorresti scoprire come migliorare la tua autostima e fiducia in te stesso?',
      descrizione:
        'Per migliorare la tua autostima, promuovere una maggiore consapevolezza di te, vivere in armonia con i tuoi valori e desideri più autentici, valorizzare i tuoi punti di forza e riconoscere su quali punti poter lavorare da quelli che puoi accogliere ed accettare.',
    },
    {
      img: 'assets/img/mindfulness.jpeg',
      titolo: 'Mindfulness',
      sottoTitolo:
        'Ti è mai capitato di avere la sensazione di star vivendo nel passato o nel futuro ma non nel presente?',
      descrizione:
        'Pratica che ti aiuta a diventare più consapevole del momento presente, senza giudicare i tuoi pensieri o le tue emozioni, offre benefici sia fisici che psicologici: riduzione della pressione sanguigna; miglioramento del sistema immunitario; rilassamento muscolare; miglioramento della qualità del sonno; miglioramento della gestione delle emozioni e riduzione stress ed ansia.',
    },
    {
      img: 'assets/img/orientamento-scolastico-professionale.jpeg',
      titolo: 'Orientamento scolastisco e/o professionale',
      sottoTitolo:
        'Non sai quale istituto scolastico o universitario sia migliore per te? Non sai quale lavoro meglio ti si addice?',
      descrizione:
        'Processo breve che ti aiuta a prendere decisioni informate riguardo al tuo percorso scolastico e/o professionale che sia in linea con le tue attitudini permettondoti di lavorare con maggiore motivazione e soddisfazione a lungo termine.',
    },
    {
      img: 'assets/img/webinar.jpeg',
      titolo: 'Webinar psicoeducativi',
      sottoTitolo:
        'Ti piacerebbe essere più informato ed approfondire alcune tematiche?',
      descrizione:
        'Incontri strutturati di prevenzione, apprendimento e riflessione volti a informare e fornire sani strumenti su tematiche specifiche legate al benessere psicologico, emotivo e relazionale.',
    },
  ];
}
