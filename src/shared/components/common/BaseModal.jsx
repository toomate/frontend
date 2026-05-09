import { useEffect } from "react";
import "./BaseModal.css";

export function BaseModal({
  aberto,
  onClose,
  title,
  children,
  footer,
  width = 360,
  className = "",
  closeOnOverlay = true,
}) {
  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        onClose?.();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [aberto, onClose]);

  if (!aberto) {
    return null;
  }

  function onOverlayClick(event) {
    if (!closeOnOverlay) {
      return;
    }

    if (event.target === event.currentTarget) {
      onClose?.();
    }
  }

  return (
    <div className="base-modal-overlay" role="presentation" onClick={onOverlayClick}>
      <div
        className={`base-modal ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        style={{ width }}
      >
        <header className="base-modal-header">
          <h3>{title}</h3>
          <button type="button" className="base-modal-close" onClick={onClose} aria-label="Fechar">
            X
          </button>
        </header>

        <div className="base-modal-body">{children}</div>

        {footer && <footer className="base-modal-footer">{footer}</footer>}
      </div>
    </div>
  );
}
