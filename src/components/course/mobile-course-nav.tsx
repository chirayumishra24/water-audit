"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { CourseSidebar } from "@/components/course/course-sidebar";
import type { CourseModuleWithChapters } from "@/lib/course/types";

type MobileCourseNavProps = {
  modules: CourseModuleWithChapters[];
  currentModuleSlug?: string;
  currentChapterSlug?: string;
};

export function MobileCourseNav({
  currentChapterSlug,
  currentModuleSlug,
  modules,
}: MobileCourseNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[rgba(14,165,233,0.18)] bg-[rgba(6,25,42,0.6)] text-[var(--deep)]"
        aria-expanded={open}
        aria-label={open ? "Close course navigation" : "Open course navigation"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-[4.9rem] px-4 sm:px-6">
          <div className="glass-panel-strong max-h-[70vh] overflow-y-auto rounded-lg p-3 shadow-[0_24px_64px_rgba(18,53,64,0.18)]">
            <CourseSidebar
              currentChapterSlug={currentChapterSlug}
              currentModuleSlug={currentModuleSlug}
              modules={modules}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
