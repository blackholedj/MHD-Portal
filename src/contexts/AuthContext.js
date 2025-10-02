import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Začínáme s načítáním

  useEffect(() => {
    // onAuthStateChange je nejspolehlivější způsob, jak zjistit stav přihlášení.
    // Spustí se okamžitě při načtení stránky s informací ze session storage
    // a poté pokaždé, když se stav přihlášení změní.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        // Pokud máme uživatele, načteme jeho profil z naší DB
        const { data: userProfile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (error) {
          console.error("Chyba při načítání profilu:", error);
          // Pokud profil neexistuje, odhlásíme uživatele, aby se předešlo chybám
          await supabase.auth.signOut();
          setProfile(null);
        } else if (userProfile?.is_blocked) {
          // KROK 2A: Zde je logika pro blokované uživatele.
          // Pokud je uživatel blokován, okamžitě ho odhlásíme.
          await supabase.auth.signOut();
          alert(
            "Váš účet byl zablokován. Pro více informací kontaktujte administrátora."
          );
          setProfile(null);
        } else {
          // Vše je v pořádku, nastavíme profil
          setProfile(userProfile);
        }
      } else {
        // Pokud není session, vynulujeme profil
        setProfile(null);
      }

      // Až po všech těchto kontrolách definitivně ukončíme načítání
      setLoading(false);
    });

    // Při odmountování komponenty se odhlásíme z listeneru, aby se předešlo memory leakům
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    // Schválený je ten, kdo má status 'approved' A NENÍ blokovaný
    isApproved: profile?.status === "approved" && !profile?.is_blocked,
    isAdmin: profile?.role === "admin" && !profile?.is_blocked,
    loginWithGoogle: () =>
      supabase.auth.signInWithOAuth({ provider: "google" }),
    logout: () => supabase.auth.signOut(),
    loading, // Poskytujeme i stav načítání, aby ho mohly použít jiné komponenty
  };

  // Vykreslíme zbytek aplikace AŽ POTÉ, co je načítání dokončeno
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
