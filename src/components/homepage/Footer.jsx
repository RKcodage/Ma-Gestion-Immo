import React from 'react'
import { Link } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      <footer className="bg-primary text-gray-300 py-12 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {/* App name */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Ma Gestion Immo</h3>
            <p className="text-sm">
              Une plateforme complète pour simplifier la relation entre propriétaires et locataires.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-white">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Accueil</Link></li>
              <li><Link to="/#features" className="hover:underline">Fonctionnalités</Link></li>
              <li><Link to="/signup" className="hover:underline">S'inscrire</Link></li>
              <li><Link to="/login" className="hover:underline">Se connecter</Link></li>
            </ul>
          </div>

          {/* Social networks and mentions */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-white">Informations</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/legal-mentions" className="hover:underline">Mentions légales</Link></li>
              <li><Link to="/cgu" className="hover:underline">Conditions d'utilisation</Link></li>
            </ul>

            {/* Social networks */}
            <div className="flex space-x-4 mt-6 justify-center">
              <a href="#" aria-label="Facebook" className="hover:text-white"><FaFacebookF /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white"><FaLinkedinIn /></a>
              <a href="#" aria-label="Twitter" className="hover:text-white"><FaTwitter /></a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center text-xs text-black-500">
          © {new Date().getFullYear()} Ma Gestion Immo. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}

export default Footer