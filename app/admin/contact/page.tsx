"use client";
import { useEffect, useState } from "react";
import Loading from '@/components/Loading';

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
          icon: "",
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
      <h1 className="text-2xl font-bold mb-6">Edit Contact Information</h1>

      {/* Contact Title */}
      <div className="space-y-2">
        <h2 className="font-semibold">Title</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">French</label>
            <input
              type="text"
              value={contact.contactTitle.fr}
              onChange={(e) => handleInputChange("contactTitle", "fr", "", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">English</label>
            <input
              type="text"
              value={contact.contactTitle.en}
              onChange={(e) => handleInputChange("contactTitle", "en", "", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </div>

      {/* Contact Description */}
      <div className="space-y-2">
        <h2 className="font-semibold">Description</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">French</label>
            <textarea
              value={contact.contactDescription.fr}
              onChange={(e) => handleInputChange("contactDescription", "fr", "", e.target.value)}
              className="border p-2 rounded w-full h-32"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">English</label>
            <textarea
              value={contact.contactDescription.en}
              onChange={(e) => handleInputChange("contactDescription", "en", "", e.target.value)}
              className="border p-2 rounded w-full h-32"
            />
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Contact Information</h2>
          <button
            onClick={handleAddContactInfo}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Add Contact Method
          </button>
        </div>
        
        {contact.contactInfo.length === 0 ? (
          <div className="text-gray-500 italic">No contact methods added yet</div>
        ) : (
          contact.contactInfo.map((info, idx) => (
            <div key={idx} className="border p-4 rounded-lg space-y-3 relative">
              <button
                onClick={() => handleRemoveContactInfo(idx)}
                className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
              >
                Remove
              </button>
              
              <div>
                <label className="block text-sm mb-1">Icon</label>
                <input
                  type="text"
                  value={info.icon}
                  onChange={(e) => handleInputChange("contactInfo", idx, "icon", e.target.value)}
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
                    onChange={(e) => handleInputChange("contactInfo", idx, "label.fr", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Label (EN)</label>
                  <input
                    type="text"
                    value={info.label.en}
                    onChange={(e) => handleInputChange("contactInfo", idx, "label.en", e.target.value)}
                    className="border p-2 rounded w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Value</label>
                <input
                  type="text"
                  value={typeof info.value === 'string' ? info.value : ''}
                  onChange={(e) => handleInputChange("contactInfo", idx, "value", e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Link</label>
                <input
                  type="text"
                  value={info.link}
                  onChange={(e) => handleInputChange("contactInfo", idx, "link", e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Button */}
      <div className="space-y-4">
        <h2 className="font-semibold">Contact Button</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Text (FR)</label>
            <input
              type="text"
              value={contact.contactButton.startProject.fr}
              onChange={(e) => handleInputChange("contactButton", "fr", "startProject", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Text (EN)</label>
            <input
              type="text"
              value={contact.contactButton.startProject.en}
              onChange={(e) => handleInputChange("contactButton", "en", "startProject", e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm mb-1">Link</label>
          <input
            type="text"
            value={contact.contactButton.link}
            onChange={(e) => handleInputChange("contactButton", "", "link", e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
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