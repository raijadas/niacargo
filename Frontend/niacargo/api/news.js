export default async function handler(req, res) {
  try {
    const FEED = "https://www.google.com/alerts/feeds/03048749724054773156/7709675868494600170";
    const r = await fetch(FEED, { headers: { "user-agent": "NIA-Progress (+https://niacargo.com)", accept: "application/atom+xml,application/xml,text/xml;q=0.9,*/*;q=0.8" }, cache: "no-store" });
    if (!r.ok) { res.status(r.status).json({ error: `Upstream ${r.status}` }); return; }
    const xml = await r.text();

    const entries = [];
    const entryRegex = /<entry[\s\S]*?<\/entry>/g; // each <entry>...</entry>
    const titleRegex = /<title(?:[^>]*)>([\s\S]*?)<\/title>/i;
    const linkRegex = /<link[^>]*?href=["']([^"']+)["'][^>]*>/i;
    const updatedRegex = /<updated>([^<]+)<\/updated>/i;
    const contentRegex = /<content[^>]*>([\s\S]*?)<\/content>/i;
    const clean = (s = "") => s.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();

    const matches = xml.match(entryRegex) || [];
    for (const block of matches) {
      const title = clean((block.match(titleRegex) || [])[1]);
      const link = (block.match(linkRegex) || [])[1] || "";
      const updated = (block.match(updatedRegex) || [])[1] || "";
      const content = clean((block.match(contentRegex) || [])[1] || "");
      if (title || link) entries.push({ title, link, updated, summary: content });
    }

    res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json({ updated: new Date().toISOString(), items: entries });
  } catch (err) {
    res.status(500).json({ error: err.message || "feed error" });
  }
}