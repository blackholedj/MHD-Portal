// src/pages/Home.js
import React from "react";
import { FaBus, FaInfoCircle } from "react-icons/fa";
import { FaTrainTram } from "react-icons/fa6";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user, profile } = useAuth();

  // Komponenta pro zobrazení upozornění
  const PendingApprovalNotification = () => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md my-6 flex items-center gap-3">
      <FaInfoCircle size={20} />
      <div>
        <p className="font-bold">Váš účet čeká na schválení.</p>
        <p>
          Některé funkce Vám budou zpřístupněny až poté, co administrátor ověří
          Váš účet.
        </p>
      </div>
    </div>
  );
  
  return (
    <div>
    {user && profile?.status === "pending" && <PendingApprovalNotification />}
    <div className="text-center p-6 sm:p-10 bg-white rounded-xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
      {/* Zde můžete vložit logo */}
      <div className="flex justify-center items-center gap-4 text-6xl text-blue-600 mb-6">
        <FaBus />
        <FaTrainTram />
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        {user
          ? `Vítejte zpět, ${profile?.full_name || "řidiči"}!`
          : "Vítejte v Portálu pro řidiče MHD"}
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
        Vaše centrální místo pro všechny potřebné informace, dokumenty, tabulky a
        komunikaci s kolegy.
      </p>
    </div>
    </div>
  );
};

export default Home;
