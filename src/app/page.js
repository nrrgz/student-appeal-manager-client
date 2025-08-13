"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo");

    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.loggedIn) {
        if (user.role === "student") {
          router.push("/student");
        } else if (user.role === "admin") {
          router.push("/admin");
        } else if (user.role === "reviewer") {
          router.push("/reviewer");
        }
      } else {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
