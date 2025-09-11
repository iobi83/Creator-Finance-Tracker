'use client';
import { useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { computeKpis } from './metricsKpis';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function BrandDealMetricsModal({ deal, onClose }) {
  const [form, setForm] = useState({
    platform: 'tiktok', deliverable_type: 'video', content_url: '',
    impressions: '', reach: '', likes: '', comments: '', shares: '', saves: '', avg_watch_time_sec: '',
    clicks: '', conversions: '', attributed_revenue_cents: '', coupon_redemptions: '',
    brand_spend_cents: '', period_start: '', period_end: '', talking_points: ''
  });
  const kpis = useMemo(() => computeKpis({
    impressions: +form.impressions || 0,
    reach: +form.reach || 0,
    likes: +form.likes || 0,
    comments: +form.comments || 0,
    shares: +form.shares || 0,
    saves: +form.saves || 0,
    clicks: +form.clicks || 0,
    conversions: +form.conversions || 0,
    attributed_revenue_cents: +form.attributed_revenue_cents || 0,
    brand_spend_cents: +form.brand_spend_cents || 0,
  }), [form]);

  function up(v){ return v?.target ? v.target.value : v; }

  async function handleSave() {
    // Require session to set user_id
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { alert('Please sign in to save metrics.'); return; }
    const payload = {
      user_id: session.user.id,
      deal_id: deal?.id,
      ...form,
      impressions: form.impressions ? +form.impressions : null,
      reach: form.reach ? +form.reach : null,
      likes: form.likes ? +form.likes : null,
      comments: form.comments ? +form.comments : null,
      shares: form.shares ? +form.shares : null,
      saves: form.saves ? +form.saves : null,
      avg_watch_time_sec: form.avg_watch_time_sec ? +form.avg_watch_time_sec : null,
      clicks: form.clicks ? +form.clicks : null,
      conversions: form.conversions ? +form.conversions : null,
      attributed_revenue_cents: form.attributed_revenue_cents ? +form.attributed_revenue_cents : null,
      coupon_redemptions: form.coupon_redemptions ? +form.coupon_redemptions : null,
      brand_spend_cents: form.brand_spend_cents ? +form.brand_spend_cents : null,
      period_start: form.period_start || null,
      period_end: form.period_end || null,
    };
    const { error } = await supabase.from('brand_deal_metrics').insert(payload);
    if (error) { console.error(error); alert('Save failed.'); return; }
    onClose?.('saved');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Add Metrics{deal?.brand ? ` — ${deal.brand}` : ''}</h2>
          <button onClick={()=>onClose?.()} className="text-slate-600 hover:text-slate-900">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-600">Platform</label>
            <select className="mt-1 w-full border border-slate-200 rounded-lg p-2"
              value={form.platform} onChange={e=>setForm(f=>({...f, platform: up(e)}))}>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-600">Deliverable</label>
            <select className="mt-1 w-full border border-slate-200 rounded-lg p-2"
              value={form.deliverable_type} onChange={e=>setForm(f=>({...f, deliverable_type: up(e)}))}>
              <option value="video">Video</option>
              <option value="reel">Reel</option>
              <option value="post">Post</option>
              <option value="story">Story</option>
              <option value="live">Live</option>
              <option value="short">Short</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-600">Content URL</label>
            <input className="mt-1 w-full border border-slate-200 rounded-lg p-2"
              placeholder="https://..." value={form.content_url}
              onChange={e=>setForm(f=>({...f, content_url: up(e)}))} />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Impressions/Views</label>
            <input className="mt-1 w-full border border-slate-200 rounded-lg p-2" type="number"
              value={form.impressions} onChange={e=>setForm(f=>({...f, impressions: up(e)}))} />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Reach</label>
            <input className="mt-1 w-full border border-slate-200 rounded-lg p-2" type="number"
              value={form.reach} onChange={e=>setForm(f=>({...f, reach: up(e)}))} />
          </div>

          <div className="grid grid-cols-3 gap-2 md:col-span-2">
            {[
              ['likes','Likes'],['comments','Comments'],['shares','Shares'],['saves','Saves'],
              ['clicks','Clicks'],['conversions','Conversions'],['avg_watch_time_sec','Avg watch (s)'],
              ['coupon_redemptions','Coupon uses']
            ].map(([k,label])=>(
              <div key={k}>
                <label className="block text-xs text-slate-600">{label}</label>
                <input className="mt-1 w-full border border-slate-200 rounded-lg p-2" type="number"
                  value={form[k]} onChange={e=>setForm(f=>({...f, [k]: up(e)}))} />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm text-slate-600">Attributed revenue (USD cents)</label>
            <input className="mt-1 w-full border border-slate-200 rounded-lg p-2" type="number"
              value={form.attributed_revenue_cents} onChange={e=>setForm(f=>({...f, attributed_revenue_cents: up(e)}))} />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Brand spend (USD cents, optional)</label>
            <input className="mt-1 w-full border border-slate-200 rounded-lg p-2" type="number"
              value={form.brand_spend_cents} onChange={e=>setForm(f=>({...f, brand_spend_cents: up(e)}))} />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Period start</label>
            <input className="mt-1 w-full border border-slate-200 rounded-lg p-2" type="date"
              value={form.period_start} onChange={e=>setForm(f=>({...f, period_start: up(e)}))} />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Period end</label>
            <input className="mt-1 w-full border border-slate-200 rounded-lg p-2" type="date"
              value={form.period_end} onChange={e=>setForm(f=>({...f, period_end: up(e)}))} />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-600">Notes / talking points</label>
            <textarea className="mt-1 w-full border border-slate-200 rounded-lg p-2" rows={3}
              value={form.talking_points} onChange={e=>setForm(f=>({...f, talking_points: up(e)}))} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Kpi label="Engagement rate" value={kpis.engagementRate} fmt="pct" />
          <Kpi label="CTR" value={kpis.ctr} fmt="pct" />
          <Kpi label="Conv. rate" value={kpis.convRate} fmt="pct" />
          <Kpi label="eCPM (rev/1k views)" value={kpis.eCPM} fmt="usd" />
          <Kpi label="ROAS" value={kpis.roas} fmt="x" />
          <Kpi label="EPC (rev/click)" value={kpis.epc} fmt="usd" />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={()=>onClose?.()} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white">Save metrics</button>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value, fmt }) {
  let v = value || 0;
  if (fmt === 'pct') v = (v * 100).toFixed(1) + '%';
  else if (fmt === 'usd') v = '$' + (v).toFixed(2);
  else if (fmt === 'x') v = (v).toFixed(2) + 'x';
  else v = String(v);
  return (
    <div className="rounded-xl bg-indigo-50 p-4">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="text-lg font-semibold text-slate-900">{v}</div>
    </div>
  );
}
