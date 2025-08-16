"use client";

import { useEffect, useState } from "react";

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({
    title: { fr: "", en: "" },
    description: { fr: "", en: "" },
    techStack: [],
    button: { icon: "", label: { fr: "", en: "" }, link: "" },
    link: "",
    image: null,
  });
  const [newTech, setNewTech] = useState("");

  useEffect(() => {
    fetch("/api/Projets")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []));
  }, []);

  const handleAddTech = () => {
    if (newTech.trim()) {
      setForm((prev: any) => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const handleRemoveTech = (idx: number) => {
    setForm((prev: any) => ({
      ...prev,
      techStack: prev.techStack.filter((_: any, i: number) => i !== idx),
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    if (form._id) fd.append("_id", form._id);
    fd.append("title.fr", form.title.fr);
    fd.append("title.en", form.title.en);
    fd.append("description.fr", form.description.fr);
    fd.append("description.en", form.description.en);
    fd.append("techStack", JSON.stringify(form.techStack));
    fd.append("button", JSON.stringify(form.button));
    fd.append("link", form.link);
    if (form.image instanceof File) fd.append("image", form.image);

    const res = await fetch("/api/Projets", { method: "PUT", body: fd });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error saving project");
    } else {
      alert("Saved!");
      setProjects((prev) =>
        form._id ? prev.map((p) => (p._id === form._id ? data : p)) : [...prev, data]
      );
      setForm({
        title: { fr: "", en: "" },
        description: { fr: "", en: "" },
        techStack: [],
        button: { icon: "", label: { fr: "", en: "" }, link: "" },
        link: "",
        image: null,
      });
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Projects</h1>

      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded-lg shadow-md">
        <input
          placeholder="Title (FR)"
          value={form.title.fr}
          onChange={(e) => setForm({ ...form, title: { ...form.title, fr: e.target.value } })}
          className="border p-2 w-full"
        />
        <input
          placeholder="Title (EN)"
          value={form.title.en}
          onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
          className="border p-2 w-full"
        />

        <textarea
          placeholder="Description (FR)"
          value={form.description.fr}
          onChange={(e) =>
            setForm({ ...form, description: { ...form.description, fr: e.target.value } })
          }
          className="border p-2 w-full"
        />
        <textarea
          placeholder="Description (EN)"
          value={form.description.en}
          onChange={(e) =>
            setForm({ ...form, description: { ...form.description, en: e.target.value } })
          }
          className="border p-2 w-full"
        />

        {/* Tech Stack */}
        <div>
          <label className="font-semibold">Tech Stack</label>
          <div className="flex gap-2 mt-2">
            <input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Add tech..."
              className="border p-2 flex-1"
            />
            <button type="button" onClick={handleAddTech} className="bg-blue-500 text-white px-3">
              Add
            </button>
          </div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {form.techStack.map((t: string, i: number) => (
              <li key={i} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-2">
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(i)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Saving..." : "Save Project"}
        </button>
      </form>

      <div className="mt-8">
        <h2 className="font-bold mb-4">Current Projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map((p, i) => (
            <div key={i} className="border rounded-lg p-4 shadow">
              <h3 className="font-semibold">{p.title.en}</h3>
              <p className="text-sm text-gray-600">{p.description.en}</p>
              <ul className="flex flex-wrap gap-2 mt-2">
                {p.techStack?.map((t: string, idx: number) => (
                  <li key={idx} className="bg-gray-100 px-2 py-1 rounded">{t}</li>
                ))}
              </ul>
              {p.image && <img src={p.image} alt="" className="mt-2 rounded" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
