import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CourseShell } from "@/components/course/course-shell";
import { getCourseModuleBySlug, getCourseModules } from "@/lib/course/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const modules = await getCourseModules();
  return modules.map((module) => ({ moduleSlug: module.slug }));
}

export async function generateMetadata(
  props: PageProps<"/modules/[moduleSlug]">,
): Promise<Metadata> {
  const { moduleSlug } = await props.params;
  const courseModule = await getCourseModuleBySlug(moduleSlug);

  if (!courseModule) {
    return {};
  }

  return {
    title: `${courseModule.title} | Water Audit Course`,
    description: courseModule.summary,
  };
}

export default async function ModulePage(props: PageProps<"/modules/[moduleSlug]">) {
  const { moduleSlug } = await props.params;
  const courseModule = await getCourseModuleBySlug(moduleSlug);

  if (!courseModule) {
    notFound();
  }

  return (
    <CourseShell currentModuleSlug={courseModule.slug}>
      <div className="space-y-8 pb-16">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.14em] text-[var(--deep-soft)]">
              Module {String(courseModule.order).padStart(2, "0")}
            </p>
            <h1 className="text-3xl leading-tight font-semibold text-[var(--deep)] sm:text-4xl">
              {courseModule.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-[var(--muted)]">
              {courseModule.summary}
            </p>
          </div>

          <div className="glass-panel rounded-lg p-5">
            <p className="text-sm uppercase tracking-[0.14em] text-[var(--deep-soft)]">
              In this module
            </p>
            <p className="mt-3 text-2xl font-semibold text-[var(--deep)]">
              {courseModule.chapters.length}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              chapter{courseModule.chapters.length === 1 ? "" : "s"} arranged from simple context
              to applied audit work.
            </p>
          </div>
        </section>

        <section className="section-rule pt-8">
          <div className="grid gap-5">
            {courseModule.chapters.map((chapter) => (
              <a
                key={chapter.slug}
                href={`/${courseModule.order}-${chapter.order}`}
                className="glass-panel-strong group rounded-lg p-5 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.14em] text-[var(--deep-soft)]">
                      Chapter {String(chapter.order).padStart(2, "0")}
                    </p>
                    <h2 className="text-xl font-semibold text-[var(--deep)]">{chapter.title}</h2>
                    <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
                      {chapter.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--deep-soft)]">
                    <span>{chapter.readingTime}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </CourseShell>
  );
}
