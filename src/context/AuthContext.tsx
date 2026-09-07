import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./authContextInstance";
import { loginUser, registerUser } from "../services/authService";

type AuthProviderPropsType = {
    children: ReactNode;
};

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_EMAIL_KEY = "userEmail";

const getSavedSession = () => {
    const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const savedEmail = localStorage.getItem(USER_EMAIL_KEY);

    if (savedToken && savedEmail) {
        return {
            email: savedEmail,
            isAuthenticated: true
        };
    }

    return {
        email: "",
        isAuthenticated: false
    };
};

export function AuthProvider({ children }: AuthProviderPropsType) {
    const [email, setEmail] = useState(() => getSavedSession().email);
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => getSavedSession().isAuthenticated
    );

    const saveSession = (
        userEmail: string,
        accessToken: string,
        refreshToken?: string
    ) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(USER_EMAIL_KEY, userEmail);

        if (refreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }

        setEmail(userEmail);
        setIsAuthenticated(true);
    };

    const register = async (userEmail: string, password: string) => {
        const result = await registerUser(userEmail, password);

        saveSession(result.user.email, result.token);
    };

    const login = async (userEmail: string, password: string) => {
        const result = await loginUser(userEmail, password);

        saveSession(
            result.user.email,
            result.token,
            result.refresh_token
        );
    };

    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_EMAIL_KEY);

        setEmail("");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                email,
                isAuthenticated,
                register,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
