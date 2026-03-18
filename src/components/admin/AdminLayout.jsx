export default function LayoutAdmin({
  barraLateral,
  topo,
  children,
  menuLateralAberto,
  aoFecharMenuLateral,
}) {
  return (
    <div className="admin-shell">
      <div
        className={`admin-overlay ${menuLateralAberto ? "is-open" : ""}`}
        onClick={aoFecharMenuLateral}
        aria-hidden={!menuLateralAberto}
      />

      <aside className={`admin-sidebar ${menuLateralAberto ? "is-open" : ""}`}>
        {barraLateral}
      </aside>

      <div className="admin-main">
        {topo}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

