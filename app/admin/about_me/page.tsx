"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/Loading';

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
    levels: {
      native: { fr: string; en: string };
      good: { fr: string; en: string };
      average: { fr: string; en: string };
    };
  };
  interests: { icon: string; name: { fr: string; en: string } }[];
}

const defaultAboutData: AboutData = {
  aboutTitle: { fr: "", en: "" },
  aboutDescription: { fr: "", en: "" },
  personalInfo: [],
  languages: {
    title: { fr: "Languages", en: "Languages" },
    levels: {
      native: { fr: "Native", en: "Native" },
      good: { fr: "Good", en: "Good" },
      average: { fr: "Average", en: "Average" },
    },
  },
  interests: [],
};

export default function AboutAdminPage() {
  const [about, setAbout] = useState<AboutData>(defaultAboutData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAbout() {
      setLoading(true);
      try {
        const res = await fetch("/api/about_me");
        if (!res.ok) throw new Error("Failed to fetch about data");
        
        const data = await res.json();
        if (data) {
          // Merge with default to ensure all fields exist
          setAbout({
            ...defaultAboutData,
            ...data,
            languages: {
              ...defaultAboutData.languages,
              ...(data.languages || {}),
              levels: {
                ...defaultAboutData.languages.levels,
                ...(data.languages?.levels || {}),
              },
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
      const newData = JSON.parse(JSON.stringify(prev)); // Deep clone
      
      if (section === "aboutTitle" || section === "aboutDescription") {
        (newData[section] as any)[indexOrKey as string] = value;
      } 
      else if (section === "languages") {
        if (field === "title") {
          (newData.languages.title as any)[indexOrKey as string] = value;
        } else {
          const langLevel = field as "native" | "good" | "average";
          newData.languages.levels[langLevel][indexOrKey as string] = value;
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

  const handleAddItem = (section: "personalInfo" | "interests") => {
    setAbout((prev) => {
      const newData = { ...prev };
      if (section === "personalInfo") {
        newData.personalInfo = [
          ...newData.personalInfo,
          {
            icon: "",
            label: { fr: "", en: "" },
            value: { fr: "", en: "" },
          },
        ];
      } else if (section === "interests") {
        newData.interests = [
          ...newData.interests,
          { icon: "", name: { fr: "", en: "" } },
        ];
      }
      return newData;
    });
  };

  const handleRemoveItem = (section: "personalInfo" | "interests", index: number) => {
    setAbout((prev) => {
      const newData = { ...prev };
      if (section === "personalInfo") {
        newData.personalInfo = newData.personalInfo.filter((_, i) => i !== index);
      } else if (section === "interests") {
        newData.interests = newData.interests.filter((_, i) => i !== index);
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

      {/* Language Levels */}
      <div className="space-y-4">
        <h2 className="font-semibold">Language Levels</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(about.languages.levels).map(([level, translations]) => (
            <div key={level} className="space-y-2">
              <h3 className="font-medium capitalize">{level}</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">French</label>
                  <input
                    type="text"
                    value={translations.fr}
                    onChange={(e) => handleInputChange("languages", "fr", level, e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">English</label>
                  <input
                    type="text"
                    value={translations.en}
                    onChange={(e) => handleInputChange("languages", "en", level, e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
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
        
        {about.personalInfo.map((info, idx) => (
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
        ))}
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
        
        {about.interests.map((interest, idx) => (
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
        ))}
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