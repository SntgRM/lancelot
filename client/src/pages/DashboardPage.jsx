import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import { AuthContext } from "../context/AuthContext";
import TaskForm from "../components/tasks/TaskForm";
import TaskCard from "../components/tasks/TaskCard";
import EditTaskModal from "../components/tasks/EditTaskModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import { getTasks, deleteTask, updateTask } from "../services/taskService";

function DashboardPage() {

    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const { showAlert } = useAlert();
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filter, setFilter] = useState("all");
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [priorityFilterOpen, setPriorityFilterOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const fetchTasks = async () => {
        try {
            const data = await getTasks();
            setTasks(data);
        } catch (error) {
            console.log(error);
            showAlert("Error al cargar las tareas", "error");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate("/");
    };

    const handleTaskCreated = (task) => {
        setTasks((prev) => [task, ...prev]);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );
        setSelectedTask(null);
    };

    const handleDeleteTask = (taskId) => {
        setTaskToDelete(taskId);
        setShowDeleteModal(true);
    };

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;

        try {
            await deleteTask(taskToDelete);
            setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
            showAlert("Tarea eliminada", "success");
        } catch (error) {
            console.log(error);
            showAlert("Error al eliminar la tarea", "error");
        }

        setTaskToDelete(null);
    };

    const handleToggleComplete = async (task) => {
        const newStatus = task.status === "completed" ? "pending" : "completed";

        try {
            const updatedTask = await updateTask(task.id, {
                ...task,
                status: newStatus,
            });
            setTasks((prev) =>
                prev.map((item) => (item.id === updatedTask.id ? updatedTask : item))
            );
        } catch (error) {
            console.log(error);
            showAlert("Error al actualizar la tarea", "error");
        }
    };

    const filteredTasks = tasks
        .filter((task) => {
            if (filter !== "all" && task.status !== filter) return false;
            if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
            if (searchText.trim() !== "") {
                const search = searchText.toLowerCase();
                return task.title.toLowerCase().includes(search);
            }
            return true;
        })
        .sort((a, b) => b.id - a.id);

    const filterLabels = {
        all: "Todas",
        pending: "Pendientes",
        completed: "Completadas"
    };

    const priorityLabels = {
        all: "Todas",
        high: "Alta",
        medium: "Media",
        low: "Baja"
    };

    return (
        <div className="min-h-screen bg-background">

            <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
                    
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-muted">
                            <svg 
                                className="h-5 w-5 text-accent" 
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
                        <h1 className="text-xl font-bold text-foreground">
                            Lancelot ToDo
                        </h1>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="btn-primary flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground hover:border-accent/50 hover:text-accent"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Salir
                    </button>

                </div>
            </header>

            <main className="mx-auto max-w-4xl px-6 py-8">

                <TaskForm onTaskCreated={handleTaskCreated} />

                {selectedTask && (
                    <EditTaskModal
                        task={selectedTask}
                        onClose={() => setSelectedTask(null)}
                        onTaskUpdated={handleTaskUpdated}
                    />
                )}

                <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">
                            Mis Tareas
                            <span className="ml-2 text-sm font-normal text-muted">
                                ({filteredTasks.length})
                            </span>
                        </h2>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <button
                                    onClick={() => { setPriorityFilterOpen(!priorityFilterOpen); setFilterOpen(false); }}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-accent/50 hover:text-accent hover:shadow-md hover:shadow-accent/10 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Prioridad: {priorityLabels[priorityFilter]}
                                    <svg className={`h-4 w-4 text-muted transition-transform ${priorityFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {priorityFilterOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-border bg-surface-elevated p-2 shadow-xl shadow-black/20 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <button
                                            onClick={() => { setPriorityFilter("all"); setPriorityFilterOpen(false); }}
                                            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${priorityFilter === "all" ? "bg-accent-muted text-accent" : "text-foreground hover:bg-surface"}`}
                                        >
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current">
                                                {priorityFilter === "all" && <span className="h-2 w-2 rounded-full bg-current" />}
                                            </span>
                                            Todas
                                        </button>
                                        <button
                                            onClick={() => { setPriorityFilter("high"); setPriorityFilterOpen(false); }}
                                            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${priorityFilter === "high" ? "bg-red-500/10 text-red-400" : "text-foreground hover:bg-surface"}`}
                                        >
                                            <span className={`h-2 w-2 rounded-full bg-red-400`} />
                                            Alta
                                        </button>
                                        <button
                                            onClick={() => { setPriorityFilter("medium"); setPriorityFilterOpen(false); }}
                                            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${priorityFilter === "medium" ? "bg-yellow-500/10 text-yellow-400" : "text-foreground hover:bg-surface"}`}
                                        >
                                            <span className={`h-2 w-2 rounded-full bg-yellow-400`} />
                                            Media
                                        </button>
                                        <button
                                            onClick={() => { setPriorityFilter("low"); setPriorityFilterOpen(false); }}
                                            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${priorityFilter === "low" ? "bg-green-500/10 text-green-400" : "text-foreground hover:bg-surface"}`}
                                        >
                                            <span className={`h-2 w-2 rounded-full bg-green-400`} />
                                            Baja
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => { setFilterOpen(!filterOpen); setPriorityFilterOpen(false); }}
                                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-all hover:border-accent/50 hover:text-accent hover:shadow-md hover:shadow-accent/10 hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Estado: {filterLabels[filter]}
                                    <svg className={`h-4 w-4 text-muted transition-transform ${filterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {filterOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-border bg-surface-elevated p-2 shadow-xl shadow-black/20 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <button
                                            onClick={() => { setFilter("all"); setFilterOpen(false); }}
                                            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${filter === "all" ? "bg-accent-muted text-accent" : "text-foreground hover:bg-surface"}`}
                                        >
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current">
                                                {filter === "all" && <span className="h-2 w-2 rounded-full bg-current" />}
                                            </span>
                                            Todas
                                        </button>
                                        <button
                                            onClick={() => { setFilter("pending"); setFilterOpen(false); }}
                                            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${filter === "pending" ? "bg-accent-muted text-accent" : "text-foreground hover:bg-surface"}`}
                                        >
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current">
                                                {filter === "pending" && <span className="h-2 w-2 rounded-full bg-current" />}
                                            </span>
                                            Pendientes
                                        </button>
                                        <button
                                            onClick={() => { setFilter("completed"); setFilterOpen(false); }}
                                            className={`flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${filter === "completed" ? "bg-accent-muted text-accent" : "text-foreground hover:bg-surface"}`}
                                        >
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current">
                                                {filter === "completed" && <span className="h-2 w-2 rounded-full bg-current" />}
                                            </span>
                                            Completadas
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar tareas por nombre..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="input-field w-full rounded-lg border border-border bg-surface-elevated pl-11 pr-4 py-3 text-foreground placeholder-muted outline-none focus:border-accent"
                        />
                        {searchText && (
                            <button
                                onClick={() => setSearchText("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted hover:text-foreground transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">

                    {filteredTasks.length === 0 ? (

                        <div className="rounded-xl border border-border bg-surface p-12 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated">
                                <svg className="h-8 w-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="mb-1 text-lg font-semibold text-foreground">
                                No hay tareas
                            </h3>
                            <p className="text-sm text-muted">
                                {searchText 
                                    ? `No se encontraron tareas con "${searchText}"`
                                    : filter === "all" && priorityFilter === "all"
                                        ? "Crea tu primera tarea para comenzar" 
                                        : "No hay tareas que coincidan con los filtros seleccionados"}
                            </p>
                        </div>

                    ) : (

                        filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onDelete={handleDeleteTask}
                                onToggleComplete={handleToggleComplete}
                                onEdit={setSelectedTask}
                            />
                        ))

                    )}

                </div>

            </main>

            <ConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={confirmLogout}
                title="Cerrar sesion"
                message="¿Estas seguro de que deseas cerrar sesion?"
                confirmText="Cerrar sesion"
                cancelText="Cancelar"
                variant="warning"
            />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setTaskToDelete(null); }}
                onConfirm={confirmDeleteTask}
                title="Eliminar tarea"
                message="¿Estas seguro de que deseas eliminar esta tarea? Esta accion no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />

        </div>
    );
}

export default DashboardPage;