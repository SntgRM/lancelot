import { useState } from "react";
import toast from "react-hot-toast";

function TaskForm({ onTaskCreated }) {

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "medium",
    });

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

            toast.success("Task created");

            setFormData({
                title: "",
                description: "",
                priority: "medium",
            });

        } catch (error) {

            console.log(error);

            toast.error("Something went wrong");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-lg border bg-white p-6 shadow"
        >

            <h2 className="mb-5 text-2xl font-bold">
                Create Task
            </h2>

            <input
                type="text"
                name="title"
                placeholder="Task title"
                value={formData.title}
                onChange={handleChange}
                className="mb-4 w-full rounded border p-3"
            />

            <textarea
                name="description"
                placeholder="Task description"
                value={formData.description}
                onChange={handleChange}
                className="mb-4 min-h-30 w-full rounded border p-3"
            />

            <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mb-4 w-full rounded border p-3"
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

            <button
                type="submit"
                className="rounded bg-black px-5 py-3 text-white transition hover:opacity-90"
            >
                Create
            </button>

        </form>
    );
}

export default TaskForm;