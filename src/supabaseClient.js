// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";


// Načtení proměnných z .env souboru
//const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
//const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabaseUrl = "https://pbckynrqscbizsgvmbci.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiY2t5bnJxc2NiaXpzZ3ZtYmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMDg3MzEsImV4cCI6MjA3NDc4NDczMX0.v9uZok3z4IVWZMfkg1PvkJwrodEZcwdvk6U2vJLuSFo";


// Vytvoření a export klienta
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
