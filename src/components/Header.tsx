import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Modal from "./Modal";

function Header() {
    const { email, isAuthenticated, logout } = useAuthContext();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const closeLogin = () => setIsLoginOpen(false);
    const closeRegister = () => setIsRegisterOpen(false);

    return (
        <header className="site-header">
            <div className="header-top">
                <h1>Магазин товарів</h1>

                {isAuthenticated ? (
                    <div className="header-user">
                        <p className="welcome-message">
                            Welcome, {email}
                        </p>
                        <button
                            className="logout-button"
                            type="button"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="header-auth-actions">
                        <button
                            className="auth-open-button"
                            type="button"
                            onClick={() => setIsRegisterOpen(true)}
                        >
                            Реєстрація
                        </button>
                        <button
                            className="auth-open-button"
                            type="button"
                            onClick={() => setIsLoginOpen(true)}
                        >
                            Увійти
                        </button>
                    </div>
                )}
            </div>

            <Modal open={isRegisterOpen} close={closeRegister}>
                <RegisterForm onSuccess={closeRegister} />
            </Modal>

            <Modal open={isLoginOpen} close={closeLogin}>
                <LoginForm onSuccess={closeLogin} />
            </Modal>
        </header>
    );
}

export default Header;
