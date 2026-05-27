function TaskCard({
    task,
    onDelete,
    onComplete,
    onEdit,
}) {

    const isCompleted = task.status === "completed";

    return (
        <div className="rounded-lg bg-white p-5 shadow">

            <div className="mb-3 flex items-center justify-between">

                <h2 className="text-2xl font-bold">
                    {task.title}
                </h2>

                <span className="rounded bg-black px-3 py-1 text-sm text-white">
                    {task.priority}
                </span>

            </div>

            <p className="mb-4 text-gray-700">
                {task.description}
            </p>

            <div className="mt-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <span>
                        Status:
                    </span>

                    <span
                        className={
                            isCompleted
                                ? "font-bold text-green-600"
                                : "font-bold text-yellow-600"
                        }
                    >
                        {task.status}
                    </span>

                </div>

                <div className="flex gap-3">

                    <button
                        onClick={() => onEdit(task)}
                        className="rounded bg-blue-500 px-4 py-2 text-white transition hover:opacity-90"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => onDelete(task.id)}
                        className="rounded bg-red-500 px-4 py-2 text-white transition hover:opacity-90"
                    >
                        Delete
                    </button>

                    <button
                        onClick={() => onComplete(task)}
                        disabled={isCompleted}
                        className={
                            isCompleted
                                ? "cursor-not-allowed rounded bg-gray-400 px-4 py-2 text-white"
                                : "rounded bg-green-500 px-4 py-2 text-white transition hover:opacity-90"
                        }
                    >
                        Complete
                    </button>

                </div>

            </div>

        </div>
    );
}

export default TaskCard;