export const readApiError = async (response: Response, fallback: string) => {
    try {
        const data: unknown = await response.json();

        if (typeof data === "string" && data.trim()) {
            return data;
        }

        if (!data || typeof data !== "object") {
            return fallback;
        }

        const body = data as {
            detail?: unknown;
            errors?: Record<string, unknown>;
        };

        if (body.errors) {
            const messages = Object.values(body.errors)
                .flatMap((value) => Array.isArray(value) ? value : [value])
                .filter((value): value is string =>
                    typeof value === "string" && value.trim().length > 0
                );

            if (messages.length > 0) {
                return messages.join(". ");
            }
        }

        if (
            typeof body.detail === "string" &&
            body.detail.trim() &&
            body.detail !== "Validation failed"
        ) {
            return body.detail;
        }
    } catch {
        return fallback;
    }

    return fallback;
};
