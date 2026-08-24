import { motion } from "motion/react";
import Dashboard from "../Dashboard/Dashboard";
import POS from "../POS/POS";
import "./ScreenPanel.scss";

function ScreenPanel({ title, onNavigate }) {
  let screenContent;

  if (title === "Dashboard") {
    screenContent = <Dashboard onNavigate={onNavigate} />;
  } else if (title === "POS") {
    screenContent = <POS />;
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
