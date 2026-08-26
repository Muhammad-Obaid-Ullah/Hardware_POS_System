import { useEffect, useRef, useState } from "react";
import {
  LuCheck,
  LuChevronDown,
  LuMinus,
  LuPlus,
  LuSearch,
  LuSlidersHorizontal,
  LuStore,
  LuTag,
  LuTrash2,
  LuShoppingCart,
} from "react-icons/lu";
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
  { id: 9, name: "Cash Register Drawer", category: "Hardware", price: 7500 },
  { id: 10, name: "Barcode Label Pack", category: "Supplies", price: 900 },
  { id: 11, name: "POS Monitor Stand", category: "Accessories", price: 4200 },
  { id: 12, name: "Network Switch", category: "Networking", price: 6800 },
  { id: 13, name: "Receipt Printer Ink", category: "Supplies", price: 1650 },
  { id: 14, name: "Wireless Mouse", category: "Accessories", price: 1500 },
  { id: 15, name: "Tablet Charging Dock", category: "Hardware", price: 5400 },
  { id: 16, name: "Cashier Keypad", category: "Hardware", price: 3600 },
  {
    id: 17,
    name: "Thermal Printer Stand",
    category: "Accessories",
    price: 3100,
  },
  { id: 18, name: "USB-C Power Adapter", category: "Accessories", price: 2200 },
  { id: 19, name: "Barcode Scanner Cable", category: "Supplies", price: 700 },
  { id: 20, name: "Receipt Paper Pack", category: "Supplies", price: 1100 },
  { id: 21, name: "POS Touch Monitor", category: "Hardware", price: 32500 },
  { id: 22, name: "Network Patch Panel", category: "Networking", price: 7800 },
  { id: 23, name: "HDMI Adapter", category: "Accessories", price: 950 },
  { id: 24, name: "Cash Drawer Cable", category: "Supplies", price: 600 },
  { id: 25, name: "Label Dispenser", category: "Supplies", price: 1850 },
  { id: 26, name: "Customer Pole Display", category: "Hardware", price: 9800 },
  {
    id: 27,
    name: "Wireless Access Point",
    category: "Networking",
    price: 11200,
  },
  { id: 28, name: "Keyboard Cleaning Kit", category: "Supplies", price: 500 },
  {
    id: 29,
    name: "Monitor Privacy Filter",
    category: "Accessories",
    price: 2700,
  },
  { id: 30, name: "Surge Protector", category: "Hardware", price: 2400 },
  { id: 31, name: "POS Tablet Case", category: "Accessories", price: 1900 },
  { id: 32, name: "Inventory Shelf Tags", category: "Supplies", price: 450 },
  { id: 33, name: "Ethernet Coupler", category: "Networking", price: 400 },
  { id: 34, name: "Receipt Printer Roller", category: "Hardware", price: 1450 },
  {
    id: 35,
    name: "Cashier Barcode Scanner",
    category: "Hardware",
    price: 5200,
  },
  {
    id: 36,
    name: "Cable Management Clips",
    category: "Accessories",
    price: 350,
  },
  { id: 37, name: "Label Printer", category: "Hardware", price: 9200 },
  { id: 38, name: "Network Cable Tester", category: "Networking", price: 2900 },
  {
    id: 39,
    name: "POS Screen Cleaning Spray",
    category: "Supplies",
    price: 650,
  },
  {
    id: 40,
    name: "Adjustable Monitor Arm",
    category: "Accessories",
    price: 5900,
  },
  { id: 41, name: "Backup Power Unit", category: "Hardware", price: 14800 },
  {
    id: 42,
    name: "Wireless Receipt Printer",
    category: "Hardware",
    price: 21500,
  },
  { id: 43, name: "Interior Paint Can", category: "Supplies", price: 6800 },
  { id: 44, name: "Storage Organizer Box", category: "Supplies", price: 2400 },
  { id: 45, name: "LED Strip Light", category: "Hardware", price: 3200 },
  { id: 46, name: "Plain Packing Tape", category: "Supplies", price: 280 },
  { id: 47, name: "Basic Wire Basket", category: "Accessories", price: 950 },
  { id: 48, name: "Reusable Shopping Bag", category: "Supplies", price: 180 },
].map((product) => ({
  ...product,
  variants:
    {
      1: [{ name: "Connection", value: "USB 2.0" }],
      2: [{ name: "Size", value: "80mm Standard" }],
      3: [{ name: "Connection", value: "Wireless" }],
      5: [{ name: "Type", value: "Cat6" }],
      6: [{ name: "Type", value: "Thermal" }],
      8: [{ name: "Size", value: "15-inch" }],
      12: [{ name: "Ports", value: "8-Port" }],
      14: [{ name: "Type", value: "Silent Click" }],
      17: [{ name: "Type", value: "Adjustable" }],
      21: [{ name: "Size", value: "15.6-inch" }],
      27: [{ name: "Connection", value: "Dual Band" }],
      31: [{ name: "Size", value: "10-inch" }],
      37: [{ name: "Size", value: "4-inch" }],
      40: [{ name: "Type", value: "Single Arm" }],
      42: [{ name: "Connection", value: "Wireless" }],
      43: [
        { name: "Size", value: "5L" },
        { name: "Color", value: "Red" },
      ],
      44: [
        { name: "Size", value: "Large" },
        { name: "Color", value: "Blue" },
      ],
      45: [
        { name: "Length", value: "5m" },
        { name: "Color", value: "Warm White" },
      ],
    }[product.id] ?? [],
  brand: [46, 47, 48].includes(product.id)
    ? null
    : product.category === "Networking"
      ? "NetLink"
      : product.category === "Supplies"
        ? "StorePro"
        : "TechCore",
  stock: product.id % 9 === 0 ? 0 : 4 + ((product.id * 7) % 18),
}));

