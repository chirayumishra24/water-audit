import Link from "next/link";
import type { CourseModuleWithChapters } from "@/lib/course/types";

type CourseSidebarProps = {
  modules: CourseModuleWithChapters[];
  currentModuleSlug?: string;
  currentChapterSlug?: string;
};

export function CourseSidebar({
  currentChapterSlug,
  currentModuleSlug,
  modules,
}: CourseSidebarProps) {
  return (
    <nav className="glass-panel-strong rounded-lg p-4">
      <div className="px-2 pb-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--deep-soft)]">
          Course map
        </p>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Use the module and chapter links to move through the course. No next or previous buttons
          are used in chapter pages.
        </p>
      </div>

      <div className="space-y-3">
        {modules.map((module) => {
          const isActiveModule = module.slug === currentModuleSlug;

          return (
            <div
              key={module.slug}
              className="rounded-lg border border-[rgba(14,165,233,0.1)] bg-[rgba(6,25,42,0.4)] p-2"
            >
              <Link
                href={`/modules/${module.slug}/`}
                className={`block rounded-md px-3 py-3 transition-colors duration-300 ${
                  isActiveModule
                    ? "bg-[rgba(14,165,233,0.2)] text-[var(--deep)] border border-[rgba(34,211,238,0.15)]"
                    : "hover:bg-[rgba(14,165,233,0.08)]"
                }`}
              >
                <p
                  className={`text-xs uppercase tracking-[0.14em] ${
                    isActiveModule ? "text-[rgba(221,245,248,0.8)]" : "text-[var(--deep-soft)]"
                  }`}
                >
                  Module {String(module.order).padStart(2, "0")}
                </p>
                <p className="mt-1 text-sm font-medium">{module.title}</p>
              </Link>

              <div className="mt-2 space-y-1 px-1 pb-1">
                {module.chapters.map((chapter) => {
                  const isActiveChapter = currentChapterSlug === chapter.slug;

                  return (
                    <Link
                      key={chapter.slug}
                      href={`/modules/${module.slug}/${chapter.slug}/`}
                      className={`flex items-start gap-3 rounded-md px-3 py-2.5 text-sm leading-6 transition-colors duration-300 ${
                        isActiveChapter
                          ? "bg-[rgba(14,165,233,0.12)] text-[var(--deep)]"
                          : "text-[var(--muted)] hover:bg-[rgba(14,165,233,0.06)] hover:text-[var(--deep)]"
                      }`}
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-current" />
                      <span>{chapter.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
