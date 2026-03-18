import { Menu } from "lucide-react";

export default function TopoAdmin({ aoAlternarSidebar }) {
  return (
    <header className="admin-topbar">
      <button
        type="button"
        className="admin-mobile-menu-btn"
        onClick={aoAlternarSidebar}
        aria-label="Abrir menu lateral"
      >
        <Menu size={20} color="#6b4423" strokeWidth={2.25} />
      </button>
    </header>
  );
}

