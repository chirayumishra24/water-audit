import "server-only";

import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/course/mdx-components";
import {
  courseModuleDefinitions,
  type ChapterFrontmatter,
  type ChapterMeta,
  type ChapterPageData,
  type CourseModuleWithChapters,
  type RelatedChapter,
} from "@/lib/course/types";

const chaptersDirectory = path.join(process.cwd(), "content", "chapters");

function assertString(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid chapter frontmatter: "${fieldName}" must be a non-empty string.`);
  }

  return value.trim();
}

function assertStringArray(value: unknown, fieldName: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Invalid chapter frontmatter: "${fieldName}" must be a string array.`);
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

function assertNumber(value: unknown, fieldName: string) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Invalid chapter frontmatter: "${fieldName}" must be a number.`);
  }

  return value;
}

function parseFrontmatter(data: Record<string, unknown>): ChapterFrontmatter {
  return {
    title: assertString(data.title, "title"),
    summary: assertString(data.summary, "summary"),
    moduleSlug: assertString(data.moduleSlug, "moduleSlug"),
    order: assertNumber(data.order, "order"),
    readingTime: assertString(data.readingTime, "readingTime"),
    objectives: assertStringArray(data.objectives, "objectives"),
    practicalTitle: assertString(data.practicalTitle, "practicalTitle"),
    practicalItems: assertStringArray(data.practicalItems, "practicalItems"),
    keyTakeaways: assertStringArray(data.keyTakeaways, "keyTakeaways"),
    relatedSlugs: Array.isArray(data.relatedSlugs)
      ? assertStringArray(data.relatedSlugs, "relatedSlugs")
      : [],
  };
}

const getChapterFileMap = cache(async () => {
  const entries = await fs.readdir(chaptersDirectory);
  const files = entries.filter((entry) => entry.endsWith(".mdx"));

  return files.reduce<Record<string, string>>((map, fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    map[slug] = path.join(chaptersDirectory, fileName);
    return map;
  }, {});
});

const getAllChapterRecords = cache(async () => {
  const fileMap = await getChapterFileMap();
  const entries = await Promise.all(
    Object.entries(fileMap).map(async ([slug, filePath]) => {
      const source = await fs.readFile(filePath, "utf8");
      const { data, content } = matter(source);
      const frontmatter = parseFrontmatter(data);
      const moduleDefinition = courseModuleDefinitions.find(
        (module) => module.slug === frontmatter.moduleSlug,
      );

      if (!moduleDefinition) {
        throw new Error(`Chapter "${slug}" references unknown module "${frontmatter.moduleSlug}".`);
      }

      const meta: ChapterMeta = {
        slug,
        title: frontmatter.title,
        summary: frontmatter.summary,
        moduleSlug: frontmatter.moduleSlug,
        moduleTitle: moduleDefinition.title,
        order: frontmatter.order,
        readingTime: frontmatter.readingTime,
        objectives: frontmatter.objectives,
        practicalTitle: frontmatter.practicalTitle,
        practicalItems: frontmatter.practicalItems,
        keyTakeaways: frontmatter.keyTakeaways,
        relatedSlugs: frontmatter.relatedSlugs,
      };

      return {
        body: content,
        meta,
      };
    }),
  );

  return entries.sort((left, right) => {
    if (left.meta.moduleSlug === right.meta.moduleSlug) {
      return left.meta.order - right.meta.order;
    }

    return left.meta.moduleSlug.localeCompare(right.meta.moduleSlug);
  });
});

export const getCourseModules = cache(async (): Promise<CourseModuleWithChapters[]> => {
  const chapters = await getAllChapterRecords();

  return courseModuleDefinitions.map((module) => ({
    ...module,
    chapters: chapters
      .filter((chapter) => chapter.meta.moduleSlug === module.slug)
      .map((chapter) => chapter.meta)
      .sort((left, right) => left.order - right.order),
  }));
});

export const getCourseModuleBySlug = cache(async (moduleSlug: string) => {
  const modules = await getCourseModules();
  return modules.find((module) => module.slug === moduleSlug) ?? null;
});

const getChapterRecordBySlug = cache(async (chapterSlug: string) => {
  const chapters = await getAllChapterRecords();
  return chapters.find((chapter) => chapter.meta.slug === chapterSlug) ?? null;
});

function buildRelatedChapters(
  allChapters: ChapterMeta[],
  relatedSlugs: string[],
): RelatedChapter[] {
  return relatedSlugs
    .map((slug) => allChapters.find((chapter) => chapter.slug === slug))
    .filter((chapter): chapter is ChapterMeta => Boolean(chapter))
    .map((chapter) => ({
      slug: chapter.slug,
      title: chapter.title,
      summary: chapter.summary,
      moduleSlug: chapter.moduleSlug,
      moduleTitle: chapter.moduleTitle,
    }));
}

export const getChapterPageData = cache(
  async (moduleSlug: string, chapterSlug: string): Promise<ChapterPageData | null> => {
    const record = await getChapterRecordBySlug(chapterSlug);

    if (!record || record.meta.moduleSlug !== moduleSlug) {
      return null;
    }

    const { content } = await compileMDX<ChapterFrontmatter>({
      source: record.body,
      components: mdxComponents,
      options: {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
    });

    const allChapters = (await getAllChapterRecords()).map((chapter) => chapter.meta);

    return {
      ...record.meta,
      content,
      relatedChapters: buildRelatedChapters(allChapters, record.meta.relatedSlugs),
    };
  },
);
