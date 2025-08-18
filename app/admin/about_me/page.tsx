"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/LoadingAdmin';
import * as LucideIcons from "lucide-react";
import { useToast } from "@/hooks/use-toast"
interface LanguageItem {
  name:  { fr: string; en: string };
  level: string;
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

  const [iconSearch, setIconSearch] = useState("");
  const [newLanguageNameFr, setNewLanguageNameFr] = useState("");
  const [newLanguageNameEn, setNewLanguageNameEn] = useState("");
 const { toast } = useToast()




  const [activeIconPicker, setActiveIconPicker] = useState<{
    type: 'personalInfo' | 'interests';
    index: number;
  } | null>(null);

  const filteredIcons = Object.keys(LucideIcons)
    .filter(iconName => 
      iconName.toLowerCase().includes(iconSearch.toLowerCase()) && 
      iconName !== "default" && 
      iconName !== "createLucideIcon"
    )
    .slice(0, 50);

  const renderIcon = (iconName: string, size = 20) => {
    if (!iconName || !LucideIcons[iconName as keyof typeof LucideIcons]) {
      return <LucideIcons.Info size={size} />;
    }
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return <IconComponent size={size} />;
  };

  useEffect(() => {
    async function fetchAbout() {
      setLoading(true);
      try {
        const res = await fetch("/api/about_me");
        if (!res.ok) throw new Error("Failed to fetch about data");
        
        const data = await res.json();
        if (data) {
          setAbout({
            ...defaultAboutData,
            ...data,
            languages: {
              title: {
                ...defaultAboutData.languages.title,
                ...(data.languages?.title || {}),
              },
              levels: defaultLevels,
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
      if (typeof indexOrKey === 'number') {
        // Handle language list items
        if (field === "name.fr") {
          newData.languages.list[indexOrKey].name.fr = value;
        } else if (field === "name.en") {
          newData.languages.list[indexOrKey].name.en = value;
        } else if (field === "level") {
          newData.languages.list[indexOrKey].level = value;
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
    if (!newLanguageNameFr.trim() || !newLanguageNameEn.trim()) return;

    setAbout((prev) => ({
      ...prev,
      languages: {
        ...prev.languages,
        list: [
          ...prev.languages.list,
          {
            name: { fr: newLanguageNameFr.trim(), en: newLanguageNameEn.trim() },
            level: "b1",
          },
        ],
      },
    }));

    setNewLanguageNameFr("");
    setNewLanguageNameEn("");
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
            icon: "User",
            label: { fr: "", en: "" },
            value: { fr: "", en: "" }
          }
        ];
      } else if (section === "interests") {
        newData.interests = [
          ...prev.interests,
          {
            icon: "Heart",
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
   toast({
  title: "Success",
  description: "Saved successfully!",
  className: "bg-green-500 text-white border-none", // ✅ green background, white text
})
  
    } catch (err: any) {
  toast({
    title: "Error",
    description: err?.message || "Something went wrong!",
    className: "bg-red-500 text-white border-none",
  })


    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <LucideIcons.User size={24} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          About Me
        </h1>
      </div>

   {/*    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.Type size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Title</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French</label>
            <input
              type="text"
              value={about.aboutTitle.fr}
              onChange={(e) => handleInputChange("aboutTitle", "fr", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English</label>
            <input
              type="text"
              value={about.aboutTitle.en}
              onChange={(e) => handleInputChange("aboutTitle", "en", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div> */}

      {/* About Description */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.AlignLeft size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Description</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French</label>
            <textarea
              value={about.aboutDescription.fr}
              onChange={(e) => handleInputChange("aboutDescription", "fr", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[120px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English</label>
            <textarea
              value={about.aboutDescription.en}
              onChange={(e) => handleInputChange("aboutDescription", "en", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[120px]"
            />
          </div>
        </div>
      </div>

      {/* Language List Management */}
   <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LucideIcons.Languages size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Languages</h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mb-4">
        <input
          type="text"
          value={newLanguageNameFr}
          onChange={(e) => setNewLanguageNameFr(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white flex-1"
          placeholder="Language name (Français)"
        />
        <input
          type="text"
          value={newLanguageNameEn}
          onChange={(e) => setNewLanguageNameEn(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white flex-1"
          placeholder="Language name (English)"
          onKeyDown={(e) => e.key === "Enter" && handleAddLanguage()}
        />
        <button
          onClick={handleAddLanguage}
          className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!newLanguageNameFr.trim() || !newLanguageNameEn.trim()}
        >
          <LucideIcons.Plus size={16} />
          Add Language
        </button>
      </div>

      {about.languages.list.length === 0 ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          <LucideIcons.Info size={20} className="mx-auto mb-2" />
          No languages added yet
        </div>
      ) : (
        <div className="space-y-3">
          {about.languages.list.map((language, idx) => (
            <div key={idx} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-700 dark:text-white flex items-center gap-2">
                  <LucideIcons.Circle size={12} className="text-blue-500" />
                  Language {idx + 1}
                </h3>
                <button
                  onClick={() => handleRemoveLanguage(idx)}
                  className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                >
                  <LucideIcons.Trash2 size={14} />
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Language Name (Fr)
                  </label>
                  <input
                    type="text"
                    value={language.name.fr}
                    onChange={(e) => handleInputChange("languages", idx, "name.fr", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Language Name (En)
                  </label>
                  <input
                    type="text"
                    value={language.name.en}
                    onChange={(e) => handleInputChange("languages", idx, "name.en", e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Proficiency Level
                  </label>
      <select
  value={language.level}
  onChange={(e) => handleInputChange("languages", idx, "level", e.target.value)}
  className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
>
  {Object.entries(about.languages.levels).map(([levelKey, level]) => (
    <option key={levelKey} value={levelKey}>
      {level.fr} / {level.en}
    </option>
  ))}
</select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

      {/* Personal Info */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LucideIcons.Info size={20} className="text-gray-600 dark:text-gray-300" />
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Personal Info</h2>
          </div>
          <button
            onClick={() => handleAddItem("personalInfo")}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-sm"
          >
            <LucideIcons.Plus size={16} />
            Add Info
          </button>
        </div>
        
        {about.personalInfo.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <LucideIcons.Info size={20} className="mx-auto mb-2" />
            No personal info added yet
          </div>
        ) : (
          <div className="space-y-4">
            {about.personalInfo.map((info, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-700 dark:text-white flex items-center gap-2">
                    <LucideIcons.Circle size={12} className="text-blue-500" />
                    Personal Info {idx + 1}
                  </h3>
                  <button
                    onClick={() => handleRemoveItem("personalInfo", idx)}
                    className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    <LucideIcons.Trash2 size={14} />
                    Remove
                  </button>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Icon</label>
                  <button 
                    onClick={() => setActiveIconPicker({ type: 'personalInfo', index: idx })}
                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {renderIcon(info.icon, 16)}
                      <span>{info.icon || "Select icon"}</span>
                    </div>
                    <LucideIcons.ChevronDown size={16} />
                  </button>
                </div>

                {activeIconPicker?.type === 'personalInfo' && activeIconPicker.index === idx && (
                  <div className="mb-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
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
                          onClick={() => {
                            handleInputChange("personalInfo", idx, "icon", iconName);
                            setActiveIconPicker(null);
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

                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Label (FR)</label>
                    <input
                      type="text"
                      value={info.label.fr}
                      onChange={(e) => handleInputChange("personalInfo", idx, "label.fr", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Label (EN)</label>
                    <input
                      type="text"
                      value={info.label.en}
                      onChange={(e) => handleInputChange("personalInfo", idx, "label.en", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Value (FR)</label>
                    <input
                      type="text"
                      value={info.value.fr}
                      onChange={(e) => handleInputChange("personalInfo", idx, "value.fr", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Value (EN)</label>
                    <input
                      type="text"
                      value={info.value.en}
                      onChange={(e) => handleInputChange("personalInfo", idx, "value.en", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interests */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LucideIcons.Heart size={20} className="text-gray-600 dark:text-gray-300" />
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Interests</h2>
          </div>
          <button
            onClick={() => handleAddItem("interests")}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-sm"
          >
            <LucideIcons.Plus size={16} />
            Add Interest
          </button>
        </div>
        
        {about.interests.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <LucideIcons.Info size={20} className="mx-auto mb-2" />
            No interests added yet
          </div>
        ) : (
          <div className="space-y-4">
            {about.interests.map((interest, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-700 dark:text-white flex items-center gap-2">
                    <LucideIcons.Circle size={12} className="text-blue-500" />
                    Interest {idx + 1}
                  </h3>
                  <button
                    onClick={() => handleRemoveItem("interests", idx)}
                    className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    <LucideIcons.Trash2 size={14} />
                    Remove
                  </button>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Icon</label>
                  <button 
                    onClick={() => setActiveIconPicker({ type: 'interests', index: idx })}
                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {renderIcon(interest.icon, 16)}
                      <span>{interest.icon || "Select icon"}</span>
                    </div>
                    <LucideIcons.ChevronDown size={16} />
                  </button>
                </div>

                {activeIconPicker?.type === 'interests' && activeIconPicker.index === idx && (
                  <div className="mb-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
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
                          onClick={() => {
                            handleInputChange("interests", idx, "icon", iconName);
                            setActiveIconPicker(null);
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name (FR)</label>
                    <input
                      type="text"
                      value={interest.name.fr}
                      onChange={(e) => handleInputChange("interests", idx, "name.fr", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name (EN)</label>
                    <input
                      type="text"
                      value={interest.name.en}
                      onChange={(e) => handleInputChange("interests", idx, "name.en", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <LucideIcons.Save size={18} />
          Save All Changes
        </button>
      </div>
    </div>
  );
}