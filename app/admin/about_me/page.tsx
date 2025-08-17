"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/LoadingAdmin';

interface LanguageItem {
  name: string;
  level: string; // stores the level key (e.g., "a1")
}

interface AboutData {
  aboutTitle: { fr: string; en: string };
  aboutDescription: { fr: string; en: string };
  personalInfo: {
    icon: string;
    label: { fr: string; en: string };
    value: { fr: string; en: string };
  }[];
  languages: {
    title: { fr: string; en: string };
    levels: Record<string, { fr: string; en: string }>;
    list: LanguageItem[];
  };
  interests: { icon: string; name: { fr: string; en: string } }[];
}

const defaultLevels = {
  a1: { fr: "Débutant", en: "Beginner" },
  a2: { fr: "Élémentaire", en: "Elementary" },
  b1: { fr: "Intermédiaire", en: "Intermediate" },
  b2: { fr: "Intermédiaire Avancé", en: "Upper Intermediate" },
  c1: { fr: "Avancé", en: "Advanced" },
  c2: { fr: "Maîtrise", en: "Mastery" },
  native: { fr: "Langue Maternelle", en: "Native" }
};

const defaultAboutData: AboutData = {
  aboutTitle: { fr: "", en: "" },
  aboutDescription: { fr: "", en: "" },
  personalInfo: [],
  languages: {
    title: { fr: "Langues", en: "Languages" },
    levels: defaultLevels,
    list: [],
  },
  interests: [],
};

