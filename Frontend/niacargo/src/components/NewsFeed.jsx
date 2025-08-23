import React, { useEffect, useMemo, useState } from "react";


export default function NewsFeed({ refreshMs = 180000 }) {
const [data, setData] = useState({ updated: "", items: [] });
const [q, setQ] = useState("");
const [loading, setLoading] = useState(false);
const [source, setSource] = useState("/api/news");


async function load() {
setLoading(true);
try {
const res = await fetch("/api/news?" + Date.now(), { cache: "no-store" });
if (!res.ok) throw new Error("api unavailable");
const json = await res.json();
setData(json); setSource("/api/news");
} catch {
try { const r2 = await fetch("/news.json?" + Date.now(), { cache: "no-store" }); const j2 = await r2.json(); setData(j2); setSource("/news.json"); } catch { setData({ updated: "", items: [] }); }
} finally { setLoading(false); }
}


useEffect(() => { load(); const id = setInterval(load, refreshMs); return () => clearInterval(id); }, [refreshMs]);


const items = useMemo(() => {
const t = q.trim().toLowerCase(); if (!t) return data.items;
return data.items.filter((it) => (it.title + " " + (it.summary || "")).toLowerCase().includes(t));
}, [q, data]);


return (
<div className="space-y-4">
<div className="flex items-center justify-between gap-3">
<div className="flex items-center gap-2"><h3 className="text-lg font-semibold">Daily Pulse (Live)</h3><span className="text-xs text-gray-500">{source === "/api/news" ? "via Google Alerts" : "local fallback"}</span></div>
<div className="flex gap-2">
<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="w-40 sm:w-64 rounded-lg border px-3 py-1.5 text-sm" aria-label="Search news" />
<button onClick={load} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">{loading ? "Refreshing…" : "Refresh"}</button>
</div>
</div>
<div className="text-xs text-gray-500">Updated: {data.updated || "—"}</div>
{items.length === 0 && <div className="text-sm text-gray-600">No items yet. Try Refresh.</div>}
<ul className="space-y-4">
{items.map((it, i) => (
<li key={i} className="border-b pb-3">
<a href={it.link} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline">{it.title || it.link}</a>
{it.summary && <p className="text-sm text-gray-600 mt-1 line-clamp-3">{it.summary}</p>}
{it.updated && <div className="text-xs text-gray-400 mt-1">{new Date(it.updated).toLocaleString()}</div>}
</li>
))}
</ul>
</div>
);
}