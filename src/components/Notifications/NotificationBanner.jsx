import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import "./NotificationBanner.scss";

function NotificationBanner({
  id,
  message,
  icon,
  duration = 4000,
  textColor,
  iconColor,
  progressColor,
  onClose,
}) {
  const [isClosing, setIsClosing] = useState(false);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (isClosing) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setIsClosing(true);
    }, duration);

    return () => window.clearTimeout(timerId);
  }, [duration, id, isClosing]);

  useEffect(() => {
    if (!isClosing) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      closeRef.current?.(id);
    }, 180);

    return () => window.clearTimeout(timerId);
  }, [id, isClosing]);

  const fallbackIcon = useMemo(
    () => (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    [],
  );

  const handleClose = () => {
    if (isClosing) {
      return;
    }

    setIsClosing(true);
  };

  const resolvedTextColor = textColor;
  const resolvedIconColor = iconColor;
  const resolvedProgressColor = progressColor;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.96 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="notification-banner"
      style={{ color: resolvedTextColor }}
    >
      <div
        className="notification-banner__icon"
        style={{
          color: resolvedIconColor,
          backgroundColor: `${resolvedIconColor}1A`,
        }}
      >
        {icon ?? fallbackIcon}
      </div>
      <div className="notification-banner__body">
        <p className="notification-banner__message">{message}</p>
      </div>
      <button
        type="button"
        className="notification-banner__close"
        onClick={handleClose}
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
      <motion.div
        className="notification-banner__progress"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        style={{
          background: `linear-gradient(90deg, ${resolvedProgressColor}, ${resolvedProgressColor}99)`,
        }}
      />
    </motion.div>
  );
}

function NotificationStack({ notifications, onClose }) {
  return (
    <div className="notification-stack" aria-live="polite" aria-atomic="true">
      <AnimatePresence initial={false}>
        {notifications.map((item) => (
          <NotificationBanner
            key={item.id}
            id={item.id}
            message={item.message}
            icon={item.icon}
            duration={item.duration}
            textColor={item.textColor}
            iconColor={item.iconColor}
            progressColor={item.progressColor}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default NotificationStack;
export { NotificationBanner, NotificationStack };
