import React from 'react'
import TestimonyCard from "../cards/TestimonyCard";
import { TESTIMONIALS } from "../../constants/testimonials";

const Testimonies = () => {
  return (
    <div>
      <section className="py-20 bg-white px-6 md:px-16 text-gray-800">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ce que nos utilisateurs en disent</h2>
          <p className="text-gray-600 text-lg">
            Des centaines de propriétaires nous font déjà confiance pour simplifier la gestion de leurs biens.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <TestimonyCard
              key={t.id}
              quote={t.quote}
              author={t.author}
              subtitle={t.subtitle}
              avatarSrc={t.avatarSrc}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Testimonies