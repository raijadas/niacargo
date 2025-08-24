// /api/news.js — Robust Google Alerts cleaner + 10 items
export default async function handler(req, res) {
  try {
    const FEED = "https://www.google.com/alerts/feeds/03048749724054773156/7709675868494600170";
    const r = await fetch(FEED, {
      headers: {
        "user-agent": "NIA-Progress (+https://niacargo.com)",
        accept: "application/atom+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });
    if (!r.ok) return res.status(r.status).json({ error: `Upstream ${r.status}` });
    const xml = await r.text();

    const htmlDecode = (s = "") =>
      s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');

    const stripTags = (s = "") =>
      htmlDecode(s.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "")).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    const twiceDecode = (s) => {
      try { s = decodeURIComponent(s); } catch {}
      try { s = decodeURIComponent(s); } catch {}
      return s;
    };

    const normalizeLink = (href = "") => {
      if (!href) return href;
      href = htmlDecode(href);
      // If the whole thing is percent-encoded, decode it
      href = twiceDecode(href);

      try {
        let u = new URL(href);

        // Google wrappers
        if (u.hostname.endsWith("google.com")) {
          if (u.pathname === "/url" || u.pathname === "/imgres") {
            const direct = u.searchParams.get("url") || u.searchParams.get("q") || u.searchParams.get("imgurl");
            if (direct) href = twiceDecode(direct);
          } else if (u.pathname === "/r") {
            const direct = u.searchParams.get("url");
            if (direct) href = twiceDecode(direct);
          }
        }

        // Some feeds give feedproxy or other wrappers — decode again
        try { new URL(href); } catch { href = "https://" + href.replace(/^https?:\/\//, ""); }

        // Strip tracking params
        const clean = new URL(href);
        [
          "utm_source","utm_medium","utm_campaign","utm_term","utm_content",
          "gclid","fbclid","igshid","utm_id","utm_name"
        ].forEach((p) => clean.searchParams.delete(p));
        return clean.toString();
      } catch {
        return href;
      }
    };

    const entries = xml.match(/<entry[\s\S]*?<\/entry>/g) || [];
    const take = Math.min(10, entries.length);
    const items = [];

    for (let i = 0; i < take; i++) {
      const block = entries[i];
      const title = stripTags((block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
      const rawLink = (block.match(/<link[^>]*?href=["']([^"']+)["']/i) || [])[1] || "";
      const link = normalizeLink(rawLink);
      const updated = (block.match(/<updated>([^<]+)<\/updated>/i) || [])[1] || "";
      const summary =
        stripTags((block.match(/<content[^>]*>([\s\S]*?)<\/content>/i) || [])[1] || "") ||
        stripTags((block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i) || [])[1] || "");

      items.push({ title, link, updated, summary });
    }

    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ updated: new Date().toISOString(), items });
  } catch (e) {
    return res.status(500).json({ error: e.message || "feed error" });
  }
}
