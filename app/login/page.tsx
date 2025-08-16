"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorQuery = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid password");
    } else {
      router.push("/admin"); // الصفحة التي تريد الذهاب إليها بعد تسجيل الدخول
    }
  };

  // Show full-page loading if loading
  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {errorQuery && (
          <p className="text-red-500 mb-4 text-center">Session expired or error</p>
        )}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <div className="mb-4">
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <Loading /> : "Login"}
        </button>
      </form>
    </div>
  );
}
