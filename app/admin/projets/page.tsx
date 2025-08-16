"use client";

import { useEffect, useState } from "react";

export default function ProjetsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [titleFr, setTitleFr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descFr, setDescFr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Button states
  const [button, setButton] = useState<{
    labelFr: string;
    labelEn: string;
    link: string;
    icon?: string;
  } | null>(null);
  const [btnLabelFr, setBtnLabelFr] = useState("");
  const [btnLabelEn, setBtnLabelEn] = useState("");
  const [btnLink, setBtnLink] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projets");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error("Fetch error:", e);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addTech = () => {
    if (techInput.trim()) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput("");
    }
  };

  const addButton = () => {
    if (btnLabelFr.trim() && btnLabelEn.trim() && btnLink.trim()) {
      setButton({
        labelFr: btnLabelFr,
        labelEn: btnLabelEn,
        link: btnLink,
        icon: "external-link"
      });
      setBtnLabelFr("");
      setBtnLabelEn("");
      setBtnLink("");
    }
  };

  const removeButton = () => {
    setButton(null);
  };

  const resetForm = () => {
    setTitleFr("");
    setTitleEn("");
    setDescFr("");
    setDescEn("");
    setTechStack([]);
    setFile(null);
    setEditingId(null);
    setButton(null);
    setBtnLabelFr("");
    setBtnLabelEn("");
    setBtnLink("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titleFr || !titleEn) {
      alert("Please provide titles in both languages");
      return;
    }

    const formData = new FormData();
    formData.append("titleFr", titleFr);
    formData.append("titleEn", titleEn);
    formData.append("descFr", descFr);
    formData.append("descEn", descEn);
    formData.append("techStack", JSON.stringify(techStack));
    
    // Add button data
    if (button) {
      formData.append("buttonIcon", button.icon || "external-link");
      formData.append("buttonLabelFr", button.labelFr);
      formData.append("buttonLabelEn", button.labelEn);
      formData.append("buttonLink", button.link);
    } else {
      // Provide default/empty values if no button
      formData.append("buttonIcon", "external-link");
      formData.append("buttonLabelFr", "");
      formData.append("buttonLabelEn", "");
      formData.append("buttonLink", "");
    }

    if (file) formData.append("image", file);
    if (editingId) formData.append("projectId", editingId);

    try {
      const url = editingId ? `/api/projets/${editingId}` : "/api/projets";
      const method = "PUT"; // Always use PUT as your API expects

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Save failed:", errorData);
        alert(`Save failed: ${errorData.error || 'Unknown error'}`);
        return;
      }

      await fetchProjects();
      resetForm();
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error - check console");
    }
  };

  const handleEdit = (p: any) => {
    setEditingId(p._id);
    setTitleFr(p.title.fr);
    setTitleEn(p.title.en);
    setDescFr(p.description.fr);
    setDescEn(p.description.en);
    setTechStack(p.techStack || []);
    
    // Initialize form with existing button data if it exists
    if (p.button) {
      setButton({
        labelFr: p.button.label.fr,
        labelEn: p.button.label.en,
        link: p.button.link,
        icon: p.button.icon
      });
    } else {
      setButton(null);
    }
    
    setFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/projets/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchProjects();
      } else {
        const errorData = await res.json();
        alert(`Delete failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed - check console");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Projets</h1>

      <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded-md">
        <input
          value={titleFr}
          onChange={(e) => setTitleFr(e.target.value)}
          placeholder="Titre FR"
          className="border p-2 w-full"
          required
        />
        <input
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          placeholder="Title EN"
          className="border p-2 w-full"
          required
        />
        <textarea
          value={descFr}
          onChange={(e) => setDescFr(e.target.value)}
          placeholder="Description FR"
          className="border p-2 w-full"
        />
        <textarea
          value={descEn}
          onChange={(e) => setDescEn(e.target.value)}
          placeholder="Description EN"
          className="border p-2 w-full"
        />

        {/* Tech stack input */}
        <div className="flex gap-2">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Tech"
            className="border p-2 flex-1"
          />
          <button
            type="button"
            onClick={addTech}
            className="bg-blue-500 text-white px-4"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {techStack.map((t, i) => (
            <span key={i} className="bg-gray-200 px-2 py-1 rounded">
              {t}
            </span>
          ))}
        </div>

        {/* Button input */}
        <div className="flex flex-col gap-2 border-t pt-2">
          <h3 className="font-semibold">Project Button</h3>
          <input
            value={btnLabelFr}
            onChange={(e) => setBtnLabelFr(e.target.value)}
            placeholder="Button Label FR"
            className="border p-2"
          />
          <input
            value={btnLabelEn}
            onChange={(e) => setBtnLabelEn(e.target.value)}
            placeholder="Button Label EN"
            className="border p-2"
          />
          <input
            value={btnLink}
            onChange={(e) => setBtnLink(e.target.value)}
            placeholder="Button Link"
            className="border p-2"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addButton}
              className="bg-purple-500 text-white px-4 py-1"
            >
              {button ? "Update Button" : "Add Button"}
            </button>
            {button && (
              <button
                type="button"
                onClick={removeButton}
                className="bg-red-500 text-white px-4 py-1"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {button ? (
            <span className="bg-gray-300 px-2 py-1 rounded text-sm">
              {button.labelFr} / {button.labelEn}
            </span>
          ) : (
            <span className="text-gray-500">No button added</span>
          )}
        </div>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          accept="image/*"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2"
          >
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          projects.map((p: any) => (
            <div key={p._id} className="border rounded p-4 mb-2">
              <h2 className="font-bold">
                {p.title.fr} / {p.title.en}
              </h2>
              <p>{p.description.fr}</p>
              <p>Tech: {p.techStack?.join(", ")}</p>
              {p.image && <img src={p.image} alt="" className="w-40" />}
              <div className="flex flex-wrap gap-2 mt-2">
                {p.button && (
                  <a
                    href={p.button.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                  >
                    {p.button.label.fr} / {p.button.label.en}
                  </a>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}