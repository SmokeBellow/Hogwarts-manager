import { useEffect } from "react";

/** Scrolls the window to the top whenever any of the given values change. */
export function useScrollTop(...deps: unknown[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, deps);
}
