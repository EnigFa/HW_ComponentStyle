import { useState, type FormEvent } from "react";
import { useAuthContext } from "../context/useAuthContext";

type LoginFormPropsType = {
    onSuccess?: () => void;
};

function LoginForm({ onSuccess }: LoginFormPropsType) {
    const { login } = useAuthContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");

        try {
            await login(email, password);

            setEmail("");
            setPassword("");
            onSuccess?.();
        } catch (caught) {
            setError(
                caught instanceof Error
                    ? caught.message
                    : "Невірний email або пароль"
            );
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Авторизація</h2>

            <label>
                Email
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
            </label>

            <label>
                Password
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
            </label>

            <button type="submit">
                Увійти
            </button>

            {error && <p className="error-message">{error}</p>}
        </form>
    );
}

export default LoginForm;
