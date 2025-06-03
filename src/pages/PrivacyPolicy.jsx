import React from 'react';
import Header from '@/components/homepage/Header';
import Footer from '@/components/homepage/Footer';

const PrivacyPolicy = () => {
  return (
    <div>
      <Header className="bg-primary h-[80px] shadow-lg" />
      <main className="max-w-4xl mx-auto px-6 py-16 mt-16 text-gray-800">
        <h1 className="text-3xl font-bold mb-8">Politique de confidentialité</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">1. Collecte des données</h2>
          <p>
            Nous collectons uniquement les données nécessaires au bon fonctionnement de notre service :
            nom, prénom, adresse e-mail, numéro de téléphone, données de location et documents liés aux baux.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">2. Utilisation des données</h2>
          <p>
            Les données sont utilisées pour vous permettre de gérer vos locations, communiquer entre utilisateurs, et générer les documents nécessaires.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">3. Partage des données</h2>
          <p>
            Aucune donnée personnelle n’est vendue ni cédée. Les données sont accessibles uniquement à l’utilisateur concerné
            et, le cas échéant, à l’administrateur du service à des fins de support technique.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">4. Stockage et sécurité</h2>
          <p>
            Les données sont stockées de manière sécurisée via notre base de données hébergée chez Netlify/Cloud provider.
            Toutes les communications sont chiffrées via HTTPS.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">5. Vos droits</h2>
          <p>
            Conformément au RGPD, vous avez un droit d'accès, de rectification et de suppression de vos données.
            Pour exercer ces droits, contactez-nous à : <a href="mailto:contact@ma-gestion-immo.fr" className="text-blue-600 underline">contact@ma-gestion-immo.fr</a>.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
