import type { FaceRatios } from "@/lib/scoring";

export type Region =
  | "korea"
  | "japan"
  | "china"
  | "southeast_asia"
  | "north_america"
  | "europe"
  | "latin_america";

export interface Celebrity {
  name: string;
  nameKo: string;
  description: string;
  gender: "male" | "female";
  region: Region;
  ratios: FaceRatios;
}
