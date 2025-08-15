"use client";

import { useEffect, useState } from "react";

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

export default function AboutAdminPage() {
  const [about, setAbout] = useState<AboutData>({
    aboutTitle: { fr: "", en: "" },
    aboutDescription: { fr: "", en: "" },
    personalInfo: [],
    languages: {
      title: { fr: "", en: "" },
      levels: {
        native: { fr: "", en: "" },
        good: { fr: "", en: "" },
        average: { fr: "", en: "" },
      },
    },
    interests: [],
  });

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await fetch("/api/about_me");
        const data = await res.json();
        if (data) setAbout(data);
      } catch (err) {
        console.error("Failed to fetch about:", err);
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
      const copy = { ...prev };
      if (section === "aboutTitle" || section === "aboutDescription") {
        (copy as any)[section][indexOrKey as string] = value;
      } else if (section === "languages") {
        const langLevel = field as "native" | "good" | "average";
        copy.languages.levels[langLevel][indexOrKey as string] = value;
      } else if (section === "personalInfo") {
        const i = indexOrKey as number;
        const path = field.split(".");
        if (path.length === 2) copy.personalInfo[i][path[0]][path[1]] = value;
        else (copy.personalInfo[i] as any)[field] = value;
      } else if (section === "interests") {
        const i = indexOrKey as number;
        const path = field.split(".");
        if (path.length === 2) copy.interests[i][path[0]][path[1]] = value;
        else (copy.interests[i] as any)[field] = value;
      }
      return copy;
    });
  };

  const handleAddItem = (section: string) => {
    setAbout((prev) => {
      const copy = { ...prev };
      if (section === "personalInfo") {
        copy.personalInfo.push({
          icon: "",
          label: { fr: "", en: "" },
          value: { fr: "", en: "" },
        });
      } else if (section === "interests") {
        copy.interests.push({ icon: "", name: { fr: "", en: "" } });
      }
      return copy;
    });
  };

  const handleRemoveItem = (section: string, index: number) => {
    setAbout((prev) => {
      const copy = { ...prev };
      if (section === "personalInfo") {
        copy.personalInfo.splice(index, 1);
      } else if (section === "interests") {
        copy.interests.splice(index, 1);
      }
      return copy;
    });
  };

  const handleSave = async () => {
    try {
      await fetch("/api/about_me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(about),
      });
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit About Me</h1>

      {/* About Title */}
      <div>
        <h2 className="font-semibold mb-1">Title</h2>
        <input
          type="text"
          value={about.aboutTitle.fr}
          placeholder="Title FR"
          onChange={(e) =>
            handleInputChange("aboutTitle", "fr", "", e.target.value)
          }
          className="border p-2 rounded w-full md:w-1/2 mb-2"
        />
        <input
          type="text"
          value={about.aboutTitle.en}
          placeholder="Title EN"
          onChange={(e) =>
            handleInputChange("aboutTitle", "en", "", e.target.value)
          }
          className="border p-2 rounded w-full md:w-1/2"
        />
      </div>

      {/* About Description */}
      <div>
        <h2 className="font-semibold mb-1">Description</h2>
        <textarea
          value={about.aboutDescription.fr}
          placeholder="Description FR"
          onChange={(e) =>
            handleInputChange("aboutDescription", "fr", "", e.target.value)
          }
          className="border p-2 rounded w-full md:w-1/2 mb-2"
        />
        <textarea
          value={about.aboutDescription.en}
          placeholder="Description EN"
          onChange={(e) =>
            handleInputChange("aboutDescription", "en", "", e.target.value)
          }
          className="border p-2 rounded w-full md:w-1/2"
        />
      </div>

      {/* Personal Info */}
      <div>
        <h2 className="font-semibold mb-2">Personal Info</h2>
        <button
          onClick={() => handleAddItem("personalInfo")}
          className="mb-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Info
        </button>
        {about.personalInfo.map((info, idx) => (
          <div key={idx} className="mb-4 space-y-1 border p-2 rounded relative">
            <button
              onClick={() => handleRemoveItem("personalInfo", idx)}
              className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
            <input
              type="text"
              value={info.icon}
              placeholder="Icon"
              onChange={(e) =>
                handleInputChange("personalInfo", idx, "icon", e.target.value)
              }
              className="border p-2 rounded w-full md:w-1/4 mb-1"
            />
            <input
              type="text"
              value={info.label.fr}
              placeholder="Label FR"
              onChange={(e) =>
                handleInputChange(
                  "personalInfo",
                  idx,
                  "label.fr",
                  e.target.value
                )
              }
              className="border p-2 rounded w-full md:w-1/4 mb-1"
            />
            <input
              type="text"
              value={info.label.en}
              placeholder="Label EN"
              onChange={(e) =>
                handleInputChange(
                  "personalInfo",
                  idx,
                  "label.en",
                  e.target.value
                )
              }
              className="border p-2 rounded w-full md:w-1/4 mb-1"
            />
            <input
              type="text"
              value={info.value.fr}
              placeholder="Value FR"
              onChange={(e) =>
                handleInputChange(
                  "personalInfo",
                  idx,
                  "value.fr",
                  e.target.value
                )
              }
              className="border p-2 rounded w-full md:w-1/4 mb-1"
            />
            <input
              type="text"
              value={info.value.en}
              placeholder="Value EN"
              onChange={(e) =>
                handleInputChange(
                  "personalInfo",
                  idx,
                  "value.en",
                  e.target.value
                )
              }
              className="border p-2 rounded w-full md:w-1/4"
            />
          </div>
        ))}
      </div>

      {/* Interests */}
      <div>
        <h2 className="font-semibold mb-2">Interests</h2>
        <button
          onClick={() => handleAddItem("interests")}
          className="mb-2 px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Interest
        </button>
        {about.interests.map((interest, idx) => (
          <div key={idx} className="mb-4 space-y-1 border p-2 rounded relative">
            <button
              onClick={() => handleRemoveItem("interests", idx)}
              className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded"
            >
              Remove
            </button>
            <input
              type="text"
              value={interest.icon}
              placeholder="Icon"
              onChange={(e) =>
                handleInputChange("interests", idx, "icon", e.target.value)
              }
              className="border p-2 rounded w-full md:w-1/4 mb-1"
            />
            <input
              type="text"
              value={interest.name.fr}
              placeholder="Name FR"
              onChange={(e) =>
                handleInputChange("interests", idx, "name.fr", e.target.value)
              }
              className="border p-2 rounded w-full md:w-1/4 mb-1"
            />
            <input
              type="text"
              value={interest.name.en}
              placeholder="Name EN"
              onChange={(e) =>
                handleInputChange("interests", idx, "name.en", e.target.value)
              }
              className="border p-2 rounded w-full md:w-1/4"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
