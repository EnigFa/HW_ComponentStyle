import { createContext } from "react";

type AuthContextType = {
    email: string;
    isAuthenticated: boolean;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
