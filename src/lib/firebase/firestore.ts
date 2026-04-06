import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  onSnapshot,
  addDoc,
  deleteDoc,
  orderBy,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "./config";
import { StandDocument, Occurrence, PhotoDocument, StandFile } from "@/types/stand";
import { UserProfile } from "@/types/auth";
import { getDefaultChecklist } from "@/data/checklistTemplates";

// ---- Users ----
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

// ---- Stands ----
function getDefaultStand(id: number): Omit<StandDocument, "updatedAt" | "updatedBy"> {
  return {
    id,
    label: `Stand ${id}`,
    notes: "",
    checklist: getDefaultChecklist(),
    materials: [],
    team: { marcenaria: [], producao: [] },
    driveLinks: [],
  };
}

export async function getOrCreateStand(standId: number, userId: string): Promise<StandDocument> {
  const ref = doc(db, "stands", `stand_${standId}`);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return { ...snap.data() } as StandDocument;
  }
  const data: StandDocument = {
    ...getDefaultStand(standId),
    updatedAt: Timestamp.now(),
    updatedBy: userId,
  };
  await setDoc(ref, data);
  return data;
}

export async function updateStandField(
  standId: number,
  field: string,
  value: unknown,
  userId: string
) {
  const ref = doc(db, "stands", `stand_${standId}`);
  await updateDoc(ref, {
    [field]: value,
    updatedAt: Timestamp.now(),
    updatedBy: userId,
  });
}

export async function updateStandFields(
  standId: number,
  fields: Record<string, unknown>,
  userId: string
) {
  const ref = doc(db, "stands", `stand_${standId}`);
  await updateDoc(ref, {
    ...fields,
    updatedAt: Timestamp.now(),
    updatedBy: userId,
  });
}

export function subscribeToStands(callback: (stands: StandDocument[]) => void) {
  const q = query(collection(db, "stands"));
  return onSnapshot(q, (snapshot) => {
    const stands = snapshot.docs.map((d) => d.data() as StandDocument);
    callback(stands);
  });
}

export function subscribeToStand(standId: number, callback: (stand: StandDocument | null) => void) {
  const ref = doc(db, "stands", `stand_${standId}`);
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? (snap.data() as StandDocument) : null);
  });
}

// ---- Photos ----
export function subscribeToPhotos(standId: number, callback: (photos: PhotoDocument[]) => void) {
  const q = query(
    collection(db, "stands", `stand_${standId}`, "photos"),
    orderBy("uploadedAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const photos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as PhotoDocument));
    callback(photos);
  });
}

export async function addPhoto(standId: number, data: Omit<PhotoDocument, "id">) {
  return addDoc(collection(db, "stands", `stand_${standId}`, "photos"), data);
}

export async function deletePhoto(standId: number, photoId: string) {
  return deleteDoc(doc(db, "stands", `stand_${standId}`, "photos", photoId));
}

// ---- Occurrences ----
export function subscribeToOccurrences(standId: number, callback: (occs: Occurrence[]) => void) {
  const q = query(
    collection(db, "stands", `stand_${standId}`, "occurrences"),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const occs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Occurrence));
    callback(occs);
  });
}

export async function addOccurrence(standId: number, data: Omit<Occurrence, "id">) {
  return addDoc(collection(db, "stands", `stand_${standId}`, "occurrences"), data);
}

export async function resolveOccurrence(standId: number, occurrenceId: string, userId: string) {
  return updateDoc(doc(db, "stands", `stand_${standId}`, "occurrences", occurrenceId), {
    status: "resolvida",
    resolvedAt: Timestamp.now(),
    resolvedBy: userId,
  });
}

export async function getAllOccurrences(): Promise<Occurrence[]> {
  const standsSnap = await getDocs(collection(db, "stands"));
  const allOccs: Occurrence[] = [];
  for (const standDoc of standsSnap.docs) {
    const occsSnap = await getDocs(
      query(collection(db, "stands", standDoc.id, "occurrences"), orderBy("createdAt", "desc"))
    );
    occsSnap.docs.forEach((d) => {
      allOccs.push({ id: d.id, ...d.data() } as Occurrence);
    });
  }
  return allOccs;
}

// ---- Files ----
export function subscribeToFiles(standId: number, callback: (files: StandFile[]) => void) {
  const q = query(
    collection(db, "stands", `stand_${standId}`, "files"),
    orderBy("uploadedAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    const files = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as StandFile));
    callback(files);
  });
}

export async function addFile(standId: number, data: Omit<StandFile, "id">) {
  return addDoc(collection(db, "stands", `stand_${standId}`, "files"), data);
}

export async function deleteFile(standId: number, fileId: string) {
  return deleteDoc(doc(db, "stands", `stand_${standId}`, "files", fileId));
}
