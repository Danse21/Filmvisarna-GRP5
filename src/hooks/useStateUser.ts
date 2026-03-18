import { useState } from "react";

// Typ som beskriver hur en user ser ut i appen
export type User = {
  id: number | null;
  firstName: string;
  email: string;
  isLoggedIn: boolean;
};

// Hook som håller själva user-state
export function useUserState() {
  // Startvärde (utloggad user) False är grejen
  const [user, setUser] = useState<User>({
    id: null,
    firstName: "",
    email: "",
    isLoggedIn: false,
  });

  // Sätter hela user-objektet (används vid login/logout)
  function setUserState(newUser: User) {
    setUser(newUser);
  }

  // Uppdaterar delar av user (merge med tidigare state) Om man vill uppdatera något efter hand, byta email eller något sådan.
  function updateUserState(updates: Partial<User>) {
    setUser((prev) => ({
      ...prev,
      ...updates,
    }));
  }

  return [user, setUserState, updateUserState] as const;
}