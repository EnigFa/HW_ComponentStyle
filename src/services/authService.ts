import type { AuthResponseType } from "../types/AuthType";

const AUTH_URL = "https://localhost:7000/api/v1/Auth";

export const registerUser = async (
    email: string,
    password: string
): Promise<AuthResponseType> => {
    const response = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (!response.ok) {
        throw new Error("Не вдалося зареєструвати користувача");
    }

    return response.json();
};

export const loginUser = async (
    email: string,
    password: string
): Promise<AuthResponseType> => {
    const response = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });

    if (!response.ok) {
        throw new Error("Невірний email або пароль");
    }

    return response.json();
};
