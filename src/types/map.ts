export interface StandCoord {
  id: number;
  coords: number[];
  label?: string;
}

export type StandStatus = "none" | "red" | "yellow" | "green";
