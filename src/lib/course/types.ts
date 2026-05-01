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
    title: "Introduction to Water Challenges and Data Collection",
    summary:
      "Understand India's water crisis, define what a water audit is, and learn the foundations of data integrity for evidence-based solutions.",
    order: 1,
  },
  {
    slug: "measurement",
    title: "Practical Water Measurement and Fieldwork",
    summary:
      "Master volume measurement, flow rate calculation, household data collection, and community interaction to build a complete water picture.",
    order: 2,
  },
  {
    slug: "reporting-action",
    title: "Strategies for Water Conservation and Maintenance",
    summary:
      "Identify wastage, learn repair techniques, explore groundwater recharge and greywater reuse, and design a long-term water legacy.",
    order: 3,
  },
  {
    slug: "future-planning",
    title: "Future Planning, Community Action & Career",
    summary:
      "Forecast future water needs, advocate for change through formal communication, and explore career paths in water management.",
    order: 4,
  },
  {
    slug: "capstone",
    title: "Capstone Projects",
    summary: "Apply your knowledge by completing a comprehensive digital project to solve real-world water challenges.",
    order: 5,
  },
];
