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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titleFr", titleFr);
    formData.append("titleEn", titleEn);
    formData.append("descFr", descFr);
    formData.append("descEn", descEn);
    formData.append("techStack", JSON.stringify(techStack));
    formData.append("buttonIcon", "external-link");
    formData.append("buttonLabelFr", "Voir le projet");
    formData.append("buttonLabelEn", "View Project");
    formData.append("buttonLink", "https://example.com");

    if (file) formData.append("image", file);

    const res = await fetch("/api/projets", {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) {
      console.error("save failed");
      return;
    }

    await fetchProjects();
    setTitleFr(""); setTitleEn(""); setDescFr(""); setDescEn(""); setTechStack([]); setFile(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Projets</h1>

      <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded-md">
        <input value={titleFr} onChange={e=>setTitleFr(e.target.value)} placeholder="Titre FR" className="border p-2 w-full"/>
        <input value={titleEn} onChange={e=>setTitleEn(e.target.value)} placeholder="Title EN" className="border p-2 w-full"/>
        <textarea value={descFr} onChange={e=>setDescFr(e.target.value)} placeholder="Description FR" className="border p-2 w-full"/>
        <textarea value={descEn} onChange={e=>setDescEn(e.target.value)} placeholder="Description EN" className="border p-2 w-full"/>

        <div className="flex gap-2">
          <input value={techInput} onChange={e=>setTechInput(e.target.value)} placeholder="Tech" className="border p-2 flex-1"/>
          <button type="button" onClick={addTech} className="bg-blue-500 text-white px-4">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {techStack.map((t,i)=> <span key={i} className="bg-gray-200 px-2 py-1 rounded">{t}</span>)}
        </div>

        <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} />

        <button type="submit" className="bg-green-500 text-white px-4 py-2">Save Project</button>
      </form>

      <div className="mt-6">
        {loading ? <p>Loading...</p> : (
          projects.map((p:any)=>(
            <div key={p._id} className="border rounded p-4 mb-2">
              <h2 className="font-bold">{p.title.fr} / {p.title.en}</h2>
              <p>{p.description.fr}</p>
              <p>Tech: {p.techStack.join(", ")}</p>
              {p.image && <img src={p.image} alt="" className="w-40"/>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
