import { useEffect, useState } from "react";
import {
  FolderKanban,
  Layers3,
  LogOut,
  Plus,
  CheckCircle2,
  ListTodo,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import type { Project } from "../types";

export default function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function loadProjects() {
    try {
      const { data } = await api.get<Project[]>("/projects");
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await api.post("/projects", {
        name,
        description,
      });

      setName("");
      setDescription("");
      setShowCreate(false);

      await loadProjects();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteProject(
    e: React.MouseEvent,
    projectId: string
  ) {
    e.stopPropagation();

    const confirmed = window.confirm(
      "Delete this project and all of its tasks?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/projects/${projectId}`);

      setProjects((current) =>
        current.filter(
          (project) => project.id !== projectId
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const totalTasks = projects.reduce(
    (total, project) => total + project.taskCount,
    0
  );

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <div className="dashboard-brand">
            <Layers3 size={25} />
            <span>TaskFlow</span>
          </div>

          <nav>
            <button className="nav-item active">
              <FolderKanban size={18} />
              Projects
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="user-info">
            <div className="avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <strong>{user.name || "User"}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <button className="logout-button" onClick={logout}>
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span className="eyebrow">WORKSPACE</span>
            <h1>Projects</h1>
            <p>Manage your projects and track team progress.</p>
          </div>

          <button
            className="new-project-button"
            onClick={() => setShowCreate(true)}
          >
            <Plus size={18} />
            New project
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FolderKanban size={20} />
            </div>
            <div>
              <span>Projects</span>
              <strong>{projects.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <ListTodo size={20} />
            </div>
            <div>
              <span>Total tasks</span>
              <strong>{totalTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span>Workspace</span>
              <strong>Active</strong>
            </div>
          </div>
        </section>

        <div className="section-heading">
          <div>
            <h2>Your projects</h2>
            <p>Select a project to manage its tasks.</p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <FolderKanban size={38} />

            <h3>No projects yet</h3>

            <p>Create your first project to start organizing your work.</p>

            <button
              className="new-project-button"
              onClick={() => setShowCreate(true)}
            >
              <Plus size={18} />
              Create project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <article
                className="project-card"
                key={project.id}
                onClick={() =>
                  navigate(`/projects/${project.id}`)
                }
              >
                <button
                  className="project-delete"
                  onClick={(e) =>
                    deleteProject(e, project.id)
                  }
                  title="Delete project"
                >
                  <Trash2 size={15} />
                </button>
                
                <div className="project-icon">
                  <FolderKanban size={22} />
                </div>

                <h3>{project.name}</h3>

                <p>
                  {project.description ||
                    "No description provided."}
                </p>

                <footer>
                  <span>
                    {project.taskCount}{" "}
                    {project.taskCount === 1 ? "task" : "tasks"}
                  </span>

                  <span>
                    {new Date(
                      project.createdAt
                    ).toLocaleDateString()}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        )}
      </main>

      {showCreate && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setShowCreate(false)}
        >
          <form
            className="project-modal"
            onSubmit={createProject}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span className="eyebrow">NEW PROJECT</span>
            <h2>Create project</h2>

            <label>Project name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="TaskFlow Platform"
              required
            />

            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="What is this project about?"
              rows={4}
            />

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>

              <button className="new-project-button">
                Create project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}