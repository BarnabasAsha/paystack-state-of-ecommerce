export type VectorVariant =
  | "vector-a"
  | "vector-b"
  | "vector-c"
  | "vector-d"
  | "vector-e"
  | "vector-f";

export type ContentPosition =
  | "top-left"
  | "top"
  | "top-center"
  | "center-left"
  | "center"
  | "bottom-left"
  | "bottom-center";

export type TimelineEvent = {
  id: string;
  year: number;
  yearLabel: string;
  title: string;
  description: string[];
  vector: VectorVariant;
  contentPosition: ContentPosition;
};

export type TimelinePhase = {
  id: string;
  title: string;
  description: string;
  startYear: number;
  endYear: number;
  theme: "orange" | "red" | "green";

  events: TimelineEvent[];
};
