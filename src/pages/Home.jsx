import React from "react";
import Hero from "../components/homepage/Hero";
import Services from "../components/homepage/Services";
import Difficulties from "../components/homepage/Difficulties";
import Cta from "../components/homepage/Cta";
import Testimonies from "../components/homepage/Testimonies";
import Footer from "../components/homepage/Footer";

const Home = () => {
  return (
    <div className="w-full overflow-hidden">
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
