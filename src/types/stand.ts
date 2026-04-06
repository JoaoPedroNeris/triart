import { Timestamp } from "firebase/firestore";

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  checkedAt?: Timestamp;
  checkedBy?: string;
}

export interface StandChecklist {
  eletrica: ChecklistItem[];
  marcenaria: ChecklistItem[];
  tapecaria: ChecklistItem[];
  comunicacaoVisual: ChecklistItem[];
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  confirmed: boolean;
  confirmedAt?: Timestamp;
  confirmedBy?: string;
}

export interface DriveLink {
  id: string;
  title: string;
  url: string;
  addedAt: Timestamp;
  addedBy: string;
}

export interface StandTeam {
  marcenaria: string[];
  producao: string[];
}

export interface StandDocument {
  id: number;
  label: string;
  notes: string;
  updatedAt: Timestamp;
  updatedBy: string;
  checklist: StandChecklist;
  materials: Material[];
  team: StandTeam;
  driveLinks: DriveLink[];
}

export interface PhotoDocument {
  id: string;
  url: string;
  storagePath: string;
  caption?: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
}

export interface Occurrence {
  id: string;
  standId: number;
  title: string;
  description: string;
  priority: "leve" | "media" | "extrema";
  status: "aberta" | "resolvida";
  createdAt: Timestamp;
  createdBy: string;
  resolvedAt?: Timestamp;
  resolvedBy?: string;
}

export interface StandFile {
  id: string;
  name: string;
  url: string;
  storagePath: string;
  size: number;
  uploadedAt: Timestamp;
  uploadedBy: string;
}
