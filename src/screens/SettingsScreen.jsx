import { useState } from 'react'
import { Download, Trash2, Share2, Smartphone, ChevronRight, Moon, Sun, Globe } from 'lucide-react'
import useStore from '../store/useStore'
import { formatINR } from '../utils/helpers'
import { useLang } from '../App'
import { LANG_NAMES } from '../i18n/translations'

// ── Reusable CONFIRM modal ────────────────────────────────────────────────────
function ConfirmDeleteModal({ title, subtitle, warningText, onConfirm, onCancel }) {
  const [typed, setTyped] = useState('')
  const isReady = typed === 'CONFIRM'

  return (
    <div
      className="absolute inset-0 bg-black/50 flex items-end z-50"
      onClick={onCancel}
    >
      <div
        className="w-full bg-white rounded-t-3xl p-6 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <div className="text-center mb-5">
          <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-3">
            <Trash2 size={28} color="#DC2626" />
          </div>
          <h2 className="text-[18px] font-bold font-display text-[#2B1D1C]">{title}</h2>
          <p className="text-[13px] text-[#A0A0A0] mt-1 leading-snug">{subtitle}</p>
        </div>
        <div className="bg-red-50 rounded-2xl px-4 py-3 mb-4">
          <p className="text-[12px] text-red-700 font-semibold leading-snug">{warningText}</p>
        </div>
        <p className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase mb-2">
          Type <span className="text-red-600 font-bold">CONFIRM</span> to proceed
        </p>
        <input
          type="text"
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder="Type CONFIRM here..."
          autoFocus
          className="w-full h-[50px] bg-[#F5F5F5] rounded-2xl px-4 text-[15px] font-semibold text-[#2B1D1C] placeholder-[#C0C0C0] outline-none focus:ring-2 focus:ring-red-300 mb-4 tracking-widest"
        />
        <button
          onClick={() => { if (isReady) onConfirm() }}
          disabled={!isReady}
          className="w-full h-[52px] bg-red-600 text-white font-bold text-[15px] rounded-full disabled:opacity-30 mb-2 transition-opacity"
        >
          {isReady ? '🗑️ Delete Permanently' : 'Type CONFIRM to unlock'}
        </button>
        <button onClick={onCancel} className="w-full h-[44px] text-[#A0A0A0] text-[14px]">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function SettingsScreen({ onNavigate }) {
  const {
    sites, clearAllData, deleteSite, exportData, generateWhatsAppSummary,
    getGrandTotal, getSiteTotal,
    theme, setTheme, language, setLanguage,
  } = useStore()

  const lang = useLang()

  const [clearModal, setClearModal]     = useState(false)
  const [deleteSiteId, setDeleteSiteId] = useState(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedShareSite, setSelectedShareSite] = useState('')

  const grandTotal = getGrandTotal()
  const siteToDelete = sites.find(s => s.id === deleteSiteId)
  const isDark = theme === 'dark'

  const handleExport = () => {
    const data = exportData()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ashvin-construction-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleWhatsApp = () => {
    if (!selectedShareSite) return
    const msg = generateWhatsAppSummary(selectedShareSite)
    const encoded = encodeURIComponent(msg)
    window.open(`https://wa.me/?text=${encoded}`, '_blank')
    setShareModalOpen(false)
  }

  return (
    <div className="screen bg-white">
      <div className="header-glass px-5 pt-12 pb-3 flex items-center gap-3">
        <button onClick={() => onNavigate('home')} className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center active:scale-95 transition-transform flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2B1D1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div>
          <h1 className="text-[22px] font-bold font-display text-[#2B1D1C]">{lang.settingsTitle}</h1>
          <p className="text-[12px] text-[#A0A0A0]">Ashvin Construction · Vadodara</p>
        </div>
      </div>

      <div className="screen-body px-4 pb-4 space-y-5">

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-3xl card-shadow card-stripe p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
            <img src="/logo.png" alt="Ashvin Construction" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-[16px] font-bold font-display text-[#2B1D1C]">Ashvin Construction</p>
            <p className="text-[12px] text-[#A0A0A0]">Vadodara</p>
            <p className="text-[13px] font-semibold text-[#D4A800] mt-0.5">
              {sites.length} sites · {formatINR(grandTotal)} total
            </p>
          </div>
        </div>

        {/* ── Appearance (Dark / Light) ── */}
        <div>
          <SectionLabel>{lang.appearance}</SectionLabel>
          <div className="bg-white rounded-3xl card-shadow overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                {isDark ? <Moon size={16} color="#FED447" /> : <Sun size={16} color="#D4A800" />}
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-[#2B1D1C]">
                  {isDark ? lang.darkMode : lang.lightMode}
                </p>
                <p className="text-[11px] text-[#A0A0A0]">
                  {isDark ? 'Easy on eyes in low light' : 'Clean & bright interface'}
                </p>
              </div>
              {/* Toggle pill */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`w-[52px] h-[30px] rounded-full flex items-center transition-all duration-300 px-[3px]
                  ${isDark ? 'bg-[#FED447]' : 'bg-[#E0E0E0]'}`}
              >
                <div
                  className={`w-[24px] h-[24px] rounded-full bg-white shadow-md transition-transform duration-300
                    ${isDark ? 'translate-x-[22px]' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── Language Selector ── */}
        <div>
          <SectionLabel>{lang.language}</SectionLabel>
          <div className="bg-white rounded-3xl card-shadow overflow-hidden p-1.5">
            <div className="flex gap-1">
              {Object.entries(LANG_NAMES).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`flex-1 h-[42px] rounded-2xl text-[13px] font-semibold transition-all
                    ${language === code
                      ? 'bg-[#FED447] text-[#2B1D1C] shadow-sm'
                      : 'bg-transparent text-[#A0A0A0]'}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Manage Sites ── */}
        {sites.length > 0 && (
          <div>
            <SectionLabel>{lang.managesites || 'Manage Sites'}</SectionLabel>
            <div className="bg-white rounded-3xl card-shadow overflow-hidden divide-y divide-gray-50">
              {sites.map((site) => {
                const siteTotal = getSiteTotal(site.id)
                return (
                  <div key={site.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[#2B1D1C] truncate">{site.name}</p>
                      <p className="text-[12px] text-[#A0A0A0]">{formatINR(siteTotal)}</p>
                    </div>
                    <button
                      onClick={() => onNavigate('ledger', { siteId: site.id })}
                      className="text-[12px] font-semibold text-[#D4A800] px-3 py-1.5 rounded-xl bg-[#FFF8DC] active:scale-95 transition-transform"
                    >
                      {lang.open}
                    </button>
                    <button
                      onClick={() => setDeleteSiteId(site.id)}
                      className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center active:scale-95 transition-transform flex-shrink-0"
                    >
                      <Trash2 size={15} color="#DC2626" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Share & Export ── */}
        <div>
          <SectionLabel>{lang.shareExport}</SectionLabel>
          <div className="bg-[#E8F5E9] rounded-3xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[20px] flex-shrink-0">📤</div>
              <div>
                <p className="text-[15px] font-bold text-[#2B1D1C]">Share Site Summary</p>
                <p className="text-[12px] text-[#666] mt-0.5">Sends a formatted text summary to WhatsApp</p>
              </div>
            </div>
            <button
              id="share-whatsapp-btn"
              onClick={() => setShareModalOpen(true)}
              className="share-btn w-full h-[48px] bg-[#2B1D1C] text-white font-bold text-[14px] rounded-full flex items-center justify-center gap-2 btn-press"
            >
              <Share2 size={16} />
              Choose Site & Share
            </button>
          </div>
        </div>

        {/* ── Data & Storage ── */}
        <div>
          <SectionLabel>{lang.dataStorage}</SectionLabel>
          <div className="bg-white rounded-3xl card-shadow overflow-hidden">
            <button
              id="export-btn"
              onClick={handleExport}
              className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-50"
            >
              <div className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                <Download size={16} color="#2B1D1C" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[14px] font-semibold text-[#2B1D1C]">{lang.exportData}</p>
                <p className="text-[11px] text-[#A0A0A0]">{lang.exportSub}</p>
              </div>
              <ChevronRight size={16} color="#A0A0A0" />
            </button>
            <div className="h-px bg-gray-50 mx-4" />
            <button
              id="clear-data-btn"
              onClick={() => setClearModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-red-50"
            >
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={16} color="#DC2626" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[14px] font-semibold text-red-600">{lang.clearAll}</p>
                <p className="text-[11px] text-red-400">{lang.clearAllSub}</p>
              </div>
            </button>
          </div>
        </div>

        {/* ── App Info ── */}
        <div>
          <SectionLabel>{lang.appInfo}</SectionLabel>
          <div className="bg-white rounded-3xl card-shadow p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF8DC] flex items-center justify-center flex-shrink-0">
                <Smartphone size={18} color="#D4A800" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#2B1D1C]">Install on Phone</p>
                <p className="text-[11px] text-[#A0A0A0]">Works offline · Add to Home Screen</p>
              </div>
            </div>
            <div className="bg-[#F5F5F5] rounded-2xl p-3.5">
              <p className="text-[12px] text-[#2B1D1C] font-medium mb-1">📱 On iPhone/iPad:</p>
              <p className="text-[12px] text-[#A0A0A0]">Tap Share → "Add to Home Screen"</p>
              <p className="text-[12px] text-[#2B1D1C] font-medium mt-2 mb-1">🤖 On Android:</p>
              <p className="text-[12px] text-[#A0A0A0]">Tap ⋮ menu → "Add to Home Screen"</p>
            </div>
            <p className="text-[11px] text-[#A0A0A0] text-center mt-3">v1.0.0 · Vite + React + Zustand · PWA</p>
          </div>
        </div>

        <div className="h-2" />
      </div>

      {/* ── Delete Single Site Modal ── */}
      {deleteSiteId && siteToDelete && (
        <ConfirmDeleteModal
          title={`Delete "${siteToDelete.name}"?`}
          subtitle={`This will permanently delete the site and all its expense entries (${formatINR(getSiteTotal(deleteSiteId))} total).`}
          warningText="⚠️ All entries for this site will be lost forever. This action cannot be undone."
          onConfirm={() => { deleteSite(deleteSiteId); setDeleteSiteId(null) }}
          onCancel={() => setDeleteSiteId(null)}
        />
      )}

      {/* ── Clear All Data Modal ── */}
      {clearModal && (
        <ConfirmDeleteModal
          title="Clear ALL Data?"
          subtitle={`This will delete all ${sites.length} sites and every expense entry (${formatINR(grandTotal)} total).`}
          warningText="⚠️ Every site and every entry will be deleted forever. There is no undo."
          onConfirm={() => { clearAllData(); setClearModal(false) }}
          onCancel={() => setClearModal(false)}
        />
      )}

      {/* ── WhatsApp Share Modal ── */}
      {shareModalOpen && (
        <div className="absolute inset-0 bg-black/40 flex items-end z-50" onClick={() => setShareModalOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl p-5 pb-8" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
            <h2 className="text-[18px] font-bold font-display text-[#2B1D1C] mb-4">Share Site Summary</h2>
            {sites.length === 0 ? (
              <p className="text-[#A0A0A0] text-center py-4">No sites to share yet.</p>
            ) : (
              <>
                <label className="text-[11px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
                  {lang.selectSite}
                </label>
                <div className="space-y-2 mb-4">
                  {sites.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedShareSite(s.id)}
                      className={`w-full h-[46px] rounded-2xl px-4 text-left text-[14px] font-semibold flex items-center gap-2 transition-all
                        ${selectedShareSite === s.id ? 'bg-[#FED447] text-[#2B1D1C]' : 'bg-[#F5F5F5] text-[#2B1D1C]'}`}
                    >
                      🏗️ {s.name}
                    </button>
                  ))}
                </div>
                <button
                  id="send-whatsapp-btn"
                  onClick={handleWhatsApp}
                  disabled={!selectedShareSite}
                  className="w-full h-[52px] bg-[#25D366] text-white font-bold text-[15px] rounded-full disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  📤 Open WhatsApp
                </button>
              </>
            )}
            <button onClick={() => setShareModalOpen(false)} className="w-full mt-2 h-[44px] text-[#A0A0A0] text-[13px]">
              {lang.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold text-[#A0A0A0] tracking-wider uppercase mb-2 px-1">{children}</p>
}

function SettingsRow({ icon, label, sub }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center text-[16px] flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[14px] font-semibold text-[#2B1D1C]">{label}</p>
        {sub && <p className="text-[11px] text-[#A0A0A0]">{sub}</p>}
      </div>
    </div>
  )
}
