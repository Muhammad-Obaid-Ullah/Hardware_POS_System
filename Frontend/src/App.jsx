import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LoginScreen from "./components/Login Screen/LoginScreen";
import NotificationStack from "./components/Notifications/NotificationBanner";
import Sidebar from "./components/Sidebar/Sidebar";
import ScreenPanel from "./components/ScreenPanel/ScreenPanel";
import { getStoredToken, loginUser, logoutUser } from "./services/auth";
import "./App.scss";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(getStoredToken()),
  );
  const demoCredentials = useMemo(
    () => ({ email: "admin@hardware.com", password: "demo1234" }),
    [],
  );
  const [formValues, setFormValues] = useState(demoCredentials);
  const [loading, setLoading] = useState(false);
  const [activeScreen, setActiveScreen] = useState("Dashboard");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);

  const pushNotification = (message, options = {}) => {
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
  };

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
    setError("");

    try {
      await loginUser({
        email: formValues.email,
        password: formValues.password,
      });
      setActiveScreen("Dashboard");
      setIsAuthenticated(true);
      pushNotification("Signed in successfully", {
        icon: (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ),
      });
    } catch (loginError) {
      setError(
        loginError.message ||
          "Invalid email or password. Use the demo credentials to continue.",
      );
      pushNotification(
        loginError.message ||
          "Invalid email or password. Use the demo credentials to continue.",
        {
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
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const screens = ["Dashboard", "POS", "Inventory", "Sales", "Reports"];

  const setScreen = (screen) => {
    setActiveScreen(screen);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const main = document.querySelector(".app-main");
    if (main) {
      main.scrollTop = 0;
    }
  }, [activeScreen]);

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
              error={error}
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
                logoutUser();
                setIsAuthenticated(false);
                pushNotification("Signed out successfully", {
                  icon: (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ),
                });
              }}
            />
            <main className="app-main">
              <ScreenPanel
                key={activeScreen}
                title={activeScreen}
                onNavigate={setScreen}
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
