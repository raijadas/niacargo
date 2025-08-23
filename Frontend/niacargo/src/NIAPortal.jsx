import React, { useMemo, useState, useEffect } from "react";

// NIA Project Progress — Single‑file React app
// Styling: Tailwind CSS (assumed available in host), clean UI, mobile‑first
// Replace sample data with real milestones, updates, and media.

// ---------------------- Helper Components ----------------------
function Container({ children }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

function Section({ title, subtitle, children, action }) {
  return (
    <section className="py-10 sm:py-12">
      <Container>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
            )}
          </div>
          {action}
        </div>
        {children}
      </Container>
    </section>
  );
}

function Badge({ children, color = "gray" }) {
  const map = {
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    green: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100",
    red: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-100",
    violet: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-100",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[color]}`}>{children}</span>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
      <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}>
      {children}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input {...props} className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 ${className}`} />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea {...props} className={`w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 ${className}`} />
  );
}

function Button({ children, className = "", ...props }) {
  return (
    <button {...props} className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all hover:shadow ${className} bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60`}>
      {children}
    </button>
  );
}

function GhostButton({ children, className = "", ...props }) {
  return (
    <button {...props} className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${className}`}>
      {children}
    </button>
  );
}

// ---------------------- Sample Data ----------------------
const TARGET_OPEN_DATE = new Date("2025-10-31T00:00:00+05:30"); // edit as needed

const initialMilestones = [
  { id: 1, title: "Runway 1 – Paving & Lighting", start: "2024-10-01", end: "2025-05-15", status: "Completed", percent: 100, tag: "Airside" },
  { id: 2, title: "ATC Tower – Fit‑Out", start: "2025-02-01", end: "2025-08-15", status: "On Track", percent: 72, tag: "Airside" },
  { id: 3, title: "Passenger Terminal – Facade", start: "2025-01-10", end: "2025-09-30", status: "On Track", percent: 63, tag: "Landside" },
  { id: 4, title: "Cargo/Utility Blocks – MEP", start: "2025-03-01", end: "2025-09-20", status: "At Risk", percent: 48, tag: "Support" },
  { id: 5, title: "Approach Roads & Interchange", start: "2024-12-05", end: "2025-08-31", status: "Completed", percent: 100, tag: "Access" },
  { id: 6, title: "Security & ICT Systems", start: "2025-04-01", end: "2025-10-10", status: "On Track", percent: 55, tag: "Systems" },
];

const initialUpdates = [
  { id: 101, date: "2025-08-18", title: "Facade glazing hits 60% completion", body: "South and east elevations progressing ahead of plan.", tags: ["terminal", "facade"], media: "" },
  { id: 102, date: "2025-08-10", title: "Taxiway centerline lights tested", body: "First night tests successful; CAT‑I calibration next week.", tags: ["airside", "lighting"], media: "" },
  { id: 103, date: "2025-07-28", title: "Approach road landscaping complete", body: "Native species planted; irrigation in commissioning.", tags: ["roads", "landscape"], media: "" },
];

const sampleGallery = [
  { id: "g1", src: "https://images.unsplash.com/photo-1549376546-013b1493ebca?q=80&w=1600&auto=format&fit=crop", caption: "Terminal roof trusses at sunset" },
  { id: "g2", src: "https://images.unsplash.com/photo-1529078155058-5d716f45d604?q=80&w=1600&auto=format&fit=crop", caption: "Runway edge lighting" },
  { id: "g3", src: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?q=80&w=1600&auto=format&fit=crop", caption: "ATC tower cladding" },
  { id: "g4", src: "https://images.unsplash.com/photo-1502031377224-4696c790d1fb?q=80&w=1600&auto=format&fit=crop", caption: "Road interchange and signage" },
];

// ---------------------- Utilities ----------------------
function daysUntil(date) {
  const ms = date.getTime() - new Date().getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function percentOverall(arr) {
  if (!arr.length) return 0;
  const avg = arr.reduce((a, b) => a + (b.percent || 0), 0) / arr.length;
  return Math.round(avg);
}

function statusColor(status) {
  if (status === "Completed") return "green";
  if (status === "On Track") return "blue";
  if (status === "At Risk") return "amber";
  if (status === "Delayed") return "red";
  return "gray";
}

// ---------------------- Main App ----------------------
export default function NIAPortal() {
  const [tab, setTab] = useState("home");
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem("nia_milestones");
    return saved ? JSON.parse(saved) : initialMilestones;
  });
  const [updates, setUpdates] = useState(() => {
    const saved = localStorage.getItem("nia_updates");
    return saved ? JSON.parse(saved) : initialUpdates;
  });
  const [query, setQuery] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [poll, setPoll] = useState(() => {
    const saved = localStorage.getItem("nia_poll");
    return saved ? JSON.parse(saved) : { question: "Which update do you want next?", options: ["Live cam feed", "Weekly drone shots", "Budget breakdown", "Jobs & tenders"], votes: [0, 0, 0, 0] };
  });

  const isAdmin = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("admin") === "1";

  useEffect(() => {
    localStorage.setItem("nia_milestones", JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem("nia_updates", JSON.stringify(updates));
  }, [updates]);

  useEffect(() => {
    localStorage.setItem("nia_poll", JSON.stringify(poll));
  }, [poll]);

  const overall = useMemo(() => percentOverall(milestones), [milestones]);
  const days = useMemo(() => daysUntil(TARGET_OPEN_DATE), []);

  const filteredUpdates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return updates;
    return updates.filter(u => [u.title, u.body, ...(u.tags||[])].join(" ").toLowerCase().includes(q));
  }, [query, updates]);

  function addMilestone(m) {
    setMilestones(prev => [{ id: Date.now(), ...m }, ...prev]);
  }
  function addUpdate(u) {
    setUpdates(prev => [{ id: Date.now(), ...u }, ...prev]);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-black dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <Container>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600" />
              <div>
                <div className="text-sm uppercase tracking-widest text-blue-600">NIA PROJECT</div>
                <div className="text-lg font-semibold -mt-1">Progress & Community Hub</div>
              </div>
            </div>
            <nav className="hidden gap-1 sm:flex">
              {[
                ["home", "Home"],
                ["progress", "Progress"],
                ["updates", "Updates"],
                ["gallery", "Media"],
                ["map", "Map"],
                ["tools", "Tools"],
                ["community", "Community"],
                ["about", "About"],
              ].map(([key, label]) => (
                <GhostButton key={key} onClick={() => setTab(key)} className={`${tab===key?"bg-gray-100 dark:bg-gray-800":""}`}>{label}</GhostButton>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <GhostButton onClick={() => setTab("contact")} className="hidden sm:inline-flex">Contact</GhostButton>
              <Button onClick={() => setTab("updates")}>Daily Pulse</Button>
            </div>
          </div>
        </Container>
      </header>

      {/* Hero */}
      {tab === "home" && (
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.12),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.12),transparent_55%)]" />
          <Container>
            <div className="relative z-10 grid grid-cols-1 items-center gap-8 py-14 sm:py-20 lg:grid-cols-2">
              <div>
                <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">Noida International Airport — Construction Progress</h1>
                <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Transparent, timely updates on milestones, photos, maps, and community feedback. Follow the journey to opening day.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={() => setTab("progress")}>See Progress</Button>
                  <GhostButton onClick={() => setTab("gallery")}>View Media</GhostButton>
                </div>
                <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                  <Card>
                    <div className="text-sm text-gray-500">Overall completion</div>
                    <div className="mt-2 flex items-end gap-3">
                      <div className="text-3xl font-bold">{overall}%</div>
                      <Badge color="blue">Live</Badge>
                    </div>
                    <div className="mt-3"><ProgressBar value={overall} /></div>
                  </Card>
                  <Card>
                    <div className="text-sm text-gray-500">Days to target opening</div>
                    <div className="mt-2 text-3xl font-bold">{days}</div>
                    <div className="mt-1 text-xs text-gray-500">Target: {TARGET_OPEN_DATE.toDateString()}</div>
                  </Card>
                  <Card>
                    <div className="text-sm text-gray-500">Milestones tracked</div>
                    <div className="mt-2 text-3xl font-bold">{milestones.length}</div>
                    <div className="mt-1 text-xs text-gray-500">Airside • Landside • Systems</div>
                  </Card>
                </div>
              </div>
              <div>
                <Card className="overflow-hidden p-0">
                  <img src={sampleGallery[0].src} alt="Hero" className="h-64 w-full object-cover sm:h-96" />
                  <div className="p-5">
                    <div className="text-sm text-gray-500">Latest highlight</div>
                    <div className="mt-1 font-medium">{initialUpdates[0].title}</div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">{initialUpdates[0].body}</div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Progress */}
      {tab === "progress" && (
        <Section title="Project Progress" subtitle="Track milestones across workstreams in real time.">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600 dark:text-gray-300">Overall</div>
              <div className="w-56"><ProgressBar value={overall} /></div>
              <div className="text-sm font-semibold">{overall}%</div>
            </div>
            {isAdmin && (
              <MilestoneForm onAdd={addMilestone} />
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {milestones.map(m => (
              <Card key={m.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">{m.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span>{m.start} → {m.end}</span>
                      <Badge color={statusColor(m.status)}>{m.status}</Badge>
                      <Badge>{m.tag}</Badge>
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm font-medium">{m.percent}%</div>
                </div>
                <div className="mt-3"><ProgressBar value={m.percent} /></div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Updates */}
      {tab === "updates" && (
        <Section title="Daily Pulse" subtitle="Bite‑size construction updates and announcements" action={<div className="flex gap-2"><Input placeholder="Search updates" value={query} onChange={e=>setQuery(e.target.value)} className="w-56" />{isAdmin && <Button onClick={()=>{const t=prompt('Title'); if(!t) return; const b=prompt('Details')||''; const d=new Date().toISOString().slice(0,10); addUpdate({ title:t, body:b, date:d, tags:[] });}}>Quick add</Button>}</div>}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredUpdates.map(u => (
              <Card key={u.id}>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">{u.date}</div>
                  <div className="flex gap-1">{(u.tags||[]).map(t => <Badge key={t}>{t}</Badge>)}</div>
                </div>
                <div className="mt-2 text-lg font-semibold">{u.title}</div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{u.body}</p>
                {u.media && (
                  <div className="mt-3 overflow-hidden rounded-xl">
                    <img src={u.media} alt="update media" className="h-40 w-full object-cover"/>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Media */}
      {tab === "gallery" && (
        <Section title="Media Gallery" subtitle="Photos & videos from site.">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sampleGallery.map(g => (
              <Card key={g.id} className="overflow-hidden p-0">
                <img src={g.src} alt={g.caption} className="h-52 w-full object-cover" />
                <div className="p-4 text-sm">{g.caption}</div>
              </Card>
            ))}
            <Card>
              <div className="aspect-video overflow-hidden rounded-xl">
                <iframe className="h-full w-full" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </div>
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">Embed weekly site walk‑throughs or livestreams here.</div>
            </Card>
          </div>
        </Section>
      )}

      {/* Map */}
      {tab === "map" && (
        <Section title="Project Map" subtitle="Location and access">
          <Card>
            <div className="aspect-video w-full overflow-hidden rounded-xl">
              <iframe
                title="NIA Map"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=28.1006,77.5536&z=12&output=embed`}
              />
            </div>
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">Tip: replace with a custom map (construction gates, logistics yard, diversions).</div>
          </Card>
        </Section>
      )}

      {/* Tools */}
      {tab === "tools" && (
        <Section title="Engagement Tools" subtitle="Interactive widgets to keep visitors coming back.">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <div className="text-lg font-semibold">Countdown to Opening</div>
              <div className="mt-2 text-4xl font-bold">{days}</div>
              <div className="mt-1 text-xs text-gray-500">days remaining (target {TARGET_OPEN_DATE.toDateString()})</div>
            </Card>

            <Card>
              <div className="text-lg font-semibold">Poll</div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{poll.question}</div>
              <div className="mt-3 space-y-2">
                {poll.options.map((opt, i) => (
                  <button key={i} onClick={() => {
                    const v = [...poll.votes]; v[i] = (v[i]||0)+1; setPoll({...poll, votes: v});
                  }} className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-3 text-left text-sm hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900">
                    <span>{opt}</span>
                    <Badge color="blue">{poll.votes[i]||0}</Badge>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <div className="text-lg font-semibold">Newsletter</div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Get weekly highlights in your inbox.</div>
              <div className="mt-3 flex gap-2">
                <Input type="email" placeholder="you@example.com" value={newsletterEmail} onChange={e=>setNewsletterEmail(e.target.value)} />
                <Button onClick={()=>{ if(!newsletterEmail.includes("@")) return alert("Enter a valid email"); const list = JSON.parse(localStorage.getItem("nia_newsletter")||"[]"); list.push({email:newsletterEmail, ts: Date.now()}); localStorage.setItem("nia_newsletter", JSON.stringify(list)); setNewsletterEmail(""); alert("Subscribed! (Demo — connect to Formspree/Netlify Forms)"); }}>Subscribe</Button>
              </div>
              <div className="mt-2 text-xs text-gray-500">Connect to Netlify Forms, Formspree, or your backend for production.</div>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <div className="text-lg font-semibold">Downloads</div>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm">
                <li><a className="underline" href="#">Monthly Progress PDF (sample)</a></li>
                <li><a className="underline" href="#">Site Access & Safety Checklist</a></li>
                <li><a className="underline" href="#">Media Kit & Logo Pack</a></li>
              </ul>
            </Card>
            <Card>
              <div className="text-lg font-semibold">RSS / Web Push</div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Expose an RSS feed for updates; add web‑push for breaking milestones.</p>
              <ul className="mt-3 list-disc pl-6 text-sm text-gray-600 dark:text-gray-300">
                <li>RSS: /updates.xml</li>
                <li>Web Push: OneSignal or Firebase Cloud Messaging</li>
              </ul>
            </Card>
          </div>
        </Section>
      )}

      {/* Community */}
      {tab === "community" && (
        <Section title="Community" subtitle="Feedback, Q&A, and discussions">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card>
              <div className="text-lg font-semibold">Ask a Question</div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Hook this form to Formspree / Netlify Forms.</p>
              <div className="mt-3 space-y-3">
                <Input placeholder="Name" />
                <Input placeholder="Email" />
                <Textarea rows={4} placeholder="Your question or suggestion" />
                <Button>Submit</Button>
              </div>
            </Card>
            <Card className="lg:col-span-2">
              <div className="text-lg font-semibold">Comments</div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Embed Giscus (GitHub Discussions) or Utterances for free, privacy‑friendly comments.</p>
              <div className="mt-3 rounded-xl border border-dashed p-6 text-sm text-gray-500 dark:border-gray-700">Drop the embed script here after configuring your repo.</div>
            </Card>
          </div>
        </Section>
      )}

      {/* About */}
      {tab === "about" && (
        <Section title="About this site" subtitle="Independent progress tracker & engagement hub">
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <p>This website curates publicly visible construction progress, community observations, and media about the Noida International Airport project. It’s not an official portal and does not represent any government or corporate entity.</p>
            <ul>
              <li>Purpose: transparency, education, and community engagement</li>
              <li>Data sources: site observations, public releases, community submissions</li>
              <li>Contact: hello@yourdomain.in</li>
            </ul>
          </div>
        </Section>
      )}

      {/* Contact */}
      {tab === "contact" && (
        <Section title="Contact" subtitle="Reach out for corrections, media, or collaboration">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <div className="text-lg font-semibold">Email</div>
              <div className="mt-1 text-sm">hello@yourdomain.in</div>
            </Card>
            <Card>
              <div className="text-lg font-semibold">WhatsApp</div>
              <div className="mt-1 text-sm">+91 98xxxxxxx0</div>
            </Card>
            <Card>
              <div className="text-lg font-semibold">Social</div>
              <div className="mt-1 text-sm">Twitter • Instagram • YouTube</div>
            </Card>
          </div>
        </Section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10 text-sm dark:border-gray-800">
        <Container>
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="text-gray-600 dark:text-gray-400">© {new Date().getFullYear()} NIA Project Progress — Independent site</div>
            <div className="flex flex-wrap items-center gap-3">
              <a className="underline" href="#">Privacy</a>
              <a className="underline" href="#">Terms</a>
              <a className="underline" href="#">RSS</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

// ---------------------- Forms (Admin) ----------------------
function MilestoneForm({ onAdd }) {
  const [form, setForm] = useState({ title: "", start: "", end: "", status: "On Track", percent: 0, tag: "General" });
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-2 text-sm font-medium">Quick add milestone (admin)</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-6">
        <Input placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="sm:col-span-2" />
        <Input type="date" value={form.start} onChange={e=>setForm({...form, start:e.target.value})} />
        <Input type="date" value={form.end} onChange={e=>setForm({...form, end:e.target.value})} />
        <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
          {['On Track','At Risk','Completed','Delayed'].map(s => <option key={s}>{s}</option>)}
        </select>
        <Input type="number" min={0} max={100} value={form.percent} onChange={e=>setForm({...form, percent: Number(e.target.value)})} placeholder="%" />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Input placeholder="Tag (Airside/Landside/Systems)" value={form.tag} onChange={e=>setForm({...form, tag:e.target.value})} className="sm:w-56" />
        <Button onClick={()=>{ if(!form.title) return; onAdd(form); setForm({ title:"", start:"", end:"", status:"On Track", percent:0, tag:"General" }); }}>Add</Button>
      </div>
    </div>
  );
}
