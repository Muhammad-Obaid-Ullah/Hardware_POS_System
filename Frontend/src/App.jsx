import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LoginScreen from "./components/Login Screen/LoginScreen";
import NotificationStack from "./components/Notifications/NotificationBanner";
import Sidebar from "./components/Sidebar/Sidebar";
import ScreenPanel from "./components/ScreenPanel/ScreenPanel";
import { getCurrentUser, loginUser, logoutUser } from "./services/auth";
import "./App.scss";

function getTodayValue() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState(null);
  const defaultCredentials = useMemo(() => ({ email: "", password: "" }), []);
  const [formValues, setFormValues] = useState(defaultCredentials);
  const [loading, setLoading] = useState(false);
  const [activeScreen, setActiveScreen] = useState("Dashboard");
  const [dashboardFromDate, setDashboardFromDate] = useState(getTodayValue);
  const [dashboardToDate, setDashboardToDate] = useState(getTodayValue);
  const [salesFromDate, setSalesFromDate] = useState(getTodayValue);
  const [salesToDate, setSalesToDate] = useState(getTodayValue);
  const [notifications, setNotifications] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const pushNotification = useCallback((message, options = {}) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const notification = {
      id,
      message,
      duration: options.duration ?? 4000,
      icon: options.icon,
      textColor: options.textColor,
      iconColor: options.iconColor,
      progressColor: options.progressColor,
    };

    setNotifications((current) => [...current, notification]);
  }, []);

  const handleCloseNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!formValues.email || !formValues.email.includes("@")) {
      pushNotification("Enter a valid email address.", {
        textColor: "#64748b",
        iconColor: "#dc2626",
        progressColor: "#dc2626",
      });
      setLoading(false);
      return;
    }

    if (!formValues.password) {
      pushNotification("Password is required.", {
        textColor: "#64748b",
        iconColor: "#dc2626",
        progressColor: "#dc2626",
      });
      setLoading(false);
      return;
    }

    try {
      const session = await loginUser({
        email: formValues.email,
        password: formValues.password,
      });
      setActiveScreen("Dashboard");
      setIsAuthenticated(true);
      setSessionExpiresAt(session.expiresAt);
      const today = getTodayValue();
      setDashboardFromDate(today);
      setDashboardToDate(today);
      setSalesFromDate(today);
      setSalesToDate(today);
      pushNotification("Signed in successfully", {
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ),
      });
    } catch (loginError) {
      pushNotification(loginError.message || "Invalid email or password.", {
        textColor: "#64748b",
        iconColor: "#dc2626",
        progressColor: "#dc2626",
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 8v5" />
            <path d="M12 16h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const screens = ["Dashboard", "POS", "Inventory", "Sales", "Reports"];

  const setScreen = (screen) => {
    setActiveScreen(screen);
  };

  useEffect(() => {
    getCurrentUser().then((session) => {
      setIsAuthenticated(Boolean(session));
      setSessionExpiresAt(session?.expiresAt ?? null);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const main = document.querySelector(".app-main");
    if (main) {
      main.scrollTop = 0;
    }
  }, [activeScreen]);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    if (!sessionExpiresAt) {
      return undefined;
    }

    const timeout = window.setTimeout(
      () => {
        void logoutUser();
        setIsAuthenticated(false);
        const today = getTodayValue();
        setDashboardFromDate(today);
        setDashboardToDate(today);
        setSalesFromDate(today);
        setSalesToDate(today);
      },
      Math.max(0, sessionExpiresAt - Date.now()),
    );

    return () => window.clearTimeout(timeout);
  }, [isAuthenticated, sessionExpiresAt]);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="page-transition-wrapper"
          >
            <LoginScreen
              values={formValues}
              onChange={handleChange}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            className="app-shell"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <Sidebar
              screens={screens}
              activeScreen={activeScreen}
              onSelect={setScreen}
              onLogout={() => {
                void logoutUser();
                setSessionExpiresAt(null);
                setIsAuthenticated(false);
                const today = getTodayValue();
                setDashboardFromDate(today);
                setDashboardToDate(today);
                setSalesFromDate(today);
                setSalesToDate(today);
                pushNotification("Signed out successfully", {
                  icon: (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ),
                });
              }}
            />

            <main
              className={`app-main app-main--${activeScreen.toLowerCase()}`}
            >
              <ScreenPanel
                key={activeScreen}
                title={activeScreen}
                onNavigate={setScreen}
                onNotify={pushNotification}
                dashboardFromDate={dashboardFromDate}
                dashboardToDate={dashboardToDate}
                onDashboardFromDateChange={setDashboardFromDate}
                onDashboardToDateChange={setDashboardToDate}
                salesFromDate={salesFromDate}
                salesToDate={salesToDate}
                onSalesFromDateChange={setSalesFromDate}
                onSalesToDateChange={setSalesToDate}
                invoices={invoices}
                onInvoiceCreated={(invoice) =>
                  setInvoices((current) => [invoice, ...current])
                }
                onInvoiceDeleted={(invoiceNumber) =>
                  setInvoices((current) =>
                    current.map((invoice) =>
                      invoice.number === invoiceNumber
                        ? { ...invoice, deleted: true }
                        : invoice,
                    ),
                  )
                }
                onInvoiceRestored={(invoiceNumber) =>
                  setInvoices((current) =>
                    current.map((invoice) =>
                      invoice.number === invoiceNumber
                        ? { ...invoice, deleted: false }
                        : invoice,
                    ),
                  )
                }
                onInvoiceRefunded={(invoiceNumber) =>
                  setInvoices((current) =>
                    current.map((invoice) =>
                      invoice.number === invoiceNumber
                        ? {
                            ...invoice,
                            refunded: true,
                            partiallyRefunded: false,
                          }
                        : invoice,
                    ),
                  )
                }
                onInvoicePartiallyRefunded={(
                  invoiceNumber,
                  items,
                  total,
                  isFullyRefunded,
                ) =>
                  setInvoices((current) =>
                    current.map((invoice) =>
                      invoice.number === invoiceNumber
                        ? {
                            ...invoice,
                            items,
                            total,
                            refunded: isFullyRefunded,
                            partiallyRefunded: !isFullyRefunded,
                          }
                        : invoice,
                    ),
                  )
                }
              />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      <NotificationStack
        notifications={notifications}
        onClose={handleCloseNotification}
      />
    </>
  );
}

export default App;
