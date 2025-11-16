import React from 'react';
import Header from '@/components/homepage/Header';
import Footer from '../components/homepage/Footer'
import SEO from "../components/SEO/SEO";
import LegalArticle from "@/components/legal/LegalArticle";
import { cguArticles } from "../constants/cguArticles";

const Cgu = () => {
  return (
    <div>
      {/* Page SEO  */}
      <SEO
        title="Ma Gestion Immo — Conditions Générales d'Utilisation"
        description="Conditions Générales d’Utilisation de Ma Gestion Immo : accès et usage du service, obligations et responsabilités, confidentialité et propriété intellectuelle."
      />

      <Header className="bg-primary h-[80px] shadow-lg" />
      <div className="max-w-4xl mx-auto px-6 py-16 mt-16 text-gray-800">
        <h1 className="text-3xl font-bold mb-8">Conditions Générales d’Utilisation</h1>

        {cguArticles.map((art) => (
          <LegalArticle key={art.id || art.title} title={art.title} id={art.id}>
            {art.children}
          </LegalArticle>
        ))}

        <p className="text-sm text-gray-500 mt-12">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Cgu;
