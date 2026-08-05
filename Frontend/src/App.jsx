import { useMemo, useState } from "react";
import LoginScreen from "./components/Login Screen/LoginScreen";
import NotificationStack from "./components/Notifications/NotificationBanner";
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

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen
          values={formValues}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
        <NotificationStack
          notifications={notifications}
          onClose={handleCloseNotification}
        />
      </>
    );
  }

  return (
    <main className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Hardware store control center</h1>
          <p className="hero-copy">
            Ready for the next step: inventory, sales, and reporting views will
            be added here.
          </p>
        </div>
        <button
          type="button"
          className="secondary-btn"
          onClick={() => {
            logoutUser();
            setIsAuthenticated(false);
          }}
        >
          Sign out
        </button>
      </section>

      <section className="dashboard-grid">
        <article className="info-card">
          <h2>Today&apos;s sales</h2>
          <p className="stat">$4,820</p>
          <span>Filtered by selected date range</span>
        </article>
        <article className="info-card">
          <h2>Products in stock</h2>
          <p className="stat">128</p>
          <span>Always visible on the dashboard</span>
        </article>
      </section>
      <NotificationStack
        notifications={notifications}
        onClose={handleCloseNotification}
      />
    </main>
  );
}

export default App;
