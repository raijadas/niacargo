// /src/components/NewsFeed.jsx
import React, { useEffect, useMemo, useState } from "react";

const domainFrom = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return ""; }
};

const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
};

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
      try {
        const r2 = await fetch("/news.json?" + Date.now(), { cache: "no-store" });
        const j2 = await r2.json();
        setData(j2); setSource("/news.json");
      } catch {
        setData({ updated: "", items: [] });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); const id = setInterval(load, refreshMs); return () => clearInterval(id); }, [refreshMs]);

  const items = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = data.items || [];
    if (!t) return list;
    return list.filter((it) => (it.title + " " + (it.summary || "")).toLowerCase().includes(t));
  }, [q, data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Daily Pulse (Live)</h3>
          <span className="text-xs text-gray-500">
            {source === "/api/news" ? "via Google Alerts" : "local fallback"}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="w-40 sm:w-64 rounded-lg border px-3 py-1.5 text-sm"
            aria-label="Search news"
          />
          <button onClick={load} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500">Updated: {data.updated || "—"}</div>

      {items.length === 0 && (
        <div className="text-sm text-gray-600">No items yet. Try Refresh.</div>
      )}

      <ul className="space-y-4">
        {items.slice(0, 10).map((it, i) => {
          const dom = domainFrom(it.link);
          return (
            <li key={i} className="rounded-xl border p-4 hover:bg-gray-50 transition">
              <a
                href={it.link}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="font-medium text-blue-700 hover:underline"
              >
                {it.title || it.link}
              </a>
              <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                {dom && (
                  <>
                    <img
                      alt=""
                      className="h-4 w-4"
                      src={`https://www.google.com/s2/favicons?domain=${dom}&sz=16`}
                    />
                    <span>{dom}</span>
                    <span>•</span>
                  </>
                )}
                <span>{timeAgo(it.updated)}</span>
              </div>
              {it.summary && (
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">{it.summary}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
