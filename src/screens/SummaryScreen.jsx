import { useState } from 'react'
import useStore from '../store/useStore'
import { formatINR, getCategoryIcon } from '../utils/helpers'
import { useLang } from '../App'

// ── Section config ────────────────────────────────────────────────────────────
const SECTION_CONFIG = [
  {
    type: 'labor',
    label: 'Labour',
    icon: '👷',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    barColor: '#93C5FD',
  },
  {
    type: 'material',
    label: 'Material',
    icon: '🏗️',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-700',
    barColor: '#FED447',
  },
  {
    type: 'misc',
    label: 'Misc',
    icon: '📦',
    accentBg: 'bg-green-50',
    accentText: 'text-green-700',
    barColor: '#86EFAC',
  },
]

// Build grouped data: { labor: [{category, total},...], material: [...], misc: [...] }
function buildSectionData(filteredEntries) {
  const sections = {}
  SECTION_CONFIG.forEach(s => { sections[s.type] = {} })

  filteredEntries.forEach((e) => {
    const type = e.type || 'misc'   // fallback for older entries
    if (!sections[type]) sections[type] = {}
    if (!sections[type][e.category]) sections[type][e.category] = 0
    sections[type][e.category] += Number(e.amount) || 0
  })

  // Convert to sorted arrays
  const result = {}
  SECTION_CONFIG.forEach(({ type }) => {
    result[type] = Object.entries(sections[type] || {})
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
  })
  return result
}

