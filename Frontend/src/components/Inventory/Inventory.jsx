import { useEffect, useMemo, useRef, useState } from "react";
import {
  LuCheck,
  LuChevronDown,
  LuCircleCheck,
  LuCircleDollarSign,
  LuPackage,
  LuPackagePlus,
  LuPackageMinus,
  LuPackageX,
  LuPencil,
  LuPlus,
  LuSearch,
  LuSlidersHorizontal,
  LuStore,
  LuTag,
  LuTriangleAlert,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { MdProductionQuantityLimits } from "react-icons/md";
import { RiDropdownList } from "react-icons/ri";
import "../POS/POS.scss";
import "./Inventory.scss";

const initialInventoryItems = [
  {
    id: 1,
    name: "USB Barcode Scanner",
    category: "Hardware",
    brand: "TechCore",
    price: 4500,
    stock: 16,
    variants: ["USB 2.0"],
  },
  {
    id: 2,
    name: "Thermal Paper Roll",
    category: "Supplies",
    brand: "StorePro",
    price: 350,
    stock: 42,
    variants: ["80mm Standard"],
  },
  {
    id: 3,
    name: "Wireless Keyboard",
    category: "Accessories",
    brand: "TechCore",
    price: 2800,
    stock: 9,
    variants: ["Wireless"],
  },
  {
    id: 4,
    name: "Cash Drawer Tray",
    category: "Hardware",
    brand: "TechCore",
    price: 6200,
    stock: 7,
    variants: ["Standard"],
  },
  {
    id: 5,
    name: "Ethernet Cable",
    category: "Networking",
    brand: "NetLink",
    price: 850,
    stock: 25,
    variants: ["Cat6"],
  },
  {
    id: 6,
    name: "Receipt Printer",
    category: "Hardware",
    brand: "TechCore",
    price: 18500,
    stock: 5,
    variants: ["Thermal"],
  },
  {
    id: 7,
    name: "USB Extension Cable",
    category: "Accessories",
    brand: "TechCore",
    price: 1200,
    stock: 14,
    variants: ["2m"],
  },
  {
    id: 8,
    name: "Customer Display",
    category: "Hardware",
    brand: "TechCore",
    price: 12500,
    stock: 4,
    variants: ["15-inch"],
  },
  {
    id: 9,
    name: "Cash Register Drawer",
    category: "Hardware",
    brand: "TechCore",
    price: 7500,
    stock: 6,
    variants: ["Steel"],
  },
  {
    id: 10,
    name: "Barcode Label Pack",
    category: "Supplies",
    brand: "StorePro",
    price: 900,
    stock: 31,
    variants: ["A4 Labels"],
  },
  {
    id: 11,
    name: "POS Monitor Stand",
    category: "Accessories",
    brand: "TechCore",
    price: 4200,
    stock: 11,
    variants: ["Adjustable"],
  },
  {
    id: 12,
    name: "Network Switch",
    category: "Networking",
    brand: "NetLink",
    price: 6800,
    stock: 8,
    variants: ["8-Port"],
  },
  {
    id: 13,
    name: "Receipt Printer Ink",
    category: "Supplies",
    brand: "StorePro",
    price: 1650,
    stock: 19,
    variants: ["Black"],
  },
  {
    id: 14,
    name: "Wireless Mouse",
    category: "Accessories",
    brand: "TechCore",
    price: 1500,
    stock: 22,
    variants: ["Silent Click"],
  },
  {
    id: 15,
    name: "Tablet Charging Dock",
    category: "Hardware",
    brand: "TechCore",
    price: 5400,
    stock: 10,
    variants: ["10-inch"],
  },
  {
    id: 16,
    name: "Cashier Keypad",
    category: "Hardware",
    brand: "TechCore",
    price: 3600,
    stock: 13,
    variants: ["Numeric"],
  },
  {
    id: 17,
    name: "Thermal Printer Stand",
    category: "Accessories",
    brand: "TechCore",
    price: 3100,
    stock: 7,
    variants: ["Adjustable"],
  },
  {
    id: 18,
    name: "USB-C Power Adapter",
    category: "Accessories",
    brand: "TechCore",
    price: 2200,
    stock: 18,
    variants: ["65W"],
  },
  {
    id: 19,
    name: "Barcode Scanner Cable",
    category: "Supplies",
    brand: "StorePro",
    price: 700,
    stock: 28,
    variants: ["5m"],
  },
  {
    id: 20,
    name: "Receipt Paper Pack",
    category: "Supplies",
    brand: "StorePro",
    price: 1100,
    stock: 35,
    variants: ["Thermal Pack"],
  },
  {
    id: 21,
    name: "POS Touch Monitor",
    category: "Hardware",
    brand: "TechCore",
    price: 32500,
    stock: 3,
    variants: ["15.6-inch"],
  },
  {
    id: 22,
    name: "Network Patch Panel",
    category: "Networking",
    brand: "NetLink",
    price: 7800,
    stock: 4,
    variants: ["24-port"],
  },
  {
    id: 23,
    name: "HDMI Adapter",
    category: "Accessories",
    brand: "TechCore",
    price: 950,
    stock: 20,
    variants: ["HDMI to HDMI"],
  },
  {
    id: 24,
    name: "Cash Drawer Cable",
    category: "Supplies",
    brand: "StorePro",
    price: 600,
    stock: 26,
    variants: ["Long cable"],
  },
  {
    id: 25,
    name: "Label Dispenser",
    category: "Supplies",
    brand: "StorePro",
    price: 1850,
    stock: 12,
    variants: ["Compact"],
  },
  {
    id: 26,
    name: "Customer Pole Display",
    category: "Hardware",
    brand: "TechCore",
    price: 9800,
    stock: 5,
    variants: ["Pole Mount"],
  },
  {
    id: 27,
    name: "Wireless Access Point",
    category: "Networking",
    brand: "NetLink",
    price: 11200,
    stock: 6,
    variants: ["Dual Band"],
  },
  {
    id: 28,
    name: "Keyboard Cleaning Kit",
    category: "Supplies",
    brand: "StorePro",
    price: 500,
    stock: 30,
    variants: ["Kit"],
  },
  {
    id: 29,
    name: "Monitor Privacy Filter",
    category: "Accessories",
    brand: "TechCore",
    price: 2700,
    stock: 17,
    variants: ["15-inch"],
  },
  {
    id: 30,
    name: "Surge Protector",
    category: "Hardware",
    brand: "TechCore",
    price: 2400,
    stock: 14,
    variants: ["8-Outlet"],
  },
  {
    id: 31,
    name: "POS Tablet Case",
    category: "Accessories",
    brand: "TechCore",
    price: 1900,
    stock: 21,
    variants: ["10-inch"],
  },
  {
    id: 32,
    name: "Inventory Shelf Tags",
    category: "Supplies",
    brand: "StorePro",
    price: 450,
    stock: 40,
    variants: ["Set of 10"],
  },
  {
    id: 33,
    name: "Ethernet Coupler",
    category: "Networking",
    brand: "NetLink",
    price: 400,
    stock: 29,
    variants: ["RJ45"],
  },
  {
    id: 34,
    name: "Receipt Printer Roller",
    category: "Hardware",
    brand: "TechCore",
    price: 1450,
    stock: 18,
    variants: ["Standard"],
  },
  {
    id: 35,
    name: "Cashier Barcode Scanner",
    category: "Hardware",
    brand: "TechCore",
    price: 5200,
    stock: 8,
    variants: ["USB 3.0"],
  },
  {
    id: 36,
    name: "Cable Management Clips",
    category: "Accessories",
    brand: "TechCore",
    price: 350,
    stock: 44,
    variants: ["50 Pack"],
  },
  {
    id: 37,
    name: "Label Printer",
    category: "Hardware",
    brand: "TechCore",
    price: 9200,
    stock: 7,
    variants: ["4-inch"],
  },
  {
    id: 38,
    name: "Network Cable Tester",
    category: "Networking",
    brand: "NetLink",
    price: 2900,
    stock: 9,
    variants: ["Multi-mode"],
  },
  {
    id: 39,
    name: "POS Screen Cleaning Spray",
    category: "Supplies",
    brand: "StorePro",
    price: 650,
    stock: 23,
    variants: ["500ml"],
  },
  {
    id: 40,
    name: "Adjustable Monitor Arm",
    category: "Accessories",
    brand: "TechCore",
    price: 5900,
    stock: 6,
    variants: ["Single Arm"],
  },
  {
    id: 41,
    name: "Backup Power Unit",
    category: "Hardware",
    brand: "TechCore",
    price: 14800,
    stock: 4,
    variants: ["UPS 1500VA"],
  },
  {
    id: 42,
    name: "Wireless Receipt Printer",
    category: "Hardware",
    brand: "TechCore",
    price: 21500,
    stock: 3,
    variants: ["Wireless"],
  },
  {
    id: 43,
    name: "Interior Paint Can",
    category: "Supplies",
    brand: "StorePro",
    price: 6800,
    stock: 5,
    variants: ["5L / Red"],
  },
  {
    id: 44,
    name: "Storage Organizer Box",
    category: "Supplies",
    brand: "StorePro",
    price: 2400,
    stock: 12,
    variants: ["Large / Blue"],
  },
  {
    id: 45,
    name: "LED Strip Light",
    category: "Hardware",
    brand: "TechCore",
    price: 3200,
    stock: 15,
    variants: ["5m / Warm White"],
  },
  {
    id: 46,
    name: "Plain Packing Tape",
    category: "Supplies",
    brand: null,
    price: 280,
    stock: 52,
    variants: ["Standard"],
  },
  {
    id: 47,
    name: "Basic Wire Basket",
    category: "Accessories",
    brand: null,
    price: 950,
    stock: 18,
    variants: ["Medium"],
  },
  {
    id: 48,
    name: "Reusable Shopping Bag",
    category: "Supplies",
    brand: null,
    price: 180,
    stock: 67,
    variants: ["Retail"],
  },
  {
    id: 49,
    name: "Portable Receipt Tray",
    category: "Accessories",
    brand: null,
    price: 1250,
    stock: 0,
    variants: [],
  },
].map((item) => ({
  ...item,
  minimumThreshold: Math.max(3, Math.ceil(item.stock * 0.25)),
}));

function getInventoryStatus(stock, threshold) {
  if (stock === 0) {
    return {
      label: "Out of Stock",
      className: "out-of-stock",
      icon: <LuPackageX aria-hidden="true" />,
    };
  }

  if (stock <= threshold) {
    return {
      label: "Critical",
      className: "critical",
      icon: <LuPackageMinus aria-hidden="true" />,
    };
  }

  if (stock <= threshold * 2) {
    return {
      label: "Low Stock",
      className: "low-stock",
      icon: <LuTriangleAlert aria-hidden="true" />,
    };
  }

  return {
    label: "Healthy Stock",
    className: "good",
    icon: <LuCircleCheck aria-hidden="true" />,
  };
}

function InventoryFilterDropdown({ label, value, options, onChange }) {
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
    <div className="inventory-filter-dropdown" ref={dropdownRef}>
      <span className="sr-only">Filter by {label.toLowerCase()}</span>
      <button
        type="button"
        className="inventory-filter-dropdown__trigger"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{selectedOption.label}</span>
        <LuChevronDown aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="inventory-filter-dropdown__menu" role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`inventory-filter-dropdown__option ${option.value === value ? "inventory-filter-dropdown__option--selected" : ""}`}
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

function InventoryFormSelect({
  label,
  icon,
  value,
  options,
  onChange,
  onCreate,
  onCancelCreate,
  createValue,
  onCreateChange,
  readOnly = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isCreating = value === "__create__";

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

  const selectedLabel = isCreating
    ? `Create new ${label.toLowerCase()}`
    : value || `Select ${label.toLowerCase()}`;

  return (
    <div className="inventory-form-field">
      <label htmlFor={`inventory-form-${label.toLowerCase()}`}>
        <span className="inventory-form-field__label">
          {icon}
          {label}
        </span>
      </label>
      {readOnly ? (
        <div className="inventory-form-dropdown__trigger inventory-form-dropdown__trigger--readonly">
          <span>{selectedLabel}</span>
        </div>
      ) : isCreating ? (
        <div className="inventory-form-field__create-panel">
          <div className="inventory-form-field__create-input-row">
            <input
              type="text"
              placeholder={`Name your new ${label.toLowerCase()}`}
              value={createValue}
              onChange={(event) => onCreateChange(event.target.value)}
              autoFocus
            />
            <button
              type="button"
              className="inventory-form-field__back-button"
              aria-label={`Choose an existing ${label.toLowerCase()}`}
              title={`Choose an existing ${label.toLowerCase()}`}
              onClick={() => {
                onCancelCreate();
                setIsOpen(false);
              }}
            >
              <RiDropdownList aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div className="inventory-form-select-wrap" ref={dropdownRef}>
          <button
            type="button"
            className="inventory-form-dropdown__trigger"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span>{selectedLabel}</span>
            <LuChevronDown aria-hidden="true" />
          </button>
          {isOpen && (
            <div className="inventory-form-dropdown__menu" role="listbox">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`inventory-form-dropdown__option ${option === value ? "inventory-form-dropdown__option--selected" : ""}`}
                  role="option"
                  aria-selected={option === value}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  <span>{option}</span>
                  {option === value && <LuCheck aria-hidden="true" />}
                </button>
              ))}
              <button
                type="button"
                className="inventory-form-dropdown__option inventory-form-dropdown__option--create"
                onClick={() => {
                  onCreate();
                  setIsOpen(false);
                }}
              >
                <span>Create a new {label.toLowerCase()}</span>
                <LuPlus aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Inventory({ onNotify }) {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [restockItem, setRestockItem] = useState(null);
  const [restockAmount, setRestockAmount] = useState("");
  const [modalMode, setModalMode] = useState("add");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [newBrand, setNewBrand] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [itemForm, setItemForm] = useState({
    name: "",
    brand: "",
    category: "",
    purchasingPrice: "",
    sellingPrice: "",
    minimumThreshold: "",
    stock: "",
    variants: "",
  });

  const brands = useMemo(
    () =>
      [
        { value: "all", label: "All brands" },
        ...new Set(inventoryItems.map((item) => item.brand).filter(Boolean)),
      ].map((brand) =>
        typeof brand === "string"
          ? { value: brand, label: brand }
          : { value: brand.value, label: brand.label },
      ),
    [inventoryItems],
  );
  const categories = useMemo(
    () =>
      [
        { value: "all", label: "All categories" },
        ...new Set(inventoryItems.map((item) => item.category)),
      ].map((category) =>
        typeof category === "string"
          ? { value: category, label: category }
          : { value: category.value, label: category.label },
      ),
    [inventoryItems],
  );
  const statuses = [
    { value: "all", label: "All status" },
    { value: "out-of-stock", label: "Out of Stock" },
    { value: "critical", label: "Critical" },
    { value: "low-stock", label: "Low Stock" },
    { value: "good", label: "Healthy Stock" },
  ];

  const updateItemForm = (field, value) => {
    setItemForm((current) => ({ ...current, [field]: value }));
  };

  const emptyItemForm = () => ({
    name: "",
    brand: "",
    category: "",
    purchasingPrice: "",
    sellingPrice: "",
    minimumThreshold: "",
    stock: "",
    variants: "",
  });

  const openAddItemModal = () => {
    setModalMode("add");
    setSelectedItemId(null);
    setNewBrand("");
    setNewCategory("");
    setItemForm(emptyItemForm());
    setIsAddItemOpen(true);
  };

  const openItemModal = (item, mode = "view") => {
    setModalMode(mode);
    setSelectedItemId(item.id);
    setNewBrand("");
    setNewCategory("");
    setItemForm({
      name: item.name,
      brand: item.brand || "",
      category: item.category,
      purchasingPrice: item.purchasingPrice ?? "",
      sellingPrice: item.price ?? "",
      minimumThreshold: item.minimumThreshold ?? "",
      stock: item.stock ?? "",
      variants: item.variants.join("\n"),
    });
    setIsAddItemOpen(true);
  };

  const closeAddItemModal = () => {
    setIsAddItemOpen(false);
    setModalMode("add");
    setSelectedItemId(null);
    setNewBrand("");
    setNewCategory("");
    setItemForm(emptyItemForm());
  };

  const openRestockModal = (event, item) => {
    event.stopPropagation();
    setRestockItem(item);
    setRestockAmount("");
  };

  const closeRestockModal = () => {
    setRestockItem(null);
    setRestockAmount("");
  };

  const applyStockAdjustment = (event) => {
    event.preventDefault();
    const amount = Number(restockAmount);

    if (!restockItem || !Number.isFinite(amount) || amount === 0) return;

    const finalStock = Math.max(0, restockItem.stock + amount);
    setInventoryItems((items) =>
      items.map((item) =>
        item.id === restockItem.id ? { ...item, stock: finalStock } : item,
      ),
    );
    onNotify?.(`${restockItem.name} stock is now ${finalStock}.`, {
      icon: <LuPackagePlus aria-hidden="true" />,
      iconColor: "#0f766e",
      progressColor: "#14b8a6",
    });
    closeRestockModal();
  };

  const enterEditMode = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setModalMode("edit");
  };

  const handleSaveItem = (event) => {
    event.preventDefault();
    const stock = Number(itemForm.stock) || 0;
    const minimumThreshold = Number(itemForm.minimumThreshold) || 0;
    const brand = newBrand.trim() || itemForm.brand;
    const category = newCategory.trim() || itemForm.category;

    if (!itemForm.name.trim() || !brand || !category) return;

    const itemData = {
      name: itemForm.name.trim(),
      brand,
      category,
      price: Number(itemForm.sellingPrice) || 0,
      purchasingPrice: Number(itemForm.purchasingPrice) || 0,
      stock,
      minimumThreshold,
      variants: itemForm.variants
        .split("\n")
        .map((variant) => variant.trim())
        .filter(Boolean),
    };

    setInventoryItems((items) =>
      modalMode === "edit"
        ? items.map((item) =>
            item.id === selectedItemId ? { ...item, ...itemData } : item,
          )
        : [...items, { id: Date.now(), ...itemData }],
    );
    onNotify?.(
      modalMode === "edit"
        ? `${itemData.name} was updated successfully.`
        : `${itemData.name} was added successfully.`,
      {
        icon: <LuCircleCheck aria-hidden="true" />,
        iconColor: "#15803d",
        progressColor: "#22c55e",
      },
    );
    closeAddItemModal();
  };

  const handleDeleteItem = (event, item) => {
    event.stopPropagation();
    setInventoryItems((items) =>
      items.filter((current) => current.id !== item.id),
    );
    onNotify?.(`${item.name} was deleted.`, {
      icon: <LuTrash2 aria-hidden="true" />,
      iconColor: "#dc2626",
      progressColor: "#ef4444",
    });
  };

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return inventoryItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(query);
      const matchesBrand =
        selectedBrand === "all" || item.brand === selectedBrand;
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" ||
        getInventoryStatus(item.stock, item.minimumThreshold).className ===
          selectedStatus;

      return matchesSearch && matchesBrand && matchesCategory && matchesStatus;
    });
  }, [
    inventoryItems,
    searchTerm,
    selectedBrand,
    selectedCategory,
    selectedStatus,
  ]);

  return (
    <div className="inventory-screen">
      <div className="inventory-toolbar">
        <div className="inventory-filters" role="search">
          <label className="inventory-filters__search">
            <LuSearch aria-hidden="true" />
            <span className="sr-only">Search inventory items</span>
            <input
              type="search"
              placeholder="Search by item name"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <div className="inventory-filter inventory-filter--brand">
            <InventoryFilterDropdown
              label="Brand"
              value={selectedBrand}
              options={brands}
              onChange={setSelectedBrand}
            />
          </div>

          <div className="inventory-filter inventory-filter--category">
            <InventoryFilterDropdown
              label="Category"
              value={selectedCategory}
              options={categories}
              onChange={setSelectedCategory}
            />
          </div>

          <div className="inventory-filter inventory-filter--status">
            <InventoryFilterDropdown
              label="Status"
              value={selectedStatus}
              options={statuses}
              onChange={setSelectedStatus}
            />
          </div>
        </div>

        <button
          type="button"
          className="inventory-toolbar__add-button"
          onClick={openAddItemModal}
        >
          <LuPlus aria-hidden="true" />
          Add Item
        </button>
      </div>

      <div className="inventory-grid">
        {filteredItems.length === 0 ? (
          <div className="inventory-empty">
            <LuSearch aria-hidden="true" />
            <strong>No items found</strong>
            <span>Try a different search, brand, or category.</span>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="inventory-card"
              role="button"
              tabIndex="0"
              onClick={() => openItemModal(item)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openItemModal(item);
                }
              }}
            >
              <div className="inventory-card__top-row">
                <span className="inventory-card__badge inventory-card__badge--category">
                  <LuTag aria-hidden="true" />
                  {item.category}
                </span>
                <div className="inventory-card__top-actions">
                  {item.brand && (
                    <span className="inventory-card__badge inventory-card__badge--brand">
                      <LuStore aria-hidden="true" />
                      {item.brand}
                    </span>
                  )}
                </div>
              </div>

              <div className="inventory-card__content-row">
                <div className="inventory-card__details">
                  <h3 className="inventory-card__name">{item.name}</h3>

                  {item.variants.length > 0 && (
                    <div className="inventory-card__variant-section">
                      <span className="inventory-card__variant-heading">
                        <LuSlidersHorizontal aria-hidden="true" />
                        Variant
                      </span>
                      <span className="inventory-card__variants">
                        {item.variants.join(" / ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="inventory-card__icon-actions">
                  <button
                    type="button"
                    className="inventory-card__icon-button"
                    aria-label={`Edit ${item.name}`}
                    title={`Edit ${item.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      openItemModal(item, "edit");
                    }}
                  >
                    <LuPencil aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="inventory-card__icon-button inventory-card__icon-button--danger"
                    aria-label={`Delete ${item.name}`}
                    title={`Delete ${item.name}`}
                    onClick={(event) => handleDeleteItem(event, item)}
                  >
                    <LuTrash2 aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="inventory-card__restock-button"
                    aria-label={`Restock ${item.name}`}
                    title={`Restock ${item.name}`}
                    onClick={(event) => openRestockModal(event, item)}
                  >
                    <LuPackagePlus aria-hidden="true" />
                  </button>
                  {(() => {
                    const status = getInventoryStatus(
                      item.stock,
                      item.minimumThreshold,
                    );

                    return (
                      <span
                        className={`inventory-card__status inventory-card__status--${status.className}`}
                      >
                        {status.icon}
                        {status.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="inventory-card__footer">
                <div className="inventory-card__stock-summary">
                  <span>Total {item.stock}</span>
                  <span className="inventory-card__threshold-separator">-</span>
                  <span
                    className="inventory-card__threshold"
                    title={`Minimum threshold: ${item.minimumThreshold}`}
                    aria-label={`Minimum threshold: ${item.minimumThreshold}`}
                  >
                    <MdProductionQuantityLimits aria-hidden="true" />
                    {item.minimumThreshold}
                  </span>
                </div>
                <strong className="inventory-card__price">
                  PKR {item.price.toLocaleString()}
                </strong>
              </div>
            </div>
          ))
        )}
      </div>

      {isAddItemOpen && (
        <div
          className="inventory-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAddItemModal();
          }}
        >
          <section
            className="inventory-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-inventory-item-title"
          >
            <div className="inventory-modal__header">
              <div>
                <p className="inventory-modal__eyebrow">Inventory</p>
                <h2 id="add-inventory-item-title">
                  {modalMode === "view"
                    ? "Item Details"
                    : modalMode === "edit"
                      ? "Edit Item"
                      : "Add Item"}
                </h2>
              </div>
              <button
                type="button"
                className="inventory-modal__close"
                aria-label="Close add item dialog"
                onClick={closeAddItemModal}
              >
                <LuX aria-hidden="true" />
              </button>
            </div>

            <form
              className={`inventory-form ${modalMode === "view" ? "inventory-form--readonly" : ""}`}
              onSubmit={handleSaveItem}
            >
              <div className="inventory-form__select-row">
                <InventoryFormSelect
                  label="Brand Name"
                  icon={<LuStore aria-hidden="true" />}
                  value={itemForm.brand}
                  options={brands
                    .filter((brand) => brand.value !== "all")
                    .map((brand) => brand.label)}
                  onChange={(value) => {
                    setNewBrand("");
                    updateItemForm("brand", value);
                  }}
                  onCreate={() => {
                    setItemForm((current) => ({
                      ...current,
                      brand: "__create__",
                    }));
                    setNewBrand("");
                  }}
                  onCancelCreate={() => {
                    setNewBrand("");
                    updateItemForm("brand", "");
                  }}
                  createValue={newBrand}
                  onCreateChange={setNewBrand}
                  readOnly={modalMode === "view"}
                />
                <InventoryFormSelect
                  label="Category"
                  icon={<LuTag aria-hidden="true" />}
                  value={itemForm.category}
                  options={categories
                    .filter((category) => category.value !== "all")
                    .map((category) => category.label)}
                  onChange={(value) => {
                    setNewCategory("");
                    updateItemForm("category", value);
                  }}
                  onCreate={() => {
                    setItemForm((current) => ({
                      ...current,
                      category: "__create__",
                    }));
                    setNewCategory("");
                  }}
                  onCancelCreate={() => {
                    setNewCategory("");
                    updateItemForm("category", "");
                  }}
                  createValue={newCategory}
                  onCreateChange={setNewCategory}
                  readOnly={modalMode === "view"}
                />
              </div>

              <label className="inventory-form-field">
                <span className="inventory-form-field__label">
                  <LuPackage aria-hidden="true" />
                  Item Name
                </span>
                <input
                  required
                  type="text"
                  value={itemForm.name}
                  onChange={(event) =>
                    updateItemForm("name", event.target.value)
                  }
                  placeholder="Enter item name"
                  readOnly={modalMode === "view"}
                />
              </label>

              <div className="inventory-form__input-grid">
                <label className="inventory-form-field">
                  <span className="inventory-form-field__label">
                    <LuCircleDollarSign aria-hidden="true" />
                    Purchasing Price (PKR)
                  </span>
                  <input
                    min="0"
                    type="number"
                    value={itemForm.purchasingPrice}
                    onChange={(event) =>
                      updateItemForm("purchasingPrice", event.target.value)
                    }
                    placeholder="0"
                    readOnly={modalMode === "view"}
                  />
                </label>
                <label className="inventory-form-field">
                  <span className="inventory-form-field__label">
                    <LuCircleDollarSign aria-hidden="true" />
                    Selling Price (PKR)
                  </span>
                  <input
                    required
                    min="0"
                    type="number"
                    value={itemForm.sellingPrice}
                    onChange={(event) =>
                      updateItemForm("sellingPrice", event.target.value)
                    }
                    placeholder="0"
                    readOnly={modalMode === "view"}
                  />
                </label>
              </div>

              <div className="inventory-form__input-grid">
                <label className="inventory-form-field">
                  <span className="inventory-form-field__label">
                    <MdProductionQuantityLimits aria-hidden="true" />
                    Minimum Threshold
                  </span>
                  <input
                    required
                    min="0"
                    type="number"
                    value={itemForm.minimumThreshold}
                    onChange={(event) =>
                      updateItemForm("minimumThreshold", event.target.value)
                    }
                    placeholder="0"
                    readOnly={modalMode === "view"}
                  />
                </label>
                <label className="inventory-form-field">
                  <span className="inventory-form-field__label">
                    <LuPackagePlus aria-hidden="true" />
                    Stock
                  </span>
                  <input
                    min="0"
                    type="number"
                    value={itemForm.stock}
                    onChange={(event) =>
                      updateItemForm("stock", event.target.value)
                    }
                    placeholder="Enter stock"
                    readOnly={modalMode === "view"}
                  />
                </label>
              </div>

              <label className="inventory-form-field">
                <span className="inventory-form-field__label">
                  <LuSlidersHorizontal aria-hidden="true" />
                  Variant
                </span>
                <textarea
                  rows="7"
                  value={itemForm.variants}
                  onChange={(event) =>
                    updateItemForm("variants", event.target.value)
                  }
                  placeholder="Enter one variant per line"
                  readOnly={modalMode === "view"}
                />
              </label>

              <div className="inventory-form__actions">
                <button
                  type="button"
                  className="inventory-form__cancel"
                  onClick={closeAddItemModal}
                >
                  Cancel
                </button>
                {modalMode === "view" ? (
                  <button
                    type="button"
                    className="inventory-form__submit"
                    onClick={enterEditMode}
                  >
                    <LuPencil aria-hidden="true" />
                    Edit Item
                  </button>
                ) : (
                  <button type="submit" className="inventory-form__submit">
                    <LuPlus aria-hidden="true" />
                    {modalMode === "edit" ? "Save Changes" : "Add Item"}
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      )}

      {restockItem && (
        <div
          className="inventory-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeRestockModal();
          }}
        >
          <section
            className="inventory-modal inventory-restock-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="restock-item-title"
          >
            <div className="inventory-modal__header">
              <div>
                <p className="inventory-modal__eyebrow">Stock adjustment</p>
                <h2 id="restock-item-title">Update {restockItem.name}</h2>
              </div>
              <button
                type="button"
                className="inventory-modal__close"
                aria-label="Close stock adjustment dialog"
                onClick={closeRestockModal}
              >
                <LuX aria-hidden="true" />
              </button>
            </div>

            <form
              className="inventory-restock-form"
              onSubmit={applyStockAdjustment}
            >
              <label className="inventory-form-field">
                <span className="inventory-form-field__label">
                  <LuPackagePlus aria-hidden="true" />
                  Quantity change
                </span>
                <input
                  autoFocus
                  required
                  type="number"
                  value={restockAmount}
                  onChange={(event) => setRestockAmount(event.target.value)}
                  placeholder="Enter a positive or negative amount"
                />
                <small className="inventory-restock-form__hint">
                  Use a positive number to add stock or a negative number to
                  remove stock.
                </small>
              </label>

              <div className="inventory-restock-summary" aria-live="polite">
                <div>
                  <span>Current stock</span>
                  <strong>{restockItem.stock}</strong>
                </div>
                <div>
                  <span>Change</span>
                  <strong
                    className={
                      Number(restockAmount) < 0 ? "is-negative" : "is-positive"
                    }
                  >
                    {Number(restockAmount) > 0 ? "+" : ""}
                    {Number(restockAmount) || 0}
                  </strong>
                </div>
                <div className="inventory-restock-summary__total">
                  <span>Final stock</span>
                  <strong>
                    {Math.max(
                      0,
                      restockItem.stock + (Number(restockAmount) || 0),
                    )}
                  </strong>
                </div>
              </div>

              <div className="inventory-form__actions">
                <button
                  type="button"
                  className="inventory-form__cancel"
                  onClick={closeRestockModal}
                >
                  Cancel
                </button>
                <button type="submit" className="inventory-form__submit">
                  <LuPackagePlus aria-hidden="true" />
                  Apply change
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Inventory;
