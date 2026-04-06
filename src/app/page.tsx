"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/evento");
      } else {
        router.replace("/login");
      }
    });
    return unsubscribe;
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-triart-bg">
      <div className="w-8 h-8 border-2 border-triart-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
