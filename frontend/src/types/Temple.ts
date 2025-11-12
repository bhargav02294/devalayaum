// strict, typed multilingual definitions for Temple
export type LangCode = "en" | "hi" | "mr" | "ta" | "te" | "bn";

export type Multilingual = Partial<Record<LangCode, string>>;

export interface NearbyPlace {
  name: Multilingual;
  description: Multilingual;
}

export interface Temple {
  _id?: string;
  name: Multilingual;
  location: Multilingual;
  about?: Multilingual;
  images?: string[]; // Cloudinary URLs
  mainDeity?: Multilingual;
  deityDescription?: Multilingual;
  significance?: Multilingual;
  history?: Multilingual;
  architecture?: Multilingual;
  builderOrTrust?: Multilingual;
  consecrationDate?: string;
  darshanTiming?: Multilingual;
  aartiTimings?: {
    morning?: string;
    shringar?: string;
    shayan?: string;
  };
  specialPoojaInfo?: Multilingual;
  dressCode?: Multilingual;
  entryRules?: Multilingual;
  prohibitedItems?: string[];
  lockerFacility?: boolean;
  howToReach?: Multilingual;
  nearestAirport?: Multilingual;
  nearestRailway?: Multilingual;
  roadConnectivity?: Multilingual;
  mapLocation?: { lat?: number; lng?: number };
  nearbyPlaces?: NearbyPlace[];
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
}