export default function AboutAdminPage() {
  const [about, setAbout] = useState<AboutData>(defaultAboutData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newLanguageName, setNewLanguageName] = useState("");

  useEffect(() => {
    async function fetchAbout() {
      setLoading(true);
      try {
        const res = await fetch("/api/about_me");
        if (!res.ok) throw new Error("Failed to fetch about data");
        
        const data = await res.json();
        if (data) {
          // Merge with default levels if none exist
          const levels = defaultLevels;
          
          setAbout({
            ...defaultAboutData,
            ...data,
            languages: {
              title: {
                ...defaultAboutData.languages.title,
                ...(data.languages?.title || {}),
              },
              levels,
              list: data.languages?.list || [],
            },
          });
        } else {
          setAbout(defaultAboutData);
        }
      } catch (err) {
        console.error("Failed to fetch about:", err);
        setError("Failed to load about data");
        setAbout(defaultAboutData);
      } finally {
        setLoading(false);
      }
    }
    fetchAbout();
  }, []);

  const handleInputChange = (
    section: string,
    indexOrKey: string | number,
    field: string,
    value: string
  ) => {
    setAbout((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      
      if (section === "aboutTitle" || section === "aboutDescription") {
        (newData[section] as any)[indexOrKey as string] = value;
      } 
      else if (section === "languages") {
        if (field === "title") {
          (newData.languages.title as any)[indexOrKey as string] = value;
        } else if (field === "levelName") {
          const [level, lang] = (indexOrKey as string).split(".");
          newData.languages.levels[level][lang] = value;
        } else if (field.startsWith("list.")) {
          const [_, listField] = field.split(".");
          const index = indexOrKey as number;
          if (listField === "name") {
            newData.languages.list[index].name = value;
          } else if (listField === "level") {
            newData.languages.list[index].level = value;
          }
        }
      } 
      else if (section === "personalInfo") {
        const i = indexOrKey as number;
        const path = field.split(".");
        if (path.length === 2) {
          (newData.personalInfo[i] as any)[path[0]][path[1]] = value;
        } else {
          (newData.personalInfo[i] as any)[field] = value;
        }
      } 
      else if (section === "interests") {
        const i = indexOrKey as number;
        const path = field.split(".");
        if (path.length === 2) {
          (newData.interests[i] as any)[path[0]][path[1]] = value;
        } else {
          (newData.interests[i] as any)[field] = value;
        }
      }
      
      return newData;
    });
  };

  const handleAddLanguage = () => {
    if (!newLanguageName.trim()) return;
    
    setAbout(prev => ({
      ...prev,
      languages: {
        ...prev.languages,
        list: [
          ...prev.languages.list,
          {
            name: newLanguageName.trim(),
            level: "b1" // Default to intermediate level
          }
        ]
      }
    }));
    
    setNewLanguageName("");
  };

  const handleRemoveLanguage = (index: number) => {
    setAbout(prev => ({
      ...prev,
      languages: {
        ...prev.languages,
        list: prev.languages.list.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddItem = (section: "personalInfo" | "interests") => {
    setAbout(prev => {
      const newData = { ...prev };
      
      if (section === "personalInfo") {
        newData.personalInfo = [
          ...prev.personalInfo,
          {
            icon: "",
            label: { fr: "", en: "" },
            value: { fr: "", en: "" }
          }
        ];
      } else if (section === "interests") {
        newData.interests = [
          ...prev.interests,
          {
            icon: "",
            name: { fr: "", en: "" }
          }
        ];
      }
      
      return newData;
    });
  };

  const handleRemoveItem = (section: "personalInfo" | "interests", index: number) => {
    setAbout(prev => {
      const newData = { ...prev };
      
      if (section === "personalInfo") {
        newData.personalInfo = prev.personalInfo.filter((_, i) => i !== index);
      } else if (section === "interests") {
        newData.interests = prev.interests.filter((_, i) => i !== index);
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/about_me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-6">Edit About Me</h1>

      {/* About Title */}
      <div className="space-y-2">
        <h2 className="font-semibold">Title</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">French</label>
            <input
              type="text"
              value={about.aboutTitle.fr}
              onChange={(e) => handleInputChange("aboutTitle", "fr", "", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">English</label>
            <input
              type="text"
              value={about.aboutTitle.en}
              onChange={(e) => handleInputChange("aboutTitle", "en", "", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </div>

      {/* About Description */}
      <div className="space-y-2">
        <h2 className="font-semibold">Description</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">French</label>
            <textarea
              value={about.aboutDescription.fr}
              onChange={(e) => handleInputChange("aboutDescription", "fr", "", e.target.value)}
              className="border p-2 rounded w-full h-32"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">English</label>
            <textarea
              value={about.aboutDescription.en}
              onChange={(e) => handleInputChange("aboutDescription", "en", "", e.target.value)}
              className="border p-2 rounded w-full h-32"
            />
          </div>
        </div>
      </div>

      {/* Language List Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Languages</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newLanguageName}
              onChange={(e) => setNewLanguageName(e.target.value)}
              className="border p-2 rounded"
              placeholder="Language name (e.g., Français)"
              onKeyDown={(e) => e.key === 'Enter' && handleAddLanguage()}
            />
            <button
              onClick={handleAddLanguage}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
              disabled={!newLanguageName.trim()}
            >
              Add Language
            </button>
          </div>
        </div>
        
        {about.languages.list.length === 0 ? (
          <div className="text-gray-500 italic">No languages added yet</div>
        ) : (
          <div className="space-y-3">
            {about.languages.list.map((language, idx) => (
              <div key={idx} className="border p-4 rounded-lg space-y-3 relative">
                <button
                  onClick={() => handleRemoveLanguage(idx)}
                  className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
                >
                  Remove
                </button>
                
                <div>
                  <label className="block text-sm mb-1">Language Name</label>
                  <input
                    type="text"
                    value={language.name}
                    onChange={(e) => handleInputChange("languages", idx, "list.name", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-1">Proficiency Level</label>
                  <select
                    value={language.level}
                    onChange={(e) => handleInputChange("languages", idx, "list.level", e.target.value)}
                    className="border p-2 rounded w-full"
                  >
                    {Object.entries(about.languages.levels).map(([levelKey, level]) => (
                      <option key={levelKey} value={levelKey}>
                        {level.fr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Personal Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Personal Info</h2>
          <button
            onClick={() => handleAddItem("personalInfo")}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Add Info
          </button>
        </div>
        
        {about.personalInfo.length === 0 ? (
          <div className="text-gray-500 italic">No personal info added yet</div>
        ) : (
          about.personalInfo.map((info, idx) => (
            <div key={idx} className="border p-4 rounded-lg space-y-3 relative">
              <button
                onClick={() => handleRemoveItem("personalInfo", idx)}
                className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
              >
                Remove
              </button>
              
              <div>
                <label className="block text-sm mb-1">Icon</label>
                <input
                  type="text"
                  value={info.icon}
                  onChange={(e) => handleInputChange("personalInfo", idx, "icon", e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Icon name (e.g., mail, phone)"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Label (FR)</label>
                  <input
                    type="text"
                    value={info.label.fr}
                    onChange={(e) => handleInputChange("personalInfo", idx, "label.fr", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Label (EN)</label>
                  <input
                    type="text"
                    value={info.label.en}
                    onChange={(e) => handleInputChange("personalInfo", idx, "label.en", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Value (FR)</label>
                  <input
                    type="text"
                    value={info.value.fr}
                    onChange={(e) => handleInputChange("personalInfo", idx, "value.fr", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Value (EN)</label>
                  <input
                    type="text"
                    value={info.value.en}
                    onChange={(e) => handleInputChange("personalInfo", idx, "value.en", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interests */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Interests</h2>
          <button
            onClick={() => handleAddItem("interests")}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Add Interest
          </button>
        </div>
        
        {about.interests.length === 0 ? (
          <div className="text-gray-500 italic">No interests added yet</div>
        ) : (
          about.interests.map((interest, idx) => (
            <div key={idx} className="border p-4 rounded-lg space-y-3 relative">
              <button
                onClick={() => handleRemoveItem("interests", idx)}
                className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
              >
                Remove
              </button>
              
              <div>
                <label className="block text-sm mb-1">Icon</label>
                <input
                  type="text"
                  value={interest.icon}
                  onChange={(e) => handleInputChange("interests", idx, "icon", e.target.value)}
                  className="border p-2 rounded w-full"
                  placeholder="Emoji or icon name"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Name (FR)</label>
                  <input
                    type="text"
                    value={interest.name.fr}
                    onChange={(e) => handleInputChange("interests", idx, "name.fr", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Name (EN)</label>
                  <input
                    type="text"
                    value={interest.name.en}
                    onChange={(e) => handleInputChange("interests", idx, "name.en", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}