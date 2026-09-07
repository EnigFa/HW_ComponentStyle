export type AuthUserType = {
    id: string;
    email: string;
    role: number;
};

export type AuthResponseType = {
    user: AuthUserType;
    token: string;
    refresh_token: string;
};
