"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/Loading';

type HeroButton = {
  text: { fr: string; en: string };
  link: string;
  icon: string;
};

type HeroData = {
  specialist: { fr: string; en: string };
  heroTitle: { fr: string; en: string };
  heroDescription: { fr: string; en: string };
  heroButtons: HeroButton[];
};

export default function HeroAdminPage() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch hero data
      const heroRes = await fetch("/api/hero");
      if (!heroRes.ok) throw new Error("Failed to fetch hero data");
      const heroData = await heroRes.json();
      setHero(heroData);

      // Fetch username
      const usernameRes = await fetch("/api/username");
      if (!usernameRes.ok) throw new Error("Failed to fetch username");
      const { name } = await usernameRes.json();
      setUsername(name || "");

    } catch (err: any) {
      setError(err.message);
      // Fallback to empty structures
      setHero({
        specialist: { fr: "", en: "" },
        heroTitle: { fr: "", en: "" },
        heroDescription: { fr: "", en: "" },
        heroButtons: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const saveHero = async () => {
    if (!hero) return;
    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hero),
      });
      
      if (!res.ok) throw new Error("Failed to save hero content");
      alert("Hero content saved successfully!");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const saveUsername = async () => {
    try {
      const res = await fetch("/api/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username }),
      });
      
      if (!res.ok) throw new Error("Failed to save username");
      alert("Username saved successfully!");
      fetchData(); // Refresh data to show new username
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (field: string, lang: "fr" | "en", value: string) => {
    if (!hero) return;
    setHero({ ...hero, [field]: { ...hero[field as keyof HeroData], [lang]: value } });
  };

  const handleButtonChange = (index: number, field: "text" | "link" | "icon", value: any, lang?: "fr" | "en") => {
    if (!hero) return;
    const updatedButtons = [...hero.heroButtons];
    if (field === "text" && lang) {
      updatedButtons[index].text[lang] = value;
    } else {
      updatedButtons[index][field] = value;
    }
    setHero({ ...hero, heroButtons: updatedButtons });
  };

  const addButton = () => {
    if (!hero) return;
    setHero({
      ...hero,
      heroButtons: [...hero.heroButtons, { text: { fr: "", en: "" }, link: "", icon: "" }],
    });
  };

  const removeButton = (index: number) => {
    if (!hero) return;
    const updatedButtons = hero.heroButtons.filter((_, i) => i !== index);
    setHero({ ...hero, heroButtons: updatedButtons });
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">
        Hello {username || "Admin"}
      </h1>

      {/* Username Management Section */}
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="font-semibold mb-2 text-lg">Username</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            type="text"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded flex-1 w-full"
          />
          <button
            onClick={saveUsername}
            disabled={!username.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>

      {/* Hero Content Sections */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Specialist</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={hero?.specialist.fr || ""}
            placeholder="French version"
            onChange={(e) => handleInputChange("specialist", "fr", e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />
          <input
            type="text"
            value={hero?.specialist.en || ""}
            placeholder="English version"
            onChange={(e) => handleInputChange("specialist", "en", e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Title</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            value={hero?.heroTitle.fr || ""}
            placeholder="French title"
            onChange={(e) => handleInputChange("heroTitle", "fr", e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />
          <input
            type="text"
            value={hero?.heroTitle.en || ""}
            placeholder="English title"
            onChange={(e) => handleInputChange("heroTitle", "en", e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Description</h2>
        <div className="flex flex-col gap-2">
          <textarea
            value={hero?.heroDescription.fr || ""}
            placeholder="French description"
            onChange={(e) => handleInputChange("heroDescription", "fr", e.target.value)}
            className="border p-2 rounded w-full"
            rows={3}
          />
          <textarea
            value={hero?.heroDescription.en || ""}
            placeholder="English description"
            onChange={(e) => handleInputChange("heroDescription", "en", e.target.value)}
            className="border p-2 rounded w-full"
            rows={3}
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Buttons</h2>
        {hero?.heroButtons.map((btn, index) => (
          <div key={index} className="border p-4 rounded mb-4 flex flex-col md:flex-row md:items-center gap-2">
            <input
              type="text"
              value={btn.text.fr}
              placeholder="French text"
              onChange={(e) => handleButtonChange(index, "text", e.target.value, "fr")}
              className="border p-2 rounded w-full md:w-1/4"
            />
            <input
              type="text"
              value={btn.text.en}
              placeholder="English text"
              onChange={(e) => handleButtonChange(index, "text", e.target.value, "en")}
              className="border p-2 rounded w-full md:w-1/4"
            />
            <input
              type="text"
              value={btn.link}
              placeholder="Button link"
              onChange={(e) => handleButtonChange(index, "link", e.target.value)}
              className="border p-2 rounded w-full md:w-1/4"
            />
            <input
              type="text"
              value={btn.icon}
              placeholder="Icon name"
              onChange={(e) => handleButtonChange(index, "icon", e.target.value)}
              className="border p-2 rounded w-full md:w-1/6"
            />
            <button
              onClick={() => removeButton(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={addButton}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Add Button
        </button>
      </div>

      <div className="mt-6 flex justify-center md:justify-start">
        <button
          onClick={saveHero}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
        >
          Save Content
        </button>
      </div>
    </div>
  );
}