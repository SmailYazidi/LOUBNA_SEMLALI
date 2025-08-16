"use client";

import { useEffect, useState } from "react";

export default function ProjetsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // form states
  const [titleFr, setTitleFr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descFr, setDescFr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // dynamic buttons
  const [buttons, setButtons] = useState<
    { labelFr: string; labelEn: string; link: string; icon?: string }[]
  >([]);
  const [btnLabelFr, setBtnLabelFr] = useState("");
  const [btnLabelEn, setBtnLabelEn] = useState("");
  const [btnLink, setBtnLink] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projets");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error("fetch error:", e);
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
      setButtons([
        ...buttons,
        { labelFr: btnLabelFr, labelEn: btnLabelEn, link: btnLink, icon: "external-link" },
      ]);
      setBtnLabelFr("");
      setBtnLabelEn("");
      setBtnLink("");
    }
  };

  const resetForm = () => {
    setTitleFr("");
    setTitleEn("");
    setDescFr("");
    setDescEn("");
    setTechStack([]);
    setFile(null);
    setEditingId(null);
    setButtons([]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titleFr", titleFr);
    formData.append("titleEn", titleEn);
    formData.append("descFr", descFr);
    formData.append("descEn", descEn);
    formData.append("techStack", JSON.stringify(techStack));
    formData.append("buttons", JSON.stringify(buttons));
    if (file) formData.append("image", file);

    const url = editingId ? `/api/projets/${editingId}` : "/api/projets";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });

    if (!res.ok) {
      console.error("save failed");
      return;
    }

    await fetchProjects();
    resetForm();
  };

  const handleEdit = (p: any) => {
    setEditingId(p._id);
    setTitleFr(p.title.fr);
    setTitleEn(p.title.en);
    setDescFr(p.description.fr);
    setDescEn(p.description.en);
    setTechStack(p.techStack || []);
    setButtons(p.buttons || []);
    setFile(null); // new file optional, old image stays unless replaced
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projets/${id}`, { method: "DELETE" });
    if (res.ok) fetchProjects();
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
        />
        <input
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          placeholder="Title EN"
          className="border p-2 w-full"
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

        {/* Buttons input */}
        <div className="flex flex-col gap-2 border-t pt-2">
          <h3 className="font-semibold">Project Buttons</h3>
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
          <button
            type="button"
            onClick={addButton}
            className="bg-purple-500 text-white px-4 py-1"
          >
            Add Button
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {buttons.map((b, i) => (
            <span
              key={i}
              className="bg-gray-300 px-2 py-1 rounded text-sm"
            >
              {b.labelFr} / {b.labelEn}
            </span>
          ))}
        </div>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

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
            className="ml-2 bg-gray-500 text-white px-4 py-2"
          >
            Cancel
          </button>
        )}
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
                {p.buttons?.map((b: any, i: number) => (
                  <a
                    key={i}
                    href={b.link}
                    target="_blank"
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                  >
                    {b.labelFr} / {b.labelEn}
                  </a>
                ))}
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
