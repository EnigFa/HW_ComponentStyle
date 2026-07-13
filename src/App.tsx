import { useEffect, useState } from "react";
import "./App.css";
import ProductCard from "./components/ProductCard";
import type { ProductType } from "./types/ProductType";
import type { CartItemType } from "./types/CartItemType";

function App() {
  const product1: ProductType = {
    id: 1,
    title: "Навушники Esperanza EH187K Black",
    image: "https://i.allo.ua/media/catalog/product/cache/3/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/e/h/eh187k_black.webp",
    price: 229,
    oldPrice: 0,
    discountPercent: 5,
    monoPercent: 5,
    rating: 2,
    reviewsCount: 1,
    isFavorite: false,
    hasAction: true
  };

  const product2: ProductType = {
    id: 2,
    title: "Навушники Canyon GTWS2 Orange",
    image: "https://i.allo.ua/media/catalog/product/cache/3/small_image/212x184/9df78eab33525d08d6e5fb8d27136e95/c/n/cnd-gtws2o_.webp",
    price: 549,
    oldPrice: 899,
    discountPercent: 39,
    monoPercent: 0,
    rating: 4,
    reviewsCount: 24,
    isFavorite: false,
    hasAction: false
  };

  const [favorites, setFavorites] = useState<ProductType[]>([]);
  const [cart, setCart] = useState<CartItemType[]>([]);

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

  const products: ProductType[] = [product1, product2];

  return (
      <div className="app">
        <h1>Картки товарів</h1>

        <div className="top-info">
          <p>Улюблені товари: {favorites.length}</p>
          <p>
            Кошик: {
            cart.reduce((sum, item) => sum + item.quantity, 0)
          }
          </p>
        </div>

        <div className="products-list">
          {products.map((product) => (
              <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.some((item) => item.id === product.id)}
              />
          ))}
        </div>
      </div>
  );
}

export default App;