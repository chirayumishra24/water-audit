import type { ReactNode } from "react";

export type CourseModuleDefinition = {
  slug: string;
  title: string;
  summary: string;
  order: number;
};

export type ChapterFrontmatter = {
  title: string;
  summary: string;
  moduleSlug: string;
  order: number;
  readingTime: string;
  objectives: string[];
  practicalTitle: string;
  practicalItems: string[];
  keyTakeaways: string[];
  relatedSlugs: string[];
};

export type ChapterMeta = ChapterFrontmatter & {
  slug: string;
  moduleTitle: string;
};

export type CourseModuleWithChapters = CourseModuleDefinition & {
  chapters: ChapterMeta[];
};

export type RelatedChapter = {
  slug: string;
  title: string;
  summary: string;
  moduleSlug: string;
  moduleTitle: string;
};

export type ChapterPageData = ChapterMeta & {
  content: ReactNode;
  relatedChapters: RelatedChapter[];
};

export const courseModuleDefinitions: CourseModuleDefinition[] = [
  {
    slug: "foundations",
    title: "Foundations of Water Auditing",
    summary:
      "Establish what a water audit is, why it matters, and how to define the operating boundaries before any data collection starts.",
    order: 1,
  },
  {
    slug: "measurement",
    title: "Measurement and Loss Detection",
    summary:
      "Translate facility data into a usable water balance, then connect field observations to measurable losses and inefficiencies.",
    order: 2,
  },
  {
    slug: "reporting-action",
    title: "Reporting and Action Planning",
    summary:
      "Turn observations into prioritized recommendations, implementation pathways, and a practical plan for the site team.",
    order: 3,
  },
  {
    slug: "future-planning",
    title: "Future Planning & Forecasting",
    summary:
      "Use data modeling to predict future water requirements for growing communities and plan sustainable infrastructure.",
    order: 4,
  },
];
