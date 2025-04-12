import React from "react";

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
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-10">
        <h1 className="text-white text-2xl font-bold">Ma Gestion Immo</h1>
        <div className="space-x-6">
          <a href="#signup" className="text-white hover:underline text-lg">Inscription</a>
          <a href="#login" className="text-white hover:underline text-lg">Connexion</a>
        </div>
      </header>

      {/* Titre central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <h2 className="text-white text-3xl md:text-5xl font-semibold mb-4">
          Gérez vos biens immobiliers sans stress
        </h2>
        <p className="text-white text-base md:text-xl max-w-2xl">
          Une solution simple et efficace pour gérer vos locations, documents et échanges avec vos locataires.
        </p>
      </div>
    </div>
  );
};

export default Home;
