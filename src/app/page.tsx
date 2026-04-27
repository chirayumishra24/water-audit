import Link from "next/link";
import { ArrowRight, Droplets, FileChartColumnIncreasing, Search } from "lucide-react";
import { CourseShell } from "@/components/course/course-shell";
import { ModuleCard } from "@/components/course/module-card";
import { getCourseModules } from "@/lib/course/content";

const learningPath = [
  {
    title: "See the system clearly",
    description:
      "Start with the purpose of a water audit, the boundaries you define, and the data you need before visiting the site.",
    icon: Search,
  },
  {
    title: "Measure what matters",
    description:
      "Build a water balance, interpret meter readings, and identify the process points where losses become visible.",
    icon: Droplets,
  },
  {
    title: "Turn findings into action",
    description:
      "Prioritize opportunities, frame recommendations, and build an action plan that a facility team can execute.",
    icon: FileChartColumnIncreasing,
  },
];

export default async function Home() {
  const modules = await getCourseModules();

  return (
    <CourseShell>
      <div className="space-y-16 pb-16">
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-6">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
              Water Audit Course
            </p>
            <h1 className="max-w-4xl text-4xl leading-[1.04] font-semibold text-[var(--deep)] sm:text-5xl lg:text-6xl">
              Learn water auditing with a course flow that feels familiar to React learners.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-[var(--muted)]">
              This course shell is built for progressive study: module hubs, chapter routes,
              persistent navigation, practical checkpoints, and a visual system shaped around
              moving water instead of generic documentation chrome.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/modules/${modules[0]?.slug}/`}
                className="inline-flex h-12 items-center gap-2 rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-[#020810] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(34,211,238,0.3)]"
              >
                Start with Module 1
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#modules"
                className="inline-flex h-12 items-center rounded-lg border border-[rgba(34,211,238,0.22)] bg-[rgba(224,242,254,0.6)] px-5 text-sm font-medium text-[var(--deep)] backdrop-blur-sm transition-colors duration-300 hover:bg-[rgba(14,165,233,0.12)] hover:border-[rgba(34,211,238,0.35)]"
              >
                Browse modules
              </a>
            </div>
          </div>


        </section>

        <section className="section-rule pt-12">
          <div className="grid gap-6 lg:grid-cols-3">
            {learningPath.map(({ title, description, icon: Icon }) => (
              <div key={title} className="glass-panel rounded-lg p-6">
                <Icon className="h-5 w-5 text-[var(--accent)]" />
                <h2 className="mt-5 text-xl font-semibold text-[var(--deep)]">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="modules" className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.14em] text-[var(--accent)]">
                Modules
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[var(--deep)]">
                Structured like a practical technical course
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">
              Each module has a dedicated hub page and each chapter has its own reading route.
              That keeps the course easy to expand later when you provide the real water audit
              source material.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {modules.map((module) => (
              <ModuleCard key={module.slug} module={module} />
            ))}
          </div>
        </section>
      </div>
    </CourseShell>
  );
}
