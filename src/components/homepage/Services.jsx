import React from 'react'
import { FaRegBuilding, FaClipboardList, FaComments } from "react-icons/fa";

const Services = () => {
  return (
    <div>
      <section className="pt-20 pb-20 px-6 md:px-16 bg-gray-50 text-gray-800" id='features'>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Votre assistant personnel de gestion immobilière
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10">
            Automatisez la gestion de vos biens, communiquez avec vos locataires, suivez vos documents et échéances en un seul endroit.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div>
            <FaRegBuilding size={40} className="mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Gestion des biens</h3>
            <p className="text-gray-600">
              Suivez vos propriétés, ajoutez des unités, visualisez les informations essentielles d’un coup d'œil.
            </p>
          </div>

          <div>
            <FaClipboardList size={40} className="mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Suivi des documents</h3>
            <p className="text-gray-600">
              Gérez les contrats de bail, quittances de loyer, justificatifs et autres documents importants.
            </p>
          </div>

          <div>
            <FaComments size={40} className="mx-auto text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Messagerie intégrée</h3>
            <p className="text-gray-600">
              Échangez facilement avec vos locataires, posez des questions, réglez les problèmes sans intermédiaire.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services