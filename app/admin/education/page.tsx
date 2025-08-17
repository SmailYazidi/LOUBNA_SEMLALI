"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/LoadingAdmin';
import * as LucideIcons from "lucide-react";
import { useToast } from "@/hooks/use-toast"

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
 const { toast } = useToast()

  const fetchEducation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/education");
      if (!res.ok) throw new Error("Failed to fetch education data");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
      // Fallback to empty structure
      setData({
        journeyTitle: { fr: "", en: "" },
        education: [],
        experience: []
      });
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

  const handleYearChange = (section: "education" | "experience", index: number, value: string) => {
    if (!data) return;
    const newData = { ...data };
    newData[section][index].year = value;
    setData(newData);
  };

  const addItem = (section: "education" | "experience") => {
    if (!data) return;
    const newItem = { 
      year: "", 
      title: { fr: "", en: "" }, 
      institution: { fr: "", en: "" }, 
      description: { fr: "", en: "" } 
    };
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
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        journeyTitle: data.journeyTitle,
        education: data.education,
        experience: data.experience
      }),
    });

    const responseData = await res.json();
    
    if (!res.ok) {
      throw new Error(responseData.error || "Failed to save education data");
    }

    toast({
      title: "Success",
      description: "Saved successfully!!",
      className: "bg-green-500 text-white border-none",
    });
    
    // Refresh data after successful save
    await fetchEducation();
  } catch (err: any) {
    console.error("Save error:", err);
    toast({
      title: "Error",
      description: err?.message || "Something went wrong!",
      className: "bg-red-500 text-white border-none",
    });
  }
};

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
  if (!data) return null;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <LucideIcons.GraduationCap size={24} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Education & Experience
        </h1>
      </div>

 
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.Bookmark size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Journey Title</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French Title</label>
            <input
              type="text"
              value={data.journeyTitle.fr}
              placeholder="Title in French"
              onChange={(e) => handleChange("journeyTitle", null, "fr", "fr", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English Title</label>
            <input
              type="text"
              value={data.journeyTitle.en}
              placeholder="Title in English"
              onChange={(e) => handleChange("journeyTitle", null, "en", "en", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div> 

      {/* Education Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LucideIcons.GraduationCap size={20} className="text-gray-600 dark:text-gray-300" />
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Education</h2>
          </div>
          <button 
            onClick={() => addItem("education")}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-sm"
          >
            <LucideIcons.Plus size={16} />
            Add Education
          </button>
        </div>

        {data.education.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <LucideIcons.Info size={20} className="mx-auto mb-2" />
            No education items added yet
          </div>
        ) : (
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Year</label>
                    <input
                      type="text"
                      value={edu.year}
                      placeholder="e.g. 2015-2019"
                      onChange={(e) => handleYearChange("education", index, e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                {["title", "institution", "description"].map((field) => (
                  <div key={field} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {`${field.charAt(0).toUpperCase() + field.slice(1)} (FR)`}
                      </label>
                      {field === "description" ? (
                        <textarea
                          value={edu[field as keyof EducationItem].fr}
                          placeholder={`French ${field}`}
                          onChange={(e) => handleChange("education", index, field as keyof LocalizedText, "fr", e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[100px]"
                        />
                      ) : (
                        <input
                          type="text"
                          value={edu[field as keyof EducationItem].fr}
                          placeholder={`French ${field}`}
                          onChange={(e) => handleChange("education", index, field as keyof LocalizedText, "fr", e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {`${field.charAt(0).toUpperCase() + field.slice(1)} (EN)`}
                      </label>
                      {field === "description" ? (
                        <textarea
                          value={edu[field as keyof EducationItem].en}
                          placeholder={`English ${field}`}
                          onChange={(e) => handleChange("education", index, field as keyof LocalizedText, "en", e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[100px]"
                        />
                      ) : (
                        <input
                          type="text"
                          value={edu[field as keyof EducationItem].en}
                          placeholder={`English ${field}`}
                          onChange={(e) => handleChange("education", index, field as keyof LocalizedText, "en", e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => removeItem("education", index)}
                  className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
                >
                  <LucideIcons.Trash2 size={16} />
                  Remove Education
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LucideIcons.Briefcase size={20} className="text-gray-600 dark:text-gray-300" />
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Experience</h2>
          </div>
          <button 
            onClick={() => addItem("experience")}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-sm"
          >
            <LucideIcons.Plus size={16} />
            Add Experience
          </button>
        </div>

        {data.experience.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <LucideIcons.Info size={20} className="mx-auto mb-2" />
            No experience items added yet
          </div>
        ) : (
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Year</label>
                    <input
                      type="text"
                      value={exp.year}
                      placeholder="e.g. 2019-2022"
                      onChange={(e) => handleYearChange("experience", index, e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                {["title", "institution", "description"].map((field) => (
                  <div key={field} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {`${field.charAt(0).toUpperCase() + field.slice(1)} (FR)`}
                      </label>
                      {field === "description" ? (
                        <textarea
                          value={exp[field as keyof ExperienceItem].fr}
                          placeholder={`French ${field}`}
                          onChange={(e) => handleChange("experience", index, field as keyof LocalizedText, "fr", e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[100px]"
                        />
                      ) : (
                        <input
                          type="text"
                          value={exp[field as keyof ExperienceItem].fr}
                          placeholder={`French ${field}`}
                          onChange={(e) => handleChange("experience", index, field as keyof LocalizedText, "fr", e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {`${field.charAt(0).toUpperCase() + field.slice(1)} (EN)`}
                      </label>
                      {field === "description" ? (
                        <textarea
                          value={exp[field as keyof ExperienceItem].en}
                          placeholder={`English ${field}`}
                          onChange={(e) => handleChange("experience", index, field as keyof LocalizedText, "en", e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[100px]"
                        />
                      ) : (
                        <input
                          type="text"
                          value={exp[field as keyof ExperienceItem].en}
                          placeholder={`English ${field}`}
                          onChange={(e) => handleChange("experience", index, field as keyof LocalizedText, "en", e.target.value)}
                          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        />
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => removeItem("experience", index)}
                  className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
                >
                  <LucideIcons.Trash2 size={16} />
                  Remove Experience
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={saveData}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <LucideIcons.Save size={18} />
          Save All Data
        </button>
      </div>
    </div>
  );
}