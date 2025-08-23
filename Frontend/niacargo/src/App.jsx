
import React, { useMemo, useState, useEffect, useRef } from "react";
import NewsFeed from "./components/NewsFeed";

/**************** SEO helper (no extra libs) ****************/
function SEO({ title, description, keywords = "" }) {
  useEffect(() => {
    if (title) document.title = title;
    const ensure = (name, value) => {
      if (!value) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", value);
    };
    ensure("description", description);
    ensure("keywords", keywords);
  }, [title, description, keywords]);
  return null;
}

/**************** Site constants ****************/
const SITE = { name: "NIA Progress", logo: "/logo.svg", baseUrl: "https://niacargo.com/" };

/**************** UI helpers ****************/
export const Container = ({ children, className = "" }) => (
  <div className={`mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);
const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}>{children}</div>
);
const ProgressBar = ({ value }) => (
  <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
);

/**************** Features ****************/
function Countdown({ target }) {
  const [left, setLeft] = useState(() => new Date(target) - Date.now());
  useEffect(() => { const id = setInterval(() => setLeft(new Date(target) - Date.now()), 1000); return () => clearInterval(id); }, [target]);
  if (left <= 0) return <span className="font-semibold text-green-600">Milestone reached!</span>;
  const s = Math.floor(left / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const Tile = ({ label, value }) => (
    <div className="px-4 py-2 bg-white/80 text-gray-900 rounded-xl text-center dark:bg-white/10 dark:text-white">
      <div className="text-2xl font-bold tabular-nums">{String(value).padStart(2, "0")}</div>
      <div className="text-xs uppercase tracking-wide">{label}</div>
    </div>
  );
  return <div className="flex flex-wrap gap-3"><Tile label="Days" value={d}/><Tile label="Hours" value={h}/><Tile label="Mins" value={m}/><Tile label="Secs" value={sec}/></div>;
}
function AdsenseBanner({ slot, style = {} }) {
  const ref = useRef(null);
  useEffect(() => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {} }, []);
  return (<ins ref={ref} className="adsbygoogle block my-6" style={{ display: "block", ...style }} data-ad-client="ca-pub-5056506973875388" data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />);
}
function MapPane({ lat = 28.1006, lng = 77.5536, zoom = 12, title = "Site & Access Map" }) {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  return (
    <Card>
      <div className="text-sm font-semibold mb-2">{title}</div>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl">
        <iframe title={title} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={src} />
      </div>
    </Card>
  );
}

/**************** Demo content ****************/
const TARGET_OPEN_DATE = "2025-09-31T00:00:00+05:30";
const MILESTONES = [
  { id: 1, title: "Runway 1 – Paving & Lighting", percent: 100, status: "Completed", tag: "Airside" },
  { id: 2, title: "ATC Tower – Fit‑Out", percent: 72, status: "On Track", tag: "Airside" },
  { id: 3, title: "Passenger Terminal – Facade", percent: 63, status: "On Track", tag: "Landside" },
  { id: 4, title: "Cargo/Utility Blocks – MEP", percent: 85, status: "on Track", tag: "Support" },
  { id: 5, title: "Approach Roads & Interchange", percent: 90, status: "on Track", tag: "Access" },
  { id: 6, title: "Security & ICT Systems", percent: 55, status: "On Track", tag: "Systems" }
];
const GALLERY = [
  { id: "g1", src: "./gallery/PTB.gif?q=80&w=1600&auto=format&fit=crop", caption: "Terminal roof trusses at sunset" },
  { id: "g2", src: "./gallery/runway.gif?q=80&w=1600&auto=format&fit=crop", caption: "Runway edge lighting" },
  { id: "g3", src: "./gallery/ATC.gif?q=80&w=1600&auto=format&fit=crop", caption: "ATC tower cladding" }
];


/**************** App ****************/
export default function App() {
  const [tab, setTab] = useState("home");
  const overall = useMemo(() => Math.round(MILESTONES.reduce((a, b) => a + b.percent, 0) / MILESTONES.length), []);

  // HARD fix for the top-gap: disable scroll anchoring + force top on tab change
  useEffect(() => { document.documentElement.style["overflow-anchor"] = "none"; return () => { document.documentElement.style["overflow-anchor"] = "auto"; }; }, []);
  useEffect(() => { window.scrollTo(0, 0); document.body.scrollTop = 0; document.documentElement.scrollTop = 0; }, [tab]);

  const seoKeywords = [
    "Noida International Airport updates",
    "Jewar Airport construction progress",
    "NIA project news",
    "NIA Cargo terminal",
    "Noida airport timeline",
    "Noida Airport live news",
    "nouda airport updates", // include common misspelling
    "Uttar Pradesh aviation infrastructure",
    "Greenfield airport India",
    "runway paving lighting",
    "terminal facade glazing",
    "ATC tower fit-out",
    "cargo terminal development",
    "Noida airport photos gallery",
    "Noida International Airport map",
    "opening countdown Jewar airport",
  ].join(", ");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-black dark:text-gray-100 [overflow-anchor:none]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <Container>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              {SITE.logo ? (<img src={SITE.logo} alt="NIA Progress logo" className="h-9 w-9 rounded-xl object-contain" onError={(e)=>{e.currentTarget.style.display='none'}} />) : (<div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600" />)}
              <div>
                <div className="text-sm uppercase tracking-widest text-blue-600">{SITE.name}</div>
                <div className="text-lg font-semibold -mt-1">Progress & Community Hub</div>
              </div>
            </div>
            <nav className="hidden gap-1 sm:flex">
              {["home","progress","updates","gallery","tools","about"].map((key) => (
                <button key={key} onClick={() => setTab(key)} className={`rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800 ${tab===key?"bg-gray-100 dark:bg-gray-800":''}`}>{key[0].toUpperCase()+key.slice(1)}</button>
              ))}
            </nav>
            <button onClick={() => setTab("updates")}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
            <span className="relative z-10">Daily Pulse</span>
            <span className="absolute inset-0 -z-0 h-full w-full bg-white/10 opacity-0 transition-opacity duration-300 hover:opacity-20" />
            </button>
          </div>
        </Container>
      </header>

      {/* HOME — vertical layout with hero, stats, BLOGS, and live news */}
      {tab === "home" && (
        <>
          <SEO title="Noida International Airport Construction Progress | NIA Progress" description="Live Noida International Airport (Jewar) & NIA Cargo tracker: milestones, timeline, photos, daily news, blog, map, and opening countdown." keywords={seoKeywords} />

          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.15),transparent_55%)]" />
            <Container className="relative z-10 grid grid-cols-1 items-center gap-8 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:grid-cols-2">
              <div>
                <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">Noida International Airport — Construction Progress</h1>
                <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Transparent, timely updates on milestones, photos, blogs, maps, and community feedback.</p>
                <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                  <Card><div className="text-sm text-gray-500">Overall completion</div><div className="mt-2 flex items-end gap-3"><div className="text-3xl font-bold">{overall}%</div><span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-100">Live</span></div><div className="mt-3"><ProgressBar value={overall} /></div></Card>
                  <Card><div className="text-sm text-gray-500">Countdown to opening</div><div className="mt-2"><Countdown target={TARGET_OPEN_DATE} /></div></Card>
                  <Card><div className="text-sm text-gray-500">Milestones tracked</div><div className="mt-2 text-3xl font-bold">{MILESTONES.length}</div><div className="mt-1 text-xs text-gray-500">Runway • Terminal • Cargo • ATC</div></Card>
                </div>
              </div>
              <div>
                <Card className="overflow-hidden p-0"><img src={GALLERY[0].src} alt="Terminal construction highlight" className="h-64 w-full object-cover sm:h-96" /><div className="p-5"><div className="text-sm text-gray-500">Latest highlight</div><div className="mt-1 font-medium">Facade glazing hits 60% completion</div><div className="mt-2 text-sm text-gray-600 dark:text-gray-300">South and east elevations progressing ahead of plan.</div></div></Card>
              </div>
            </Container>
          </section>


          {/* DAILY PULSE (live Google Alerts) */}
          <section className="py-10 sm:py-14 border-t border-gray-100 dark:border-gray-800">
            <Container>
              <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-semibold">Daily Pulse — Noida Airport / NIA Cargo News</h2><span className="text-xs text-gray-500">via Google Alerts</span></div>
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
                <div className="lg:col-span-3"><NewsFeed refreshMs={180000} /></div>
                <aside className="lg:col-span-1 space-y-6"><Card><div className="text-sm text-gray-500">Sponsored</div><AdsenseBanner slot="0000000000" /></Card><Card><div className="text-sm text-gray-500">Countdown</div><div className="mt-2"><Countdown target={TARGET_OPEN_DATE} /></div></Card></aside>
              </div>
            </Container>
          </section>
        </>
      )}

      {/* PROGRESS */}
      {tab === "progress" && (
        <>
          <SEO title="Project Progress — Noida International Airport (Jewar)" description="Track runway paving, terminal facade, NIA Cargo, ATC tower fit‑out, approach roads and security systems at Noida Airport." keywords={seoKeywords} />
          <section className="pt-6 pb-12 sm:pt-8 sm:pb-14">
            <Container>
              <div className="mb-6 flex items-center gap-3"><div className="text-sm text-gray-600 dark:text-gray-300">Overall</div><div className="w-56"><ProgressBar value={overall} /></div><div className="text-sm font-semibold">{overall}%</div></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {MILESTONES.map(m => (
                  <Card key={m.id}><div className="flex items-start justify-between gap-4"><div><div className="text-lg font-semibold">{m.title}</div><div className="mt-1 flex items-center gap-2 text-xs text-gray-500"><span className="rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800">{m.tag}</span><span className={`rounded-full px-2 py-0.5 ${m.status==="Completed"?"bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200":m.status==="On Track"?"bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100":"bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100"}`}>{m.status}</span></div></div><div className="w-20 text-right text-sm font-medium">{m.percent}%</div></div><div className="mt-3"><ProgressBar value={m.percent} /></div></Card>
                ))}
              </div>
            </Container>
          </section>
        </>
      )}

      {/* UPDATES (standalone tab) */}
      {tab === "updates" && (
        <>
          <SEO title="Daily News — Noida International Airport (Google Alerts feed)" description="Latest NIA / Noida airport news curated via Google Alerts. Live updates, headlines and quick summaries." keywords={seoKeywords} />
          <section className="pt-6 pb-12 sm:pt-8 sm:pb-14">
            <Container>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <div className="lg:col-span-2"><NewsFeed refreshMs={180000} /></div>
                <div className="lg:col-span-1"><MapPane /></div>
                <aside className="lg:col-span-1 space-y-6"><Card><div className="text-sm text-gray-500">Sponsored</div><AdsenseBanner slot="0000000000" /></Card><Card><div className="text-sm text-gray-500">Countdown</div><div className="mt-2"><Countdown target={TARGET_OPEN_DATE} /></div></Card></aside>
              </div>
            </Container>
          </section>
        </>
      )}

      {/* GALLERY */}
      {tab === "gallery" && (
        <>
          <SEO title="Photo & Video Gallery — Noida International Airport" description="Construction photos and media from Noida International Airport (Jewar): runway lighting, facade glazing, ATC tower and more." keywords={seoKeywords} />
          <section className="pt-6 pb-12 sm:pt-8 sm:pb-14">
            <Container>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{GALLERY.map(g => (<Card key={g.id} className="overflow-hidden p-0"><img src={g.src} alt={g.caption} className="h-52 w-full object-cover" /><div className="p-4 text-sm">{g.caption}</div></Card>))}</div>
            </Container>
          </section>
        </>
      )}

      {/* TOOLS */}
      {tab === "tools" && (
        <>
          <SEO title="Tools — Countdown, Newsletter & Downloads (NIA)" description="Utilities for the NIA project: opening countdown, newsletter signup and media/downloads for Noida International Airport / NIA Cargo." keywords={seoKeywords} />
          <section className="pt-6 pb-12 sm:pt-8 sm:pb-14">
            <Container>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3"><Card><div className="text-lg font-semibold">Countdown to Opening</div><div className="mt-2"><Countdown target={TARGET_OPEN_DATE} /></div></Card><Card><div className="text-lg font-semibold">Newsletter</div><div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Connect to Formspree/Netlify Forms.</div><div className="mt-3 flex gap-2"><input className="w-full rounded-xl border px-3 py-2 text-sm" placeholder="you@example.com" /><button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Subscribe</button></div></Card><Card><div className="text-lg font-semibold">Downloads</div><ul className="mt-3 list-disc pl-6 text-sm"><li><a className="underline" href="#">Monthly Progress PDF (sample)</a></li><li><a className="underline" href="#">Site Access & Safety Checklist</a></li><li><a className="underline" href="#">Media Kit & Logo Pack</a></li></ul></Card></div>
            </Container>
          </section>
        </>
      )}

      {/* ABOUT */}
      {tab === "about" && (
        <>
          <SEO title="About — NIA Progress (Independent tracker)" description="Independent tracker for Noida International Airport (Jewar) and NIA Cargo with daily news, gallery, timeline and more." keywords={seoKeywords} />
          <section className="pt-6 pb-12 sm:pt-8 sm:pb-14">
            <Container>
              <div className="prose prose-gray max-w-none dark:prose-invert"><h2>About this site</h2><p>This site tracks <strong>Noida International Airport (Jewar)</strong> and <strong>NIA Cargo</strong> with real‑time updates on the runway, terminal facade, cargo development, ATC tower fit‑out, approach roads and ICT/security systems. Follow the opening timeline, read curated news and explore the photo gallery.</p></div>
              <p className="mt-6 text-xs text-gray-500">Keywords: Noida International Airport updates, Jewar airport news, NIA Cargo, construction progress, opening date, runway paving, terminal glazing, cargo terminal, ATC tower, approach roads, NIA site photos, Noida airport map, daily news feed, nouda airport.</p>
            </Container>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 text-sm dark:border-gray-800">
        <Container>
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row"><div className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} {SITE.name} — Independent site</div><div className="flex flex-wrap items-center gap-3"><a className="underline" href="#">Privacy</a><a className="underline" href="#">Terms</a><a className="underline" href="#">RSS</a></div></div>
        </Container>
      </footer>
    </div>
  );
}
