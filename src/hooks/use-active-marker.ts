"use client";
import { useCallback, useRef } from "react";

/** Tracks a set of id -> element refs and toggles `activeClassName` on exactly one. */
export function useActiveMarker(activeClassName: string) {
  const elements = useRef(new Map<string, HTMLElement>());
  const activeId = useRef<string | null>(null);

  const register = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) elements.current.set(id, el);
      else elements.current.delete(id);
    },
    [],
  );

  const setActive = useCallback(
    (id: string) => {
      if (id === activeId.current) return;

      if (activeId.current) {
        elements.current.get(activeId.current)?.classList.remove(activeClassName);
      }
      elements.current.get(id)?.classList.add(activeClassName);
      activeId.current = id;
    },
    [activeClassName],
  );

  return { register, setActive, elements, activeId };
}
