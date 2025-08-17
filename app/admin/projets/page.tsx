"use client";

import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

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
  const [iconSearch, setIconSearch] = useState("");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const filteredIcons = Object.keys(LucideIcons)
    .filter(iconName => 
      iconName.toLowerCase().includes(iconSearch.toLowerCase()) && 
      iconName !== "default" && 
      iconName !== "createLucideIcon"
    )
    .slice(0, 50);

  const renderIcon = (iconName: string, size = 20) => {
    if (!iconName || !LucideIcons[iconName as keyof typeof LucideIcons]) {
      return <LucideIcons.ExternalLink size={size} />;
    }
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return <IconComponent size={size} />;
  };

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

  const removeTech = (index: number) => {
    setTechStack(techStack.filter((_, i) => i !== index));
  };

  const addButton = () => {
    if (btnLabelFr.trim() && btnLabelEn.trim() && btnLink.trim()) {
      setButton({
        labelFr: btnLabelFr,
        labelEn: btnLabelEn,
        link: btnLink,
        icon: button?.icon || "external-link"
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
    
    if (button) {
      formData.append("buttonIcon", button.icon || "external-link");
      formData.append("buttonLabelFr", button.labelFr);
      formData.append("buttonLabelEn", button.labelEn);
      formData.append("buttonLink", button.link);
    } else {
      formData.append("buttonIcon", "external-link");
      formData.append("buttonLabelFr", "");
      formData.append("buttonLabelEn", "");
      formData.append("buttonLink", "");
    }

    if (file) formData.append("image", file);
    if (editingId) formData.append("projectId", editingId);

    try {
      const url = editingId ? `/api/projets/${editingId}` : "/api/projets";
      const method = "PUT";

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
    <div className="p-4 md:p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <LucideIcons.FolderGit2 size={24} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Projects 
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-700 dark:text-white">
          <LucideIcons.Plus size={20} className="text-gray-600 dark:text-gray-300" />
          {editingId ? "Edit Project" : "Add New Project"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title (FR)</label>
            <input
              value={titleFr}
              onChange={(e) => setTitleFr(e.target.value)}
              placeholder="Titre FR"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title (EN)</label>
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Title EN"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description (FR)</label>
            <textarea
              value={descFr}
              onChange={(e) => setDescFr(e.target.value)}
              placeholder="Description FR"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[100px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description (EN)</label>
            <textarea
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              placeholder="Description EN"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[100px]"
            />
          </div>
        </div>

        {/* Tech stack input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Technologies</label>
      <div className="flex flex-col sm:flex-row gap-2 w-full">
  <input
    value={techInput}
    onChange={(e) => setTechInput(e.target.value)}
    placeholder="Add technology"
    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg flex-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
  />
  <button
    type="button"
    onClick={addTech}
    className="flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
  >
    <LucideIcons.Plus size={16} />
    Add
  </button>
</div>

          <div className="flex flex-wrap gap-2 mt-2">
            {techStack.map((t, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-1">
                <span className="text-sm">{t}</span>
                <button 
                  type="button" 
                  onClick={() => removeTech(i)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <LucideIcons.X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Button input */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-700 dark:text-white">
            <LucideIcons.Link size={18} className="text-gray-600 dark:text-gray-300" />
            Project Button
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Label (FR)</label>
              <input
                value={btnLabelFr}
                onChange={(e) => setBtnLabelFr(e.target.value)}
                placeholder="Button Label FR"
                className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Label (EN)</label>
              <input
                value={btnLabelEn}
                onChange={(e) => setBtnLabelEn(e.target.value)}
                placeholder="Button Label EN"
                className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Link</label>
            <input
              value={btnLink}
              onChange={(e) => setBtnLink(e.target.value)}
              placeholder="Button Link"
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Icon</label>
            <button 
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full justify-between"
            >
              <div className="flex items-center gap-2">
                {button?.icon ? renderIcon(button.icon, 16) : <LucideIcons.ExternalLink size={16} />}
                <span>{button?.icon || "Select icon"}</span>
              </div>
              <LucideIcons.ChevronDown size={16} />
            </button>
            
            {showIconPicker && (
              <div className="mt-2 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Search icons..."
                    className="border border-gray-300 dark:border-gray-600 p-2 pl-9 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                  <LucideIcons.Search className="absolute left-2.5 top-3 text-gray-400" size={16} />
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2">
                  {filteredIcons.map(iconName => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        if (button) {
                          setButton({...button, icon: iconName});
                        } else {
                          setButton({
                            labelFr: btnLabelFr || "Voir",
                            labelEn: btnLabelEn || "View",
                            link: btnLink || "#",
                            icon: iconName
                          });
                        }
                        setShowIconPicker(false);
                        setIconSearch("");
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded flex flex-col items-center justify-center"
                      title={iconName}
                    >
                      {renderIcon(iconName, 20)}
                      <span className="text-xs mt-1 truncate w-full">{iconName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addButton}
              className="flex items-center gap-1 bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 transition"
            >
              {button ? <LucideIcons.RefreshCw size={16} /> : <LucideIcons.Plus size={16} />}
              {button ? "Update Button" : "Add Button"}
            </button>
            {button && (
              <button
                type="button"
                onClick={removeButton}
                className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LucideIcons.Trash2 size={16} />
                Remove
              </button>
            )}
          </div>
          
          <div className="mt-2">
            {button ? (
              <div className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                {renderIcon(button.icon || "external-link", 16)}
                <span>{button.labelFr} / {button.labelEn}</span>
              </div>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">No button added</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Project Image</label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition">
              <LucideIcons.Upload size={16} className="inline mr-2" />
              {file ? file.name : "Choose File"}
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept="image/*"
                className="hidden"
              />
            </label>
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-red-500 hover:text-red-700"
              >
                <LucideIcons.X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            {editingId ? <LucideIcons.Save size={18} /> : <LucideIcons.Plus size={18} />}
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
              <LucideIcons.X size={18} />
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-700 dark:text-white">
          <LucideIcons.List size={20} className="text-gray-600 dark:text-gray-300" />
          Projects List
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <LucideIcons.FolderX size={24} className="mx-auto mb-2" />
            No projects found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p: any) => (
              <div key={p._id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                {p.image && (
                  <div className="h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <img 
                      src={p.image} 
                      alt={`${p.title.fr} project`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                    {p.title.fr} / {p.title.en}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                    {p.description.fr}
                  </p>
                  
                  {p.techStack?.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1">
                        {p.techStack.map((tech: string, i: number) => (
                          <span key={i} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {p.button && (
                    <div className="mt-3">
                      <a
                        href={p.button.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition"
                      >
                        {renderIcon(p.button.icon || "external-link", 14)}
                        {p.button.label.fr} / {p.button.label.en}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleEdit(p)}
                      className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 transition"
                    >
                      <LucideIcons.Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                      <LucideIcons.Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}