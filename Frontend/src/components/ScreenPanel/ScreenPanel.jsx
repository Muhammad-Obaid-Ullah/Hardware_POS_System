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
  const topCategoriesRef = useRef(null);
  const paymentMethodsRef = useRef(null);
  const topCompaniesRef = useRef(null);

  useEffect(() => {
    if (!isDashboard) return;

    let salesChart = null;
    let profitChart = null;
    let topCategoriesChart = null;
    let paymentMethodsChart = null;
    let topCompaniesChart = null;

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

      if (topCategoriesRef.current) {
        topCategoriesRef.current.innerHTML = "";
        topCategoriesChart = new Apex(
          topCategoriesRef.current,
          topCategoriesOpts,
        );
        topCategoriesChart.render();
      }

      if (paymentMethodsRef.current) {
        paymentMethodsRef.current.innerHTML = "";
        paymentMethodsChart = new Apex(
          paymentMethodsRef.current,
          paymentMethodsOpts,
        );
        paymentMethodsChart.render();
      }

      if (topCompaniesRef.current) {
        topCompaniesRef.current.innerHTML = "";
        topCompaniesChart = new Apex(topCompaniesRef.current, topCompaniesOpts);
        topCompaniesChart.render();
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
        if (topCategoriesChart) {
          topCategoriesChart.destroy();
          if (topCategoriesRef.current) topCategoriesRef.current.innerHTML = "";
        }
        if (paymentMethodsChart) {
          paymentMethodsChart.destroy();
          if (paymentMethodsRef.current)
            paymentMethodsRef.current.innerHTML = "";
        }
        if (topCompaniesChart) {
          topCompaniesChart.destroy();
          if (topCompaniesRef.current) topCompaniesRef.current.innerHTML = "";
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
