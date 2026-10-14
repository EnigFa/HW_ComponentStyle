export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_EMAIL_KEY = "userEmail";

export const apiUrl = (path: string) => path;

export const resolveMediaUrl = (
    url?: string | null,
    folder: "categories" | "products" = "categories"
) => {
    if (!url) {
        return "";
    }

    const value = url.trim().replace(/\\/g, "/");

    if (!value || value.endsWith("/")) {
        return "";
    }

    const isRemote = value.startsWith("http://") || value.startsWith("https://");
    const looksLikeImage = /\.(png|jpe?g|webp|gif|svg|jfif|bmp|avif)(\?.*)?$/i.test(value);

    if (!isRemote && !looksLikeImage) {
        return "";
    }

    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("/")
    ) {
        return value;
    }

    if (value.includes("/")) {
        return `/${value.replace(/^\/+/, "")}`;
    }

    return `/${folder}/${value}`;
};

export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};
