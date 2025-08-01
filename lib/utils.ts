import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

export async function getUserLocation(): Promise<GeolocationPosition | null> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        console.error("Error getting location:", error.message);
        resolve(null);
      }
    );
  });
}