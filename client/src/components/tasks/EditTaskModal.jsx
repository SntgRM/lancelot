import { useEffect, useState } from "react";
import { useAlert } from "../../context/AlertContext";
import { updateTask } from "../../services/taskService";

function EditTaskModal({ task, onClose, onTaskUpdated }) {

    const { showAlert } = useAlert();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
    });
    const [titleError, setTitleError] = useState("");

    useEffect(() => {
        if (!task) return;
        setFormData({
            title: task.title,
            description: task.description,
            priority: task.priority,
        });
        setTitleError("");
    }, [task]);

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

        try {
            const updatedTask = await updateTask(task.id, { ...task, ...formData });
            onTaskUpdated(updatedTask);
            showAlert("Tarea actualizada", "success");
            onClose();
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

    if (!task) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-200 rounded-xl border border-border bg-surface shadow-2xl shadow-black/40">

                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-muted">
                            <svg className="h-4 w-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <h2 className="text-base font-semibold text-foreground">Editar Tarea</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 p-6">

                    <div>
                        <label htmlFor="edit-title" className="mb-1.5 block text-sm font-medium text-foreground">
                            Título
                        </label>
                        <input
                            id="edit-title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
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

                    <div>
                        <label htmlFor="edit-description" className="mb-1.5 block text-sm font-medium text-foreground">
                            Descripción
                            <span className="ml-1 font-normal text-muted">(opcional)</span>
                        </label>
                        <textarea
                            id="edit-description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="input-field w-full resize-none rounded-lg border border-border bg-surface-elevated px-4 py-3 text-foreground placeholder-muted outline-none focus:border-accent"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
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
                                            : "border-border bg-surface-elevated text-muted hover:border-border-hover hover:text-foreground"
                                    }`}
                                >
                                    <span className={`h-2 w-2 rounded-full ${formData.priority === option.value ? option.dotClass : "bg-muted"}`} />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary cursor-pointer rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white"
                        >
                            Guardar Cambios
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default EditTaskModal;