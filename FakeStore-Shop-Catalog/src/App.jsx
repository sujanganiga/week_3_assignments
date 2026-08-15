import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products and categories
  useEffect(() => {
    Promise.all([
      fetch("https://fakestoreapi.com/products"),
      fetch("https://fakestoreapi.com/products/categories"),
    ])
      .then(async ([productsResponse, categoriesResponse]) => {
        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData);
        setCategories(categoriesData);

        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Filter products
  let filteredProducts = products.filter((product) => {
    if (category === "all") {
      return true;
    }

    return product.category === category;
  });

  // Sort products
  if (sort === "low") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.price - b.price
    );
  }

  if (sort === "high") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.price - a.price
    );
  }

  if (sort === "rating") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.rating.rate - a.rating.rate
    );
  }

  // Add to cart
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      setCart(
        cart.map((item) => {
          if (item.id === product.id) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }

          return item;
        })
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  // Cart total
  const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="container">
      <h1>Shop Catalog</h1>

      <div className="controls">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>

          {categories.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="default">Default</option>
          <option value="low">Price Low → High</option>
          <option value="high">Price High → Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <h2>Products</h2>

      <div className="products">
        {filteredProducts.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.image} alt={product.title} />

            <h3>{product.title}</h3>

            <p>₹ {product.price}</p>

            <p>⭐ {product.rating.rate}</p>

            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>Cart</h2>

        <p>Items: {cart.length}</p>

        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <p>
              {item.title} × {item.quantity}
            </p>

            <p>₹ {item.price * item.quantity}</p>
          </div>
        ))}

        <h3>Total: ₹ {total.toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default App;