import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IoTrendingUp } from "react-icons/io5";
import {
  LuTags,
  LuLayoutList,
  LuTriangleAlert,
  LuPackageMinus,
  LuPackageX,
  LuCalendarDays,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import { FaRupeeSign } from "react-icons/fa6";
import { TbSitemap } from "react-icons/tb";
import { BsBoxes } from "react-icons/bs";
import { BiCartAdd } from "react-icons/bi";
import { getDashboardSummary } from "../../services/dashboard";
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

/* Stock rows are loaded from the dashboard summary endpoint. */
/*
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
*/

const dashboardWeekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDashboardDate(dateValue) {
  if (!dateValue) return "Select date";
  return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDashboardMonthDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

function getDashboardToday() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

function getDashboardRange(fromDate, toDate, summary) {
  const effectiveStart = fromDate || summary?.rangeStart;
  const effectiveEnd = toDate || summary?.rangeEnd || getDashboardToday();
  const isHourly = Boolean(
    effectiveStart && effectiveEnd && effectiveStart === effectiveEnd,
  );
  if (isHourly) {
    return {
      isHourly: true,
      labels: Array.from({ length: 24 }, (_, hour) => {
        const suffix = hour < 12 ? "AM" : "PM";
        const displayHour = hour % 12 || 12;
        return `${displayHour} ${suffix}`;
      }),
      rangeDays: 1,
    };
  }

  const end = new Date(`${effectiveEnd}T00:00:00`);
  const start = fromDate
    ? new Date(`${fromDate}T00:00:00`)
    : effectiveStart
      ? new Date(`${effectiveStart}T00:00:00`)
      : new Date(end.getTime() - 89 * 24 * 60 * 60 * 1000);
  const rangeDays = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1,
  );
  const labels = Array.from({ length: rangeDays }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  });

  return { isHourly: false, labels, rangeDays };
}

