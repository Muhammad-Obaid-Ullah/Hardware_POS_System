import { useState } from "react";
import { BsBoxes } from "react-icons/bs";
import { LuShoppingCart } from "react-icons/lu";
import "./POS.scss";

const products = [
  { id: 1, name: "USB Barcode Scanner", category: "Hardware", price: 4500 },
  { id: 2, name: "Thermal Paper Roll", category: "Supplies", price: 350 },
  { id: 3, name: "Wireless Keyboard", category: "Accessories", price: 2800 },
  { id: 4, name: "Cash Drawer Tray", category: "Hardware", price: 6200 },
  { id: 5, name: "Ethernet Cable", category: "Networking", price: 850 },
  { id: 6, name: "Receipt Printer", category: "Hardware", price: 18500 },
  { id: 7, name: "USB Extension Cable", category: "Accessories", price: 1200 },
  { id: 8, name: "Customer Display", category: "Hardware", price: 12500 },
];

function POS() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing)
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      return [...items, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="pos-screen">
      <div className="pos-products">
        <div className="pos-screen__section-header">
          <div>
            <p className="pos-screen__eyebrow">Point of Sale</p>
            <h2 className="pos-screen__heading">Choose Items</h2>
          </div>
          <span className="pos-screen__item-count">
            {products.length} items
          </span>
        </div>
        <div className="pos-product-grid">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              className="pos-product"
              onClick={() => addToCart(product)}
            >
              <span className="pos-product__icon">
                <BsBoxes aria-hidden="true" />
              </span>
              <span className="pos-product__category">{product.category}</span>
              <span className="pos-product__name">{product.name}</span>
              <span className="pos-product__footer">
                <strong>PKR {product.price.toLocaleString()}</strong>
                <span className="pos-product__add">+</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <aside className="pos-cart">
        <div className="pos-cart__header">
          <div>
            <p className="pos-screen__eyebrow">Current Order</p>
            <h2 className="pos-screen__heading">Cart</h2>
          </div>
          <LuShoppingCart aria-hidden="true" />
        </div>
        <div className="pos-cart__items">
          {cartItems.length === 0 ? (
            <div className="pos-cart__empty">
              <LuShoppingCart aria-hidden="true" />
              <p>Your cart is empty</p>
              <span>Select a product to add it here.</span>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="pos-cart__item">
                <div>
                  <strong>{item.name}</strong>
                  <span>PKR {item.price.toLocaleString()}</span>
                </div>
                <div className="pos-cart__quantity">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove one ${item.name}`}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    aria-label={`Add one ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="pos-cart__summary">
          <div>
            <span>Items</span>
            <strong>{itemCount}</strong>
          </div>
          <div className="pos-cart__total">
            <span>Total</span>
            <strong>PKR {total.toLocaleString()}</strong>
          </div>
          <button
            type="button"
            className="pos-cart__checkout"
            disabled={!cartItems.length}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}

export default POS;
