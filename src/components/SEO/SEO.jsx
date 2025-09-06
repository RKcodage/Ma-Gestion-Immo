import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE =
  import.meta.env.VITE_SITE_URL;

export default function SEO({
  title = "Ma Gestion Immo",
  description = "Simplifiez votre gestion locative.",
  image = "/SEO/seo-img.jpg", 
  noIndex = false, // useful for private pages 
}) 
{
  const { pathname } = useLocation();
  const url = `${SITE}${pathname}`;
  const img = image.startsWith("http") ? image : `${SITE}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />

      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ma Gestion Immo" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}
