// src/AdminDashboard.jsx
import { useEffect, useState } from "react";
import api from "./api";

export default function AdminDashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    githubLink: "",
    liveDemo: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setError("");
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("❌ Failed to load projects. Please try again.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...form,
        techStack: form.techStack
          ? form.techStack.split(",").map((t) => t.trim())
          : [],
      };

      if (editId) {
        await api.put(`/projects/${editId}`, payload);
      } else {
        await api.post("/projects", payload);
      }

      setForm({
        title: "",
        description: "",
        techStack: "",
        githubLink: "",
        liveDemo: "",
        image: "",
      });
      setEditId(null);
      fetchProjects();
    } catch (err) {
      console.error("Save error:", err);
      setError(err?.response?.data?.error || "❌ Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      setError("");
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error("Delete error:", err);
      setError("❌ Failed to delete project. Please try again.");
    }
  };

  // Edit a project (load into form)
  const handleEdit = (project) => {
    setEditId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      githubLink: project.githubLink || "",
      liveDemo: project.liveDemo || "",
      image: project.image || "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            onLogout?.();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Project Title"
          className="p-3 bg-gray-100 rounded"
        />
        <input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="Image URL"
          className="p-3 bg-gray-100 rounded"
        />
        <textarea
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Project Description"
          className="p-3 bg-gray-100 rounded md:col-span-2"
        />
        <input
          value={form.techStack}
          onChange={(e) => setForm({ ...form, techStack: e.target.value })}
          placeholder="Tech Stack (comma separated)"
          className="p-3 bg-gray-100 rounded"
        />
        <input
          value={form.githubLink}
          onChange={(e) => setForm({ ...form, githubLink: e.target.value })}
          placeholder="GitHub URL"
          className="p-3 bg-gray-100 rounded"
        />
        <input
          value={form.liveDemo}
          onChange={(e) => setForm({ ...form, liveDemo: e.target.value })}
          placeholder="Live Demo URL"
          className="p-3 bg-gray-100 rounded"
        />

        <button
          disabled={loading}
          className="bg-gray-900 text-white px-4 py-2 rounded col-span-1 md:col-span-2"
        >
          {loading ? "Saving..." : editId ? "Update Project" : "Create Project"}
        </button>
      </form>

      {/* Projects List */}
      <div className="grid md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            {p.image && (
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              {p.techStack.join(", ")}
            </p>
            <div className="mt-3 flex gap-2">
              {p.githubLink && (
                <a
                  href={p.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-indigo-600"
                >
                  Code
                </a>
              )}
              {p.liveDemo && (
                <a
                  href={p.liveDemo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-indigo-600"
                >
                  Demo
                </a>
              )}
              <button
                onClick={() => handleEdit(p)}
                className="ml-auto text-sm text-green-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
