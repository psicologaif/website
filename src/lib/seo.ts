/**
 * SEO Utility - Structured Data Generators
 *
 * Genera JSON-LD structured data per Schema.org
 * Utilizzato per Rich Results su Google e altri motori di ricerca
 */

export interface LocalBusinessConfig {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  priceRange?: string;
  image: string;
  openingHours?: string[];
}

export interface PersonConfig {
  name: string;
  givenName?: string;
  familyName?: string;
  jobTitle: string;
  description: string;
  url: string;
  image: string;
  email?: string;
  telephone?: string;
  sameAs?: string[]; // Social media profiles
}

export interface WebPageConfig {
  name: string;
  description: string;
  url: string;
  image?: string;
}

export interface ArticleConfig {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo: string;
  };
}

/**
 * Genera schema LocalBusiness per studio di psicologia
 */
export function generateLocalBusinessSchema(
  config: LocalBusinessConfig,
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${config.url}#business`,
    name: config.name,
    description: config.description,
    url: config.url,
    telephone: config.telephone,
    ...(config.email && { email: config.email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: config.address.streetAddress,
      addressLocality: config.address.addressLocality,
      addressRegion: config.address.addressRegion,
      postalCode: config.address.postalCode,
      addressCountry: config.address.addressCountry,
    },
    ...(config.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: config.geo.latitude,
        longitude: config.geo.longitude,
      },
    }),
    ...(config.priceRange && { priceRange: config.priceRange }),
    image: config.image,
    ...(config.openingHours && { openingHours: config.openingHours }),
  };

  return JSON.stringify(schema);
}

/**
 * Genera schema Person per professionista
 */
export function generatePersonSchema(config: PersonConfig): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${config.url}#person`,
    name: config.name,
    ...(config.givenName && { givenName: config.givenName }),
    ...(config.familyName && { familyName: config.familyName }),
    jobTitle: config.jobTitle,
    description: config.description,
    url: config.url,
    image: config.image,
    ...(config.email && { email: config.email }),
    ...(config.telephone && { telephone: config.telephone }),
    ...(config.sameAs &&
      config.sameAs.length > 0 && { sameAs: config.sameAs }),
  };

  return JSON.stringify(schema);
}

/**
 * Genera schema WebPage generico
 */
export function generateWebPageSchema(config: WebPageConfig): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.name,
    description: config.description,
    url: config.url,
    ...(config.image && { image: config.image }),
  };

  return JSON.stringify(schema);
}

/**
 * Genera schema Article per blog post
 */
export function generateArticleSchema(config: ArticleConfig): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: config.headline,
    description: config.description,
    url: config.url,
    image: config.image,
    datePublished: config.datePublished,
    ...(config.dateModified && { dateModified: config.dateModified }),
    author: {
      "@type": "Person",
      name: config.author.name,
      ...(config.author.url && { url: config.author.url }),
    },
    publisher: {
      "@type": "Organization",
      name: config.publisher.name,
      logo: {
        "@type": "ImageObject",
        url: config.publisher.logo,
      },
    },
  };

  return JSON.stringify(schema);
}

/**
 * Genera schema ProfessionalService per servizi professionali
 * Utile per studi di psicologia, psicoterapia, etc.
 */
export function generateProfessionalServiceSchema(
  config: LocalBusinessConfig,
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${config.url}#service`,
    name: config.name,
    description: config.description,
    url: config.url,
    telephone: config.telephone,
    ...(config.email && { email: config.email }),
    address: {
      "@type": "PostalAddress",
      streetAddress: config.address.streetAddress,
      addressLocality: config.address.addressLocality,
      addressRegion: config.address.addressRegion,
      postalCode: config.address.postalCode,
      addressCountry: config.address.addressCountry,
    },
    ...(config.priceRange && { priceRange: config.priceRange }),
    image: config.image,
    ...(config.openingHours && { openingHours: config.openingHours }),
  };

  return JSON.stringify(schema);
}