function DashboardDatePicker({ label, value, min, max, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [monthDate, setMonthDate] = useState(() =>
    value ? new Date(`${value}T00:00:00`) : new Date(),
  );
  const pickerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleOutsideClick = (event) => {
      if (!pickerRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const days = getDashboardMonthDays(monthDate);
  const monthLabel = monthDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const selectDay = (day) => {
    if (!day) return;
    const selected = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      day,
    );
    const dateValue = [
      selected.getFullYear(),
      String(selected.getMonth() + 1).padStart(2, "0"),
      String(selected.getDate()).padStart(2, "0"),
    ].join("-");
    if ((!min || dateValue >= min) && (!max || dateValue <= max)) {
      onChange(dateValue);
      setMonthDate(selected);
      setIsOpen(false);
    }
  };

  return (
    <div className="dashboard-date-picker" ref={pickerRef}>
      <span className="sr-only">Filter sales from or to date</span>
      <button
        type="button"
        className="dashboard-date-picker__trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <LuCalendarDays aria-hidden="true" />
        <span>{label}</span>
        <strong>{formatDashboardDate(value)}</strong>
      </button>
      {isOpen && (
        <div className="dashboard-date-picker__menu">
          <div className="dashboard-date-picker__header">
            <strong>{monthLabel}</strong>
            <div>
              <button
                type="button"
                aria-label="Previous month"
                onClick={() =>
                  setMonthDate(
                    new Date(
                      monthDate.getFullYear(),
                      monthDate.getMonth() - 1,
                      1,
                    ),
                  )
                }
              >
                <LuChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() =>
                  setMonthDate(
                    new Date(
                      monthDate.getFullYear(),
                      monthDate.getMonth() + 1,
                      1,
                    ),
                  )
                }
              >
                <LuChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="dashboard-date-picker__weekdays">
            {dashboardWeekDays.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="dashboard-date-picker__days">
            {days.map((day, index) => {
              const selected =
                day &&
                `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const disabled =
                !day || (min && selected < min) || (max && selected > max);
              return (
                <button
                  type="button"
                  key={`${monthLabel}-${index}`}
                  className={
                    selected === value
                      ? "dashboard-date-picker__day--selected"
                      : ""
                  }
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="dashboard-date-picker__actions">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
            >
              Clear
            </button>
            <button
              type="button"
              disabled={
                (min && getDashboardToday() < min) ||
                (max && getDashboardToday() > max)
              }
              onClick={() => {
                const today = getDashboardToday();
                if ((!min || today >= min) && (!max || today <= max)) {
                  onChange(today);
                  setMonthDate(new Date());
                  setIsOpen(false);
                }
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard({
  onNavigate,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}) {
  const [stockPage, setStockPage] = useState(0);
  const [summary, setSummary] = useState(null);
  const salesChartRef = useRef(null);
  const profitChartRef = useRef(null);
  const topCategoriesRef = useRef(null);
  const paymentMethodsRef = useRef(null);
  const topCompaniesRef = useRef(null);

  useEffect(() => {
    getDashboardSummary(fromDate, toDate)
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [fromDate, toDate]);

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
      const {
        isHourly,
        labels: rangeLabels,
        rangeDays,
      } = getDashboardRange(fromDate, toDate, summary);
      const labels = rangeLabels;
      const trendMap = new Map(
        (summary?.trends || []).map((trend) => [trend.label, trend]),
      );
      const salesSeries = labels.map(
        (label) => trendMap.get(label)?.sales || 0,
      );
      const profitSeries = labels.map(
        (label) => trendMap.get(label)?.profit || 0,
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
          categories: labels,
          tickAmount: isHourly
            ? 8
            : Math.min(8, Math.max(2, Math.round(rangeDays / 7))),
          labels: { rotate: isHourly ? 0 : -45, rotateAlways: !isHourly },
        },
        yaxis: { tickAmount: 4 },
      });
      const options = [
        area("Sales", salesSeries, "var(--color-primary)"),
        area("Profit", profitSeries, "var(--color-primary-dark)"),
        {
          series: [
            {
              data: (summary?.categories || []).map((entry) => entry.value),
            },
          ],
          chart: {
            id: "top-categories-chart",
            type: "bar",
            height: 240,
            toolbar: { show: false },
          },
          colors: ["var(--color-primary)"],
          plotOptions: {
            bar: {
              horizontal: true,
              barHeight: "85%",
              borderRadius: 6,
              dataLabels: { position: "center" },
            },
          },
          dataLabels: {
            enabled: true,
            position: "center",
            offsetY: 4,
            formatter: (value, opts) =>
              `${Math.round((value / (opts.w.globals.seriesTotals[0] || 1)) * 100)}%`,
            style: { colors: ["#fff"], fontSize: "0.65rem" },
            background: { enabled: false },
            dropShadow: { enabled: false },
          },
          xaxis: {
            categories: [
              ...(summary?.categories || []).map((entry) => entry.label),
            ],
          },
        },
        {
          series: [
            summary?.payments?.find((entry) => entry.label === "cash")?.value ||
              0,
            summary?.payments?.find((entry) => entry.label === "online")
              ?.value || 0,
          ],
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
            style: { colors: ["#fff"], fontSize: "0.65rem" },
          },
        },
        {
          series: [
            {
              name: "Sales",
              data: (summary?.brands || []).map((entry) => entry.value),
            },
          ],
          chart: { type: "bar", height: 240, toolbar: { show: false } },
          colors: ["var(--color-primary)"],
          plotOptions: { bar: { borderRadius: 12, columnWidth: "50%" } },
          dataLabels: {
            enabled: true,
            formatter: (value, opts) =>
              `${Math.round((value / (opts.w.globals.seriesTotals[0] || 1)) * 100)}%`,
            style: { colors: ["#fff"], fontSize: "0.65rem" },
          },
          xaxis: {
            categories: (summary?.brands || []).map((entry) => entry.label),
          },
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
  }, [fromDate, toDate, summary]);

  const pageSize = 5;
  const stockInfoRows = summary?.inventory || [];
  const pageCount = Math.ceil(stockInfoRows.length / pageSize);
  const rows = stockInfoRows.slice(
    stockPage * pageSize,
    (stockPage + 1) * pageSize,
  );
  const first = stockPage * pageSize + 1;
  const last = Math.min((stockPage + 1) * pageSize, stockInfoRows.length);
  const periodLabel = "Selected date range";
  const filteredPerformanceCards = performanceCards.map((card) => {
    const values = {
      "Total Orders": summary?.metrics.totalOrders || 0,
      "Total Sales": summary?.metrics.totalSales || 0,
      "Net Profit": summary?.metrics.netProfit || 0,
      "Items Sold": summary?.metrics.itemsSold || 0,
    };
    const value = values[card.label];
    const formattedValue =
      card.label.includes("Sales") || card.label === "Net Profit"
        ? `PKR ${(value / 1000).toFixed(1)}K`
        : value.toLocaleString();

    return {
      ...card,
      value: formattedValue,
      detail: `${periodLabel}`,
    };
  });

  return (
    <div className="dashboard-screen">
      <section className="dashboard-section">
        <div className="dashboard-section__header dashboard-section__header--sales">
          <p className="dashboard-section__title">Sales Performance</p>
          <div className="dashboard-section__date-filters">
            <DashboardDatePicker
              label="From"
              value={fromDate}
              max={toDate}
              onChange={onFromDateChange}
            />
            <DashboardDatePicker
              label="To"
              value={toDate}
              min={fromDate}
              onChange={onToDateChange}
            />
          </div>
        </div>
        <div className="dashboard-section__cards dashboard-section__cards--metrics">
          {filteredPerformanceCards.map((card) => (
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
          {storePerformanceCards.map((card) => {
            const values = {
              "Inventory Value": summary?.store.inventoryValue || 0,
              "Potential Sales": summary?.store.potentialSales || 0,
              "Estimated Profit": summary?.store.estimatedProfit || 0,
              "Total Categories": summary?.store.totalCategories || 0,
            };
            const value = values[card.label];
            return (
              <div
                key={card.label}
                className="dashboard-card dashboard-card--metric"
              >
                <div className="dashboard-card__icon">{card.icon}</div>
                <div>
                  <p className="dashboard-card__label">{card.label}</p>
                  <p className="dashboard-card__value">
                    {card.label === "Total Categories"
                      ? value.toLocaleString()
                      : `PKR ${(value / 1000).toFixed(1)}K`}
                  </p>
                  <p className="dashboard-card__detail">{card.detail}</p>
                </div>
              </div>
            );
          })}
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
