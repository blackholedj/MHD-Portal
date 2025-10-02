import React from "react";
import {
  FaBullhorn,
  FaFileAlt,
  FaMapMarkedAlt,
  FaComments,
  FaGraduationCap,
} from "react-icons/fa";

const Feature = ({ icon, title, children }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  </div>
);

const About = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-800">
        O aplikaci MHD Portál
      </h1>
      <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
        MHD Portál je moderní webová platforma navržená speciálně pro řidiče
        autobusů a tramvají. Naším cílem je zjednodušit přístup k důležitým
        informacím, usnadnit komunikaci a poskytnout všechny potřebné nástroje
        na jednom místě.
      </p>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Klíčové funkce
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Feature icon={<FaComments size={24} />} title="Nástěnka (Chat)">
            Rychlá a jednoduchá komunikace s kolegy. Sdílejte důležité
            informace, vzkazy a postřehy z provozu v reálném čase.
          </Feature>
          <Feature icon={<FaFileAlt size={24} />} title="Správa dokumentů">
            Všechny důležité manuály, příručky, směrnice a tabulky bezpečně
            uložené a dostupné kdykoliv ke stažení.
          </Feature>
          <Feature icon={<FaGraduationCap size={24} />} title="Tabulky">
            Fotogalérie provozních tabulek pro řidiče MHD.
          </Feature>
          <Feature
            icon={<FaMapMarkedAlt size={24} />}
            title="Interaktivní mapa"
          >
            Přehledná mapa všech zastávek a linek s detailními informacemi po
            kliknutí.
          </Feature>
        </div>
      </div>
    </div>
  );
};

export default About;
