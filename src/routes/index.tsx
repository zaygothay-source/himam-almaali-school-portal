import { createFileRoute } from "@tanstack/react-router";
import heroAsset from "../assets/hero.png.asset.json";
import newsAsset from "../assets/news.png.asset.json";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aldridge School | Where Curiosity Is Taught" },
      {
        name: "description",
        content:
          "Aldridge is a K-12 independent school where small classes, real mentorship, and ambitious academics prepare students for what comes next.",
      },
      { property: "og:title", content: "Aldridge School | Where Curiosity Is Taught" },
      {
        property: "og:description",
        content:
          "A K-12 independent school where small classes, real mentorship, and ambitious academics prepare students for what comes next.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <Navigation />
      <Hero />
      <Academics />
      <Admissions />
      <News />
      <Footer />
    </div>
  );
}

function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground font-display text-lg font-semibold leading-none">
            A
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Aldridge</span>
        </a>
        <div className="hidden items-center gap-8 text-sm md:flex">
          <a
            href="#academics"
            className="text-foreground/75 transition-colors hover:text-foreground"
          >
            Academics
          </a>
          <a
            href="#admissions"
            className="text-foreground/75 transition-colors hover:text-foreground"
          >
            Admissions
          </a>
          <a href="#news" className="text-foreground/75 transition-colors hover:text-foreground">
            News
          </a>
          <a href="#visit" className="text-foreground/75 transition-colors hover:text-foreground">
            Visit
          </a>
        </div>
        <a
          href="#admissions"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Apply<span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header id="top" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[1200px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]"></div>
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-14 pt-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="rise font-mono text-xs uppercase tracking-[0.25em] text-primary">
            Est. 1964 &middot; Independent &middot; Estuary, WA
          </p>
          <h1 className="rise mt-5 font-display text-5xl leading-[1.03] tracking-tight text-balance md:text-6xl [animation-delay:80ms]">
            A place where <span className="italic text-primary">curiosity</span> is taught.
          </h1>
          <p className="rise mt-6 max-w-[46ch] text-lg text-pretty text-foreground/70 [animation-delay:160ms]">
            Aldridge is a K&ndash;12 independent school where small classes, real mentorship, and a
            love of the outdoors meet ambitious academics.
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3 [animation-delay:240ms]">
            <a
              href="#academics"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <span className="relative z-10">Explore academics</span>
              <span
                className="relative z-10 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                &rarr;
              </span>
              <span
                aria-hidden="true"
                className="sheen absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-md"
              ></span>
            </a>
            <a
              href="#news"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground/90 transition-colors hover:border-foreground/30"
            >
              Upcoming events
            </a>
          </div>
          <div className="rise mt-10 flex divide-x divide-border text-sm [animation-delay:320ms]">
            <div className="pr-6">
              <span className="font-mono text-base text-primary">14</span>
              <span className="ml-2 text-foreground/60">year program</span>
            </div>
            <div className="px-6">
              <span className="font-mono text-base text-primary">1:9</span>
              <span className="ml-2 text-foreground/60">faculty ratio</span>
            </div>
            <div className="pl-6">
              <span className="font-mono text-base text-primary">98%</span>
              <span className="ml-2 text-foreground/60">to college</span>
            </div>
          </div>
        </div>
        <div className="rise relative [animation-delay:200ms]">
          <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] bg-primary/10 blur-2xl"></div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-card-2 outline-1 -outline-offset-1 outline-black/5 ring-1 ring-white/10">
            <img
              src={heroAsset.url}
              alt="Students collaborating in a warmly lit modern school atrium"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function Academics() {
  return (
    <section id="academics" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">(a) Academics</p>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-balance md:text-5xl">
              Rigorous, personal, alive.
            </h2>
          </div>
          <p className="max-w-[40ch] text-pretty text-foreground/65">
            Three divisions, one promise: every student is known, challenged, and given room to find
            their voice.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <article className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
            <p className="font-mono text-xs text-primary">01</p>
            <h3 className="mt-3 font-display text-2xl tracking-tight">Lower School</h3>
            <p className="mt-2 text-sm text-pretty text-foreground/60">
              Grades K&ndash;5. Playful, project-based foundations that build genuine confidence and
              habits of mind.
            </p>
          </article>
          <article className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
            <p className="font-mono text-xs text-primary">02</p>
            <h3 className="mt-3 font-display text-2xl tracking-tight">Middle School</h3>
            <p className="mt-2 text-sm text-pretty text-foreground/60">
              Grades 6&ndash;8. Inquiry-led cohorts and an advisory system that keeps every student
              seen.
            </p>
          </article>
          <article className="group rounded-2xl border border-border bg-card p-6 ring-1 ring-primary/20 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50">
            <p className="flex items-center gap-2 font-mono text-xs text-primary">
              03{" "}
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                Popular
              </span>
            </p>
            <h3 className="mt-3 font-display text-2xl tracking-tight">Upper School</h3>
            <p className="mt-2 text-sm text-pretty text-foreground/60">
              Grades 9&ndash;12. 24 AP courses, a research seminar, and a capstone studio before
              graduation.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Admissions() {
  return (
    <section id="admissions" className="relative scroll-mt-24 overflow-hidden border-t border-border">
      <div className="pointer-events-none absolute -inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-card p-8 md:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                (b) Admissions
              </p>
              <h2 className="mt-4 font-display text-4xl tracking-tight text-balance md:text-5xl">
                Begin the conversation.
              </h2>
              <p className="mt-4 max-w-[42ch] text-pretty text-foreground/70">
                Applications for the 2026&ndash;27 class open September 1. Attend an open house, or
                book a private tour of campus.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="mailto:hello@aldridge.edu?subject=Campus tour request"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  <span className="relative z-10">Book a tour</span>
                  <span
                    className="relative z-10 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                  <span
                    aria-hidden="true"
                    className="sheen absolute inset-y-0 left-0 w-1/3 bg-white/25 blur-md [animation-delay:2.4s]"
                  ></span>
                </a>
                <a
                  href="#admissions"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground/90 transition-colors hover:border-foreground/30"
                >
                  Read the guide
                </a>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/50">
                Key dates
              </p>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex items-baseline justify-between gap-4">
                  <span className="text-foreground/75">Open house</span>
                  <span className="font-mono text-primary">Sep 12</span>
                </li>
                <li className="flex items-baseline justify-between gap-4">
                  <span className="text-foreground/75">Applications open</span>
                  <span className="font-mono text-primary">Sep 1</span>
                </li>
                <li className="flex items-baseline justify-between gap-4">
                  <span className="text-foreground/75">Decision day</span>
                  <span className="font-mono text-primary">Jan 15</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function News() {
  return (
    <section id="news" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
              (c) On campus
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-balance md:text-5xl">
              News &amp; events
            </h2>
          </div>
          <a
            href="#news"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            All stories<span aria-hidden="true">&rarr;</span>
          </a>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <article className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
            <div className="aspect-[16/9] w-full overflow-hidden bg-card-2 outline-1 -outline-offset-1 outline-black/5">
              <img
                src={newsAsset.url}
                alt="Students working on a hands-on science experiment in a lab"
                width={1280}
                height={800}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <p className="font-mono text-xs text-foreground/50">Research</p>
              <h3 className="mt-3 font-display text-2xl tracking-tight text-balance">
                Students chart the estuary&rsquo;s changing tides
              </h3>
              <p className="mt-2 text-sm text-pretty text-foreground/60">
                A three-year data study by the Upper School science cohort earns a regional science
                award.
              </p>
            </div>
          </article>
          <div className="flex flex-col gap-5">
            <article className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
              <p className="font-mono text-xs text-foreground/50">Event &middot; Oct 24</p>
              <h3 className="mt-3 font-display text-xl tracking-tight">Winter concert in the Hall</h3>
              <p className="mt-2 text-sm text-pretty text-foreground/60">
                The full ensemble performs, 7pm. Doors open at 6:30.
              </p>
            </article>
            <article className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
              <p className="font-mono text-xs text-foreground/50">Milestone</p>
              <h3 className="mt-3 font-display text-xl tracking-tight">Aldridge earns its third honor</h3>
              <p className="mt-2 text-sm text-pretty text-foreground/60">
                Recognized for teaching innovation in the 2025 national review.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="visit" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground font-display text-lg font-semibold leading-none">
              A
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">Aldridge School</span>
          </div>
          <p className="mt-4 max-w-[34ch] text-sm text-pretty text-foreground/60">
            112 Waterline Road, Estuary WA 98001
            <br />
            <a href="tel:2065550142" className="hover:text-foreground">
              (206) 555-0142
            </a>{" "}
            &middot;{" "}
            <a href="mailto:hello@aldridge.edu" className="hover:text-foreground">
              hello@aldridge.edu
            </a>
          </p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/45">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href="#academics" className="text-foreground/75 transition-colors hover:text-foreground">
                Academics
              </a>
            </li>
            <li>
              <a href="#admissions" className="text-foreground/75 transition-colors hover:text-foreground">
                Admissions
              </a>
            </li>
            <li>
              <a href="#news" className="text-foreground/75 transition-colors hover:text-foreground">
                News &amp; events
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/45">
            Get in touch
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href="mailto:hello@aldridge.edu?subject=Campus tour request"
                className="text-foreground/75 transition-colors hover:text-foreground"
              >
                Book a tour
              </a>
            </li>
            <li>
              <a href="#news" className="text-foreground/75 transition-colors hover:text-foreground">
                Gift shop
              </a>
            </li>
            <li>
              <a href="#top" className="text-foreground/75 transition-colors hover:text-foreground">
                Careers
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 pb-8 text-xs text-foreground/45">
        <p>&copy; 2026 Aldridge School. A fictional prototype.</p>
        <div className="flex gap-5">
          <a href="#top" className="transition-colors hover:text-foreground/80">
            Privacy
          </a>
          <a href="#top" className="transition-colors hover:text-foreground/80">
            Accessibility
          </a>
        </div>
      </div>
    </footer>
  );
}
