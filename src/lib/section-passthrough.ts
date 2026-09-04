// Lets a pinned section (e.g. CommerceTimeline) tell SectionScroll when to
// step aside — while the pin is active, native scroll + its own
// ScrollTrigger must be the only thing driving scroll, or the two fight.

export const SECTION_PASSTHROUGH_EVENT = "section-passthrough";

export type SectionPassthroughPhase =
  | "enter"
  | "leave"
  | "enterBack"
  | "leaveBack";

export function dispatchSectionPassthrough(phase: SectionPassthroughPhase) {
  window.dispatchEvent(
    new CustomEvent<SectionPassthroughPhase>(SECTION_PASSTHROUGH_EVENT, {
      detail: phase,
    }),
  );
}
