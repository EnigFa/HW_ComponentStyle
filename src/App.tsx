import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import ProductCard from "./components/ProductCard";
import Category from "./components/Category";
import CategoryForm from "./components/CategoryForm";
import ProductForm from "./components/ProductForm";
import ProductDetails from "./components/ProductDetails";
import Header from "./components/Header";
import Modal from "./components/Modal";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { useProductContext } from "./context/useProductContext";
import { useAuthContext } from "./context/useAuthContext";
import { getCategories } from "./services/categoryService";
import { deleteProduct, getProductsByCategory } from "./services/productService";
import { collectCategoryIds } from "./utils/categories";
import type { CategoryType } from "./types/CategoryType";
import type { CategoryProductType } from "./types/CategoryProductType";
import {
    addToCart,
    clearCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart
} from "./store/cartSlice";
import type { AppDispatch, RootState } from "./store/store";

function AppContent() {
  const {
    products,
    foundProducts,
    hasSearched,
    productError,
    clearSearch,
    reloadProducts
  } = useProductContext();
  const { isAuthenticated } = useAuthContext();
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);

  const [favorites, setFavorites] = useState<CategoryProductType[]>(() => {
    const favoritesFromStorage = localStorage.getItem("favorites");

    if (favoritesFromStorage) {
      return JSON.parse(favoritesFromStorage);
    }

    return [];
  });
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<CategoryProductType[]>([]);
  const [categoryError, setCategoryError] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CategoryProductType | null>(null);
  const [openedProductId, setOpenedProductId] = useState<number | null>(null);
  const [productActionError, setProductActionError] = useState("");

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const loadCategories = async () => {
    try {
      const loadedCategories = await getCategories();
      setCategories(loadedCategories);
      setCategoryError("");
    } catch {
      setCategoryError("Не вдалося завантажити категорії");
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const toggleFavorite = (product: CategoryProductType) => {
    const foundProduct = favorites.find(
        (item) => item.id === product.id
    );

    if (foundProduct) {
      setFavorites(favorites.filter((item) => item.id !== product.id));
    } else {
      setFavorites([...favorites, product]);
    }
  };

  const selectCategory = async (category: CategoryType) => {
    clearSearch();
    setSelectedCategory(category);

    const ids = collectCategoryIds(category);

    try {
      const lists = await Promise.all(
          ids.map(async (id) => {
            try {
              return await getProductsByCategory(id);
            } catch {
              return [];
            }
          })
      );

      const fromApi = [
        ...new Map(
            lists.flat().map((product) => [product.id, product])
        ).values()
      ];

      if (fromApi.length > 0) {
        setCategoryProducts(fromApi);
        return;
      }
    } catch {
      // локальна фільтрація, якщо endpoint не відповів
    }

    setCategoryProducts(
        products.filter((product) => ids.includes(product.categoryId))
    );
  };

  const refreshProducts = async () => {
    await reloadProducts();

    if (selectedCategory) {
      await selectCategory(selectedCategory);
    }
  };

  const removeProduct = async (product: CategoryProductType) => {
    const confirmed = window.confirm(`Видалити «${product.name}»?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(product.id);
      dispatch(removeFromCart(product.id));
      setFavorites((items) => items.filter((item) => item.id !== product.id));
      setOpenedProductId(null);
      setIsProductFormOpen(false);
      setProductActionError("");
      await refreshProducts();
    } catch (caught) {
      setProductActionError(
          caught instanceof Error
              ? caught.message
              : "Не вдалося видалити товар"
      );
    }
  };

  const showAllProducts = () => {
    clearSearch();
    setSelectedCategory(null);
    setCategoryProducts([]);
  };

  const displayedProducts = hasSearched
      ? foundProducts
      : selectedCategory
        ? categoryProducts
        : products;

  const catalogTitle = hasSearched
      ? "Результати пошуку"
      : selectedCategory
        ? selectedCategory.name
        : "Усі товари";

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
      <div className="page">
        <Header
            favoritesCount={favorites.length}
            cartCount={cartCount}
            onOpenFavorites={() => setIsFavoritesOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenCategoryForm={
              isAuthenticated
                  ? () => setIsCategoryFormOpen(true)
                  : undefined
            }
            onOpenProductForm={
              isAuthenticated
                  ? () => {
                    setEditingProduct(null);
                    setIsProductFormOpen(true);
                  }
                  : undefined
            }
        />

        <main className="page-body">
          <aside className="catalog">
            <div className="catalog-head">
              <h2>Каталог</h2>
              <button
                  className="text-button"
                  type="button"
                  onClick={showAllProducts}
              >
                Усі товари
              </button>
            </div>

            {categoryError && (
                <p className="error-message">{categoryError}</p>
            )}

            {categories.length === 0 && !categoryError && (
                <p className="catalog-empty">Категорій ще немає</p>
            )}

            <div className="catalog-list">
              {categories.map((category) => (
                  <Category
                      key={category.id}
                      category={category}
                      selectedId={selectedCategory?.id ?? null}
                      onSelectCategory={selectCategory}
                  />
              ))}
            </div>
          </aside>

          <section className="showcase">
            <div className="showcase-head">
              <div>
                <p className="eyebrow">Aura shop</p>
                <h2>{catalogTitle}</h2>
              </div>
              <p className="showcase-count">
                {displayedProducts.length} товарів
              </p>
            </div>

            {productError && (
                <p className="error-message">{productError}</p>
            )}

            {productActionError && (
                <p className="error-message">{productActionError}</p>
            )}

            {!productError && displayedProducts.length === 0 && (
                <p className="empty-message">
                  {hasSearched
                      ? "Нічого не знайдено"
                      : "У цій добірці поки немає товарів"}
                </p>
            )}

            {displayedProducts.length > 0 && (
                <div className="products-list">
                  {displayedProducts.map((product) => (
                      <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={(product) => dispatch(addToCart(product))}
                          onToggleFavorite={toggleFavorite}
                          onOpen={(item) => setOpenedProductId(item.id)}
                          isFavorite={favorites.some(
                              (item) => item.id === product.id
                          )}
                      />
                  ))}
                </div>
            )}
          </section>
        </main>

        <Modal
            open={isCartOpen}
            close={() => setIsCartOpen(false)}
            wide
        >
          <div className="drawer">
            <h2>Кошик</h2>
            {cart.length === 0 ? (
                <p className="empty-message">Кошик порожній</p>
            ) : (
                <>
                  <ul className="drawer-list">
                    {cart.map((item) => (
                        <li key={item.product.id}>
                          <span>{item.product.name}</span>
                          <strong>
                            {item.quantity} × {item.product.price} ₴
                          </strong>
                          <div className="cart-controls">
                            <button
                                className="cart-remove"
                                type="button"
                                onClick={() => dispatch(decreaseQuantity(item.product.id))}
                                aria-label="Зменшити кількість"
                            >
                              −
                            </button>
                            <button
                                className="cart-increase"
                                type="button"
                                onClick={() => dispatch(increaseQuantity(item.product.id))}
                                aria-label="Збільшити кількість"
                            >
                              +
                            </button>
                            <button
                                className="text-button"
                                type="button"
                                onClick={() => dispatch(removeFromCart(item.product.id))}
                            >
                              Прибрати
                            </button>
                          </div>
                        </li>
                    ))}
                  </ul>
                  <button
                      className="text-button"
                      type="button"
                      onClick={() => dispatch(clearCart())}
                  >
                    Очистити кошик
                  </button>
                </>
            )}
          </div>
        </Modal>

        <Modal
            open={isFavoritesOpen}
            close={() => setIsFavoritesOpen(false)}
            wide
        >
          <div className="drawer">
            <h2>Обране</h2>
            {favorites.length === 0 ? (
                <p className="empty-message">Поки нічого не збережено</p>
            ) : (
                <div className="products-list">
                  {favorites.map((product) => (
                      <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={(product) => dispatch(addToCart(product))}
                          onToggleFavorite={toggleFavorite}
                          onOpen={(item) => setOpenedProductId(item.id)}
                          isFavorite={true}
                      />
                  ))}
                </div>
            )}
          </div>
        </Modal>

        <Modal
            open={openedProductId !== null}
            close={() => setOpenedProductId(null)}
            wide
        >
          {openedProductId !== null && (
              <ProductDetails
                  productId={openedProductId}
                  canManage={isAuthenticated}
                  onEdit={(product) => {
                    setEditingProduct(product);
                    setOpenedProductId(null);
                    setIsProductFormOpen(true);
                  }}
                  onDelete={removeProduct}
              />
          )}
        </Modal>

        <Modal
            open={isProductFormOpen}
            close={() => setIsProductFormOpen(false)}
        >
          <ProductForm
              categories={categories}
              product={editingProduct}
              onSaved={() => {
                setIsProductFormOpen(false);
                setEditingProduct(null);
                refreshProducts();
              }}
          />
        </Modal>

        <Modal
            open={isCategoryFormOpen}
            close={() => setIsCategoryFormOpen(false)}
        >
          <CategoryForm
              categories={categories}
              onCategoryCreated={() => {
                loadCategories();
                setIsCategoryFormOpen(false);
              }}
          />
        </Modal>
      </div>
  );
}

function App() {
  return (
      <AuthProvider>
        <ProductProvider>
          <AppContent />
        </ProductProvider>
      </AuthProvider>
  );
}

export default App;
