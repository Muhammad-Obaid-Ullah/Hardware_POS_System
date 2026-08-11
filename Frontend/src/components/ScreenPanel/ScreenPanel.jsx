import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { IoTrendingUp } from "react-icons/io5";
import { LuTags, LuLayoutList, LuBoxes } from "react-icons/lu";
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
    icon: <LuBoxes />,
    label: "Items Sold",
    value: "562",
    detail: "Products moved today",
  },
];

const overviewCards = [
  { label: "Products in stock", value: "1,248", detail: "Current inventory" },
  { label: "Active customers", value: "3,620", detail: "Store base" },
  { label: "Pending orders", value: "24", detail: "Needs attention" },
  { label: "Store rating", value: "4.8 / 5", detail: "Customer feedback" },
];

function ScreenPanel({ title }) {
  const isDashboard = title === "Dashboard";
  const salesChartRef = useRef(null);
  const profitChartRef = useRef(null);

  useEffect(() => {
    if (!isDashboard) return;

    let salesChart = null;
    let profitChart = null;

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

      if (salesChartRef.current) {
        // clear any previous chart markup (prevents duplicate SVGs in dev/strict mode)
        salesChartRef.current.innerHTML = "";
        salesChart = new Apex(salesChartRef.current, salesOpts);
        salesChart.render();
      }

      if (profitChartRef.current) {
        profitChartRef.current.innerHTML = "";
        profitChart = new Apex(profitChartRef.current, profitOpts);
        profitChart.render();
      }
    })();

    return () => {
      try {
        if (salesChart) {
          salesChart.destroy();
          if (salesChartRef.current) salesChartRef.current.innerHTML = "";
        }
        if (profitChart) {
          profitChart.destroy();
          if (profitChartRef.current) profitChartRef.current.innerHTML = "";
        }
      } catch (e) {}
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
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section__header">
              <p className="dashboard-section__title">Store Overview</p>
            </div>
            <div className="dashboard-section__cards">
              {overviewCards.map((card) => (
                <div key={card.label} className="dashboard-card">
                  <p className="dashboard-card__label">{card.label}</p>
                  <p className="dashboard-card__value">{card.value}</p>
                  <p className="dashboard-card__detail">{card.detail}</p>
                </div>
              ))}
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
