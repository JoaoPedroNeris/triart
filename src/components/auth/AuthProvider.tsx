"use client";

import { ReactNode } from "react";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const authValue = useAuthProvider();
  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}
