import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterContent } from "@/components/course/chapter-content";
import { CourseShell } from "@/components/course/course-shell";
import { getChapterPageData, getCourseModules } from "@/lib/course/content";

export async function generateStaticParams() {
  const modules = await getCourseModules();

  return modules.flatMap((module) =>
    module.chapters.map((chapter) => ({
      moduleSlug: module.slug,
      chapterSlug: chapter.slug,
    })),
  );
}

export async function generateMetadata(
  props: PageProps<"/modules/[moduleSlug]/[chapterSlug]">,
): Promise<Metadata> {
  const { moduleSlug, chapterSlug } = await props.params;
  const chapter = await getChapterPageData(moduleSlug, chapterSlug);

  if (!chapter) {
    return {};
  }

  return {
    title: `${chapter.title} | Water Audit Course`,
    description: chapter.summary,
  };
}

export default async function ChapterPage(
  props: PageProps<"/modules/[moduleSlug]/[chapterSlug]">,
) {
  const { moduleSlug, chapterSlug } = await props.params;
  const chapter = await getChapterPageData(moduleSlug, chapterSlug);

  if (!chapter) {
    notFound();
  }

  return (
    <CourseShell
      currentModuleSlug={chapter.moduleSlug}
      currentChapterSlug={chapter.slug}
    >
      <ChapterContent chapter={chapter} />
    </CourseShell>
  );
}
