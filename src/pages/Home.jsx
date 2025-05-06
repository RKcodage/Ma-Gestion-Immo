import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/homepage/Header";

const Home = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <img
        src="/images/homepage-bg.jpg"
        alt="immobilier"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* Header */}
      <Header />

      {/* Titre central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4">
        <h2 className="text-white text-3xl md:text-5xl font-semibold mb-4">
          Gérez vos biens immobiliers sans stress
        </h2>
        <p className="text-white text-base md:text-xl max-w-2xl mb-6">
          Une solution simple et efficace pour gérer vos locations, documents et échanges avec vos locataires.
        </p>

        {/* Bouton S'inscrire */}
        <Link
          to="/signup"
          className="mt-6 px-8 py-4 rounded-full text-lg font-semibold tracking-wide text-white border-2 border-white bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:scale-105"
        >
          Essayez dès maintenant
        </Link>
      </div>
    </div>
  );
};

export default Home;
