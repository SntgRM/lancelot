function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", variant = "danger" }) {
    
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: (
                <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            confirmBtn: "bg-red-500 hover:bg-red-600 text-white",
            iconBg: "bg-red-500/10"
        },
        warning: {
            icon: (
                <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            confirmBtn: "bg-yellow-500 hover:bg-yellow-600 text-black",
            iconBg: "bg-yellow-500/10"
        }
    };

    const styles = variantStyles[variant] || variantStyles.danger;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="confirm-backdrop-enter absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="confirm-modal-enter relative w-full max-w-md mx-4 rounded-2xl border border-border bg-surface-elevated p-6 shadow-2xl">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${styles.iconBg}`}>
                    {styles.icon}
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-muted">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 cursor-pointer rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-surface-elevated hover:border-muted"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${styles.confirmBtn}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

        </div>
    );
}

export default ConfirmModal;
