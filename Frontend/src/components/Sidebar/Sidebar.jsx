import iconSrc from "../../assets/Icon.jpg";
import {
  CiAlignBottom,
  CiBarcode,
  CiBoxes,
  CiReceipt,
  CiViewList,
} from "react-icons/ci";
import { HiOutlineLogout } from "react-icons/hi";
import "./Sidebar.scss";

const navIcons = {
  Dashboard: <CiAlignBottom size={20} />,
  POS: <CiBarcode size={20} />,
  Inventory: <CiBoxes size={20} />,
  Sales: <CiReceipt size={20} />,
  Reports: <CiViewList size={20} />,
};

const logoutIcon = <HiOutlineLogout size={18} />;

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
          <span>LOG OUT</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
