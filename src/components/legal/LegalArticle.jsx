import React from "react";

// Reusable article section for legal pages (CGU, Privacy, etc.)
// - Props: title (string), children (content), id (optional anchor id)
// - Keeps a consistent spacing and heading style
export default function LegalArticle({ title, children, id }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="space-y-3 text-gray-800 text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}

