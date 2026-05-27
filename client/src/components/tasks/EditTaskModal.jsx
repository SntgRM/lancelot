import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function EditTaskModal({
    task,
    onClose,
    onTaskUpdated,
}) {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
    });

    useEffect(() => {

        if (!task) return;

        setFormData({
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
        });

    }, [task]);

    const handleChange = (e) => {

        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Title is required");
            return;
        }

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/tasks/${task.id}/`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        ...task,
                        ...formData,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            const updatedTask = await response.json();

            onTaskUpdated(updatedTask);

            toast.success("Task updated");

            onClose();

        } catch (error) {

            console.log(error);

            toast.error("Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">

                <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-3xl font-bold">
                        Edit Task
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-xl transition hover:opacity-70"
                    >
                        ✕
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        name="title"
                        placeholder="Task title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full rounded border p-3"
                    />

                    <textarea
                        name="description"
                        placeholder="Task description"
                        value={formData.description}
                        onChange={handleChange}
                        className="min-h-30 w-full rounded border p-3"
                    />

                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full rounded border p-3"
                    >
                        <option value="high">
                            High
                        </option>

                        <option value="medium">
                            Medium
                        </option>

                        <option value="low">
                            Low
                        </option>
                    </select>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded border p-3"
                    >
                        <option value="pending">
                            Pending
                        </option>

                        <option value="completed">
                            Completed
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-black py-3 text-white transition hover:opacity-90"
                    >
                        Save Changes
                    </button>

                </form>

            </div>

        </div>
    );
}

export default EditTaskModal;