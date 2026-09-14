import { useState, type FormEvent } from "react";
import { useAuthContext } from "../context/useAuthContext";

type RegisterFormPropsType = {
    onSuccess?: () => void;
};

function RegisterForm({ onSuccess }: RegisterFormPropsType) {
    const { register } = useAuthContext();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (password !== repeatPassword) {
            setError("Паролі не збігаються");
            return;
        }

        try {
            await register(email, password);

            setEmail("");
            setPassword("");
            setRepeatPassword("");
            setMessage("Реєстрація успішна");
            onSuccess?.();
        } catch {
            setError("Не вдалося зареєструвати користувача");
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Реєстрація</h2>

            <label>
                Email
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    minLength={5}
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
                    minLength={5}
                />
            </label>

            <label>
                Repeat password
                <input
                    type="password"
                    name="repeat_password"
                    value={repeatPassword}
                    onChange={(event) => setRepeatPassword(event.target.value)}
                    required
                    minLength={5}
                />
            </label>

            <button type="submit">
                Зареєструватися
            </button>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}

export default RegisterForm;
