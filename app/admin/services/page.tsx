"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/LoadingAdmin';
import * as LucideIcons from "lucide-react";

type Service = {
  title: { fr: string; en: string };
  description: { fr: string; en: string };
};

type ServicesData = {
  servicesList: Service[];
};

export default function ServicesAdminPage() {
  const [services, setServices] = useState<ServicesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data);
    } catch (err: any) {
      setError(err.message);
      // Fallback to empty structure
      setServices({ servicesList: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleServiceChange = (index: number, field: "title" | "description", lang: "fr" | "en", value: string) => {
    if (!services) return;
    const updatedList = [...services.servicesList];
    updatedList[index][field][lang] = value;
    setServices({ servicesList: updatedList });
  };

  const addService = () => {
    if (!services) return;
    setServices({
      servicesList: [
        ...services.servicesList,
        { title: { fr: "", en: "" }, description: { fr: "", en: "" } },
      ],
    });
  };

  const removeService = (index: number) => {
    if (!services) return;
    const updatedList = services.servicesList.filter((_, i) => i !== index);
    setServices({ servicesList: updatedList });
  };

  const saveServices = async () => {
    if (!services) return;
    try {
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      });
      if (!res.ok) throw new Error("Failed to save services");
      alert("Services saved successfully!");
      fetchServices();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
  if (!services) return null;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <LucideIcons.Settings size={24} className="text-blue-500" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Services
        </h1>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LucideIcons.List size={20} className="text-gray-600 dark:text-gray-300" />
            <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">Services List</h2>
          </div>
          <button 
            onClick={addService}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition text-sm"
          >
            <LucideIcons.Plus size={16} />
            Add Service
          </button>
        </div>

        {services.servicesList.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            <LucideIcons.Info size={20} className="mx-auto mb-2" />
            No services added yet
          </div>
        ) : (
          <div className="space-y-4">
            {services.servicesList.map((service, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-lg flex items-center gap-2 text-gray-700 dark:text-white">
                    <LucideIcons.Circle size={12} className="text-blue-500" />
                    Service {index + 1}
                  </h3>
                  <button
                    onClick={() => removeService(index)}
                    className="flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    <LucideIcons.Trash2 size={14} />
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title (FR)</label>
                    <input
                      type="text"
                      value={service.title.fr}
                      placeholder="Service title in French"
                      onChange={(e) => handleServiceChange(index, "title", "fr", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title (EN)</label>
                    <input
                      type="text"
                      value={service.title.en}
                      placeholder="Service title in English"
                      onChange={(e) => handleServiceChange(index, "title", "en", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description (FR)</label>
                    <textarea
                      value={service.description.fr}
                      placeholder="Service description in French"
                      onChange={(e) => handleServiceChange(index, "description", "fr", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description (EN)</label>
                    <textarea
                      value={service.description.en}
                      placeholder="Service description in English"
                      onChange={(e) => handleServiceChange(index, "description", "en", e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={saveServices}
          className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <LucideIcons.Save size={18} />
          Save Services
        </button>
      </div>
    </div>
  );
}