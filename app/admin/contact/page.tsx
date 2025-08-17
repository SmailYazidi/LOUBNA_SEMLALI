"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/LoadingAdmin';
import * as LucideIcons from "lucide-react";

interface ContactInfoItem {
  icon: string;
  label: { fr: string; en: string };
  value: string | { fr: string; en: string };
  link: string;
}

interface ContactData {
  contactTitle: { fr: string; en: string };
  contactDescription: { fr: string; en: string };
  contactInfo: ContactInfoItem[];
  contactButton: {
    startProject: { fr: string; en: string };
    link: string;
  };
}

const defaultContactData: ContactData = {
  contactTitle: { fr: "", en: "" },
  contactDescription: { fr: "", en: "" },
  contactInfo: [],
  contactButton: {
    startProject: { fr: "", en: "" },
    link: ""
  }
};

export default function ContactAdminPage() {
  const [contact, setContact] = useState<ContactData>(defaultContactData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Icon picker state
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);
  const [iconSearch, setIconSearch] = useState("");

  const filteredIcons = Object.keys(LucideIcons)
    .filter(iconName => 
      iconName.toLowerCase().includes(iconSearch.toLowerCase()) && 
      iconName !== "default" && 
      iconName !== "createLucideIcon"
    )
    .slice(0, 50);

  const renderIcon = (iconName: string, size = 20) => {
    if (!iconName || !LucideIcons[iconName as keyof typeof LucideIcons]) {
      return <LucideIcons.Mail size={size} />;
    }
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
    return <IconComponent size={size} />;
  };

  useEffect(() => {
    async function fetchContact() {
      setLoading(true);
      try {
        const res = await fetch("/api/contact");
        if (!res.ok) throw new Error("Failed to fetch contact data");
        
        const data = await res.json();
        setContact(data || defaultContactData);
      } catch (err) {
        console.error("Failed to fetch contact:", err);
        setError("Failed to load contact data");
        setContact(defaultContactData);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, []);

  const handleInputChange = (
    section: string,
    indexOrKey: string | number,
    field: string,
    value: string
  ) => {
    setContact((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      
      if (section === "contactTitle" || section === "contactDescription") {
        (newData[section] as any)[indexOrKey as string] = value;
      } 
      else if (section === "contactButton") {
        if (field === "startProject") {
          (newData.contactButton.startProject as any)[indexOrKey as string] = value;
        } else {
          (newData.contactButton as any)[field] = value;
        }
      }
      else if (section === "contactInfo") {
        const i = indexOrKey as number;
        const path = field.split(".");
        if (path.length === 2) {
          (newData.contactInfo[i] as any)[path[0]][path[1]] = value;
        } else {
          (newData.contactInfo[i] as any)[field] = value;
        }
      }
      
      return newData;
    });
  };

  const handleAddContactInfo = () => {
    setContact(prev => ({
      ...prev,
      contactInfo: [
        ...prev.contactInfo,
        {
          icon: "mail",
          label: { fr: "", en: "" },
          value: "",
          link: ""
        }
      ]
    }));
  };

  const handleRemoveContactInfo = (index: number) => {
    setContact(prev => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        throw new Error("Failed to save");
      }

      alert("Contact information saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    }
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <LucideIcons.AlertCircle size={20} className="text-red-500" />
          <span className="text-red-600 dark:text-red-400">{error}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <LucideIcons.Mail size={24} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Contact Information
        </h1>
      </div>

      {/* Contact Title */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.Type size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Contact Title</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French Title</label>
            <input
              type="text"
              value={contact.contactTitle.fr}
              onChange={(e) => handleInputChange("contactTitle", "fr", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Titre en français"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English Title</label>
            <input
              type="text"
              value={contact.contactTitle.en}
              onChange={(e) => handleInputChange("contactTitle", "en", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Title in English"
            />
          </div>
        </div>
      </div>

      {/* Contact Description */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.FileText size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Contact Description</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">French Description</label>
            <textarea
              value={contact.contactDescription.fr}
              onChange={(e) => handleInputChange("contactDescription", "fr", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[120px]"
              placeholder="Description en français"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">English Description</label>
            <textarea
              value={contact.contactDescription.en}
              onChange={(e) => handleInputChange("contactDescription", "en", "", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[120px]"
              placeholder="Description in English"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LucideIcons.Contact size={20} className="text-gray-600 dark:text-gray-300" />
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Contact Methods</h2>
          </div>
          <button
            onClick={handleAddContactInfo}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-sm"
          >
            <LucideIcons.Plus size={16} />
            Add
          </button>
        </div>
        
        {contact.contactInfo.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <LucideIcons.ContactRound size={24} className="mx-auto mb-2" />
            No contact methods added yet
          </div>
        ) : (
          <div className="space-y-4">
            {contact.contactInfo.map((info, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    {renderIcon(info.icon, 18)}
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      Contact Method #{idx + 1}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveContactInfo(idx)}
                    className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-red-600 transition"
                  >
                    <LucideIcons.Trash2 size={14} />
                    Remove
                  </button>
                </div>
                
                {/* Icon Selection */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Icon</label>
                  <button 
                    type="button"
                    onClick={() => setShowIconPicker(showIconPicker === idx ? null : idx)}
                    className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {renderIcon(info.icon, 16)}
                      <span>{info.icon || "Select icon"}</span>
                    </div>
                    <LucideIcons.ChevronDown size={16} />
                  </button>
                  
                  {showIconPicker === idx && (
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
                              handleInputChange("contactInfo", idx, "icon", iconName);
                              setShowIconPicker(null);
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
                
                {/* Labels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Label (FR)</label>
                    <input
                      type="text"
                      value={info.label.fr}
                      onChange={(e) => handleInputChange("contactInfo", idx, "label.fr", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="Libellé en français"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Label (EN)</label>
                    <input
                      type="text"
                      value={info.label.en}
                      onChange={(e) => handleInputChange("contactInfo", idx, "label.en", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="Label in English"
                    />
                  </div>
                </div>
                
                {/* Value and Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Value</label>
                    <input
                      type="text"
                      value={typeof info.value === 'string' ? info.value : ''}
                      onChange={(e) => handleInputChange("contactInfo", idx, "value", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="Contact value (email, phone, etc.)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Link</label>
                    <input
                      type="text"
                      value={info.link}
                      onChange={(e) => handleInputChange("contactInfo", idx, "link", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      placeholder="mailto:, tel:, https://"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Button */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.MousePointerClick size={20} className="text-gray-600 dark:text-gray-300" />
          <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Contact Button</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Button Text (FR)</label>
            <input
              type="text"
              value={contact.contactButton.startProject.fr}
              onChange={(e) => handleInputChange("contactButton", "fr", "startProject", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Texte du bouton en français"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Button Text (EN)</label>
            <input
              type="text"
              value={contact.contactButton.startProject.en}
              onChange={(e) => handleInputChange("contactButton", "en", "startProject", e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              placeholder="Button text in English"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Button Link</label>
          <input
            type="text"
            value={contact.contactButton.link}
            onChange={(e) => handleInputChange("contactButton", "", "link", e.target.value)}
            className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            placeholder="Button destination URL"
          />
        </div>

        {/* Button Preview */}
        {(contact.contactButton.startProject.fr || contact.contactButton.startProject.en) && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400 block mb-2">Button Preview:</span>
            <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
              <LucideIcons.Send size={16} />
              {contact.contactButton.startProject.en || contact.contactButton.startProject.fr}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <LucideIcons.Save size={18} />
          Save Contact Information
        </button>
      </div>
    </div>
  );
}