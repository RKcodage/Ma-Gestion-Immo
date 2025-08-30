import React from 'react'

const Testimonies = () => {
  return (
    <div>
      <section className="py-20 bg-white px-6 md:px-16 text-gray-800">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que nos utilisateurs en disent</h2>
          <p className="text-gray-600 text-lg">
            Des centaines de propriétaires nous font déjà confiance pour simplifier la gestion de leurs biens.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Testimony 1 */}
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-700 italic mb-4">
              “Depuis que j’utilise cette plateforme, je gagne un temps fou. Tout est centralisé, clair et simple à utiliser.”
            </p>
            <div className="text-primary font-semibold">Sophie M.</div>
            <div className="text-sm text-gray-500">Propriétaire à Bordeaux</div>
          </div>

          {/* Testimony 2 */}
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-700 italic mb-4">
              “Une interface super intuitive ! La communication avec mes locataires n’a jamais été aussi fluide.”
            </p>
            <div className="text-primary font-semibold">Karim L.</div>
            <div className="text-sm text-gray-500">Propriétaire à Lyon</div>
          </div>

          {/* Testimony 3 */}
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-700 italic mb-4">
              “J’ai pu digitaliser la gestion de mes biens sans avoir besoin de formation. C’est exactement ce qu’il me fallait.”
            </p>
            <div className="text-primary font-semibold">Julie T.</div>
            <div className="text-sm text-gray-500">Propriétaire à Nantes</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Testimonies