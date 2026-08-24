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
import "./Dashboard.scss";

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

const stockInfoRows = [
  ["Sensor Cables", 9, 20],
  ["Thermal Paper", 14, 9],
  ["Coffee Beans", 0, 30],
  ["USB Barcode Scanner", 6, 10],
  ["Receipt Printer Rolls", 0, 12],
  ["Wireless Keyboards", 18, 15],
  ["Cash Drawer Trays", 4, 8],
  ["Ethernet Cables", 13, 10],
  ["Display Stands", 0, 6],
  ["Label Printer Ink", 7, 7],
  ["POS Terminal Stands", 12, 10],
  ["HDMI Display Cables", 5, 8],
  ["Keyboard Wrist Rests", 0, 5],
  ["Cash Register Keys", 16, 12],
  ["Receipt Printer Heads", 3, 6],
  ["Barcode Labels", 23, 18],
  ["Network Switches", 0, 4],
  ["Power Adapters", 9, 9],
  ["USB Extension Cables", 19, 14],
  ["Customer Display Screens", 2, 5],
  ["Receipt Paper Boxes", 28, 22],
  ["Cashier Headsets", 0, 3],
  ["Tablet Charging Docks", 11, 8],
  ["Inventory Tags", 7, 10],
  ["Security Cable Locks", 15, 10],
  ["Handheld POS Scanners", 0, 6],
  ["Monitor Mounts", 8, 8],
  ["Power Strip Units", 17, 12],
  ["Thermal Printer Covers", 4, 7],
  ["Wireless Mouse Units", 20, 15],
  ["Shelf Label Holders", 0, 8],
  ["POS Software Licenses", 13, 10],
].map(([item, stock, threshold]) => ({ item, stock, threshold }));

