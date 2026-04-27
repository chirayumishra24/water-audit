import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CourseModuleWithChapters } from "@/lib/course/types";

type ModuleCardProps = {
  module: CourseModuleWithChapters;
};

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <div className="glass-panel-strong rounded-lg p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--deep-soft)]">
        Module {String(module.order).padStart(2, "0")}
      </p>
      <h3 className="mt-4 text-2xl font-semibold text-[var(--deep)]">{module.title}</h3>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{module.summary}</p>

      <div className="mt-6 space-y-3">
        {module.chapters.slice(0, 3).map((chapter) => (
          <Link
            key={chapter.slug}
            href={`/modules/${module.slug}/${chapter.slug}/`}
            className="block rounded-lg border border-[rgba(14,165,233,0.12)] bg-[rgba(224,242,254,0.4)] px-4 py-3 text-sm text-[var(--muted)] transition-colors duration-300 hover:bg-[rgba(14,165,233,0.15)] hover:text-[var(--deep)]"
          >
            {chapter.title}
          </Link>
        ))}
      </div>

      <Link
        href={`/modules/${module.slug}/`}
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]"
      >
        Explore module
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
