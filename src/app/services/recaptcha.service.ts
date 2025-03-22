import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare global {
  interface Window {
    grecaptcha: any;
    onCaptchaSuccess: (token: string) => void;
    recaptchaLoaded: boolean;
  }
}

@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  private captchaSubject = new Subject<string>();
  private pendingAction: string | null = null;
  private actionCallbacks = new Map<string, () => void>();

  constructor() {
    // Imposta la callback globale
    window.onCaptchaSuccess = this.onCaptchaVerified.bind(this);
  }

  /**
   * Esegue una verifica reCAPTCHA e poi esegue il callback associato
   * @param actionId Identificatore univoco dell'azione
   * @param callback Funzione da eseguire dopo la verifica
   */
  executeRecaptcha(actionId: string, callback: () => void): void {
    // Salva l'azione e il callback
    this.pendingAction = actionId;
    this.actionCallbacks.set(actionId, callback);

    // Verifica se siamo in ambiente di sviluppo
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      console.log('Ambiente di sviluppo: bypass del reCAPTCHA');
      this.executeCallback(actionId);
      return;
    }

    // Controlla se reCAPTCHA è stato caricato
    if (
      window.recaptchaLoaded &&
      window.grecaptcha &&
      window.grecaptcha.execute
    ) {
      try {
        window.grecaptcha.execute();
      } catch (error) {
        console.error("Errore durante l'esecuzione di reCAPTCHA:", error);
        alert(
          'Si è verificato un errore durante la verifica di sicurezza. Riprova.'
        );
      }
    } else {
      console.error('reCAPTCHA non caricato correttamente');
      alert(
        'Il sistema di sicurezza non è stato caricato correttamente. Ricarica la pagina e riprova.'
      );
      // NON eseguire il callback in caso di errore in produzione
    }
  }

  private onCaptchaVerified(token: string): void {
    if (token && this.pendingAction) {
      this.captchaSubject.next(token);
      this.executeCallback(this.pendingAction);

      // Reset captcha
      if (window.grecaptcha && window.grecaptcha.reset) {
        window.grecaptcha.reset();
      }
    }
  }

  private executeCallback(actionId: string): void {
    const callback = this.actionCallbacks.get(actionId);
    if (callback) {
      callback();
      this.actionCallbacks.delete(actionId);
    }
    this.pendingAction = null;
  }

  // Opzionale: Observable per chi vuole accedere al token
  getCaptchaResponse(): Observable<string> {
    return this.captchaSubject.asObservable();
  }
}
