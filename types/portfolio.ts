export type ProjectMediaKind = "image" | "video";

export type ProjectMediaItem = {
  alt?: string;
  kind: ProjectMediaKind;
  label: string;
  note: string;
  poster?: string;
  src?: string;
  title: string;
};

export type ProjectDetailItem = {
  label: string;
  value: string;
};

export type ProjectItem = {
  company: string;
  detailItems: ProjectDetailItem[];
  highlights: string[];
  media: ProjectMediaItem[];
  navHint: string;
  navLabel: string;
  period: string;
  role: string;
  slug: string;
  summary: string;
  tags: string[];
  title: string;
};