export default function SummaryScreen({ onNavigate }) {
  const { sites, getSiteTotal, getGrandTotal, entries } = useStore()
  const [selectedSiteId, setSelectedSiteId] = useState('all')
  const [showSitePicker, setShowSitePicker] = useState(false)
  const t = useLang()

  const grandTotal = getGrandTotal()

  const filteredEntries = selectedSiteId === 'all'
    ? entries
    : entries.filter(e => e.siteId === selectedSiteId)

  const displayTotal = selectedSiteId === 'all'
    ? grandTotal
    : getSiteTotal(selectedSiteId)

  const sectionData = buildSectionData(filteredEntries)

  const hasAnyData = filteredEntries.length > 0

  return (
    <div className="screen bg-white">
      {/* Header */}
      <div className="header-glass px-5 pt-12 pb-3 flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center active:scale-95 transition-transform flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B1D1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div>
          <h1 className="text-[22px] font-bold font-display text-[#2B1D1C]">{t.summaryTitle}</h1>
          <p className="text-[12px] text-[#A0A0A0]">{t.expenseBreakdown}</p>
        </div>
      </div>

      <div className="screen-body px-4 pb-4 space-y-4">
        {/* ── Site Selector ── */}
        <button
          id="site-selector-btn"
          onClick={() => setShowSitePicker(true)}
          className="w-full h-[46px] bg-[#F5F5F5] rounded-2xl px-4 text-left flex items-center justify-between active:bg-[#EFEFEF]"
        >
          <span className="text-[14px] font-semibold text-[#2B1D1C] truncate">
            {selectedSiteId === 'all'
              ? t.allSites
              : (sites.find(s => s.id === selectedSiteId)?.name ?? t.selectSite)}
          </span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* ── Site Picker Modal — anchored to #root, not viewport ── */}
        {showSitePicker && (
          <div
            className="absolute inset-0 bg-black/40 flex items-end z-50"
            onClick={() => setShowSitePicker(false)}
          >
            <div
              className="w-full bg-white rounded-t-3xl p-5 pb-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
              <p className="text-[15px] font-bold font-display text-[#2B1D1C] mb-3">{t.selectSite}</p>
              <div className="space-y-2">
                {[{ id: 'all', name: t.allSites }, ...sites.map(s => ({ id: s.id, name: s.name }))].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setSelectedSiteId(opt.id); setShowSitePicker(false) }}
                    className={`w-full h-[48px] rounded-2xl px-4 text-left text-[15px] font-semibold flex items-center gap-3 transition-all
                      ${selectedSiteId === opt.id ? 'bg-[#FED447] text-[#2B1D1C]' : 'bg-[#F5F5F5] text-[#2B1D1C]'}`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Empty State ── */}
        {!hasAnyData && (
          <div className="text-center py-16 text-[#A0A0A0]">
            <p className="text-[40px] mb-3">📊</p>
            <p className="text-[15px]">No data yet. Add some entries first.</p>
          </div>
        )}

        {/* ── Section Cards: Labour / Material / Misc ── */}
        {hasAnyData && SECTION_CONFIG.map(({ type, label, icon, accentBg, accentText, barColor }) => {
          const rows = sectionData[type] || []
          const sectionTotal = rows.reduce((sum, r) => sum + r.total, 0)
          const maxInSection = rows[0]?.total || 1

          if (rows.length === 0) return null

          return (
            <div key={type} className="bg-white rounded-3xl card-shadow overflow-hidden">
              {/* Section header */}
              <div className={`px-4 py-3 flex items-center justify-between ${accentBg}`}>
                <div className="flex items-center gap-2">
                  <span className="text-[16px]">{icon}</span>
                  <span className={`text-[13px] font-bold tracking-wide uppercase ${accentText}`}>
                    {label}
                  </span>
                </div>
                <span className={`text-[14px] font-bold font-display ${accentText}`}>
                  {formatINR(sectionTotal)}
                </span>
              </div>

              {/* Category rows */}
              <div className="divide-y divide-gray-50">
                {rows.map(({ category, total }) => {
                  const pct = displayTotal > 0 ? Math.round((total / displayTotal) * 100) : 0
                  const barW = Math.round((total / maxInSection) * 100)
                  return (
                    <div key={category} className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className="w-8 h-8 rounded-xl bg-[#F5F5F5] flex items-center justify-center text-[14px] flex-shrink-0">
                          {getCategoryIcon(category)}
                        </div>
                        {/* Name + bar */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[13px] font-semibold text-[#2B1D1C] truncate">{category}</p>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                              <span className="text-[10px] text-[#A0A0A0] font-medium">{pct}%</span>
                              <span className="text-[14px] font-bold font-display text-[#2B1D1C]">
                                {formatINR(total)}
                              </span>
                            </div>
                          </div>
                          {/* Mini bar */}
                          <div className="h-[4px] bg-[#F0F0F0] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${barW}%`, backgroundColor: barColor }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Section subtotal row */}
              <div className="px-4 py-2.5 bg-[#FAFAFA] border-t border-gray-100 flex justify-between items-center">
                <span className="text-[11px] font-semibold text-[#A0A0A0] uppercase tracking-wider">
                  {label} Subtotal
                </span>
                <span className="text-[15px] font-bold font-display text-[#2B1D1C]">
                  {formatINR(sectionTotal)}
                </span>
              </div>
            </div>
          )
        })}

        {/* ── By Site ── (only on All Sites view, above grand total) */}
        {hasAnyData && selectedSiteId === 'all' && sites.length > 1 && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-[#A0A0A0] tracking-wider uppercase px-1">By Site</p>
            {sites.map((site) => {
              const t = getSiteTotal(site.id)
              const pct = grandTotal > 0 ? Math.round((t / grandTotal) * 100) : 0
              return (
                <button
                  key={site.id}
                  onClick={() => onNavigate('ledger', { siteId: site.id })}
                  className="w-full bg-white rounded-2xl card-shadow card-stripe px-4 py-3 text-left"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[13px] font-semibold text-[#2B1D1C]">{site.name}</p>
                    <p className="text-[14px] font-bold font-display text-[#2B1D1C]">{formatINR(t)}</p>
                  </div>
                  <div className="h-[4px] bg-[#F5F5F5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FED447] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* ── Grand Total Card ── */}
        {hasAnyData && (
          <div className="grand-total-card bg-[#2B1D1C] rounded-3xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#FED447]/70 uppercase tracking-widest mb-0.5">{t.grandTotal}</p>
              <p className="text-[12px] text-[#FED447]/50">{filteredEntries.length} {t.entries}</p>
            </div>
            <p className="text-[28px] font-bold font-display text-[#FED447]">
              {formatINR(displayTotal)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
