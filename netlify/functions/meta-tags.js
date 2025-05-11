// netlify/functions/meta-tags.js
const axios = require("axios");

// Questa funzione sarà invocata quando un crawler di social media richiede un articolo
exports.handler = async (event) => {
  // Estrai l'ID dell'articolo dal percorso URL
  const path = event.path;
  const match = path.match(/\/blog\/articolo\/(\d+)/);

  if (!match) {
    // Reindirizza alla pagina normale se non è un URL di un articolo
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: "<!DOCTYPE html><html><head><meta http-equiv='refresh' content='0; url=/'></head><body></body></html>",
    };
  }

  const articleId = parseInt(match[1], 10);

  try {
    // Recupera i dati dell'articolo utilizzando la stessa logica del tuo service
    const articolo = await getArticoloFromGoogleSheets(articleId);

    if (!articolo) {
      return {
        statusCode: 404,
        body: "Articolo non trovato",
      };
    }

    // Costruisci l'HTML con i meta tag corretti
    const html = `
        <!DOCTYPE html>
        <html lang="it">
        <head>
          <meta charset="utf-8" />
          <title>${articolo.titolo} - Psicologa Ioana Frale</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          <meta name="description" content="${articolo.descrizione}" />
          
          <!-- Open Graph per condivisione sui social -->
          <meta property="og:title" content="${articolo.titolo}" />
          <meta property="og:description" content="${
            articolo.sottotitolo || articolo.descrizione
          }" />
          <meta property="og:image" content="${articolo.immagine}" />
          <meta property="og:url" content="https://psicologaioanafrale.netlify.app/blog/articolo/${
            articolo.id
          }" />
          <meta property="og:type" content="article" />
          <meta property="og:locale" content="it_IT" />
          
          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${articolo.titolo}" />
          <meta name="twitter:description" content="${
            articolo.sottotitolo || articolo.descrizione
          }" />
          <meta name="twitter:image" content="${articolo.immagine}" />
          
          <!-- Reindirizza alla SPA dopo alcuni secondi (solo per i browser) -->
          <meta http-equiv="refresh" content="0; url=/blog/articolo/${
            articolo.id
          }" />
        </head>
        <body>
          <p>Reindirizzamento in corso...</p>
        </body>
        </html>
      `;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
      },
      body: html,
    };
  } catch (error) {
    console.error("Errore:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore del server" }),
    };
  }
};

// Implementazione della funzione per recuperare i dati da Google Sheets API
// Adattata dal tuo ArticoloService
async function getArticoloFromGoogleSheets(id) {
  try {
    // Utilizza il tuo SHEET_ID - prendilo dalle variabili d'ambiente oppure definiscilo qui
    const SHEET_ID = process.env.SHEET_ID; // Configura questa variabile nelle impostazioni di Netlify

    // Utilizza la tua API_KEY - prendila dalle variabili d'ambiente
    const API_KEY = process.env.API_KEY_GOOGLE_SHEETS; // Configura questa variabile nelle impostazioni di Netlify

    // Stessa URL che usi nel service
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/articoli?key=${API_KEY}`;

    // Esegui la richiesta
    const response = await axios.get(url);

    if (
      !response.data ||
      !response.data.values ||
      response.data.values.length < 2
    ) {
      console.error(
        "Dati non validi ricevuti da Google Sheets:",
        response.data
      );
      return null;
    }

    // Estrai headers e valori (come fai nel service)
    const headers = response.data.values[0];
    const rows = response.data.values.slice(1);

    // Trova l'articolo con l'ID richiesto
    const articoloRow = rows.find((row, index) => index + 1 === id);

    if (!articoloRow) {
      console.error(`Articolo con ID ${id} non trovato`);
      return null;
    }

    // Crea l'oggetto articolo (come fai nel service)
    const articolo = { id: id };

    headers.forEach((header, i) => {
      const normalizedHeader = normalizeHeader(header);
      articolo[normalizedHeader] = articoloRow[i] || "";
    });

    // Assicurati che l'URL dell'immagine sia completo
    if (articolo.immagine && !articolo.immagine.startsWith("http")) {
      articolo.immagine = `https://psicologaioanafrale.netlify.app${articolo.immagine}`;
    }

    return articolo;
  } catch (error) {
    console.error("Errore nel recupero dati da Google Sheets:", error);
    throw error;
  }
}

// Utility per normalizzare l'header (come hai nel tuo service)
function normalizeHeader(header) {
  return header.replace(/^"(.*)"$/, "$1").toLowerCase();
}
