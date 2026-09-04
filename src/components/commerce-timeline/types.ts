export type VectorVariant =
  | "vector-a"
  | "vector-b"
  | "vector-c"
  | "vector-e"
  | "vector-f";

export type ContentPosition =
  | "top-left"
  | "upper-left" // top-left, but not flush against the top — vector-a
  | "flush-top-left" // pulled above the wrapper's own box to reach the true top — vector-b
  | "high-left" // flush with the wrapper's own top edge — vector-c
  | "lower-left" // like center-left, but shifted down — vector-e
  | "top"
  | "top-center"
  | "center-left"
  | "center"
  | "bottom-left"
  | "bottom-center";

export type PhaseTheme = "orange" | "red" | "green";

export type TimelineEvent = {
  id: string;
  title: string;
  description: string[];
  vector: VectorVariant;
  contentPosition: ContentPosition;
};

export type TimelineYear = {
  id: string;
  year: number;
  yearLabel: string;
  // A year can have more than one event.
  events: TimelineEvent[];
};

export type TimelinePhase = {
  id: string;
  title: string;
  description: string;
  startYear: number;
  endYear: number;
  theme: PhaseTheme;

  years: TimelineYear[];
};
