function TaskCard({
    task,
    onDelete,
    onToggleComplete,
    onEdit,
}) {

    const isCompleted = task.status === "completed";

    const priorityStyles = {
        high: "bg-red-500/20 text-red-400 border-red-500/30",
        medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        low: "bg-green-500/20 text-green-400 border-green-500/30"
    };

    const priorityLabels = {
        high: "Alta",
        medium: "Media",
        low: "Baja"
    };

    return (
        <div className={`group rounded-xl border bg-surface p-5 transition-all hover:border-border-hover ${isCompleted ? 'border-border/50 opacity-75' : 'border-border'}`}>

            <div className="mb-3 flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">
                    <button
                        onClick={() => onToggleComplete(task)}
                        className={`mt-1 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border transition-all ${
                            isCompleted 
                                ? 'border-accent bg-accent text-white' 
                                : 'border-border hover:border-accent'
                        }`}
                        title={isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
                    >
                        {isCompleted && (
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </button>

                    <div>
                        <h2 className={`text-lg font-semibold ${isCompleted ? 'text-muted line-through' : 'text-foreground'}`}>
                            {task.title}
                        </h2>
                        {task.description && (
                            <p className={`mt-1 text-sm ${isCompleted ? 'text-muted/70' : 'text-muted'}`}>
                                {task.description}
                            </p>
                        )}
                    </div>
                </div>

                <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${priorityStyles[task.priority]}`}>
                    {priorityLabels[task.priority]}
                </span>

            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">

                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isCompleted ? 'text-green-400' : 'text-yellow-400'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? 'bg-green-400' : 'bg-yellow-400'}`} />
                        {isCompleted ? "Completada" : "Pendiente"}
                    </span>
                </div>

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => onEdit(task)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-orange-500/50 hover:text-orange-400 hover:shadow-md hover:shadow-orange-500/10 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                    </button>

                    <button
                        onClick={() => onDelete(task.id)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-red-500/50 hover:text-red-400 hover:shadow-md hover:shadow-red-500/10 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                    </button>

                </div>

            </div>

        </div>
    );
}

export default TaskCard;