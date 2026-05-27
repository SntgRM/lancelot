import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";
import EditTaskModal from "../components/tasks/EditTaskModal";

function DashboardPage() {

    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filter, setFilter] = useState("all");

    const fetchTasks = async () => {

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/api/tasks/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const data = await response.json();

            setTasks(data);

        } catch (error) {

            console.log(error);

            toast.error("Failed to load tasks");
        }
    };

    useEffect(() => {

        fetchTasks();

    }, []);

    const handleLogout = () => {

        logout();

        navigate("/");
    };

    const handleTaskCreated = (task) => {

        setTasks((prev) => [task, ...prev]);
    };

    const handleTaskUpdated = (updatedTask) => {

        setTasks((prev) =>
            prev.map((task) =>
                task.id === updatedTask.id
                    ? updatedTask
                    : task
            )
        );

        setSelectedTask(null);
    };

    const handleDeleteTask = async (taskId) => {

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/tasks/${taskId}/`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            setTasks((prev) =>
                prev.filter((task) => task.id !== taskId)
            );

            toast.success("Task deleted");

        } catch (error) {

            console.log(error);

            toast.error("Failed to delete task");
        }
    };

    const handleCompleteTask = async (task) => {

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
                        status: "completed",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to complete task");
            }

            const updatedTask = await response.json();

            setTasks((prev) =>
                prev.map((item) =>
                    item.id === updatedTask.id
                        ? updatedTask
                        : item
                )
            );

            toast.success("Task completed");

        } catch (error) {

            console.log(error);

            toast.error("Failed to complete task");
        }
    };

    const filteredTasks = tasks.filter((task) => {

        if (filter === "all") {
            return true;
        }

        return task.status === filter;
    });

    return (
        <div className="min-h-screen bg-gray-100 p-10">

            <div className="mb-10 flex items-center justify-between">

                <h1 className="text-4xl font-bold">
                    My Tasks
                </h1>

                <button
                    onClick={handleLogout}
                    className="rounded bg-red-500 px-5 py-2 text-white transition hover:opacity-90"
                >
                    Logout
                </button>

            </div>

            <TaskForm
                onTaskCreated={handleTaskCreated}
            />

            {selectedTask && (

                <EditTaskModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onTaskUpdated={handleTaskUpdated}
                />

            )}

            <div className="mb-8 flex gap-3">

                <button
                    onClick={() => setFilter("all")}
                    className="rounded bg-black px-4 py-2 text-white transition hover:opacity-90"
                >
                    All
                </button>

                <button
                    onClick={() => setFilter("pending")}
                    className="rounded bg-yellow-500 px-4 py-2 text-white transition hover:opacity-90"
                >
                    Pending
                </button>

                <button
                    onClick={() => setFilter("completed")}
                    className="rounded bg-green-600 px-4 py-2 text-white transition hover:opacity-90"
                >
                    Completed
                </button>

            </div>

            <div className="grid gap-5">

                {filteredTasks.length === 0 ? (

                    <div className="rounded-lg bg-white p-10 text-center shadow">

                        <h2 className="mb-2 text-2xl font-bold">
                            No tasks yet
                        </h2>

                        <p className="text-gray-500">
                            Create your first task
                        </p>

                    </div>

                ) : (

                    filteredTasks.map((task) => (

                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={handleDeleteTask}
                            onComplete={handleCompleteTask}
                            onEdit={setSelectedTask}
                        />

                    ))

                )}

            </div>

        </div>
    );
}

export default DashboardPage;