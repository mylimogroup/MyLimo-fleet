const features = [
  {
    title: "Fleet Overview",
    description:
      "Track every vehicle in real time — availability, maintenance status, and location at a glance.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a49.902 49.902 0 0 0-.244-3.716 3.05 3.05 0 0 0-2.12-2.136 47.664 47.664 0 0 0-8.838 0 3.05 3.05 0 0 0-2.12 2.136 49.903 49.903 0 0 0-.244 3.716c-.039.62.469 1.124 1.09 1.124H21M8.25 6.75h7.5M8.25 6.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m0 0V4.875C5.25 3.84 6.09 3 7.125 3H8.25m7.5 3.75h1.125c1.035 0 1.875.84 1.875 1.875V6.75m-9 0V4.875c0-1.036.84-1.875 1.875-1.875"
        />
      </svg>
    ),
  },
  {
    title: "Driver Management",
    description:
      "Assign chauffeurs, monitor schedules, and keep certifications and compliance up to date.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
    ),
  },
  {
    title: "Bookings & Dispatch",
    description:
      "Coordinate reservations, optimize routes, and dispatch the right vehicle for every client.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
        />
      </svg>
    ),
  },
  {
    title: "Analytics & Reports",
    description:
      "Gain insights into utilization, revenue, and performance to grow your chauffeur business.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
  },
];

const stats = [
  { label: "Vehicles tracked", value: "—" },
  { label: "Active drivers", value: "—" },
  { label: "Bookings today", value: "—" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a49.902 49.902 0 0 0-.244-3.716 3.05 3.05 0 0 0-2.12-2.136 47.664 47.664 0 0 0-8.838 0 3.05 3.05 0 0 0-2.12 2.136 49.903 49.903 0 0 0-.244 3.716c-.039.62.469 1.124 1.09 1.124H21M8.25 6.75h7.5M8.25 6.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m0 0V4.875C5.25 3.84 6.09 3 7.125 3H8.25m7.5 3.75h1.125c1.035 0 1.875.84 1.875 1.875V6.75m-9 0V4.875c0-1.036.84-1.875 1.875-1.875"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">
              MyLimo <span className="text-accent">Fleet</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted sm:flex">
            <span className="cursor-default">Dashboard</span>
            <span className="cursor-default">Vehicles</span>
            <span className="cursor-default">Drivers</span>
            <span className="cursor-default">Bookings</span>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-primary px-6 py-20 text-primary-foreground sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-6xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
              Chauffeur Fleet Management
            </p>
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
              Run your limousine fleet with confidence
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/80">
              MyLimo Fleet is a modern platform to manage vehicles, chauffeurs,
              bookings, and dispatch — built for premium transportation
              companies.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                Get Started
              </button>
              <button
                type="button"
                className="rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
              >
                View Demo
              </button>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card px-6 py-12">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-background p-6 text-center"
              >
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need to manage your fleet
              </h2>
              <p className="mt-4 text-muted">
                From dispatch to analytics — one platform for your entire
                chauffeur operation.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-8 transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} MyLimo Fleet. All rights reserved.
          </p>
          <p>Built with Next.js, TypeScript &amp; Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
