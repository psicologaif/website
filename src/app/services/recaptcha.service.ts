import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoaded: () => void;
  }
}

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private captchaLoaded = false;
  private siteKey = '6LeR1_wqAAAAAJaGf5BzrMenKEzwqFQ0oE8mYA8t';
  private scriptLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    console.log('>>> RecaptchaService: costruttore chiamato');

    if (isPlatformBrowser(this.platformId)) {
      console.log('>>> RecaptchaService: esecuzione in browser');

      // Imposta la callback globale
      window.onRecaptchaLoaded = () => {
        this.captchaLoaded = true;
        console.log('>>> reCAPTCHA loaded successfully');
      };

      // Carica lo script reCAPTCHA se non è già stato caricato
      this.loadRecaptchaScript();
    } else {
      console.log('>>> RecaptchaService: non in esecuzione in browser');
    }
  }

  /**
   * Carica dinamicamente lo script reCAPTCHA v3
   */
  private loadRecaptchaScript(): void {
    console.log('>>> Tentativo di caricamento script reCAPTCHA');

    // Evita di caricare lo script più volte
    if (this.scriptLoaded) {
      console.log('>>> Script già caricato, nessuna azione necessaria');
      return;
    }

    // Controlla se lo script è già presente nel DOM
    if (document.querySelector('script[src*="recaptcha/api.js"]')) {
      console.log('>>> Script reCAPTCHA già presente nel DOM');
      this.scriptLoaded = true;
      return;
    }

    console.log('>>> Creazione elemento script per reCAPTCHA');
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}&onload=onRecaptchaLoaded`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('>>> Script reCAPTCHA caricato con successo (evento onload)');
    };

    script.onerror = (error) => {
      console.error(
        '>>> Errore nel caricamento dello script reCAPTCHA:',
        error
      );
    };

    document.head.appendChild(script);
    console.log('>>> Script reCAPTCHA aggiunto al DOM');
    this.scriptLoaded = true;
  }

  /**
   * Esegue la verifica reCAPTCHA per l'azione specificata
   * @param actionId Identificatore dell'azione (es. 'whatsapp', 'mailto')
   * @param callback Funzione da chiamare dopo la verifica
   */
  executeRecaptcha(actionId: string, callback: (token?: string) => void): void {
    console.log(`>>> executeRecaptcha chiamato per azione: ${actionId}`);

    // Bypass in ambiente di sviluppo
    if (
      !isPlatformBrowser(this.platformId) ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      console.log('>>> Ambiente di sviluppo o SSR: bypass del reCAPTCHA');
      callback();
      return;
    }

    console.log('>>> Attesa caricamento reCAPTCHA...');

    // Attende che reCAPTCHA sia caricato
    this.waitForRecaptcha()
      .then(() => {
        console.log(
          ">>> reCAPTCHA caricato con successo, pronto per l'esecuzione"
        );

        try {
          console.log('>>> Chiamata a grecaptcha.ready()');

          window.grecaptcha.ready(() => {
            console.log('>>> grecaptcha.ready() completato, esecuzione azione');

            console.log(
              '>>> Chiamata a grecaptcha.execute()',
              this.siteKey,
              actionId
            );
            window.grecaptcha
              .execute(this.siteKey, { action: actionId })
              .then((token: string) => {
                console.log(
                  `>>> Token reCAPTCHA generato per ${actionId}:`,
                  token.substring(0, 20) + '...'
                );

                // Qui potresti anche inviare il token al tuo backend per verifica
                // come ulteriore livello di sicurezza

                console.log('>>> Chiamata alla callback con token');
                callback(token);
              })
              .catch((error: any) => {
                console.error('>>> Errore nella verifica reCAPTCHA:', error);

                // Decide se vuoi essere più o meno severo in caso di errore
                // Qui procediamo comunque, ma puoi scegliere di bloccare l'azione
                console.log(
                  '>>> Chiamata alla callback senza token a causa di errore'
                );
                callback();
              });
          });
        } catch (error) {
          console.error(">>> Errore durante l'esecuzione di reCAPTCHA:", error);
          console.log(
            '>>> Chiamata alla callback senza token a causa di errore try/catch'
          );
          callback();
        }
      })
      .catch((error) => {
        console.error('>>> Timeout nel caricamento di reCAPTCHA:', error);
        console.log(
          '>>> Chiamata alla callback senza token a causa di timeout'
        );
        callback();
      });
  }

  /**
   * Attende che reCAPTCHA sia caricato o raggiunge il timeout
   * @returns Promise che si risolve quando reCAPTCHA è pronto o si rifiuta dopo il timeout
   */
  private waitForRecaptcha(): Promise<void> {
    console.log('>>> waitForRecaptcha: inizio attesa');

    return new Promise((resolve, reject) => {
      // Se grecaptcha è già disponibile, risolvi immediatamente
      if (window.grecaptcha && window.grecaptcha.ready) {
        console.log('>>> grecaptcha già disponibile, risoluzione immediata');
        resolve();
        return;
      }

      console.log('>>> grecaptcha non ancora disponibile, inizio polling');

      // Altrimenti, controlla periodicamente
      let attempts = 0;
      const maxAttempts = 20; // 10 secondi massimo (20 * 500ms)

      const interval = setInterval(() => {
        attempts++;
        console.log(
          `>>> Tentativo ${attempts}/${maxAttempts} di trovare grecaptcha`
        );

        if (window.grecaptcha && window.grecaptcha.ready) {
          console.log('>>> grecaptcha trovato, risoluzione promise');
          clearInterval(interval);
          resolve();
          return;
        }

        if (attempts >= maxAttempts) {
          console.error(`>>> Timeout dopo ${maxAttempts} tentativi`);
          clearInterval(interval);
          reject(new Error('Timeout caricamento reCAPTCHA'));
        }
      }, 500);
    });
  }
}