function Dashboard({ onNavigate }) {
  const [stockPage, setStockPage] = useState(0);
  const salesChartRef = useRef(null);
  const profitChartRef = useRef(null);
  const topCategoriesRef = useRef(null);
  const paymentMethodsRef = useRef(null);
  const topCompaniesRef = useRef(null);

  const getStockStatus = (stock, threshold) => {
    if (stock === 0)
      return {
        label: "Out of Stock",
        className: "out-of-stock",
        icon: <LuPackageX aria-hidden="true" />,
      };
    if (stock <= threshold)
      return {
        label: "Critical",
        className: "critical",
        icon: <LuPackageMinus aria-hidden="true" />,
      };
    return {
      label: "Low Stock",
      className: "low-stock",
      icon: <LuTriangleAlert aria-hidden="true" />,
    };
  };

  useEffect(() => {
    let charts = [];
    let cancelled = false;
    const elements = [
      salesChartRef,
      profitChartRef,
      topCategoriesRef,
      paymentMethodsRef,
      topCompaniesRef,
    ].map((ref) => ref.current);
    (async () => {
      const Apex = (await import("apexcharts")).default;
      if (cancelled) return;
      const days = Array.from({ length: 90 }, (_, index) => `Day ${index + 1}`);
      const series = (start) =>
        days.map((_, index) =>
          Math.max(
            0,
            Math.round(
              start +
                Math.sin(index / 5) * start * 0.18 +
                Math.random() * start * 0.12,
            ),
          ),
        );
      const area = (name, data, color) => ({
        series: [{ name, data }],
        chart: {
          type: "area",
          height: 240,
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        stroke: { curve: "smooth", width: 2, colors: [color] },
        fill: { opacity: 0.12, colors: [color] },
        markers: { size: 0 },
        dataLabels: { enabled: false },
        tooltip: { theme: "light" },
        xaxis: {
          categories: days,
          tickAmount: 8,
          labels: { rotate: -45, rotateAlways: true },
        },
        yaxis: { tickAmount: 4 },
      });
      const options = [
        area("Sales", series(12000), "var(--color-primary)"),
        area("Profit", series(3000), "var(--color-primary-dark)"),
        {
          series: [{ data: [1720, 1480, 1320, 1120, 980] }],
          chart: { type: "bar", height: 240, toolbar: { show: false } },
          colors: ["var(--color-primary)"],
          plotOptions: {
            bar: { horizontal: true, barHeight: "75%", borderRadius: 6 },
          },
          dataLabels: {
            enabled: true,
            formatter: (value, opts) =>
              `${Math.round((value / (opts.w.globals.seriesTotals[0] || 1)) * 100)}%`,
            style: { colors: ["#fff"] },
          },
          xaxis: {
            categories: [
              "Beverages",
              "Snacks",
              "Electronics",
              "Clothing",
              "Home",
            ],
          },
        },
        {
          series: [64, 36],
          chart: { type: "donut", height: 240, toolbar: { show: false } },
          labels: ["Cash", "Online"],
          colors: ["var(--color-primary)", "rgba(20, 184, 166, 0.38)"],
          plotOptions: {
            pie: { borderRadius: 12, spacing: 5, donut: { size: "68%" } },
          },
          stroke: { width: 0 },
          legend: { position: "bottom" },
          dataLabels: {
            enabled: true,
            formatter: (value) => `${Math.round(value)}%`,
            style: { colors: ["#fff"] },
          },
        },
        {
          series: [{ name: "Sales", data: [2020, 1840, 1600, 1430, 1280] }],
          chart: { type: "bar", height: 240, toolbar: { show: false } },
          colors: ["var(--color-primary)"],
          plotOptions: { bar: { borderRadius: 12, columnWidth: "50%" } },
          dataLabels: {
            enabled: true,
            formatter: (value, opts) =>
              `${Math.round((value / (opts.w.globals.seriesTotals[0] || 1)) * 100)}%`,
            style: { colors: ["#fff"] },
          },
          xaxis: { categories: ["Acme", "Nova", "Zenith", "Orion", "Apex"] },
        },
      ];
      elements.forEach((element, index) => {
        if (cancelled || !element) return;
        element.innerHTML = "";
        const chart = new Apex(element, options[index]);
        charts.push(chart);
        chart.render();
      });
    })();
    return () => {
      cancelled = true;
      charts.forEach((chart) => chart.destroy());
      elements.forEach((element) => {
        if (element) element.innerHTML = "";
      });
    };
  }, []);

  const pageSize = 5;
  const pageCount = Math.ceil(stockInfoRows.length / pageSize);
  const rows = stockInfoRows.slice(
    stockPage * pageSize,
    (stockPage + 1) * pageSize,
  );
  const first = stockPage * pageSize + 1;
  const last = Math.min((stockPage + 1) * pageSize, stockInfoRows.length);

  return (
    <div className="dashboard-screen">
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
            <div className="dashboard-chart" ref={salesChartRef} />
          </div>
          <div className="dashboard-card dashboard-card--chart">
            <p className="dashboard-card__label">Profit Trends</p>
            <div className="dashboard-chart" ref={profitChartRef} />
          </div>
        </div>
        <div className="dashboard-section__cards dashboard-section__cards--triple">
          <div className="dashboard-card dashboard-card--chart">
            <p className="dashboard-card__label">Top Categories</p>
            <div className="dashboard-chart" ref={topCategoriesRef} />
          </div>
          <div className="dashboard-card dashboard-card--chart">
            <p className="dashboard-card__label">Payment Methods</p>
            <div className="dashboard-chart" ref={paymentMethodsRef} />
          </div>
          <div className="dashboard-card dashboard-card--chart">
            <p className="dashboard-card__label">Top Companies</p>
            <div className="dashboard-chart" ref={topCompaniesRef} />
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
              <div className="dashboard-card__icon">{card.icon}</div>
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
                transition={{ duration: 0.2 }}
              >
                {rows.map((row) => {
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
                      <span className="stock-info__value">{row.threshold}</span>
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
                {Array.from({ length: pageSize - rows.length }).map(
                  (_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="stock-info__row stock-info__row--placeholder"
                      aria-hidden="true"
                    />
                  ),
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {pageCount > 1 && (
            <div className="stock-info__pagination">
              <span className="stock-info__results">
                Showing Results {first} - {last} out of {stockInfoRows.length}
              </span>
              <button
                type="button"
                className="stock-info__page-button"
                onClick={() => setStockPage((page) => page - 1)}
                disabled={stockPage === 0}
                aria-label="Previous stock items"
              >
                <LuChevronLeft />
              </button>
              <span className="stock-info__page-status">
                {stockPage + 1} / {pageCount}
              </span>
              <button
                type="button"
                className="stock-info__page-button"
                onClick={() => setStockPage((page) => page + 1)}
                disabled={stockPage === pageCount - 1}
                aria-label="Next stock items"
              >
                <LuChevronRight />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
