import React from 'react'
import Header from "../homepage/Header";
import CtaButton from "../buttons/CtaButton"
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <div className="relative h-screen w-full">
        {/* Background Image */}
        <img
          src="/images/homepage-bg.jpg"
          alt="immobilier"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>

        {/* Header */}
        <Header />

        {/* Main title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4">
          <h2 className="text-white text-3xl md:text-4xl font-semibold mb-4">
          Réinventons ensemble la gestion locative<span className="text-primary">.</span>
          </h2>
          <p className="text-white text-base md:text-xl max-w-2xl mb-6">
          Que vous soyez propriétaire ou locataire, accédez à un espace partagé pour tout gérer simplement, de façon transparente et efficace.
          </p>

          {/* Sign up CTA */}
          <CtaButton>
            Essayez dès maintenant
          </CtaButton>
        </div>
      </div>
    </>
  )
}

export default Hero