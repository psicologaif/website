import { Injectable } from '@angular/core';

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

  constructor() {
    // Imposta la callback globale
    window.onRecaptchaLoaded = () => {
      this.captchaLoaded = true;
      console.log('reCAPTCHA loaded successfully');
    };
  }

  executeRecaptcha(actionId: string, callback: () => void): void {
    // Bypass in ambiente di sviluppo
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      console.log('Ambiente di sviluppo: bypass del reCAPTCHA');
      callback();
      return;
    }

    if (!window.grecaptcha || !window.grecaptcha.ready) {
      console.error('reCAPTCHA non caricato correttamente');
      alert(
        'Il sistema di sicurezza non è stato caricato correttamente. Ricarica la pagina e riprova.'
      );
      return;
    }

    window.grecaptcha.ready(() => {
      try {
        window.grecaptcha
          .execute(this.siteKey, { action: actionId })
          .then((token: string) => {
            console.log('Token generato:', token);
            callback();
          })
          .catch((error: any) => {
            console.error('Errore nella verifica reCAPTCHA:', error);
            alert('Errore durante la verifica di sicurezza. Riprova.');
          });
      } catch (error) {
        console.error("Errore durante l'esecuzione di reCAPTCHA:", error);
        alert(
          'Si è verificato un errore durante la verifica di sicurezza. Riprova.'
        );
      }
    });
  }
}
