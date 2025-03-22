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
    if (isPlatformBrowser(this.platformId)) {
      // Imposta la callback globale
      window.onRecaptchaLoaded = () => {
        this.captchaLoaded = true;
        console.log('reCAPTCHA loaded successfully');
      };

      // Carica lo script reCAPTCHA se non è già stato caricato
      this.loadRecaptchaScript();
    }
  }

  /**
   * Carica dinamicamente lo script reCAPTCHA v3
   */
  private loadRecaptchaScript(): void {
    // Evita di caricare lo script più volte
    if (this.scriptLoaded) return;

    // Controlla se lo script è già presente nel DOM
    if (document.querySelector('script[src*="recaptcha/api.js"]')) {
      this.scriptLoaded = true;
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}&onload=onRecaptchaLoaded`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error('Errore nel caricamento dello script reCAPTCHA');
    };

    document.head.appendChild(script);
    this.scriptLoaded = true;
  }

  /**
   * Esegue la verifica reCAPTCHA per l'azione specificata
   * @param actionId Identificatore dell'azione (es. 'whatsapp', 'mailto')
   * @param callback Funzione da chiamare dopo la verifica
   */
  executeRecaptcha(actionId: string, callback: (token?: string) => void): void {
    // Bypass in ambiente di sviluppo
    if (
      !isPlatformBrowser(this.platformId) ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      console.log('Ambiente di sviluppo o SSR: bypass del reCAPTCHA');
      callback();
      return;
    }

    // Attende che reCAPTCHA sia caricato
    this.waitForRecaptcha()
      .then(() => {
        try {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(this.siteKey, { action: actionId })
              .then((token: string) => {
                console.log(`Token reCAPTCHA per ${actionId}:`, token);

                // Qui potresti anche inviare il token al tuo backend per verifica
                // come ulteriore livello di sicurezza

                callback(token);
              })
              .catch((error: any) => {
                console.error('Errore nella verifica reCAPTCHA:', error);

                // Decide se vuoi essere più o meno severo in caso di errore
                // Qui procediamo comunque, ma puoi scegliere di bloccare l'azione
                callback();
              });
          });
        } catch (error) {
          console.error("Errore durante l'esecuzione di reCAPTCHA:", error);
          callback();
        }
      })
      .catch(() => {
        console.error('Timeout nel caricamento di reCAPTCHA');
        callback();
      });
  }

  /**
   * Attende che reCAPTCHA sia caricato o raggiunge il timeout
   * @returns Promise che si risolve quando reCAPTCHA è pronto o si rifiuta dopo il timeout
   */
  private waitForRecaptcha(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Se grecaptcha è già disponibile, risolvi immediatamente
      if (window.grecaptcha && window.grecaptcha.ready) {
        resolve();
        return;
      }

      // Altrimenti, controlla periodicamente
      let attempts = 0;
      const maxAttempts = 20; // 10 secondi massimo (20 * 500ms)

      const interval = setInterval(() => {
        attempts++;

        if (window.grecaptcha && window.grecaptcha.ready) {
          clearInterval(interval);
          resolve();
          return;
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error('Timeout caricamento reCAPTCHA'));
        }
      }, 500);
    });
  }
}
