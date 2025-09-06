import React from 'react';
import Header from '@/components/homepage/Header';
import Footer from '../components/homepage/Footer'

const Cgu = () => {
  return (
    <div>
      // Page SEO 
      <SEO
        title="Ma Gestion Immo — Conditions Générales d'Utilisation"
        description="Conditions Générales d’Utilisation de Ma Gestion Immo : accès et usage du service, obligations et responsabilités, confidentialité et propriété intellectuelle."
      />

      <Header className="bg-primary h-[80px] shadow-lg" />
      <div className="max-w-4xl mx-auto px-6 py-16 mt-16 text-gray-800">
        <h1 className="text-3xl font-bold mb-8">Conditions Générales d’Utilisation</h1>

        {/* Article 1 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">1. Objet</h2>
          <p>
            Les présentes conditions générales régissent l'utilisation du site <strong>Ma Gestion Immo</strong>,
            accessible à l'adresse <em>https://ma-gestion-immo.netlify.app/</em>, par les utilisateurs, qu’ils soient propriétaires ou locataires.
          </p>
        </section>

        {/* Article 2 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">2. Acceptation</h2>
          <p>
            En accédant et en utilisant ce site, l'utilisateur accepte pleinement et sans réserve les présentes CGU.
            En cas de désaccord avec ces conditions, l'utilisateur doit cesser immédiatement d'utiliser la plateforme.
          </p>
        </section>

        {/* Article 3 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">3. Services proposés</h2>
          <p>
            Ma Gestion Immo permet aux propriétaires de gérer leurs biens immobiliers et aux locataires de suivre leurs documents et échanges via une interface dédiée.
          </p>
        </section>

        {/* Article 4 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">4. Accès au service</h2>
          <p>
            Le site est accessible 24h/24 et 7j/7, sauf interruption pour maintenance ou cas de force majeure. L’éditeur
            ne peut être tenu responsable de tout dysfonctionnement ou interruption.
          </p>
        </section>

        {/* Article 5 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">5. Obligations de l'utilisateur</h2>
          <p>
            L'utilisateur s’engage à fournir des informations exactes, à respecter la législation en vigueur, et à ne pas
            utiliser la plateforme à des fins frauduleuses ou illicites.
          </p>
        </section>

        {/* Article 6 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">6. Données personnelles</h2>
          <p>
            Les données collectées sont traitées conformément au RGPD. L’utilisateur peut accéder, modifier ou supprimer ses données en contactant l’administrateur à <a href="mailto:contact@ma-gestion-immo.fr" className="text-blue-600 underline">contact@ma-gestion-immo.fr</a>.
          </p>
        </section>

        {/* Article 7 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">7. Propriété intellectuelle</h2>
          <p>
            Le contenu du site (textes, images, code, etc.) est la propriété exclusive de Ma Gestion Immo. Toute reproduction est interdite sans autorisation écrite.
          </p>
        </section>

        {/* Article 8 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">8. Modification des CGU</h2>
          <p>
            L’éditeur se réserve le droit de modifier à tout moment les présentes CGU. L'utilisateur sera informé de toute modification via une mise à jour sur le site.
          </p>
        </section>

        {/* Article 9 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">9. Loi applicable</h2>
          <p>
            Les présentes conditions sont régies par la loi française. Tout litige sera soumis à la juridiction compétente.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Cgu;
