import { useEffect, useRef, useState } from "react";
import { createSale } from "../../services/sales";
import { getInventoryItems } from "../../services/inventory";
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
  LuX,
} from "react-icons/lu";
import "./POS.scss";

export function FilterDropdown({ label, value, options, onChange }) {
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

function POS({ onNotify, onInvoiceCreated }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionNumber, setTransactionNumber] = useState("");
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    getInventoryItems()
      .then(setProducts)
      .catch((error) => {
        onNotify?.(error.message, {
          textColor: "#64748b",
          iconColor: "#dc2626",
          progressColor: "#dc2626",
        });
      })
      .finally(() => setIsLoading(false));
  }, [onNotify]);

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
    const quantityInCart = getCartQuantity(product.id);

    if (product.stock === 0 || quantityInCart >= product.stock) {
      onNotify?.(
        product.stock === 0
          ? "This item is out of stock"
          : "No more units available for this item",
        {
          textColor: "#64748b",
          iconColor: "#dc2626",
          progressColor: "#dc2626",
          icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 8v5" />
              <path d="M12 16h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          ),
        },
      );
      return;
    }

    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);

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
  const handleCheckout = async () => {
    try {
      const completedInvoice = await createSale({
        items: cartItems.map((item) => ({
          inventoryItem: item.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice ?? item.price,
        })),
        paymentMethod,
        transactionNumber,
      });

      setInvoice(completedInvoice);
      onInvoiceCreated?.(completedInvoice);
      try {
        setProducts(await getInventoryItems());
      } catch (inventoryError) {
        onNotify?.(
          `Checkout completed, but inventory could not refresh: ${inventoryError.message}`,
          {
            textColor: "#64748b",
            iconColor: "#d97706",
            progressColor: "#f59e0b",
          },
        );
      }
      setCartItems([]);
      setPaymentMethod("cash");
      setTransactionNumber("");
      onNotify?.(
        `Checkout successful. Invoice # INV-${completedInvoice.number} generated.`,
        { icon: <LuCheck aria-hidden="true" /> },
      );
    } catch (error) {
      onNotify?.(error.message, {
        textColor: "#64748b",
        iconColor: "#dc2626",
        progressColor: "#dc2626",
      });
    }
  };

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const total = cartItems.reduce(
    (sum, item) => sum + (item.unitPrice ?? item.price) * item.quantity,
    0,
  );
  const updateUnitPrice = (productId, value) => {
    if (value === "") {
      setCartItems((items) =>
        items.map((item) =>
          item.id === productId ? { ...item, unitPrice: "" } : item,
        ),
      );
      return;
    }

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
          {isLoading ? (
            <div className="pos-product-grid__empty">
              <strong>Loading inventory</strong>
            </div>
          ) : filteredProducts.length === 0 ? (
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
                aria-disabled={product.stock === 0}
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
                      {product.variants.join(" / ")}
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
                  {item.variants?.length > 0 && (
                    <span className="pos-cart__variant">
                      Variant: {item.variants.join(" / ")}
                    </span>
                  )}
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
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </aside>
      {invoice && (
        <div
          className="invoice-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setInvoice(null);
          }}
        >
          <section
            className="invoice-paper"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-title"
          >
            <button
              type="button"
              className="invoice-paper__close"
              onClick={() => setInvoice(null)}
              aria-label="Close invoice"
            >
              <LuX aria-hidden="true" />
            </button>
            <div className="invoice-paper__header">
              <span className="invoice-paper__eyebrow">Payment receipt</span>
              <h2 id="invoice-title">Invoice</h2>
              <span className="invoice-paper__number">
                INV-{invoice.number}
              </span>
            </div>
            <div className="invoice-paper__meta">
              <span>
                Date <strong>{invoice.date}</strong>
              </span>
              <span>
                Time <strong>{invoice.time}</strong>
              </span>
            </div>
            <div className="invoice-paper__items">
              <div className="invoice-paper__items-heading">
                <span>Items</span>
                <span>Qty</span>
              </div>
              {invoice.items.map((item) => (
                <div className="invoice-paper__item" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    {item.variants?.length > 0 && (
                      <span>{item.variants.join(" / ")}</span>
                    )}
                    <span>PKR {item.unitPrice.toLocaleString()}</span>
                  </div>
                  <strong>{item.quantity}</strong>
                </div>
              ))}
            </div>
            <div className="invoice-paper__total">
              <span>Total price</span>
              <strong>PKR {invoice.total.toLocaleString()}</strong>
            </div>
            <div className="invoice-paper__payment">
              <span>Payment method</span>
              <strong>
                {invoice.paymentMethod === "online" ? "Online" : "Cash"}
              </strong>
              {invoice.paymentMethod === "online" &&
                invoice.transactionNumber && (
                  <small>Transaction #{invoice.transactionNumber}</small>
                )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default POS;
