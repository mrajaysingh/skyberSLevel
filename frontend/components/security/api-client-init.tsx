"use client";

import { useEffect } from "react";
import "@/lib/api-client";

/**
 * This component initializes the API client fetch interceptor
 * It should be mounted early in the app to catch all 401 responses
 */
export function ApiClientInit() {
  useEffect(() => {
    // The api-client module will automatically override fetch when imported
    // This component just ensures it's loaded
  }, []);

  return null;
}

