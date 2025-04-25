import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

interface BrochurePage {
  title: string;
  imageSrc: string;
  description: string;
  actions?: BrochureAction[];
}

interface BrochureAction {
  label: string;
  icon?: string;
  action: string;
}

@Component({
  selector: 'app-brochure',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './brochure.component.html',
  styleUrls: ['./brochure.component.css'],
})
export class BrochureComponent implements OnInit {
  currentPage: number = 0;
  isFlipping: boolean = false;
  showDescriptionOverlay: boolean = false;
  currentFullDescription: BrochurePage | null = null;
  isMobileView: boolean = false;

  pages: BrochurePage[] = [
    {
      title: 'Progetto "Ti Affido il mio cuore"',
      imageSrc: 'assets/img/IMG_0900.jpeg',
      description:
        "Progetto realizzato dall'Ente d'Ambito Sociale n.24 Gran Sasso - Laga in collaborazione con l'associazione \"Le Ali Della Vita - Centro studi e servizi sociali per la famiglia\" per la realizzazione dell'affidamento familiare a nuove famiglie. L'affido familiare è l'accoglienza di un bambino, in un periodo di difficoltà della sua vita, in una nuova famiglia poichè i suoi genitori non riescono a prendersi cura di lui. <br/> In foto, momento dedicato alla Mindfulness in cui conduco un gruppo di coppie in formazione per l'affido familiare allo scopo di lavorare sulla preparazione e gestione emotiva del nuovo arrivo nelle loro case. Attraverso esercizi di respirazione consapevole le coppie hanno imparato a essere più presenti e coscienti delle loro emozioni e pensieri, hanno sviluppato una maggiore resilenza e capacità di affrontare le sfide che possono sorgere nell'affido familiare, permettendo loro di approcciare la nuova esperienza con maggiore calma e fiducia.",
    },
    {
      title: 'Progetto "AfFidati"',
      imageSrc: 'assets/img/IMG_0896.jpeg',
      description:
        "Progetto realizzato dall'Unione di Comuni Città Territori Val Vibrata in collaborazione con l'Associazione \"Le Ali Della Vita - Centro studi e servizi sociali per la famiglia\" rivolto a persone singole, coppie sposate o conviventi, con o senza figli, aperte all'accoglienza e disponibili a prendersi cura, temporaneamente, di un bambino in difficoltà. In foto, momenti di psico educazione e formazione in cui discuto con le coppie le loro motivazioni, aspettative e preoccupazioni riguardo all'affido familiare. Attraverso l'informazione ed attività esperienziali, le coppie sono state aiutate ad esplorare e gestire le loro emozioni legate all'accoglienza di un nuovo membro in famiglia, a praticare la loro abilità di comunicazione e di gestione delle situazioni difficili.",
    },
    {
      title: 'Progetto "Nuovi percorsi inclusivi"',
      imageSrc: 'assets/img/IMG_1104.JPG',
      description:
        "Progetto realizzato da un'ATS con capofila l'Amibito Distrettuale Sociale n.20 Teramo e membri gli Ambiti Distrettuali Sociali n.23 Fino - Cerrano e n.24 Gran Sasso - Laga, la ASL Teramo attraverso il Dipartimento di Salute Mentale, gli Organismi di Formazione accreditati Eventitalia Scarl e Consorzio Up e le agenzie per il lavoro accreditate Manpower Srl e Humangest Spa. Il progetto ha l'obiettivo di rafforzare l'occupabilità di persone svantaggiate dando un impulso al processo di reintegrazione occupazionale e contrastando così il disagio sociale che ne consegue. Il mio ruolo è stato quello di orientare gli svantaggiati alle proprie adatte opportunità lavorative analizzando, attraverso colloqui e questionari, le loro attitudini e caratteristiche personali.",
    },
    {
      title: 'Progetto "Mindfulness in gravidanza"',
      imageSrc: 'assets/img/IMG_1105.jpg',
      description:
        "Progetto realizzato presso l'Ospedale di Teramo, durante il corso di preparazione al parto, per coppie in dolce attesa. Ho presentato alle coppie il protocollo Mindfulness specifico per loro: può essere praticato singolarmente dalle future mamme, in coppia con il proprio partner o in gruppo. Praticare Mindfulness vuol dire preparasi al momento del parto, ridurre stress e ansia, curare l'insonnia, prendersi cura del proprio piccolo/a sin da prima della nascita allo scopo di favorire la sintonia e di potergli trasmettere messaggi di positività e gioia. Questa pratica può aiutare a ridurre il rischio di depressione e ansia post-partum, supportando così la salute ed il benessere mentale; inoltre, può aiutare a ridurre il dolore durante il parto e il post-parto e aiutare a gestire meglio le emozioni e a rispondere in modo più calmo e consapevole alle sfide della gravidanza e della coppia gestendo lo stress genitoriale.",
    },
    {
      title: 'Progetto "BenEssere a scuola"',
      imageSrc: 'assets/img/IMG_1106.jpeg',
      description:
        "Progetto realizzato dall'Istituto Comprensivo Statale \"San Nicolò Teramo4\" rivolto ad alunni con fragilità frequentanti la classe terza per orientarli alla scelta dell'istituto scolastico. Mi sono occupata di identificare le attitudini, i punti di forza e le aree di vulnerabilità degli studenti, con l'obiettivo di guidarli verso una scelta consapevole coinvolgendo anche il team scolastico ed i genitori. L'orientamento scolastico e/o professionale può rivelarsi fondamentale per chi ha difficoltà a individuare la propria strada, aiutando a comprendere quale percorso sia il più adatto o il più desiderato. Altro obiettivo del progetto è stato quello di promuovere l'inclusione e la partecipazione degli alunni con disailità nella vita scolastica e sociale fornendo loro un supporto che abbia tenuto conto delle loro esigenze e capacità individuali.",
    },
    {
      title: 'Progetto "Sportello di ascolto psicologico"',
      imageSrc: 'assets/img/palloncini.jpg',
      description:
        "Progetto realizzato dal Liceo Scientifico Statale A. Einstein di Teramo per tutti gli studenti della propria scuola allo scopo di fornire loro ascolto e supporto psicologico sia individuale che di gruppo in classe. Dare spazio al benessere mentale in una fase delicata come quella dell'adolescenza è necessario non solo per lavorare su eventuali stati psicopatologici ma anche per favorire una migliore crescita personale e per lavorare sulla prevenzione di un disagio che a lungo andare, se trascurato potrebbe acutizzarsi. In foto, ho avuto modo di svolgere un incontro di gruppo con la classe per parlare di autostima ed empatia attraverso attività esperienziali pratiche ed arricchenti.",
    },
    {
      title: 'Progetto "TrovarSi"',
      imageSrc: 'assets/img/IMG_1108.jpg',
      description:
        "Progetto realizzato dall'Istituto Comprensivo R. Levi Montalcini di Civitella - Torricella di mentoring ed orientamento per gli alunni iscritti alla scuola. L'obiettivo è stato quello di sviluppare una maggiore autostima e fiducia, gestire lo stress e le emozioni, identificare punti di forza e di interessi e sviluppare abilità sociali e di comunicazione. Il mio ruolo è stato quello di supportare alcuni bambini/e per migliorare il loro adattamento scolastico, eliminare fenomeni di bullismo, identificare attività di motivazione allo studio e insegnare a gestire le emozioni negative in modo sano e costruttivo. In foto, l'esercizio \"zaino delle competenenze\" che aiuta a riconoscere e valorizzare le proprie qualità e competenze, a vedersi in modo completo senza etichette.",
    },
  ];

  constructor() {
    this.checkIfMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkIfMobile();
  }

  // Controlla se siamo in vista mobile
  checkIfMobile(): void {
    this.isMobileView = window.innerWidth < 768;
  }

  ngOnInit(): void {}

  prevPage(): void {
    if (this.currentPage > 0) {
      this.playFlipAnimation();
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.pages.length - 1) {
      this.currentPage++;
    }
  }

  goToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.pages.length) {
      if (pageIndex < this.currentPage) {
        this.playFlipAnimation();
      }
      this.currentPage = pageIndex;
    }
  }

  playFlipAnimation(): void {
    this.isFlipping = true;
    setTimeout(() => {
      this.isFlipping = false;
    }, 1000);
  }

  openFullDescription(page: BrochurePage): void {
    this.currentFullDescription = page;
    this.showDescriptionOverlay = true;

    // Blocca lo scroll del body quando l'overlay è aperto
    document.body.style.overflow = 'hidden';
  }

  // Chiude l'overlay della descrizione
  closeFullDescription(): void {
    this.showDescriptionOverlay = false;
    this.currentFullDescription = null;

    // Ripristina lo scroll del body
    document.body.style.overflow = 'auto';
  }
}
