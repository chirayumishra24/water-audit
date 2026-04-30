import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-20">
      <div className="glass-panel-strong w-full rounded-lg p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.14em] text-[var(--deep-soft)]">Not found</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--deep)]">
          This course page does not exist.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          The route is outside the generated course structure. Return to the first course page or
          move through the module links in the sidebar.
        </p>
        <Link
          href="/1-0"
          className="mt-8 inline-flex h-11 items-center rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-[#020810]"
        >
          Back to first course page
        </Link>
      </div>
    </main>
  );
}
