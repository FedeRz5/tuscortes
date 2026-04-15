import { cache } from "react";
import { auth } from "@/auth";

// Deduplica auth() dentro del mismo request — si layout y page la llaman,
// solo se ejecuta una vez gracias a React cache().
export const getSession = cache(auth);
