import { useState } from 'react'
import { Plus } from 'lucide-react'
import useStore from '../store/useStore'
import { formatINR } from '../utils/helpers'
import { useLang } from '../App'

export default function HomeScreen({ onNavigate }) {
  const { sites, addSite, getSiteTotal } = useStore()
  const t = useLang()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSiteName, setNewSiteName] = useState('')

  const handleAddSite = () => {
    if (!newSiteName.trim()) return
    const id = addSite(newSiteName)
    setNewSiteName('')
    setShowAddModal(false)
    onNavigate('ledger', { siteId: id })
  }

  return (
    <div className="screen bg-white">
      {/* Header */}
      <div className="px-6 pt-14 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img src="/logo.png" alt="Ashvin Construction" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold font-display text-[#2B1D1C] leading-tight">
              Ashvin Construction
            </h1>
            <p className="text-[12px] text-[#A0A0A0] font-medium tracking-wider uppercase">
              Vadodara
            </p>
          </div>
        </div>
      </div>

      {/* Sites List */}
      <div className="screen-body px-5 pb-4">
        {sites.length === 0 ? (
          <EmptyState onAdd={() => setShowAddModal(true)} />
        ) : (
          <div className="space-y-3 mt-2">
            <p className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase px-1">
              {t.mySites} ({sites.length})
            </p>
            {sites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                total={getSiteTotal(site.id)}
                onClick={() => onNavigate('ledger', { siteId: site.id })}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB — in-flow at the bottom, only when sites exist */}
      {sites.length > 0 && (
        <div className="px-5 pb-4 pt-2">
          <button
            id="add-site-fab"
            onClick={() => setShowAddModal(true)}
            className="w-full bg-[#FED447] text-[#2B1D1C] font-bold text-[16px] h-[56px] rounded-full shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform btn-press"
          >
            <Plus size={22} strokeWidth={2.5} />
            {t.newSite}
          </button>
        </div>
      )}

      {/* Add Site Modal */}
      {showAddModal && (
        <AddSiteModal
          value={newSiteName}
          onChange={setNewSiteName}
          onSubmit={handleAddSite}
          onClose={() => { setShowAddModal(false); setNewSiteName('') }}
        />
      )}
    </div>
  )
}

function SiteCard({ site, total, onClick }) {
  return (
    <button
      id={`site-card-${site.id}`}
      onClick={onClick}
      className="w-full text-left bg-white rounded-3xl card-shadow card-stripe p-5 flex items-center justify-between active:scale-[0.98] transition-transform card-hover"
    >
      <div className="flex-1 min-w-0">
        <h2 className="text-[18px] font-bold font-display text-[#2B1D1C] truncate">{site.name}</h2>
        <p className="text-[13px] text-[#A0A0A0] mt-0.5">
          {new Date(site.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </div>
      <div className="text-right ml-4 flex-shrink-0">
        <p className="text-[22px] font-bold font-display text-[#2B1D1C]">{formatINR(total)}</p>
        <p className="text-[12px] text-[#A0A0A0]">Total Spent</p>
      </div>
    </button>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center h-[65vh] text-center px-8">
      <div className="w-24 h-24 rounded-3xl overflow-hidden mb-6 bg-[#FFF8DC] flex items-center justify-center">
        <img src="/logo.png" alt="Ashvin Construction" className="w-full h-full object-contain p-2" />
      </div>
      <h2 className="text-[22px] font-bold font-display text-[#2B1D1C] mb-2">No Sites Yet</h2>
      <p className="text-[16px] text-[#A0A0A0] leading-relaxed mb-8">
        Add your first construction site to start tracking expenses.
      </p>
      <button
        id="add-first-site-btn"
        onClick={onAdd}
        className="bg-[#FED447] text-[#2B1D1C] font-bold text-[16px] px-10 h-[56px] rounded-full flex items-center gap-2 shadow-md"
      >
        <Plus size={20} strokeWidth={2.5} />
        Add First Site
      </button>
    </div>
  )
}

function AddSiteModal({ value, onChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <h2 className="text-[20px] font-bold font-display text-[#2B1D1C] mb-5">New Construction Site</h2>
        <div className="mb-5">
          <label className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
            Site Name
          </label>
          <input
            id="site-name-input"
            type="text"
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            placeholder="e.g. Shyamal Villa, Gorwa Road..."
            className="w-full h-[52px] bg-[#F5F5F5] rounded-2xl px-5 text-[17px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447]"
          />
        </div>
        <button
          id="create-site-btn"
          onClick={onSubmit}
          disabled={!value.trim()}
          className="w-full h-[56px] bg-[#FED447] text-[#2B1D1C] font-bold text-[17px] rounded-full disabled:opacity-40"
        >
          Create Site
        </button>
        <button onClick={onClose} className="w-full mt-3 h-[44px] text-[#A0A0A0] text-[15px]">
          Cancel
        </button>
      </div>
    </div>
  )
}
