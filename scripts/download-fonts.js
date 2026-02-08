import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = path.join(__dirname, "../public/fonts");

if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

const fonts = [
  {
    family: "playfair-display",
    variants: ["regular", "600", "700", "italic"],
    subsets: ["latin", "latin-ext"],
  },
  {
    family: "inter",
    variants: ["regular", "500", "600"],
    subsets: ["latin", "latin-ext"],
  },
  {
    family: "dancing-script",
    variants: ["regular"],
    subsets: ["latin", "latin-ext"],
  },
];

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`),
          );
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
};

const fetchFontData = (family, variants, subsets) => {
  const url = `https://gwfh.mranftl.com/api/fonts/${family}?subsets=${subsets.join(",")}&variants=${variants.join(",")}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data)));
      res.on("error", reject);
    });
  });
};

async function main() {
  console.log("Downloading fonts...");

  let cssContent = "/* Auto-generated font faces */\n\n";

  for (const font of fonts) {
    console.log(`Processing ${font.family}...`);
    try {
      const data = await fetchFontData(
        font.family,
        font.variants,
        font.subsets,
      );

      for (const variant of data.variants) {
        const fontUrl = variant.woff2; // Prefer woff2
        const filename = path.basename(fontUrl);
        const dest = path.join(FONTS_DIR, filename);

        if (!fs.existsSync(dest)) {
          console.log(`  Downloading ${filename}...`);
          await downloadFile(fontUrl, dest);
        } else {
          console.log(`  Skipping ${filename} (exists)`);
        }

        // Generate CSS
        cssContent += `
@font-face {
  font-family: '${data.family}';
  font-style: ${variant.fontStyle};
  font-weight: ${variant.fontWeight};
  font-display: swap;
  src: url('/fonts/${filename}') format('woff2');
}
`;
      }
    } catch (error) {
      console.error(`Error processing ${font.family}:`, error);
    }
  }

  // We can output CSS to a file or print it. For now, let's write to src/styles/fonts.css
  const cssPath = path.join(__dirname, "../src/styles/fonts.css");
  fs.writeFileSync(cssPath, cssContent);
  console.log(`Font CSS written to ${cssPath}`);
}

main();
