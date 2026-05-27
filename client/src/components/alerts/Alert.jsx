import { useEffect, useState } from "react";
import { useAlert } from "../../context/AlertContext";

function Alert() {
    const { alert, hideAlert } = useAlert();
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (alert) {
            setIsExiting(false);
            setIsVisible(true);
            setProgress(100);

            const startTime = Date.now();
            const duration = 3000;

            const animateProgress = () => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
                setProgress(remaining);

                if (remaining > 0) {
                    requestAnimationFrame(animateProgress);
                }
            };

            requestAnimationFrame(animateProgress);

            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => {
                    setIsVisible(false);
                    hideAlert();
                }, 300);
            }, duration);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [alert, hideAlert]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            hideAlert();
        }, 300);
    };

    if (!alert || !isVisible) return null;

    const isSuccess = alert.type === "success";

    return (
        <div className="fixed left-0 right-0 top-0 z-9999 flex justify-center pointer-events-none px-4 pt-5">
            <div className={`pointer-events-auto ${isExiting ? "alert-exit" : "alert-enter"}`}>

                <div className={`relative overflow-hidden rounded-2xl backdrop-blur-xl shadow-2xl ${
                    isSuccess
                        ? "bg-linear-to-r from-emerald-500/10 to-emerald-600/5 shadow-emerald-500/10 alert-success-border"
                        : "bg-linear-to-r from-red-500/10 to-red-600/5 shadow-red-500/10 alert-error-border"
                }`}>

                    <div className="flex items-center gap-3 px-5 py-4">

                        <div className={`alert-icon-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            isSuccess
                                ? "bg-emerald-500/20 ring-1 ring-emerald-500/30"
                                : "bg-red-500/20 ring-1 ring-red-500/30"
                        }`}>
                            {isSuccess ? (
                                <svg
                                    className="h-5 w-5 text-emerald-400 alert-check-draw"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-5 w-5 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2.5}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            )}
                        </div>

                        <div className="flex flex-col gap-0.5 pr-2">
                            <span className={`text-xs font-semibold uppercase tracking-wider ${
                                isSuccess ? "text-emerald-400/80" : "text-red-400/80"
                            }`}>
                                {isSuccess ? "Completado" : "Error"}
                            </span>
                            <p className="text-sm font-medium text-white/90">
                                {alert.message}
                            </p>
                        </div>

                        <button
                            onClick={handleClose}
                            className={`ml-2 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 ${
                                isSuccess
                                    ? "text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10"
                                    : "text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                            }`}
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="h-1 w-full bg-black/20">
                        <div
                            className={`h-full transition-none ${
                                isSuccess
                                    ? "bg-linear-to-r from-emerald-400 to-emerald-500 alert-progress-success"
                                    : "bg-linear-to-r from-red-400 to-red-500 alert-progress-error"
                            }`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Alert;
