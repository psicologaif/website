/**
 * Cookie Consent Management Utility
 *
 * Gestisce il consenso cookie per conformità GDPR:
 * - Salva preferenze utente in localStorage
 * - Dispatcha custom event quando consenso è concesso
 * - Fornisce API per controllare lo stato del consenso
 */

const STORAGE_KEY = "ioana_frale_cookie_consent";
const CONSENT_GRANTED_EVENT = "cookie:consent-granted";

export type ConsentValue = "accepted" | "rejected" | null;

/**
 * Legge il consenso cookie salvato in localStorage
 * @returns "accepted" | "rejected" | null se non ancora impostato
 */
export function getCookieConsent(): ConsentValue {
  if (typeof window === "undefined") return null;

  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "accepted" || value === "rejected") {
      return value;
    }
    return null;
  } catch (error) {
    console.error("Errore lettura cookie consent:", error);
    return null;
  }
}

/**
 * Salva il consenso cookie in localStorage
 * @param value - "accepted" o "rejected"
 */
export function setCookieConsent(value: "accepted" | "rejected"): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, value);

    // Dispatcha evento solo se consenso accettato
    if (value === "accepted") {
      const event = new CustomEvent(CONSENT_GRANTED_EVENT);
      document.dispatchEvent(event);
    }
  } catch (error) {
    console.error("Errore salvataggio cookie consent:", error);
  }
}

/**
 * Mostra il banner cookie (rimuove attributo hidden)
 */
export function showCookieBanner(): void {
  if (typeof window === "undefined") return;

  const banner = document.getElementById("cookie-banner");
  if (banner) {
    banner.removeAttribute("hidden");
    banner.setAttribute("aria-hidden", "false");

    // Focus sul primo bottone per accessibility
    const acceptButton = banner.querySelector<HTMLButtonElement>(
      'button[data-action="accept"]',
    );
    if (acceptButton) {
      // Small delay per permettere al banner di renderizzare
      setTimeout(() => acceptButton.focus(), 100);
    }
  }
}

/**
 * Nasconde il banner cookie (aggiunge attributo hidden)
 */
export function hideCookieBanner(): void {
  if (typeof window === "undefined") return;

  const banner = document.getElementById("cookie-banner");
  if (banner) {
    banner.setAttribute("hidden", "");
    banner.setAttribute("aria-hidden", "true");
  }
}

/**
 * Gestisce il click sul bottone "Accetta"
 */
function handleAccept(): void {
  setCookieConsent("accepted");
  hideCookieBanner();
}

/**
 * Gestisce il click sul bottone "Rifiuta"
 */
function handleReject(): void {
  setCookieConsent("rejected");
  hideCookieBanner();
}

/**
 * Gestisce il tasto ESC per chiudere il banner (come "Rifiuta")
 */
function handleEscapeKey(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    const banner = document.getElementById("cookie-banner");
    if (banner && !banner.hasAttribute("hidden")) {
      handleReject();
    }
  }
}

/**
 * Inizializza la gestione del cookie consent
 * - Controlla se consenso già dato
 * - Mostra banner se necessario
 * - Imposta event listeners
 */
export function initCookieConsent(): void {
  if (typeof window === "undefined") return;

  // Controlla se consenso già dato
  const consent = getCookieConsent();

  if (consent === null) {
    // Nessun consenso ancora dato, mostra banner
    showCookieBanner();
  } else {
    // Consenso già dato, assicurati che banner sia nascosto
    hideCookieBanner();

    // Se accettato, dispatcha evento per eventuali listener (es. GA4)
    if (consent === "accepted") {
      const event = new CustomEvent(CONSENT_GRANTED_EVENT);
      document.dispatchEvent(event);
    }
  }

  // Event listeners per bottoni
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;

  const acceptButton = banner.querySelector<HTMLButtonElement>(
    'button[data-action="accept"]',
  );
  const rejectButton = banner.querySelector<HTMLButtonElement>(
    'button[data-action="reject"]',
  );

  if (acceptButton) {
    acceptButton.addEventListener("click", handleAccept);
  }

  if (rejectButton) {
    rejectButton.addEventListener("click", handleReject);
  }

  // ESC key listener
  document.addEventListener("keydown", handleEscapeKey);

  // Focus trap: limita tab navigation ai bottoni del banner
  if (consent === null) {
    setupFocusTrap(banner, acceptButton, rejectButton);
  }
}

/**
 * Imposta focus trap sul banner per accessibility
 */
function setupFocusTrap(
  banner: HTMLElement,
  acceptButton: HTMLButtonElement | null,
  rejectButton: HTMLButtonElement | null,
): void {
  if (!acceptButton || !rejectButton) return;

  const focusableElements = [acceptButton, rejectButton];

  banner.addEventListener("keydown", (event) => {
    // Solo se banner è visibile
    if (banner.hasAttribute("hidden")) return;

    if (event.key === "Tab") {
      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLButtonElement,
      );

      if (event.shiftKey) {
        // Shift + Tab (backward)
        event.preventDefault();
        const prevIndex =
          currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex].focus();
      } else {
        // Tab (forward)
        event.preventDefault();
        const nextIndex =
          currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
        focusableElements[nextIndex].focus();
      }
    }
  });
}
