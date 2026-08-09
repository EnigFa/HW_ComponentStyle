import { useEffect, useState } from "react";
import "./App.css";
import ProductCard from "./components/ProductCard";
import Search from "./components/Search";
import Category from "./components/Category";
import CategoryForm from "./components/CategoryForm";
import CategoryProducts from "./components/CategoryProducts";
import { ProductProvider, useProductContext } from "./context/ProductContext";
import { getCategories } from "./services/categoryService";
import type { CartItemType } from "./types/CartItemType";
import type { CategoryType } from "./types/CategoryType";
import type { CategoryProductType } from "./types/CategoryProductType";

function AppContent() {
  const {
    products,
    foundProducts,
    hasSearched,
    productError
  } = useProductContext();

  const [favorites, setFavorites] = useState<CategoryProductType[]>([]);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<
      CategoryProductType[]
  >([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const categoriesPerPage = 6;
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const firstCategoryIndex = (currentPage - 1) * categoriesPerPage;
  const lastCategoryIndex = firstCategoryIndex + categoriesPerPage;

  const currentCategories = categories.slice(
      firstCategoryIndex,
      lastCategoryIndex
  );

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

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const addToCart = (product: CategoryProductType) => {
    const foundProduct = cart.find(
        (item) => item.product.id === product.id
    );

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
      setCart([
        ...cart,
        {
          product: product,
          quantity: 1
        }
      ]);
    }
  };

  const toggleFavorite = (product: CategoryProductType) => {
    const foundProduct = favorites.find(
        (item) => item.id === product.id
    );

    if (foundProduct) {
      const updatedFavorites = favorites.filter(
          (item) => item.id !== product.id
      );

      setFavorites(updatedFavorites);
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const addCategoryToList = (category: CategoryType) => {
    setCategories([
      ...categories,
      {
        ...category,
        subCategories: category.subCategories || []
      }
    ]);
  };

  const selectCategory = (category: CategoryType) => {
    const selectedProducts = products.filter(
        (product) => product.categoryId === category.id
    );

    setSelectedCategoryName(category.name);
    setSelectedCategoryProducts(selectedProducts);
  };

  return (
      <div className="app">
        <h1>Магазин товарів</h1>

        <Search />

        <div className="top-info">
          <p>Улюблені товари: {favorites.length}</p>
          <p>
            Кошик: {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>

        {productError && (
            <p className="error-message">
              {productError}
            </p>
        )}

        {hasSearched && foundProducts.length === 0 && (
            <p className="empty-message">
              Нічого не знайдено
            </p>
        )}

        {hasSearched && foundProducts.length > 0 && (
            <section className="search-results">
              <h2>Результати пошуку</h2>

              <div className="products-list">
                {foundProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={favorites.some(
                            (item) => item.id === product.id
                        )}
                    />
                ))}
              </div>
            </section>
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
            {currentCategories.map((category) => (
                <Category
                    key={category.id}
                    category={category}
                    onSelectCategory={selectCategory}
                />
            ))}
          </div>

          {totalPages > 1 && (
              <div className="pagination">
                <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                  Попередня
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;

                  return (
                      <button
                          key={pageNumber}
                          className={
                            currentPage === pageNumber
                                ? "pagination-button active"
                                : "pagination-button"
                          }
                          onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                  );
                })}

                <button
                    className="pagination-button"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                  Наступна
                </button>
              </div>
          )}

          {selectedCategoryName && (
              <CategoryProducts
                  categoryName={selectedCategoryName}
                  products={selectedCategoryProducts}
                  onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite}
                  favorites={favorites}
              />
          )}
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