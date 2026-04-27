import Link from "next/link";
import type { ReactNode } from "react";
import { Droplets } from "lucide-react";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { MobileCourseNav } from "@/components/course/mobile-course-nav";
import { getCourseModules } from "@/lib/course/content";

type CourseShellProps = {
  children: ReactNode;
  currentModuleSlug?: string;
  currentChapterSlug?: string;
};

export async function CourseShell({
  children,
  currentChapterSlug,
  currentModuleSlug,
}: CourseShellProps) {
  const modules = await getCourseModules();

  return (
    <div className="mx-auto min-h-screen w-full px-4 sm:px-6 lg:px-8">
      <main className="mt-20 w-full relative min-w-0">{children}</main>
    </div>
  );
}
