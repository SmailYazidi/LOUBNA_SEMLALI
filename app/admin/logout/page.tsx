"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include", // مهم حتى تنمسح الكوكي
        });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        router.push("/login");
      }
    };

    doLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <p className="text-gray-700 dark:text-gray-200 text-lg">
        Logging out...
      </p>
    </div>
  );
}
