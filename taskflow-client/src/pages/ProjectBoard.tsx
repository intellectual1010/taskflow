import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Plus,
  Trash2,
} from "lucide-react";
import api from "../api/api";
import type {
  Project,
  Task,
  TaskPriority,
  TaskStatus,
} from "../types";

interface TasksResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  items: Task[];
}

interface ProjectDetails extends Project {
  tasks?: Task[];
}

const columns: {
  status: TaskStatus;
  title: string;
}[] = [
    { status: "Todo", title: "To Do" },
    { status: "InProgress", title: "In Progress" },
    { status: "Review", title: "Review" },
    { status: "Done", title: "Done" },
  ];

export default function ProjectBoard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] =
    useState<ProjectDetails | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium" as TaskPriority,
    dueDate: "",
  });

  async function loadBoard() {
    if (!id) return;

    try {
      const [projectResponse, tasksResponse] =
        await Promise.all([
          api.get<ProjectDetails>(`/projects/${id}`),
          api.get<TasksResponse>(
            `/tasks?projectId=${id}&pageSize=100`
          ),
        ]);

      setProject(projectResponse.data);
      setTasks(tasksResponse.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
  }, [id]);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();

    if (!id || !form.title.trim()) return;

    try {
      await api.post(`/tasks/${id}`, {
        title: form.title,
        description: form.description || null,
        priority: form.priority,
        dueDate: form.dueDate
          ? new Date(form.dueDate).toISOString()
          : null,
        assignedUserId: null,
      });

      setForm({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
      });

      setShowCreate(false);
      await loadBoard();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteTask(taskId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${taskId}`);

      setTasks((current) =>
        current.filter((task) => task.id !== taskId)
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function changeStatus(
    taskId: string,
    status: TaskStatus
  ) {
    try {
      await api.patch(`/tasks/${taskId}/status`, {
        status,
      });

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId
            ? { ...task, status }
            : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  const taskGroups = useMemo(() => {
    return columns.reduce(
      (result, column) => {
        result[column.status] = tasks.filter(
          (task) => task.status === column.status
        );

        return result;
      },
      {} as Record<TaskStatus, Task[]>
    );
  }, [tasks]);

  if (loading) {
    return (
      <div className="board-message">
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="board-message">
        Project not found.
      </div>
    );
  }

  return (
    <div className="board-page">
      <header className="board-header">
        <div>
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />
            Projects
          </button>

          <h1>{project.name}</h1>

          <p>
            {project.description ||
              "Manage and track project tasks."}
          </p>
        </div>

        <button
          className="new-project-button"
          onClick={() => setShowCreate(true)}
        >
          <Plus size={18} />
          New task
        </button>
      </header>

      <section className="board-summary">
        <span>{tasks.length} tasks</span>

        <span>
          {
            tasks.filter(
              (task) => task.status === "Done"
            ).length
          }{" "}
          completed
        </span>
      </section>

      <main className="kanban-board">
        {columns.map((column) => (
          <section
            className="kanban-column"
            key={column.status}
          >
            <header className="column-header">
              <div>
                {column.status === "Done" ? (
                  <CheckCircle2 size={17} />
                ) : column.status === "InProgress" ? (
                  <Clock3 size={17} />
                ) : (
                  <Circle size={17} />
                )}

                <strong>{column.title}</strong>
              </div>

              <span>
                {taskGroups[column.status]?.length || 0}
              </span>
            </header>

            <div className="task-list">
              {taskGroups[column.status]?.map(
                (task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={changeStatus}
                    onDelete={deleteTask}
                  />
                )
              )}

              {taskGroups[column.status]?.length ===
                0 && (
                  <div className="empty-column">
                    No tasks
                  </div>
                )}
            </div>
          </section>
        ))}
      </main>

      {showCreate && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setShowCreate(false)}
        >
          <form
            className="project-modal"
            onSubmit={createTask}
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >
            <span className="eyebrow">
              NEW TASK
            </span>

            <h2>Create task</h2>

            <label>Title</label>

            <input
              autoFocus
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              placeholder="Build authentication API"
              required
            />

            <label>Description</label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              placeholder="Describe the task..."
            />

            <label>Priority</label>

            <select
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority:
                    e.target.value as TaskPriority,
                })
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">
                Medium
              </option>
              <option value="High">High</option>
              <option value="Critical">
                Critical
              </option>
            </select>

            <label>Due date</label>

            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  dueDate: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setShowCreate(false)
                }
              >
                Cancel
              </button>

              <button className="new-project-button">
                Create task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  onStatusChange: (
    id: string,
    status: TaskStatus
  ) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="task-card">
      <div className="task-card-top">
        <span
          className={`priority priority-${String(
            task.priority
          ).toLowerCase()}`}
        >
          {task.priority}
        </span>
      </div>

      <button
        className="task-delete"
        onClick={() => onDelete(task.id)}
        title="Delete task"
      >
        <Trash2 size={14} />
      </button>

      <h3>{task.title}</h3>

      {task.description && (
        <p>{task.description}</p>
      )}

      {task.dueDate && (
        <div className="task-date">
          <CalendarDays size={14} />

          {new Date(
            task.dueDate
          ).toLocaleDateString()}
        </div>
      )}

      <select
        className="status-select"
        value={task.status}
        onChange={(e) =>
          onStatusChange(
            task.id,
            e.target.value as TaskStatus
          )
        }
      >
        <option value="Todo">To Do</option>
        <option value="InProgress">
          In Progress
        </option>
        <option value="Review">Review</option>
        <option value="Done">Done</option>
      </select>
    </article>
  );
}