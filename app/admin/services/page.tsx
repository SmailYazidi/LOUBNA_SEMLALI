"use client";

import { useEffect, useState } from "react";
import Loading from '@/components/LoadingAdmin';

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
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Services Admin</h1>

      {services?.servicesList.map((service, index) => (
        <div key={index} className="border p-4 mb-4 rounded-md">
          <h2 className="font-semibold mb-2">Service {index + 1}</h2>

          <input
            type="text"
            value={service.title.fr}
            placeholder="Title FR"
            onChange={(e) => handleServiceChange(index, "title", "fr", e.target.value)}
            className="border p-1 mr-2 mb-2 w-full md:w-1/2"
          />
          <input
            type="text"
            value={service.title.en}
            placeholder="Title EN"
            onChange={(e) => handleServiceChange(index, "title", "en", e.target.value)}
            className="border p-1 mb-2 w-full md:w-1/2"
          />

          <textarea
            value={service.description.fr}
            placeholder="Description FR"
            onChange={(e) => handleServiceChange(index, "description", "fr", e.target.value)}
            className="border p-1 mr-2 mb-2 w-full"
          />
          <textarea
            value={service.description.en}
            placeholder="Description EN"
            onChange={(e) => handleServiceChange(index, "description", "en", e.target.value)}
            className="border p-1 w-full mb-2"
          />

          <button
            onClick={() => removeService(index)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}

      <button onClick={addService} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
        Add Service
      </button>
      <button onClick={saveServices} className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Services
      </button>
    </div>
  );
}
