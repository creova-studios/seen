import { useCallback, useEffect, useRef, useState } from "react";
import { ServiceError } from "../services/runtime";

export type ResourceState<T> =
  | { status: "loading"; data?: T; error?: undefined }
  | { status: "ready"; data: T; error?: undefined }
  | { status: "error"; data?: T; error: ServiceError | Error };

/**
 * Loads async data with loading / ready / error states and a `retry`.
 * Keeps the last good data while re-loading so screens can show stale
 * content instead of blanking (stale-while-revalidate).
 */
export function useResource<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<ResourceState<T>>({ status: "loading" });
  const seq = useRef(0);

  const run = useCallback(() => {
    const id = ++seq.current;
    setState(prev => ({ status: "loading", data: prev.data }));
    load().then(
      data => id === seq.current && setState({ status: "ready", data }),
      error => id === seq.current && setState(prev => ({ status: "error", error, data: prev.data })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  /** Update data locally (optimistic update) without refetching. */
  const mutate = useCallback((fn: (prev: T | undefined) => T) => {
    setState(prev => ({ status: "ready", data: fn(prev.data) }));
  }, []);

  return { ...state, retry: run, mutate };
}

export function isOffline(error: unknown): boolean {
  return error instanceof ServiceError && error.code === "offline";
}
