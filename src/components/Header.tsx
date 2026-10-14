import { useState } from "react";
import { useAuthContext } from "../context/useAuthContext";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Modal from "./Modal";
import Search from "./Search";

type HeaderPropsType = {
    favoritesCount: number;
    cartCount: number;
    onOpenFavorites: () => void;
    onOpenCart: () => void;
    onOpenCategoryForm?: () => void;
    onOpenProductForm?: () => void;
};

function Header({
    favoritesCount,
    cartCount,
    onOpenFavorites,
    onOpenCart,
    onOpenCategoryForm,
    onOpenProductForm
}: HeaderPropsType) {
    const { email, role, isAuthenticated, logout } = useAuthContext();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <header className="site-header">
            <div className="header-inner">
                <a className="brand" href="/">
                    <span className="brand-mark">A</span>
                    <span className="brand-text">
                        <strong>Aura</strong>
                        <small>магазин</small>
                    </span>
                </a>

                <Search />

                <div className="header-actions">
                    <button
                        className="icon-button"
                        type="button"
                        onClick={onOpenFavorites}
                    >
                        Обране
                        <span>{favoritesCount}</span>
                    </button>

                    <button
                        className="icon-button"
                        type="button"
                        onClick={onOpenCart}
                    >
                        Кошик
                        <span>{cartCount}</span>
                    </button>

                    {isAuthenticated ? (
                        <div className="header-user">
                            <p className="welcome-message">
                                {email}{role ? ` · ${role}` : ""}
                            </p>
                            {onOpenCategoryForm && (
                                <button
                                    className="ghost-button"
                                    type="button"
                                    onClick={onOpenCategoryForm}
                                >
                                    Категорія
                                </button>
                            )}
                            {onOpenProductForm && (
                                <button
                                    className="ghost-button"
                                    type="button"
                                    onClick={onOpenProductForm}
                                >
                                    Товар
                                </button>
                            )}
                            <button
                                className="logout-button"
                                type="button"
                                onClick={logout}
                            >
                                Вийти
                            </button>
                        </div>
                    ) : (
                        <div className="header-auth-actions">
                            <button
                                className="ghost-button"
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
            </div>

            <Modal open={isRegisterOpen} close={() => setIsRegisterOpen(false)}>
                <RegisterForm onSuccess={() => setIsRegisterOpen(false)} />
            </Modal>

            <Modal open={isLoginOpen} close={() => setIsLoginOpen(false)}>
                <LoginForm onSuccess={() => setIsLoginOpen(false)} />
            </Modal>
        </header>
    );
}

export default Header;
