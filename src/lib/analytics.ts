/**
 * Google Analytics 4 Integration
 *
 * Lazy loading GA4 dopo consenso cookie + tracking eventi personalizzati
 * - Carica gtag.js solo quando utente accetta cookie
 * - Fornisce wrapper per eventi custom (WhatsApp, scroll depth, clicks)
 * - Utilizza IntersectionObserver per tracking scroll depth
 */

// Extend Window interface per gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Inizializza Google Analytics 4 dinamicamente
 * Carica lo script gtag.js e configura il tracking
 *
 * @param measurementId - GA4 Measurement ID (formato: G-XXXXXXXXXX)
 */
export function initGoogleAnalytics(measurementId: string): void {
  if (typeof window === "undefined") return;
  if (!measurementId) {
    console.warn("GA4 Measurement ID non fornito");
    return;
  }

  // Evita doppia inizializzazione
  if (typeof window.gtag !== "undefined") {
    console.log("GA4 già inizializzato");
    return;
  }

  // Inject script tag dinamicamente
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.async = true;
  document.head.appendChild(script);

  // Inizializza dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true, // Anonimizza IP per GDPR
    cookie_flags: "SameSite=None;Secure",
  });

  console.log("Google Analytics 4 inizializzato:", measurementId);
}

/**
 * Traccia un evento personalizzato in GA4
 *
 * @param eventName - Nome dell'evento (es. "contact_whatsapp_click")
 * @param params - Parametri aggiuntivi dell'evento
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, any>,
): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "undefined") {
    console.warn("GA4 non inizializzato, evento non tracciato:", eventName);
    return;
  }

  window.gtag("event", eventName, params);
  console.log("GA4 evento tracciato:", eventName, params);
}

/**
 * Imposta tracking automatico per click su link WhatsApp
 * Traccia quale bottone WhatsApp è stato cliccato (hero, contact, navbar)
 */
export function setupWhatsAppTracking(): void {
  if (typeof window === "undefined") return;

  // Trova tutti i link WhatsApp
  const whatsappLinks = document.querySelectorAll<HTMLAnchorElement>(
    'a[href*="wa.me"], a[href*="whatsapp.com"]',
  );

  whatsappLinks.forEach((link) => {
    // Determina la posizione del bottone
    const section = link.closest("section")?.id || "unknown";
    const navbar = link.closest("header, nav");
    const location = navbar ? "navbar" : section;

    link.addEventListener("click", () => {
      trackEvent("contact_whatsapp_click", {
        event_category: "contact",
        event_label: location,
        transport_type: "beacon", // Assicura invio anche se pagina cambia
      });
    });
  });

  console.log(
    `GA4: Tracking WhatsApp configurato su ${whatsappLinks.length} link`,
  );
}

/**
 * Imposta tracking profondità scroll con IntersectionObserver
 * Traccia quando l'utente raggiunge 25%, 50%, 75%, 100% delle sezioni
 *
 * @param sectionIds - Array di ID sezioni da tracciare (es. ['hero', 'chi-sono', 'servizi'])
 */
export function setupScrollDepthTracking(sectionIds: string[]): void {
  if (typeof window === "undefined") return;

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null);

  if (sections.length === 0) {
    console.warn("GA4: Nessuna sezione trovata per scroll tracking");
    return;
  }

  const trackedSections = new Set<string>();
  const totalSections = sections.length;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;

          // Traccia solo una volta per sezione
          if (!trackedSections.has(sectionId)) {
            trackedSections.add(sectionId);

            // Calcola percentuale di completamento
            const percentage = Math.round(
              (trackedSections.size / totalSections) * 100,
            );

            trackEvent("scroll_depth", {
              event_category: "engagement",
              section_id: sectionId,
              scroll_percentage: percentage,
              sections_viewed: trackedSections.size,
              total_sections: totalSections,
            });
          }
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Considera "vista" quando almeno 50% è visibile
    },
  );

  // Osserva tutte le sezioni
  sections.forEach((section) => observer.observe(section));

  console.log(`GA4: Scroll depth tracking configurato su ${sections.length} sezioni`);
}

/**
 * Imposta tracking per click su card (servizi, progetti, blog)
 * Utilizza event delegation per performance
 *
 * @param cardSelector - Selettore CSS per le card da tracciare
 * @param cardType - Tipo di card ("service" | "blog" | "project")
 */
export function setupCardClickTracking(
  cardSelector: string,
  cardType: "service" | "blog" | "project",
): void {
  if (typeof window === "undefined") return;

  // Event delegation sul document per gestire card dinamiche
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const card = target.closest(cardSelector);

    if (card) {
      const cardTitle =
        card.getAttribute("data-title") ||
        card.querySelector("h3, h4")?.textContent ||
        "unknown";

      trackEvent("card_click", {
        event_category: "engagement",
        card_type: cardType,
        card_title: cardTitle.trim(),
      });
    }
  });

  console.log(`GA4: Card click tracking configurato per ${cardType}`);
}

/**
 * Imposta tracking per interazioni con caroselli
 * Traccia navigazione con frecce e dots
 */
export function setupCarouselTracking(): void {
  if (typeof window === "undefined") return;

  // Traccia click su frecce di navigazione
  const carouselArrows = document.querySelectorAll(
    '[data-carousel-prev], [data-carousel-next]',
  );

  carouselArrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const carousel = arrow.closest("[data-carousel]");
      const carouselType = carousel?.getAttribute("data-carousel") || "unknown";
      const direction = arrow.hasAttribute("data-carousel-prev")
        ? "prev"
        : "next";

      trackEvent("carousel_navigation", {
        event_category: "engagement",
        carousel_type: carouselType,
        direction: direction,
      });
    });
  });

  // Traccia click su dots di navigazione
  const carouselDots = document.querySelectorAll("[data-carousel-dot]");

  carouselDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const carousel = dot.closest("[data-carousel]");
      const carouselType = carousel?.getAttribute("data-carousel") || "unknown";
      const slideIndex = dot.getAttribute("data-carousel-dot") || "unknown";

      trackEvent("carousel_navigation", {
        event_category: "engagement",
        carousel_type: carouselType,
        navigation_type: "dot",
        slide_index: slideIndex,
      });
    });
  });

  console.log("GA4: Carousel tracking configurato");
}

/**
 * Imposta tutti i tracking avanzati in una singola chiamata
 * Utile per inizializzazione rapida
 *
 * @param sectionIds - Array di ID sezioni per scroll tracking
 */
export function setupAllTracking(sectionIds: string[]): void {
  setupWhatsAppTracking();
  setupScrollDepthTracking(sectionIds);
  setupCardClickTracking("[data-service-card]", "service");
  // Aggiungi altri tracking se necessario
}
