import React from 'react'
import { Link } from "react-router-dom";
import CtaButton from "../buttons/CtaButton"

const Cta = () => {
  return (
    <div>
      <section className="py-20 bg-gray-100 px-6 md:px-16 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Une interface pensée pour les propriétaires exigeants
          </h2>
          <p className="text-gray-700 text-lg">
            Nous avons conçu notre plateforme pour qu'elle soit aussi intuitive que puissante.
          </p>
          <p className="text-gray-700 text-lg mb-8">Que vous ayez 1 ou 100 biens, vous gardez le contrôle, où que vous soyez.</p>
  
          <CtaButton>
            Rejoignez-nous maintenant
          </CtaButton>
        </div>
      </section>
    </div>
  )
}

export default Cta