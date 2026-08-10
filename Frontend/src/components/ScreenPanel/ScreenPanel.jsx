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
