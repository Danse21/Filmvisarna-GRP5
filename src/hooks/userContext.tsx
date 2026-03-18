import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useUserState, type User } from "./useStateUser";

// Typ för vad contextet innehåller
type UserContextType = [
  User,
  (user: User) => void,
  (updates: Partial<User>) => void
];

// Skapar context (initialt null för att kunna validera användning)
const UserContext = createContext<UserContextType | null>(null);

// Provider som wrappar appen och gör state globalt
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser, updateUser] = useUserState();

  return (
    <UserContext.Provider value={[user, setUser, updateUser]}>
      {children}
    </UserContext.Provider>
  );
}

// Hook för att läsa contextet
export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }

  return context;
}