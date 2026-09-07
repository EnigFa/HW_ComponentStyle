import { useAuthContext } from "../context/useAuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function Header() {
    const { email, isAuthenticated, logout } = useAuthContext();

    return (
        <header className="site-header">
            <div className="header-top">
                <h1>Магазин товарів</h1>

                {isAuthenticated && (
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
                )}
            </div>

            {!isAuthenticated && (
                <div className="auth-forms">
                    <RegisterForm />
                    <LoginForm />
                </div>
            )}
        </header>
    );
}

export default Header;
