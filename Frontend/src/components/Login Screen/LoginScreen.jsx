import { useState } from "react";
import { CiSliderVertical, CiDollar } from "react-icons/ci";
import { HiOutlineLogin } from "react-icons/hi";
import "./LoginScreen.scss";

function LoginScreen({ values, onChange, onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="login-page">
      <div className="login-shell">
        <main className="login-content">
          <div className="login-left">
            <section className="login-hero">
              <p className="hero-kicker">Built for fast-moving shops</p>
              <h1 className="hero-title">
                Run your store with calm confidence.
              </h1>
              <div className="hero-divider" />
              <p className="hero-copy">
                Track inventory, close sales, and stay on top of each day from a
                simpler, more focused workspace.
              </p>
              <div className="hero-badges">
                <span>
                  <CiSliderVertical size={14} />
                  Inventory sync
                </span>
                <span>
                  <CiDollar size={14} />
                  Fast checkout
                </span>
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 19V9m7 10V5m7 14v-7" />
                  </svg>
                  Daily reports
                </span>
                <span>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4Z" />
                  </svg>
                  Smart insights
                </span>
              </div>
            </section>

            <section className="login-form-panel">
              <div className="login-intro">
                <p className="intro-text">Welcome</p>
                <h2 className="login-title">Sign in to your dashboard</h2>
              </div>

              <form onSubmit={onSubmit} className="login-form">
                <label className="form-field">
                  <span className="field-label">Your Email</span>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={onChange}
                    placeholder="name@example.com"
                    autoComplete="email"
                    required
                    className="form-input"
                  />
                </label>

                <label className="form-field">
                  <span className="field-label">Password</span>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={onChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </label>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="login-btn"
                    disabled={loading}
                  >
                    <HiOutlineLogin size={18} />
                    {loading ? "Logging in..." : "LOG IN"}
                  </button>
                </div>
              </form>
            </section>
          </div>

          <aside className="login-visual">
            <div className="curved-frame">
              <img
                src="/src/assets/POS.jpg"
                alt="POS illustration"
                className="visual-image"
              />
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default LoginScreen;
