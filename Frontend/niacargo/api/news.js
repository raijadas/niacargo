// /api/news.js  (Vercel serverless)
export default async function handler(req, res) {
  try {
    const FEED =
      "https://www.google.com/alerts/feeds/03048749724054773156/7709675868494600170";

    const r = await fetch(FEED, {
      headers: {
        "user-agent": "NIA-Progress (+https://niacargo.com)",
        accept:
          "application/atom+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });
    if (!r.ok) {
      return res.status(r.status).json({ error: `Upstream ${r.status}` });
    }
    const xml = await r.text();

    // --- helpers ---
    const cleanHTML = (s = "") =>
      s
        .replace(/<!\[CDATA\[/g, "")
        .replace(/\]\]>/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"');

    const normalizeLink = (href = "") => {
      try {
        // google.com/url?…&url=<REAL>&…
        const u = new URL(href);
        if (
          u.hostname.endsWith("google.com") &&
          (u.pathname === "/url" || u.pathname === "/imgres")
        ) {
          const direct = u.searchParams.get("url") || u.searchParams.get("q");
          if (direct) href = decodeURIComponent(direct);
        }
        // news.google.* sometimes wraps as ?url= inside 'feedproxy' or others — handled above

        // strip common tracking params
        const clean = new URL(href);
        [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "utm_content",
          "gclid",
          "fbclid",
          "igshid",
        ].forEach((p) => clean.searchParams.delete(p));
        return clean.toString();
      } catch {
        return href;
      }
    };

    // --- parse a minimal Atom feed ---
    const entryBlocks = xml.match(/<entry[\s\S]*?<\/entry>/g) || [];
    const take = Math.min(10, entryBlocks.length); // latest 10
    const items = [];
    for (let i = 0; i < take; i++) {
      const block = entryBlocks[i];
      const title =
        cleanHTML((block.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]) ||
        "";
      const rawLink = (block.match(/<link[^>]*?href=["']([^"']+)["']/i) || [])[1] || "";
      const link = normalizeLink(rawLink);
      const updated = (block.match(/<updated>([^<]+)<\/updated>/i) || [])[1] || "";
      const content =
        cleanHTML((block.match(/<content[^>]*>([\s\S]*?)<\/content>/i) || [])[1]) ||
        cleanHTML((block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i) || [])[1]) ||
        "";

      items.push({ title, link, updated, summary: content });
    }

    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({
      updated: new Date().toISOString(),
      items,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "feed error" });
  }
}
