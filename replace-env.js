const fs = require("fs");
const path = require("path");

// Percorso al file index.html generato
const indexPath = path.resolve(__dirname, "dist/psychologist/index.html");

// Leggi il file index.html
fs.readFile(indexPath, "utf8", (err, data) => {
  if (err) {
    return console.log("Errore nella lettura del file index.html:", err);
  }

  // Crea lo script che conterrà la variabile d'ambiente
  const envScript = `<script>window.env = { API_KEY_GOOGLE_SHEETS: "${process.env.API_KEY_GOOGLE_SHEETS}" };</script>`;

  // Inserisci lo script prima della chiusura del tag head
  const result = data.replace("</head>", `${envScript}</head>`);

  // Scrivi il file modificato
  fs.writeFile(indexPath, result, "utf8", (err) => {
    if (err)
      return console.log("Errore nella scrittura del file index.html:", err);
    console.log("Variabile d'ambiente iniettata con successo!");
  });
});
