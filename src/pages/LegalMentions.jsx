import React from 'react'
import Header from '@/components/homepage/Header'
import Footer from '../components/homepage/Footer'
import { Link } from 'react-router-dom'

const LegalMentions = () => {
  return (
    <div>
      <Header className="bg-primary h-[80px] shadow-lg"/>

      <div className="max-w-4xl mx-auto px-6 py-16 mt-16 text-gray-800">
        <h1 className="text-3xl font-bold mb-8">Mentions légales</h1>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Éditeur du site</h2>
          <p>
            Ce site est édité par <strong>Ma Gestion Immo</strong>, projet développé par Rayan Kabra.
          </p>
          <p className="text-sm text-gray-500 mt-1">Contact : contact@ma-gestion-immo.fr</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Responsable de la publication</h2>
          <p>Rayan Kabra</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Hébergement</h2>
          <p>
            Le site est hébergé par :<br />
            <strong>Netlify, Inc.</strong><br />
            44 Montgomery Street, Suite 300<br />
            San Francisco, California 94104, USA<br />
            <a href="https://www.netlify.com" className="text-blue-600 underline">https://www.netlify.com</a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            L’hébergeur assure uniquement un service d’hébergement technique. Il n’est pas responsable du contenu publié.
          </p>

        </section>


        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Propriété intellectuelle</h2>
          <p>
            Tous les contenus présents sur ce site (textes, images, logos, vidéos, code source, etc.)
            sont la propriété exclusive de Rayan Kabra, sauf mentions contraires. Toute reproduction ou diffusion
            sans autorisation écrite est strictement interdite.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Données personnelles</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), les données personnelles collectées
            sur ce site sont destinées exclusivement à l’usage de Ma Gestion Immo. Vous disposez d’un droit d’accès, de
            rectification et de suppression des données vous concernant. Pour toute demande, merci de nous écrire à :
            contact@ma-gestion-immo.fr
          </p>
          <p className='mt-2 text-primary'>
          <Link to="/privacy-policy">
            Voir la Politique de confidentialité. 
          </Link>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Cookies</h2>
          <p>
            Ce site peut utiliser des cookies afin d’améliorer l’expérience utilisateur. Vous pouvez configurer
            votre navigateur pour refuser les cookies si vous le souhaitez.
          </p>
        </section>

        <section>
          <p className="text-sm text-gray-500">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default LegalMentions;