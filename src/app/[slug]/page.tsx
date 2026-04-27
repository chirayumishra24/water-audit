import { notFound } from "next/navigation";
import { ChapterContent } from "@/components/course/chapter-content";
import { CourseShell } from "@/components/course/course-shell";
import { getChapterPageData, getCourseModules } from "@/lib/course/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const modules = await getCourseModules();
  
  return modules.flatMap((module) =>
    module.chapters.map((chapter) => ({
      slug: `${module.order}-${chapter.order}`,
    }))
  );
}

// This handles short links like /1-1, /1-2, /2-1
export default async function ShortLinkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Regex to match "number-number"
  const match = slug.match(/^(\d+)-(\d+)$/);
  
  if (!match) {
    notFound();
  }

  const moduleOrder = parseInt(match[1], 10);
  const chapterOrder = parseInt(match[2], 10);

  const modules = await getCourseModules();
  const targetModule = modules.find(m => m.order === moduleOrder);
  
  if (!targetModule) {
    notFound();
  }

  const targetChapter = targetModule.chapters.find(c => c.order === chapterOrder);
  
  if (!targetChapter) {
    notFound();
  }

  const chapter = await getChapterPageData(targetModule.slug, targetChapter.slug);

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
