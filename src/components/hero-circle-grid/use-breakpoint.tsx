import { useEffect, useState } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 640px)");
    const mqTablet = window.matchMedia("(max-width: 1024px)");

    const update = () => {
      setBreakpoint(
        mqMobile.matches ? "mobile" : mqTablet.matches ? "tablet" : "desktop",
      );
    };

    update();
    mqMobile.addEventListener("change", update);
    mqTablet.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqTablet.removeEventListener("change", update);
    };
  }, []);

  return breakpoint;
}
