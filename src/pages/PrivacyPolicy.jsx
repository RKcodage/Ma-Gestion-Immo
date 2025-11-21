import React from 'react';
import Header from '@/components/homepage/Header';
import Footer from '@/components/homepage/Footer';
import LegalArticle from "@/components/legal/LegalArticle";
import { privacyArticles } from "@/constants/privacyArticles";
import SEO from "../components/SEO/SEO";

const PrivacyPolicy = () => {
  return (
    <div>
      {/* Page SEO  */}
      <SEO
        title="Ma Gestion Immo — Politique de confidentialité"
        description="Politique de confidentialité de Ma Gestion Immo : données collectées, finalités, base légale, durée de conservation et vos droits RGPD."
      />
      <Header className="bg-primary h-[80px] shadow-lg" />
      <main className="max-w-4xl mx-auto px-6 py-16 mt-16 text-gray-800">
        <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>

        {privacyArticles.map((art) => (
          <LegalArticle key={art.id || art.title} title={art.title} id={art.id}>
            {art.children}
          </LegalArticle>
        ))}

        <p className="text-sm text-gray-500 mt-12">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
