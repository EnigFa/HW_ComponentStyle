import type { AuthResponseType, AuthUserType } from "../types/AuthType";
import { readApiError } from "../utils/apiError";
import { apiFetch } from "./http";

const AUTH_URL = "/api/v1/Auth";

const parseUser = (value: unknown): AuthUserType | undefined => {
    if (!value || typeof value !== "object") {
        return undefined;
    }

    const user = value as Record<string, unknown>;

    return {
        id: String(user.id ?? user.Id ?? ""),
        email: String(user.email ?? user.Email ?? ""),
        role: Number(user.role ?? user.Role ?? 0)
    };
};

const parseAuthResponse = (data: Record<string, unknown>): AuthResponseType => {
    return {
        user: parseUser(data.user ?? data.User),
        token: String(data.token ?? data.Token ?? ""),
        refresh_token: String(
            data.refresh_token ?? data.refreshToken ?? data.RefreshToken ?? ""
        )
    };
};

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
        throw new Error(
            await readApiError(response, "Не вдалося зареєструвати користувача")
        );
    }

    return parseAuthResponse(await response.json());
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
        throw new Error(await readApiError(response, "Невірний email або пароль"));
    }

    return parseAuthResponse(await response.json());
};

export const getProfile = async (): Promise<{ email: string; role: string }> => {
    const response = await apiFetch(AUTH_URL);

    if (!response.ok) {
        throw new Error(await readApiError(response, "Не вдалося отримати профіль"));
    }

    const data = await response.json() as Record<string, unknown>;

    return {
        email: String(data.email ?? data.Email ?? ""),
        role: String(data.role ?? data.Role ?? "")
    };
};