function FilterDropdown({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="pos-filter-dropdown" ref={dropdownRef}>
      <span className="sr-only">Filter by {label.toLowerCase()}</span>
      <button
        type="button"
        className="pos-filter-dropdown__trigger"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{selectedOption.label}</span>
        <LuChevronDown aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="pos-filter-dropdown__menu" role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`pos-filter-dropdown__option ${option.value === value ? "pos-filter-dropdown__option--selected" : ""}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              {option.value === value && <LuCheck aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function POS() {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionNumber, setTransactionNumber] = useState("");

  const brands = [...new Set(products.map((product) => product.brand))];
  const categories = [...new Set(products.map((product) => product.category))];
  const filteredProducts = products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());
    const matchesBrand =
      selectedBrand === "all" || product.brand === selectedBrand;
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesName && matchesBrand && matchesCategory;
  });
  const getCartQuantity = (productId) =>
    cartItems.find((item) => item.id === productId)?.quantity ?? 0;

  const addToCart = (product) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      const quantityInCart = existing?.quantity ?? 0;

      if (quantityInCart >= product.stock) return items;

      if (existing)
        return items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      return [...items, { ...product, quantity: 1, unitPrice: product.price }];
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
  const removeItemFromCart = (productId) => {
    setCartItems((items) => items.filter((item) => item.id !== productId));
  };
  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + (item.unitPrice ?? item.price) * item.quantity,
    0,
  );
  const updateUnitPrice = (productId, value) => {
    const unitPrice = Number(value);
    setCartItems((items) =>
      items.map((item) =>
        item.id === productId
          ? {
              ...item,
              unitPrice: Number.isNaN(unitPrice) ? 0 : Math.max(unitPrice, 0),
            }
          : item,
      ),
    );
  };

  return (
    <div className="pos-screen">
      <div className="pos-products">
        <div className="pos-screen__section-header">
          <div>
            <h2 className="pos-screen__heading">Choose Items</h2>
          </div>
          <span className="pos-screen__item-count">
            {filteredProducts.length} of {products.length} items
          </span>
        </div>
        <div className="pos-product-filters" role="search">
          <label className="pos-product-filters__search">
            <LuSearch aria-hidden="true" />
            <span className="sr-only">Search by product name</span>
            <input
              type="search"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <FilterDropdown
            label="brand"
            value={selectedBrand}
            onChange={setSelectedBrand}
            options={[
              { value: "all", label: "All brands" },
              ...brands.map((brand) => ({ value: brand, label: brand })),
            ]}
          />
          <FilterDropdown
            label="category"
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              { value: "all", label: "All categories" },
              ...categories.map((category) => ({
                value: category,
                label: category,
              })),
            ]}
          />
        </div>
        <div
          className={`pos-product-grid ${filteredProducts.length >= 3 ? "pos-product-grid--fluid" : ""}`}
        >
          {filteredProducts.length === 0 ? (
            <div className="pos-product-grid__empty">
              <LuSearch aria-hidden="true" />
              <strong>No items found</strong>
              <span>Try another name, brand, or category.</span>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className={`pos-product ${product.stock === 0 ? "pos-product--out-of-stock" : ""}`}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
              >
                <span className="pos-product__badge-row">
                  <span className="pos-product__badge pos-product__category-badge">
                    <LuTag aria-hidden="true" />
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="pos-product__badge pos-product__brand-badge">
                      <LuStore aria-hidden="true" />
                      {product.brand}
                    </span>
                  )}
                </span>
                <span className="pos-product__name">{product.name}</span>
                {product.variants.length > 0 && (
                  <span className="pos-product__variant-section">
                    <span className="pos-product__variant-heading">
                      <LuSlidersHorizontal aria-hidden="true" />
                      Variant
                    </span>
                    <span className="pos-product__variants">
                      {product.variants
                        .map((variant) => variant.value)
                        .join(" / ")}
                    </span>
                  </span>
                )}
                <span className="pos-product__price">
                  <span className="pos-product__stock-summary">
                    <span>Total {product.stock}</span>
                    <span>In cart {getCartQuantity(product.id)}</span>
                    {getCartQuantity(product.id) > 0 && (
                      <span className="pos-product__stock-left">
                        Left{" "}
                        {Math.max(
                          product.stock - getCartQuantity(product.id),
                          0,
                        )}
                      </span>
                    )}
                  </span>
                  <strong>PKR {product.price.toLocaleString()}</strong>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
      <aside className="pos-cart">
        <div className="pos-cart__header">
          <div>
            <p className="pos-screen__eyebrow">Current Order</p>
            <h2 className="pos-screen__heading">Cart</h2>
          </div>
          <div className="pos-cart__header-actions">
            <LuShoppingCart aria-hidden="true" />
            <button
              type="button"
              className="pos-cart__clear"
              onClick={clearCart}
              disabled={!cartItems.length}
              aria-label="Clear all items from cart"
              title="Clear cart"
            >
              <LuTrash2 aria-hidden="true" />
            </button>
          </div>
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
                  <div className="pos-cart__name-row">
                    <strong>{item.name}</strong>
                    <div className="pos-cart__quantity">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove one ${item.name}`}
                      >
                        <LuMinus aria-hidden="true" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        aria-label={`Add one ${item.name}`}
                      >
                        <LuPlus aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="pos-cart__remove-item"
                        onClick={() => removeItemFromCart(item.id)}
                        aria-label={`Remove all ${item.name} from cart`}
                        title="Remove item"
                      >
                        <LuTrash2 aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <label className="pos-cart__unit-price">
                    <span className="pos-cart__price-input">
                      <span>PKR</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.unitPrice ?? item.price}
                        onChange={(event) =>
                          updateUnitPrice(item.id, event.target.value)
                        }
                        aria-label={`Unit price for ${item.name}`}
                      />
                    </span>
                  </label>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="pos-cart__payment">
          <span className="pos-cart__payment-heading">Payment method</span>
          <div className="pos-cart__payment-options">
            <label>
              <input
                type="radio"
                name="payment-method"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              Cash
            </label>
            <label>
              <input
                type="radio"
                name="payment-method"
                value="online"
                checked={paymentMethod === "online"}
                onChange={(event) => setPaymentMethod(event.target.value)}
              />
              Online
            </label>
          </div>
          <div
            className={`pos-cart__transaction-wrapper ${paymentMethod === "online" ? "pos-cart__transaction-wrapper--open" : ""}`}
            aria-hidden={paymentMethod !== "online"}
          >
            <label className="pos-cart__transaction">
              <span>Transaction number (optional)</span>
              <input
                type="text"
                placeholder="Enter transaction number"
                value={transactionNumber}
                tabIndex={paymentMethod === "online" ? 0 : -1}
                onChange={(event) => setTransactionNumber(event.target.value)}
              />
            </label>
          </div>
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
