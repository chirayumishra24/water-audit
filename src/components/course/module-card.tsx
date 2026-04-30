import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CourseModuleWithChapters } from "@/lib/course/types";

type ModuleCardProps = {
  module: CourseModuleWithChapters;
};

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <div className="glass-panel-strong rounded-lg p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--deep-soft)]">
        Module {String(module.order).padStart(2, "0")}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-[var(--deep)]">{module.title}</h3>
      <p className="mt-2.5 text-sm leading-6 text-[var(--muted)]">{module.summary}</p>

      <div className="mt-5 space-y-2.5">
        {module.chapters.slice(0, 3).map((chapter) => (
          <Link
            key={chapter.slug}
            href={`/${module.order}-${chapter.order}`}
            className="block rounded-lg border border-[rgba(14,165,233,0.12)] bg-[rgba(224,242,254,0.4)] px-3.5 py-2.5 text-sm leading-6 text-[var(--muted)] transition-colors duration-300 hover:bg-[rgba(14,165,233,0.15)] hover:text-[var(--deep)]"
          >
            {chapter.title}
          </Link>
        ))}
      </div>

      <Link
        href={`/${module.order}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]"
      >
        Explore module
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
