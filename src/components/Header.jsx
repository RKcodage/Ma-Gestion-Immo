import React from "react";

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-10">
      <h1 className="text-white text-2xl font-bold">Ma Gestion Immo</h1>
      <div className="space-x-6">
        <a href="#signup" className="text-white hover:underline text-lg">Inscription</a>
        <a href="#login" className="text-white hover:underline text-lg">Connexion</a>
      </div>
    </header>
  );
};

export default Header;
