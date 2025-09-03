import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE = import.meta.env.VITE_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");

export default function SEO({
  title = "Ma Gestion Immo",
  description = "Simplifiez votre gestion locative.",
  image = "/og-cover.jpg",
  noIndex = false, // utile pour les pages privées / dashboard
}) {
  const { pathname } = useLocation();
  const url = `${SITE}${pathname}`;
  const img = image.startsWith("http") ? image : `${SITE}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />

      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph / Twitter de base */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
