export const contactInfo = {
  email: 'psicologa.frale@gmail.com',
  subject: 'Richiesta appuntamento',
  body: `Salve Dottoressa,

Mi chiamo [inserisci qui il tuo nome] e sono interessato/a a intraprendere un percorso di psicoterapia.
Vorrei chiederle un appuntamento per un primo colloquio conoscitivo, sarei disponibile per un incontro [inserisci online/in presenza]
nei giorni [inserisci giorni/ore disponibilità].
La ringrazio per la sua disponibilità ed attendo una sua risposta.

Cordiali saluti.`,
};

export function getMailtoLink(): string {
  const subject = encodeURIComponent(contactInfo.subject);
  const body = encodeURIComponent(contactInfo.body);
  return `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
}

export function getTextWhatsapp(): string {
  const number = '393286739086';
  const text = encodeURIComponent(contactInfo.body);
  return `https://wa.me/${number}?text=${text}`;
}
