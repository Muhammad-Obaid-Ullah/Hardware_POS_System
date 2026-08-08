import { motion } from "motion/react";
import "./ScreenPanel.scss";

function ScreenPanel({ title }) {
  return (
    <motion.section
      className="screen-panel"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="screen-panel__header">
        <p className="screen-panel__eyebrow">Current screen</p>
        <h1 className="screen-panel__title">{title}</h1>
      </div>
      <div className="screen-panel__content">
        <p className="screen-panel__message">This is the {title} screen.</p>
      </div>
    </motion.section>
  );
}

export default ScreenPanel;
