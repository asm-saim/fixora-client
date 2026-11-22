"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

/**
 * Loads a protected API path with the user's token and reloads when the path changes.
 * The previous data stays on screen while the next page loads, so tables do not flash empty.
 * A slow response for an old path can never overwrite a newer one.
 */
export function useAuthedApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const latest = useRef(0);

  const load = useCallback(async () => {
    const id = ++latest.current;
    setLoading(true);
    try {
      const result = await api<T>(path, { auth: true });
      if (id !== latest.current) return;
      setData(result);
      setError(null);
    } catch (e) {
      if (id !== latest.current) return;
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      if (id === latest.current) setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, error, loading, reload: load, setData };
}
