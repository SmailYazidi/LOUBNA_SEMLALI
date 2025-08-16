"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PhotoAdminPage() {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current photo URL
  useEffect(() => {
    const fetchPhotoUrl = async () => {
      try {
        const res = await fetch("/api/photo");
        if (!res.ok) throw new Error("Failed to fetch photo");
        const data = await res.json();
        setPhotoUrl(data.url || null);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotoUrl();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPhotoFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!photoFile) {
      setError("Please select a photo");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("photo", photoFile);

      const res = await fetch("/api/photo", {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update photo");
      }

      const data = await res.json();
      setPhotoUrl(data.url);
      setPhotoFile(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Update Photo</h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Photo (JPG/PNG)</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {photoUrl && (
            <div className="mt-4">
              <p className="text-sm mb-2">Current Photo:</p>
              <img 
                src={photoUrl} 
                alt="Current profile photo" 
                className="max-w-xs max-h-xs rounded-md"
              />
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={isUploading || !photoFile}
          className="w-full sm:w-auto"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : "Update Photo"}
        </Button>
      </div>
    </div>
  );
}