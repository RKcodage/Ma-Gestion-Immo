import React from "react";
import Hero from "../components/homepage/Hero";
import Services from "../components/homepage/Services";
import Difficulties from "../components/homepage/Difficulties";
import Cta from "../components/homepage/Cta";
import Testimonies from "../components/homepage/Testimonies";
import Footer from "../components/homepage/Footer";
import SEO from "../components/SEO/SEO";
import Reveal from "@/components/animations/Reveal";


const Home = () => {
  return (
    <div className="w-full overflow-hidden">

      <SEO
        title="Ma Gestion Immo — Simplifiez votre gestion locative"
        description="Centralisez documents, baux et échanges avec vos locataires, le tout en un seul endroit."
      />
      
      <Hero />

      <Reveal from="up" amount={0.25}>
        <Services />
      </Reveal>

      <Reveal from="up" delay={0.5} amount={0.2}>
        <Difficulties />
      </Reveal>

      <Reveal from="up" delay={0.5} amount={0.2}>
        <Cta />
      </Reveal>

      <Reveal from="up" delay={0.5} amount={0.2}>
        <Testimonies />
      </Reveal>
      <Footer />
    </div>
  );
};

export default Home;
