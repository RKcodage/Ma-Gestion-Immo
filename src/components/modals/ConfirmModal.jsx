import React, { useEffect, useRef } from "react";

/**
 * ConfirmModal
 * - Accessible confirmation dialog (role="dialog", aria-modal)
 * - Keyboard support: ESC to close, focus trapped inside the dialog
 * - Click on backdrop closes (via onCancel)
 */
const ConfirmModal = ({
  title = "Are you sure?",
  message = "This action is irreversible.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  // Refs for focus management
  const dialogRef = useRef(null);
  const confirmBtnRef = useRef(null);

  // Generate IDs once for aria attributes
  const titleId = "confirm-modal-title";
  const descId = "confirm-modal-desc";

  // Focus management & escape key
  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;

    // Move focus to a meaningful element inside the dialog
    confirmBtnRef.current?.focus();

    // Handle ESC key to close the dialog
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel?.();
      }

      // Very simple focus trap: keep focus inside the dialog
      if (e.key === "Tab" && dialog) {
        const focusables = dialog.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables);
        if (list.length === 0) return;

        const first = list[0];
        const last = list[list.length - 1];

        // Shift+Tab on first -> go to last
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
        // Tab on last -> go to first
        else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    // Cleanup: restore previous focus and remove listeners
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    };
  }, [onCancel]);

  // Backdrop click handler (only close if click *outside* the panel)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onMouseDown={handleBackdropClick}
      aria-hidden={false}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full max-w-sm rounded bg-white p-6 shadow-lg"
      >
        {/* Title */}
        <h3 id={titleId} className="mb-4 text-lg font-semibold text-gray-800">
          {title}
        </h3>

        {/* Description */}
        <p id={descId} className="mb-6 text-sm text-gray-600">
          {message}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            ref={confirmBtnRef}
            onClick={onConfirm}
            className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
