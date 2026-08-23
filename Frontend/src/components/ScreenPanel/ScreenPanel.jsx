import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IoTrendingUp } from "react-icons/io5";
import {
  LuTags,
  LuLayoutList,
  LuTriangleAlert,
  LuPackageMinus,
  LuPackageX,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { FaRupeeSign } from "react-icons/fa6";
import { TbSitemap } from "react-icons/tb";
import { BsBoxes } from "react-icons/bs";
import { BiCartAdd } from "react-icons/bi";
import "./ScreenPanel.scss";

const performanceCards = [
  {
    icon: <LuLayoutList />,
    label: "Total Orders",
    value: "1,240",
    detail: "Orders processed today",
  },
  {
    icon: <LuTags />,
    label: "Total Sales",
    value: "PKR 38.4K",
    detail: "Revenue collected today",
  },
  {
    icon: <IoTrendingUp />,
    label: "Net Profit",
    value: "PKR 9.1K",
    detail: "Profit after costs",
  },
  {
    icon: <BsBoxes />,
    label: "Items Sold",
    value: "562",
    detail: "Products moved today",
  },
];

const storePerformanceCards = [
  {
    icon: <FaRupeeSign />,
    label: "Inventory Value",
    value: "PKR 215K",
    detail: "Current stock worth",
  },
  {
    icon: <LuTags />,
    label: "Potential Sales",
    value: "PKR 89K",
    detail: "Projected revenue",
  },
  {
    icon: <IoTrendingUp />,
    label: "Estimated Profit",
    value: "PKR 24K",
    detail: "After costs",
  },
  {
    icon: <TbSitemap />,
    label: "Total Categories",
    value: "18",
    detail: "Product categories",
  },
];

function ScreenPanel({ title, onNavigate }) {
  const isDashboard = title === "Dashboard";
  const [stockPage, setStockPage] = useState(0);
  const salesChartRef = useRef(null);
  const profitChartRef = useRef(null);
  const topCategoriesRef = useRef(null);
  const paymentMethodsRef = useRef(null);
  const topCompaniesRef = useRef(null);

  const stockInfoRows = [
    {
      item: "Sensor Cables",
      stock: 9,
      threshold: 20,
    },
    {
      item: "Thermal Paper",
      stock: 14,
      threshold: 9,
    },
    {
      item: "Coffee Beans",
      stock: 0,
      threshold: 30,
    },
    {
      item: "USB Barcode Scanner",
      stock: 6,
      threshold: 10,
    },
    {
      item: "Receipt Printer Rolls",
      stock: 0,
      threshold: 12,
    },
    {
      item: "Wireless Keyboards",
      stock: 18,
      threshold: 15,
    },
    {
      item: "Cash Drawer Trays",
      stock: 4,
      threshold: 8,
    },
    {
      item: "Ethernet Cables",
      stock: 13,
      threshold: 10,
    },
    {
      item: "Display Stands",
      stock: 0,
      threshold: 6,
    },
    {
      item: "Label Printer Ink",
      stock: 7,
      threshold: 7,
    },
    {
      item: "POS Terminal Stands",
      stock: 12,
      threshold: 10,
    },
    {
      item: "HDMI Display Cables",
      stock: 5,
      threshold: 8,
    },
    {
      item: "Keyboard Wrist Rests",
      stock: 0,
      threshold: 5,
    },
    {
      item: "Cash Register Keys",
      stock: 16,
      threshold: 12,
    },
    {
      item: "Receipt Printer Heads",
      stock: 3,
      threshold: 6,
    },
    {
      item: "Barcode Labels",
      stock: 23,
      threshold: 18,
    },
    {
      item: "Network Switches",
      stock: 0,
      threshold: 4,
    },
    {
      item: "Power Adapters",
      stock: 9,
      threshold: 9,
    },
    {
      item: "USB Extension Cables",
      stock: 19,
      threshold: 14,
    },
    {
      item: "Customer Display Screens",
      stock: 2,
      threshold: 5,
    },
    {
      item: "Receipt Paper Boxes",
      stock: 28,
      threshold: 22,
    },
    {
      item: "Cashier Headsets",
      stock: 0,
      threshold: 3,
    },
    {
      item: "Tablet Charging Docks",
      stock: 11,
      threshold: 8,
    },
    {
      item: "Inventory Tags",
      stock: 7,
      threshold: 10,
    },
    {
      item: "Security Cable Locks",
      stock: 15,
      threshold: 10,
    },
    {
      item: "Handheld POS Scanners",
      stock: 0,
      threshold: 6,
    },
    {
      item: "Monitor Mounts",
      stock: 8,
      threshold: 8,
    },
    {
      item: "Power Strip Units",
      stock: 17,
      threshold: 12,
    },
    {
      item: "Thermal Printer Covers",
      stock: 4,
      threshold: 7,
    },
    {
      item: "Wireless Mouse Units",
      stock: 20,
      threshold: 15,
    },
    {
      item: "Shelf Label Holders",
      stock: 0,
      threshold: 8,
    },
    {
      item: "POS Software Licenses",
      stock: 13,
      threshold: 10,
    },
  ];

  const getStockStatus = (stock, threshold) => {
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

    if (stock <= threshold + 5) {
      return {
        label: "Low Stock",
        className: "low-stock",
        icon: <LuTriangleAlert aria-hidden="true" />,
      };
    }

    return {
      label: "Low Stock",
      className: "low-stock",
      icon: <LuTriangleAlert aria-hidden="true" />,
    };
  };

  const stockPageSize = 5;
  const stockPageCount = Math.ceil(stockInfoRows.length / stockPageSize);
  const visibleStockRows = stockInfoRows.slice(
    stockPage * stockPageSize,
    (stockPage + 1) * stockPageSize,
  );
  const firstStockResult = stockPage * stockPageSize + 1;
  const lastStockResult = Math.min(
    (stockPage + 1) * stockPageSize,
    stockInfoRows.length,
  );

  useEffect(() => {
    if (!isDashboard) return;

    let salesChart = null;
    let profitChart = null;
    let topCategoriesChart = null;
    let paymentMethodsChart = null;
    let topCompaniesChart = null;

    // copy DOM refs into local variables so cleanup uses the same nodes
    const salesEl = salesChartRef.current;
    const profitEl = profitChartRef.current;
    const topCategoriesEl = topCategoriesRef.current;
    const paymentMethodsEl = paymentMethodsRef.current;
    const topCompaniesEl = topCompaniesRef.current;

    (async () => {
      const Apex = (await import("apexcharts")).default;

      // generate last 90 days (approx 3 months) categories and dummy series
      const DAYS = 90;
      const getLastNDays = (n) => {
        const arr = [];
        for (let i = 0; i < n; i++) {
          const d = new Date();
          d.setDate(d.getDate() - (n - 1 - i));
          arr.push(
            d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          );
        }
        return arr;
      };

      const generateSeries = (n, start = 10000, volatility = 0.06) => {
        const data = [];
        let value = start;
        for (let i = 0; i < n; i++) {
          // random walk with bounded volatility
          const change = (Math.random() * 2 - 1) * volatility * value;
          value = Math.max(0, Math.round(value + change));
          data.push(value);
        }
        return data;
      };

      const categories = getLastNDays(DAYS);
      const salesData = generateSeries(DAYS, 12000, 0.08);
      const profitData = generateSeries(DAYS, 3000, 0.06);

      const salesOpts = {
        series: [{ name: "Sales", data: salesData }],
        chart: {
          type: "area",
          height: 240,
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        stroke: { curve: "smooth", width: 2, colors: ["var(--color-primary)"] },
        fill: { opacity: 0.12, colors: ["var(--color-primary)"] },
        markers: { size: 0 },
        dataLabels: { enabled: false },
        tooltip: { theme: "light" },
        xaxis: {
          categories,
          labels: { show: true, rotate: -45, rotateAlways: true },
          axisBorder: { show: true },
          axisTicks: { show: true },
          tickAmount: 8,
        },
        yaxis: { show: true, labels: { show: true }, tickAmount: 4 },
      };

      const profitOpts = {
        series: [{ name: "Profit", data: profitData }],
        chart: {
          type: "area",
          height: 240,
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        stroke: {
          curve: "smooth",
          width: 2,
          colors: ["var(--color-primary-dark)"],
        },
        fill: { opacity: 0.12, colors: ["var(--color-primary-dark)"] },
        markers: { size: 0 },
        dataLabels: { enabled: false },
        tooltip: { theme: "light" },
        xaxis: {
          categories,
          labels: { show: true, rotate: -45, rotateAlways: true },
          axisBorder: { show: true },
          axisTicks: { show: true },
          tickAmount: 8,
        },
        yaxis: { show: true, labels: { show: true }, tickAmount: 4 },
      };

      const topCategoriesOpts = {
        series: [
          {
            data: [1720, 1480, 1320, 1120, 980],
          },
        ],
        chart: {
          type: "bar",
          height: 240,
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: "75%",
            borderRadius: 6,
            borderRadiusApplication: "around",
          },
        },
        fill: { opacity: 0.95, colors: ["var(--color-primary)"] },
        colors: ["var(--color-primary)"],
        dataLabels: {
          enabled: true,
          position: "center",
          offsetY: 4,
          formatter: (val, opts) => {
            const total = opts.w.globals.seriesTotals[0] || 1;
            return `${Math.round((val / total) * 100)}%`;
          },
          style: {
            colors: ["#ffffff"],
            fontSize: "0.65rem",
            fontWeight: 700,
          },
          background: { enabled: false },
          dropShadow: { enabled: false },
        },
        tooltip: { theme: "light" },
        xaxis: {
          categories: [
            "Beverages",
            "Snacks",
            "Electronics",
            "Clothing",
            "Home",
          ],
          labels: { show: true },
          axisBorder: { show: true },
          axisTicks: { show: true },
        },
        yaxis: { show: true, labels: { show: true } },
      };

      const paymentMethodsOpts = {
        series: [64, 36],
        chart: {
          type: "donut",
          height: 240,
          toolbar: { show: false },
        },
        labels: ["Cash", "Online"],
        colors: ["var(--color-primary)", "rgba(20, 184, 166, 0.38)"],
        plotOptions: {
          pie: {
            borderRadius: 12,
            spacing: 5,
            donut: {
              size: "68%",
              labels: {
                show: false,
              },
            },
          },
        },
        stroke: { width: 0 },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontSize: "0.82rem",
          markers: { width: 10, height: 10, radius: 10 },
        },
        fill: { opacity: 1 },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${Math.round(val)}%`,
          style: {
            colors: ["#ffffff"],
            fontSize: "0.65rem",
            fontWeight: 700,
          },
          background: { enabled: false },
          dropShadow: { enabled: false },
        },
        tooltip: { theme: "light" },
      };

      const topCompaniesOpts = {
        series: [{ name: "Sales", data: [2020, 1840, 1600, 1430, 1280] }],
        chart: { type: "bar", height: 240, toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 12, columnWidth: "50%" } },
        colors: ["var(--color-primary)"],
        dataLabels: {
          enabled: true,
          formatter: (val, opts) => {
            const total = opts.w.globals.seriesTotals[0] || 1;
            return `${Math.round((val / total) * 100)}%`;
          },
          style: {
            colors: ["#ffffff"],
            fontSize: "0.65rem",
            fontWeight: 700,
          },
          background: { enabled: false },
          dropShadow: { enabled: false },
        },
        tooltip: { theme: "light" },
        xaxis: {
          categories: ["Acme", "Nova", "Zenith", "Orion", "Apex"],
          labels: { show: true },
          axisBorder: { show: true },
          axisTicks: { show: true },
        },
        yaxis: { show: true, labels: { show: true }, tickAmount: 4 },
      };

      if (salesEl) {
        // clear any previous chart markup (prevents duplicate SVGs in dev/strict mode)
        salesEl.innerHTML = "";
        salesChart = new Apex(salesEl, salesOpts);
        salesChart.render();
      }

      if (profitEl) {
        profitEl.innerHTML = "";
        profitChart = new Apex(profitEl, profitOpts);
        profitChart.render();
      }

      if (topCategoriesEl) {
        topCategoriesEl.innerHTML = "";
        topCategoriesChart = new Apex(topCategoriesEl, topCategoriesOpts);
        topCategoriesChart.render();
      }

      if (paymentMethodsEl) {
        paymentMethodsEl.innerHTML = "";
        paymentMethodsChart = new Apex(paymentMethodsEl, paymentMethodsOpts);
        paymentMethodsChart.render();
      }

      if (topCompaniesEl) {
        topCompaniesEl.innerHTML = "";
        topCompaniesChart = new Apex(topCompaniesEl, topCompaniesOpts);
        topCompaniesChart.render();
      }
    })();

    return () => {
      try {
        if (salesChart) {
          salesChart.destroy();
          if (salesEl) salesEl.innerHTML = "";
        }
        if (profitChart) {
          profitChart.destroy();
          if (profitEl) profitEl.innerHTML = "";
        }
        if (topCategoriesChart) {
          topCategoriesChart.destroy();
          if (topCategoriesEl) topCategoriesEl.innerHTML = "";
        }
        if (paymentMethodsChart) {
          paymentMethodsChart.destroy();
          if (paymentMethodsEl) paymentMethodsEl.innerHTML = "";
        }
        if (topCompaniesChart) {
          topCompaniesChart.destroy();
          if (topCompaniesEl) topCompaniesEl.innerHTML = "";
        }
      } catch (e) {
        console.warn("Chart cleanup error:", e);
      }
    };
  }, [isDashboard]);

  return (
    <motion.section
      className="screen-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="screen-panel__header">
        <h1 className="screen-panel__title">{title.toUpperCase()}</h1>
      </div>

      {isDashboard ? (
        <div className="screen-panel__dashboard">
          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <p className="dashboard-section__title">Sales Performance</p>
            </div>
            <div className="dashboard-section__cards dashboard-section__cards--metrics">
              {performanceCards.map((card) => (
                <div
                  key={card.label}
                  className="dashboard-card dashboard-card--metric"
                >
                  <div className="dashboard-card__icon">{card.icon}</div>
                  <div>
                    <p className="dashboard-card__label">{card.label}</p>
                    <p className="dashboard-card__value">{card.value}</p>
                    <p className="dashboard-card__detail">{card.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="dashboard-section__cards dashboard-section__cards--charts">
              <div className="dashboard-card dashboard-card--chart">
                <p className="dashboard-card__label">Sales Trends</p>
                <div className="dashboard-chart" ref={salesChartRef}></div>
              </div>
              <div className="dashboard-card dashboard-card--chart">
                <p className="dashboard-card__label">Profit Trends</p>
                <div className="dashboard-chart" ref={profitChartRef}></div>
              </div>
            </div>
            <div className="dashboard-section__cards dashboard-section__cards--triple">
              <div className="dashboard-card dashboard-card--chart">
                <p className="dashboard-card__label">Top Categories</p>
                <div className="dashboard-chart" ref={topCategoriesRef}></div>
              </div>
              <div className="dashboard-card dashboard-card--chart">
                <p className="dashboard-card__label">Payment Methods</p>
                <div className="dashboard-chart" ref={paymentMethodsRef}></div>
              </div>
              <div className="dashboard-card dashboard-card--chart">
                <p className="dashboard-card__label">Top Companies</p>
                <div className="dashboard-chart" ref={topCompaniesRef}></div>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <p className="dashboard-section__title">Store Overview</p>
            </div>
            <div className="dashboard-section__cards dashboard-section__cards--metrics">
              {storePerformanceCards.map((card) => (
                <div
                  key={card.label}
                  className="dashboard-card dashboard-card--metric"
                >
                  <div className="dashboard-card__icon">{card.icon ?? ""}</div>
                  <div>
                    <p className="dashboard-card__label">{card.label}</p>
                    <p className="dashboard-card__value">{card.value}</p>
                    <p className="dashboard-card__detail">{card.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="stock-info">
              <div className="stock-info__header">
                <p className="stock-info__title">Stock Information</p>
              </div>
              <div className="stock-info__table">
                <div className="stock-info__row stock-info__row--header">
                  <span>Item</span>
                  <span>Status</span>
                  <span>Current Stock</span>
                  <span>Minimum Stock Threshold</span>
                  <span>Action</span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={stockPage}
                    className="stock-info__page"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {visibleStockRows.map((row) => {
                      const status = getStockStatus(row.stock, row.threshold);

                      return (
                        <div key={row.item} className="stock-info__row">
                          <span>{row.item}</span>
                          <span>
                            <span
                              className={`stock-info__indicator stock-info__indicator--${status.className}`}
                            >
                              {status.icon}
                              {status.label}
                            </span>
                          </span>
                          <span className="stock-info__value">{row.stock}</span>
                          <span className="stock-info__value">
                            {row.threshold}
                          </span>
                          <span>
                            <button
                              type="button"
                              className="stock-info__button"
                              onClick={() => onNavigate?.("Inventory")}
                              aria-label={`Restock ${row.item}`}
                              title={`Restock ${row.item}`}
                            >
                              <BiCartAdd aria-hidden="true" />
                            </button>
                          </span>
                        </div>
                      );
                    })}
                    {Array.from({
                      length: stockPageSize - visibleStockRows.length,
                    }).map((_, index) => (
                      <div
                        key={`empty-stock-row-${index}`}
                        className="stock-info__row stock-info__row--placeholder"
                        aria-hidden="true"
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
              {stockPageCount > 1 && (
                <div className="stock-info__pagination">
                  <span className="stock-info__results">
                    Showing Results {firstStockResult} - {lastStockResult} out
                    of {stockInfoRows.length}
                  </span>
                  <button
                    type="button"
                    className="stock-info__page-button"
                    onClick={() => setStockPage((page) => page - 1)}
                    disabled={stockPage === 0}
                    aria-label="Previous stock items"
                  >
                    <LuChevronLeft aria-hidden="true" />
                  </button>
                  <span className="stock-info__page-status">
                    {stockPage + 1} / {stockPageCount}
                  </span>
                  <button
                    type="button"
                    className="stock-info__page-button"
                    onClick={() => setStockPage((page) => page + 1)}
                    disabled={stockPage === stockPageCount - 1}
                    aria-label="Next stock items"
                  >
                    <LuChevronRight aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="screen-panel__content">
          <p className="screen-panel__message">This is the {title} screen.</p>
        </div>
      )}
    </motion.section>
  );
}

export default ScreenPanel;
