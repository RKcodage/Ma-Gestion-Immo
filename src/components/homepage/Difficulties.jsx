import React from 'react'

const Difficulties = () => {
  return (
    <div>
      <section className="py-20 px-6 md:px-16 bg-white text-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            La gestion locative, un casse-tête pour beaucoup
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Que vous soyez propriétaire ou locataire, la location immobilière s'accompagne souvent de complications : oublis de paiement, documents perdus, manque de communication, ou encore un suivi des dossiers chronophage.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-center">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">❌ Documents dispersés</h3>
              <p className="text-gray-600">
                Baux, quittances, justificatifs... Trop souvent éparpillés entre mails, fichiers locaux et impressions papier.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">❌ Manque de transparence</h3>
              <p className="text-gray-600">
                Des échanges flous, des suivis de paiement incomplets et des incompréhensions entre propriétaires et locataires.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">❌ Communication difficile</h3>
              <p className="text-gray-600">
                Les échanges se font par email, SMS, téléphone… sans historique clair, ni centralisation.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-2">❌ Tâches manuelles répétitives</h3>
              <p className="text-gray-600">
                Relances de loyer, envoi de quittances, organisation des dossiers... autant de tâches qui prennent un temps précieux.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Difficulties