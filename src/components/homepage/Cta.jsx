import React from 'react'
import { Link } from "react-router-dom";

const Cta = () => {
  return (
    <div>
      <section className="py-20 bg-gray-100 px-6 md:px-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Une interface pensée pour les propriétaires exigeants
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Nous avons conçu notre plateforme pour qu'elle soit aussi intuitive que puissante.
            Que vous ayez 1 ou 100 biens, vous gardez le contrôle, où que vous soyez.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 text-white bg-primary hover:bg-primary-500 transition rounded-full text-lg font-medium"
          >
            Rejoignez-nous maintenant
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Cta