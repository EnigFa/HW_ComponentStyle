import { useEffect, useState } from "react";
import "./App.css";
import ProductCard from "./components/ProductCard";
import Search from "./components/Search";
import Category from "./components/Category";
import CategoryForm from "./components/CategoryForm";
import { ProductProvider, useProductContext } from "./context/ProductContext";
import { getCategories } from "./services/categoryService";
import type { ProductType } from "./types/ProductType";
import type { CartItemType } from "./types/CartItemType";
import type { CategoryType } from "./types/CategoryType";

function AppContent() {
  const {
    foundProducts,
    hasSearched
  } = useProductContext();

  const [favorites, setFavorites] = useState<ProductType[]>([]);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    const favoritesFromStorage = localStorage.getItem("favorites");
    const cartFromStorage = localStorage.getItem("cart");

    if (favoritesFromStorage) {
      setFavorites(JSON.parse(favoritesFromStorage));
    }

    if (cartFromStorage) {
      setCart(JSON.parse(cartFromStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const loadedCategories = await getCategories();
        setCategories(loadedCategories);
      } catch {
        setCategoryError("Не вдалося завантажити категорії");
      }
    };

    loadCategories();
  }, []);

  const addToCart = (product: ProductType) => {
    const foundProduct = cart.find((item) => item.product.id === product.id);

    if (foundProduct) {
      const updatedCart = cart.map((item) => {
        if (item.product.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + 1
          };
        }

        return item;
      });

      setCart(updatedCart);
    } else {
      setCart([...cart, { product: product, quantity: 1 }]);
    }
  };

  const toggleFavorite = (product: ProductType) => {
    const foundProduct = favorites.find((item) => item.id === product.id);

    if (foundProduct) {
      const updatedFavorites = favorites.filter((item) => item.id !== product.id);
      setFavorites(updatedFavorites);
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const addCategoryToList = (category: CategoryType) => {
    setCategories([...categories, category]);
  };

  return (
      <div className="app">
        <h1>Картки товарів</h1>

        <Search />

        <div className="top-info">
          <p>Улюблені товари: {favorites.length}</p>
          <p>
            Кошик: {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>

        {hasSearched && foundProducts.length === 0 ? (
            <p className="empty-message">
              Нічого не знайдено
            </p>
        ) : (
            <div className="products-list">
              {foundProducts.map((product) => (
                  <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.some((item) => item.id === product.id)}
                  />
              ))}
            </div>
        )}

        <section className="categories-section">
          <CategoryForm onCategoryCreated={addCategoryToList} />

          <h2>Категорії</h2>

          {categoryError && (
              <p className="error-message">
                {categoryError}
              </p>
          )}

          <div className="categories-list">
            {categories.map((category) => (
                <Category
                    key={category.id}
                    category={category}
                />
            ))}
          </div>
        </section>
      </div>
  );
}

function App() {
  return (
      <ProductProvider>
        <AppContent />
      </ProductProvider>
  );
}

export default App;