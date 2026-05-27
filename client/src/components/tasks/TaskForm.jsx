import { useState } from "react";
import { useAlert } from "../../context/AlertContext";

function TaskForm({ onTaskCreated }) {

    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const [titleError, setTitleError] = useState("");

    const handleChange = (e) => {
        if (e.target.name === "title") {
            setTitleError("");
        }
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.title.trim()) {
            setTitleError("El titulo es obligatorio");
            return;
        }

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/api/tasks/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            const data = await response.json();

            onTaskCreated(data);

            showAlert("Tarea creada", "success");

            setFormData({
                title: "",
                description: "",
                priority: "medium",
            });

            setIsExpanded(false);
            setTitleError("");

        } catch (error) {

            console.log(error);

            showAlert("Algo salio mal", "error");
        }
    };

    const priorityOptions = [
        {
            value: "high",
            label: "Alta",
            activeClasses: "border-red-500/50 bg-red-500/10 text-red-400",
            dotClass: "bg-red-400",
        },
        {
            value: "medium",
            label: "Media",
            activeClasses: "border-orange-500/50 bg-orange-500/10 text-orange-400",
            dotClass: "bg-orange-400",
        },
        {
            value: "low",
            label: "Baja",
            activeClasses: "border-green-500/50 bg-green-500/10 text-green-400",
            dotClass: "bg-green-400",
        },
    ];

    return (
        <div className="mb-8 rounded-xl border border-border bg-surface p-6">

            <div className="mb-5 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-muted">
                    <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                    Nueva Tarea
                </h2>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-foreground">
                            Título
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="¿Qué necesitas hacer?"
                            value={formData.title}
                            onChange={handleChange}
                            onFocus={() => setIsExpanded(true)}
                            className={`input-field w-full rounded-lg border px-4 py-3 text-foreground placeholder-muted outline-none ${
                                titleError 
                                    ? 'border-red-500 bg-red-500/5 focus:border-red-500' 
                                    : 'border-border bg-surface-elevated focus:border-accent'
                            }`}
                        />
                        {titleError && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-red-400 animate-in fade-in slide-in-from-top-1 duration-200">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {titleError}
                            </p>
                        )}
                    </div>

                    {isExpanded && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div>
                                <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-foreground">
                                    Descripción
                                    <span className="ml-1 text-muted font-normal">(opcional)</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    placeholder="Agrega más detalles sobre la tarea..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="input-field w-full resize-none rounded-lg border border-border bg-surface-elevated px-4 py-3 text-foreground placeholder-muted outline-none focus:border-accent"
                                />
                            </div>

                            <div>
                                <label htmlFor="priority" className="mb-1.5 block text-sm font-medium text-foreground">
                                    Prioridad
                                </label>
                                <div className="flex gap-2">
                                    {priorityOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, priority: option.value }))}
                                            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                                                formData.priority === option.value
                                                    ? option.activeClasses
                                                    : 'border-border bg-surface-elevated text-muted hover:border-border-hover hover:text-foreground'
                                            }`}
                                        >
                                            <span className={`h-2 w-2 rounded-full ${formData.priority === option.value ? option.dotClass : 'bg-muted'}`} />
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`flex items-center gap-3 ${isExpanded ? 'mt-6 pt-4 border-t border-border' : 'mt-4'}`}>
                    <button
                        type="submit"
                        className="btn-primary cursor-pointer rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white"
                    >
                        Crear Tarea
                    </button>
                    {isExpanded && (
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
                        >
                            Cancelar
                        </button>
                    )}
                </div>

            </form>

        </div>
    );
}

export default TaskForm;
