"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/Loading';

type LocalizedText = { fr: string; en: string };

type EducationItem = {
  year: string;
  title: LocalizedText;
  institution: LocalizedText;
  description: LocalizedText;
};

type ExperienceItem = {
  year: string;
  title: LocalizedText;
  institution: LocalizedText;
  description: LocalizedText;
};

type EducationData = {
  journeyTitle: LocalizedText;
  education: EducationItem[];
  experience: ExperienceItem[];
};

export default function EducationAdminPage() {
  const [data, setData] = useState<EducationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/education");
      if (!res.ok) throw new Error("Failed to fetch education data");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEducation(); }, []);

  const handleChange = (
    section: "journeyTitle" | "education" | "experience",
    index: number | null,
    field: keyof LocalizedText,
    lang: "fr" | "en",
    value: string
  ) => {
    if (!data) return;
    const newData = { ...data };
    if (section === "journeyTitle") {
      newData.journeyTitle[lang] = value;
    } else if (index !== null) {
      newData[section][index][field][lang] = value;
    }
    setData(newData);
  };

  const addItem = (section: "education" | "experience") => {
    if (!data) return;
    const newItem = { year: "", title: { fr: "", en: "" }, institution: { fr: "", en: "" }, description: { fr: "", en: "" } };
    setData({ ...data, [section]: [...data[section], newItem] });
  };

  const removeItem = (section: "education" | "experience", index: number) => {
    if (!data) return;
    const updatedList = data[section].filter((_, i) => i !== index);
    setData({ ...data, [section]: updatedList });
  };

  const saveData = async () => {
    if (!data) return;
    try {
      const res = await fetch("/api/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save education data");
      alert("Education data saved successfully!");
      fetchEducation();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Education Admin</h1>

      {/* Journey Title */}
      <div className="border p-4 mb-4 rounded-md">
        <h2 className="font-semibold mb-2">Journey Title</h2>
        <input
          type="text"
          value={data.journeyTitle.fr}
          placeholder="Title FR"
          onChange={(e) => handleChange("journeyTitle", null, "fr", "fr", e.target.value)}
          className="border p-1 mr-2 mb-2 w-full md:w-1/2"
        />
        <input
          type="text"
          value={data.journeyTitle.en}
          placeholder="Title EN"
          onChange={(e) => handleChange("journeyTitle", null, "en", "en", e.target.value)}
          className="border p-1 mb-2 w-full md:w-1/2"
        />
      </div>

      {/* Education */}
      <h2 className="font-semibold mb-2">Education</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="border p-4 mb-4 rounded-md">
          <input
            type="text"
            value={edu.year}
            placeholder="Year"
            onChange={(e) => { const newData = { ...data }; newData.education[index].year = e.target.value; setData(newData); }}
            className="border p-1 mb-2 w-full md:w-1/4"
          />
          {["title", "institution", "description"].map((field) => (
            <div key={field} className="mb-2">
              <input
                type="text"
                value={edu[field as keyof EducationItem].fr}
                placeholder={`${field} FR`}
                onChange={(e) => handleChange("education", index, field as keyof LocalizedText, "fr", e.target.value)}
                className="border p-1 mr-2 mb-1 w-full md:w-1/2"
              />
              <input
                type="text"
                value={edu[field as keyof EducationItem].en}
                placeholder={`${field} EN`}
                onChange={(e) => handleChange("education", index, field as keyof LocalizedText, "en", e.target.value)}
                className="border p-1 w-full md:w-1/2"
              />
            </div>
          ))}
          <button onClick={() => removeItem("education", index)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
        </div>
      ))}
      <button onClick={() => addItem("education")} className="bg-green-500 text-white px-4 py-2 rounded mb-4">Add Education</button>

      {/* Experience */}
      <h2 className="font-semibold mb-2">Experience</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="border p-4 mb-4 rounded-md">
          <input
            type="text"
            value={exp.year}
            placeholder="Year"
            onChange={(e) => { const newData = { ...data }; newData.experience[index].year = e.target.value; setData(newData); }}
            className="border p-1 mb-2 w-full md:w-1/4"
          />
          {["title", "institution", "description"].map((field) => (
            <div key={field} className="mb-2">
              <input
                type="text"
                value={exp[field as keyof ExperienceItem].fr}
                placeholder={`${field} FR`}
                onChange={(e) => handleChange("experience", index, field as keyof LocalizedText, "fr", e.target.value)}
                className="border p-1 mr-2 mb-1 w-full md:w-1/2"
              />
              <input
                type="text"
                value={exp[field as keyof ExperienceItem].en}
                placeholder={`${field} EN`}
                onChange={(e) => handleChange("experience", index, field as keyof LocalizedText, "en", e.target.value)}
                className="border p-1 w-full md:w-1/2"
              />
            </div>
          ))}
          <button onClick={() => removeItem("experience", index)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
        </div>
      ))}
      <button onClick={() => addItem("experience")} className="bg-green-500 text-white px-4 py-2 rounded mb-4">Add Experience</button>

      <div>
        <button onClick={saveData} className="bg-blue-500 text-white px-4 py-2 rounded">Save Education Data</button>
      </div>
    </div>
  );
}
