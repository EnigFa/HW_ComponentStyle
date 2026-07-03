import "./App.css";
import ProductCard from "./components/ProductCard";
import type { ProductType } from "./types/ProductType";

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
    hasAction: true
  };

  return (
      <div className="app">
        <h1>Картки товарів</h1>

        <div className="products-list">
          <ProductCard product={product1} />
          <ProductCard product={product2} />
        </div>
      </div>
  );
}

export default App;