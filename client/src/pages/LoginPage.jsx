import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../services/api";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setError("");
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.username.trim()) {
            setError("Username is required");
            toast.error("Username is required");
            return;
        }

        if (!formData.password.trim()) {
            setError("Password is required");
            toast.error("Password is required");
            return;
        }

        try {
            const response = await axiosInstance.post(
                "/auth/login/",
                formData
            );

            login(
                response.data.user,
                response.data.access,
                response.data.refresh
            );

            toast.success("Login successful");
            navigate("/dashboard");

        } catch (error) {
            console.log(error);
            setError("Invalid credentials. Please try again.");
            toast.error("Invalid credentials");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent opacity-[0.03] blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent opacity-[0.03] blur-3xl" />
            </div>

            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-2xl shadow-black/20"
            >

                <div className="mb-8 text-center">
                    <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent-muted">
                        <svg 
                            className="h-6 w-6 text-accent" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Lancelot ToDo
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        Inicia sesión para gestionar tus tareas
                    </p>
                </div>

                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-muted px-4 py-3 text-sm text-accent animate-in fade-in slide-in-from-top-1 duration-200">
                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-foreground">
                            Nombre de Usuario
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                            className="input-field w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-foreground placeholder-muted outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                            Constraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-foreground placeholder-muted outline-none focus:border-accent"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="cursor-pointer btn-primary mt-6 w-full rounded-lg bg-accent py-3 font-medium text-white"
                >
                    Iniciar Sesión
                </button>

                <p className="mt-6 text-center text-xs text-muted">
                    Organiza tu día y tus tareas
                </p>

            </form>

        </div>
    );
}

export default LoginPage;