"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

type LocalizedText = { fr: string; en: string };

type SkillItem = {
  name: LocalizedText;
  examples: string[];
  icon: string;
};

type SkillCategory = {
  skillicon: string;
  title: LocalizedText;
  items: SkillItem[];
};

type SkillsData = {
  skillsTitle: LocalizedText;
  skills: SkillCategory[];
};

export default function SkillsAdminPage() {
  const [data, setData] = useState<SkillsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/skills");
      if (!res.ok) throw new Error("Failed to fetch skills data");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleChange = (
    categoryIndex: number | null,
    itemIndex: number | null,
    field: keyof LocalizedText | "examples" | "skillicon" | "skillsTitle" | "icon",
    langOrExampleIndex: "fr" | "en" | number,
    value: string
  ) => {
    if (!data) return;
    const newData = { ...data };

    if (categoryIndex === null) {
      if (field === "skillsTitle" && typeof langOrExampleIndex === "string") {
        newData.skillsTitle[langOrExampleIndex] = value;
      }
    } else if (itemIndex === null) {
      if (field === "skillicon") newData.skills[categoryIndex].skillicon = value;
      else if (field === "title" && typeof langOrExampleIndex === "string")
        newData.skills[categoryIndex].title[langOrExampleIndex] = value;
    } else {
      const item = newData.skills[categoryIndex].items[itemIndex];
      if (field === "name" && typeof langOrExampleIndex === "string") item.name[langOrExampleIndex] = value;
      else if (field === "examples" && typeof langOrExampleIndex === "number")
        item.examples[langOrExampleIndex] = value;
      else if (field === "icon") item.icon = value;
    }

    setData(newData);
  };

  const addCategory = () => {
    if (!data) return;
    const newCategory: SkillCategory = { skillicon: "", title: { fr: "", en: "" }, items: [] };
    setData({ ...data, skills: [...data.skills, newCategory] });
  };

  const removeCategory = (index: number) => {
    if (!data) return;
    const updated = data.skills.filter((_, i) => i !== index);
    setData({ ...data, skills: updated });
  };

  const addItem = (categoryIndex: number) => {
    if (!data) return;
    const newItem: SkillItem = { name: { fr: "", en: "" }, examples: [], icon: "" };
    const updated = [...data.skills];
    updated[categoryIndex].items.push(newItem);
    setData({ ...data, skills: updated });
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    if (!data) return;
    const updated = [...data.skills];
    updated[categoryIndex].items = updated[categoryIndex].items.filter((_, i) => i !== itemIndex);
    setData({ ...data, skills: updated });
  };

const saveData = async () => {
  if (!data) return;
  try {
    console.log("Sending data:", data); // Log what's being sent
    const res = await fetch("/api/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Server error:", errorData);
      throw new Error(errorData.error || "Failed to save skills data");
    }
    
    const result = await res.json();
    console.log("Save result:", result);
    alert("Skills data saved successfully!");
    fetchSkills();
  } catch (err: any) {
    console.error("Save error:", err);
    alert(`Error: ${err.message}`);
  }
};

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Skills Admin</h1>

      {/* Skills Title */}
      <div className="mb-6">
        <h2 className="font-semibold">Skills Title</h2>
        <input
          type="text"
          value={data.skillsTitle.fr}
          onChange={(e) => handleChange(null, null, "skillsTitle", "fr", e.target.value)}
          placeholder="French Title"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={data.skillsTitle.en}
          onChange={(e) => handleChange(null, null, "skillsTitle", "en", e.target.value)}
          placeholder="English Title"
          className="border p-2"
        />
      </div>

      {/* Skill Categories */}
      {data.skills.map((category, catIdx) => (
        <div key={catIdx} className="mb-8 border p-4 rounded">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Category {catIdx + 1}</h3>
            <button onClick={() => removeCategory(catIdx)} className="text-red-500">
              Remove Category
            </button>
          </div>

          <input
            type="text"
            value={category.skillicon}
            onChange={(e) => handleChange(catIdx, null, "skillicon", 0, e.target.value)}
            placeholder="Category Icon"
            className="border p-2 mb-2 w-full"
          />

          <input
            type="text"
            value={category.title.fr}
            onChange={(e) => handleChange(catIdx, null, "title", "fr", e.target.value)}
            placeholder="Category Title (FR)"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            value={category.title.en}
            onChange={(e) => handleChange(catIdx, null, "title", "en", e.target.value)}
            placeholder="Category Title (EN)"
            className="border p-2 mb-2 w-full"
          />

          {/* Skill Items */}
          {category.items.map((item, itemIdx) => (
            <div key={itemIdx} className="mb-4 p-2 border rounded">
              <div className="flex justify-between items-center mb-2">
                <h4>Item {itemIdx + 1}</h4>
                <button onClick={() => removeItem(catIdx, itemIdx)} className="text-red-500">
                  Remove Item
                </button>
              </div>

              <input
                type="text"
                value={item.name.fr}
                onChange={(e) => handleChange(catIdx, itemIdx, "name", "fr", e.target.value)}
                placeholder="Item Name (FR)"
                className="border p-2 mb-2 w-full"
              />
              <input
                type="text"
                value={item.name.en}
                onChange={(e) => handleChange(catIdx, itemIdx, "name", "en", e.target.value)}
                placeholder="Item Name (EN)"
                className="border p-2 mb-2 w-full"
              />

              <input
                type="text"
                value={item.icon}
                onChange={(e) => handleChange(catIdx, itemIdx, "icon", 0, e.target.value)}
                placeholder="Item Icon"
                className="border p-2 mb-2 w-full"
              />

              {item.examples.map((ex, exIdx) => (
                <input
                  key={exIdx}
                  type="text"
                  value={ex}
                  onChange={(e) => handleChange(catIdx, itemIdx, "examples", exIdx, e.target.value)}
                  placeholder={`Example ${exIdx + 1}`}
                  className="border p-2 mb-2 w-full"
                />
              ))}

              <button
                onClick={() => {
                  const updated = [...data.skills];
                  updated[catIdx].items[itemIdx].examples.push("");
                  setData({ ...data, skills: updated });
                }}
                className="text-blue-500"
              >
                Add Example
              </button>
            </div>
          ))}

          <button onClick={() => addItem(catIdx)} className="text-green-500 mt-2">
            Add Item
          </button>
        </div>
      ))}

      <button onClick={addCategory} className="text-green-600 mb-4">
        Add Category
      </button>

      <div>
        <button onClick={saveData} className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
}
