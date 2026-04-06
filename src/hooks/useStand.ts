"use client";

import { useEffect, useState, useCallback } from "react";
import {
  subscribeToStand,
  getOrCreateStand,
  updateStandField,
  updateStandFields,
  subscribeToPhotos,
  subscribeToOccurrences,
  subscribeToFiles,
} from "@/lib/firebase/firestore";
import { StandDocument, PhotoDocument, Occurrence, StandFile } from "@/types/stand";
import { useAuth } from "./useAuth";

export function useStand(standId: number | null) {
  const { user } = useAuth();
  const [stand, setStand] = useState<StandDocument | null>(null);
  const [photos, setPhotos] = useState<PhotoDocument[]>([]);
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [files, setFiles] = useState<StandFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!standId || !user) {
      setStand(null);
      setPhotos([]);
      setOccurrences([]);
      setFiles([]);
      setLoading(false);
      return;
    }

    let initialized = false;

    async function init() {
      await getOrCreateStand(standId!, user!.uid);
      initialized = true;
    }

    init();

    const unsubs = [
      subscribeToStand(standId, (data) => {
        if (data) setStand(data);
        if (initialized) setLoading(false);
      }),
      subscribeToPhotos(standId, setPhotos),
      subscribeToOccurrences(standId, setOccurrences),
      subscribeToFiles(standId, setFiles),
    ];

    return () => unsubs.forEach((u) => u());
  }, [standId, user]);

  const updateField = useCallback(
    async (field: string, value: unknown) => {
      if (!standId || !user) return;
      await updateStandField(standId, field, value, user.uid);
    },
    [standId, user]
  );

  const updateFields = useCallback(
    async (fields: Record<string, unknown>) => {
      if (!standId || !user) return;
      await updateStandFields(standId, fields, user.uid);
    },
    [standId, user]
  );

  return { stand, photos, occurrences, files, loading, updateField, updateFields };
}
