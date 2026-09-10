import { motion } from "motion/react";
import Dashboard from "../Dashboard/Dashboard";
import Inventory from "../Inventory/Inventory";
import POS from "../POS/POS";
import Sales from "../Sales/Sales";
import Reports from "../Reports/Reports";
import "./ScreenPanel.scss";

function ScreenPanel({
  title,
  onNavigate,
  onNotify,
  invoices,
  onInvoiceCreated,
  onInvoiceDeleted,
  onInvoiceRestored,
  onInvoiceRefunded,
  onInvoicePartiallyRefunded,
}) {
  let screenContent;

  if (title === "Dashboard") {
    screenContent = <Dashboard onNavigate={onNavigate} />;
  } else if (title === "POS") {
    screenContent = (
      <POS onNotify={onNotify} onInvoiceCreated={onInvoiceCreated} />
    );
  } else if (title === "Inventory") {
    screenContent = <Inventory onNotify={onNotify} />;
  } else if (title === "Sales") {
    screenContent = (
      <Sales
        invoices={invoices}
        onInvoiceDeleted={onInvoiceDeleted}
        onInvoiceRestored={onInvoiceRestored}
        onInvoiceRefunded={onInvoiceRefunded}
        onInvoicePartiallyRefunded={onInvoicePartiallyRefunded}
      />
    );
  } else if (title === "Reports") {
    screenContent = <Reports invoices={invoices} onNotify={onNotify} />;
  } else {
    screenContent = (
      <div className="screen-panel__content">
        <p className="screen-panel__message">This is the {title} screen.</p>
      </div>
    );
  }

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
      {screenContent}
    </motion.section>
  );
}

export default ScreenPanel;
