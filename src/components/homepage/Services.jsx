import React from 'react'
import ServiceCard from "../cards/ServiceCard";
import { SERVICES } from "../../constants/services";

const Services = () => {
  return (
    <div>
      <section className="pt-20 pb-20 px-6 md:px-16 bg-gray-50 text-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Votre assistant personnel de gestion immobilière
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10">
            Automatisez la gestion de vos biens, communiquez avec vos locataires, suivez vos documents et échéances en un seul endroit.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          {SERVICES.map(({ id, title, description, Icon }) => (
            <ServiceCard
              key={id}
              title={title}
              icon={<Icon size={40} className="text-primary" />}
            >
              {description}
            </ServiceCard>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Services