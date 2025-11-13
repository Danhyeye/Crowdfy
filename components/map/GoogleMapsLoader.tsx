"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

interface GoogleMapsLoaderProps {
  children: React.ReactNode;
  apiKey?: string;
}

export function GoogleMapsLoader({ children, apiKey }: GoogleMapsLoaderProps) {
  const apiKeyParam = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (!apiKeyParam) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-gray-500">
        <p>Google Maps API key is not configured.</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKeyParam} libraries={["places"]}>
      {children}
    </APIProvider>
  );
}

