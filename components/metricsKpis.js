export function safeDiv(n, d) { return d > 0 ? n / d : 0; }

export function computeKpis({
  impressions = 0,
  reach = 0,
  likes = 0,
  comments = 0,
  shares = 0,
  saves = 0,
  clicks = 0,
  conversions = 0,
  attributed_revenue_cents = 0,
  brand_spend_cents = 0,
}) {
  const engagement = likes + comments + shares + saves;
  const engagementRate = safeDiv(engagement, reach || impressions); // pick whichever exists
  const ctr = safeDiv(clicks, impressions);
  const convRate = safeDiv(conversions, clicks);
  const revenue = (attributed_revenue_cents || 0) / 100;
  const eCPM = impressions ? (revenue * 1000) / impressions : 0; // revenue per 1k views
  const roas = brand_spend_cents ? revenue / (brand_spend_cents / 100) : 0;
  const epc = safeDiv(revenue, clicks);
  return { engagement, engagementRate, ctr, convRate, eCPM, roas, epc, revenue };
}
