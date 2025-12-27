"use client";

import { useState, useEffect } from 'react';

export function useHydration() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
