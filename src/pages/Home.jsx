import React from "react";
import Hero from "../components/homepage/Hero";
import Services from "../components/homepage/Services";
import Difficulties from "../components/homepage/Difficulties";
import Cta from "../components/homepage/Cta";
import Testimonies from "../components/homepage/Testimonies";
import Footer from "../components/homepage/Footer";
import SEO from "../components/SEO/SEO";


const Home = () => {
  return (
    <div className="w-full overflow-hidden">

      <SEO
        title="Ma Gestion Immo — Simplifiez votre gestion locative"
        description="Centralisez documents, baux et échanges avec vos locataires, le tout en un seul endroit."
      />
      
      <Hero />
      <Services />
      <Difficulties />
      <Cta />
      <Testimonies />
      <Footer />
    </div>
  );
};

export default Home;
