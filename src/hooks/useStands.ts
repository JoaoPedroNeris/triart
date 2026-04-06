"use client";

import { useEffect, useState } from "react";
import { subscribeToStands } from "@/lib/firebase/firestore";
import { StandDocument } from "@/types/stand";

export function useStands() {
  const [stands, setStands] = useState<StandDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToStands((data) => {
      setStands(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { stands, loading };
}
