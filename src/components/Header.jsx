import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4 z-40">
      <h1 className="text-white text-2xl font-bold">Ma Gestion Immo</h1>
      <div className="space-x-6">
        <NavLink href="/" className="text-white hover:underline text-lg underline-offset-4">Inscription</NavLink>
        <NavLink href="/" className="text-white hover:underline text-lg underline-offset-4">Connexion</NavLink>
      </div>
    </header>
  );
};

export default Header;




