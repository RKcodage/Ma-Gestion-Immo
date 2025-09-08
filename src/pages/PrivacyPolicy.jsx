import React from 'react';
import Header from '@/components/homepage/Header';
import Footer from '@/components/homepage/Footer';
import LegalArticle from "@/components/legal/LegalArticle";
import { privacyArticles } from "@/constants/privacyArticles";

const PrivacyPolicy = () => {
  return (
    <div>
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
