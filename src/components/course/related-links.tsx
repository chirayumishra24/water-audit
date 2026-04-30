import Link from "next/link";
import type { ChapterPageData } from "@/lib/course/types";

type RelatedLinksProps = {
  chapter: ChapterPageData;
};

export function RelatedLinks({ chapter }: RelatedLinksProps) {
  if (!chapter.relatedChapters.length) {
    return null;
  }

  return (
      <section className="section-rule mt-12 pt-8">
      <h2 className="text-xl font-semibold text-[var(--deep)]">Related links</h2>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        Continue through the course using contextual references rather than next or previous
        buttons.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {chapter.relatedChapters.map((related) => (
          <Link
            key={related.slug}
            href={`/modules/${related.moduleSlug}/${related.slug}/`}
            className="rounded-lg border border-[rgba(14,165,233,0.12)] bg-[rgba(224,242,254,0.4)] p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[rgba(34,211,238,0.25)]"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--deep-soft)]">
              {related.moduleTitle}
            </p>
            <h3 className="mt-2 text-base font-semibold text-[var(--deep)]">{related.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{related.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
