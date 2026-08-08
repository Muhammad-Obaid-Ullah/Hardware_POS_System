import iconSrc from "../../assets/Icon.jpg";
import "./Sidebar.scss";

const navIcons = {
  Dashboard: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10-7h6V4h-6v9Zm0 7h6v-9h-6v9Z" />
    </svg>
  ),
  POS: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v4H4V6Zm0 6h16v8H4v-8Zm3 2v4" />
    </svg>
  ),
  Inventory: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v4H4V6Zm0 6h16v8H4v-8Zm2 2v4h12v-4H6Z" />
    </svg>
  ),
  Sales: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19h16M6 15l3-3 2 2 3-4 4 5" />
    </svg>
  ),
  Reports: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5h14v14H5V5Zm4 14V9m4 10V12M9 7h6" />
    </svg>
  ),
};

const logoutIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16 17l5-5-5-5M21 12H9M9 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
  </svg>
);

function Sidebar({ screens, activeScreen, onSelect, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <img src={iconSrc} alt="POS logo" className="sidebar__logo" />
      </div>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        {screens.map((screen) => (
          <button
            key={screen}
            type="button"
            className={`sidebar__nav-item ${
              activeScreen === screen ? "sidebar__nav-item--active" : ""
            }`}
            onClick={() => onSelect(screen)}
            aria-current={activeScreen === screen ? "page" : undefined}
          >
            <span className="sidebar__nav-icon">{navIcons[screen]}</span>
            <span className="sidebar__nav-label">{screen}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__logout" onClick={onLogout}>
          <span className="sidebar__logout-icon">{logoutIcon}</span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
