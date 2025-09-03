import React from "react";

export default function TestimonyCard({
  quote,
  author,
  subtitle,        // ex: "Propriétaire à Lyon"
  avatarSrc,       // optionnel
  // rating,       // <— on le laisse possible côté data, mais on ne l'affiche pas
  className = "",
  ...rest
}) {
  return (
    <figure
      className={`bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition text-left ${className}`}
      {...rest}
    >
      <blockquote className="text-gray-700 italic mb-4">
        “{quote}”
      </blockquote>

      <figcaption className="flex items-center gap-3">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={`Avatar de ${author}`}
            className="w-10 h-10 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold"
            aria-hidden="true"
          >
            {author?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}

        <div>
          <div className="text-primary font-semibold">{author}</div>
          {subtitle ? (
            <div className="text-sm text-gray-500">{subtitle}</div>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}
