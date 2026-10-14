import {
    ACCESS_TOKEN_KEY,
    getAccessToken,
    REFRESH_TOKEN_KEY
} from "../config/api";

const REFRESH_URL = "/api/v1/Auth/refresh";

let refreshRequest: Promise<string | null> | null = null;

const refreshAccessToken = () => {
    if (!refreshRequest) {
        refreshRequest = requestNewAccessToken().finally(() => {
            refreshRequest = null;
        });
    }

    return refreshRequest;
};

const requestNewAccessToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
        return null;
    }

    const response = await fetch(REFRESH_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refreshToken
        })
    });

    if (!response.ok) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        return null;
    }

    const data = await response.json() as Record<string, unknown>;
    const token = String(data.token ?? data.Token ?? "");
    const nextRefreshToken = String(
        data.refreshToken ?? data.refresh_token ?? data.RefreshToken ?? ""
    );

    if (!token) {
        return null;
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, token);

    if (nextRefreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, nextRefreshToken);
    }

    return token;
};

export const apiFetch = async (
    url: string,
    options: RequestInit = {},
    canRefresh = true
) => {
    const headers = new Headers(options.headers);
    const token = getAccessToken();

    if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const isFormData = options.body instanceof FormData;

    if (!isFormData && options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status !== 401 || !canRefresh) {
        return response;
    }

    const nextToken = await refreshAccessToken();

    if (!nextToken) {
        return response;
    }

    headers.set("Authorization", `Bearer ${nextToken}`);

    return fetch(url, {
        ...options,
        headers
    });
};
