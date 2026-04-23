import { useState } from 'react'
import { Plus, Search, MapPin, Phone, User, X, ArrowRight, Settings, Trash2 } from 'lucide-react'
import useStore from '../store/useStore'
import { formatINR } from '../utils/helpers'
import { useLang } from '../App'

export default function HomeScreen({ onNavigate }) {
  const { sites, addSite, getSiteTotal, getSitePaymentsTotal } = useStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSiteName, setNewSiteName] = useState('')
  const [newOwnerName, setNewOwnerName] = useState('')
  const [newOwnerPhone, setNewOwnerPhone] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const t = useLang()

  const activeSites = sites.filter((s) => s.status === 'active')
  const completedSites = sites.filter((s) => s.status === 'completed')

  const handleAddSite = () => {
    if (!newSiteName.trim()) return
    addSite({
      name: newSiteName,
      ownerName: newOwnerName,
      ownerPhone: newOwnerPhone,
      address: newAddress,
    })
    setShowAddModal(false)
    setNewSiteName('')
    setNewOwnerName('')
    setNewOwnerPhone('')
    setNewAddress('')
  }

  return (
    <div className="screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="px-5 pt-14 pb-5 bg-white border-b border-gray-50 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#FFF8DC] flex items-center justify-center flex-shrink-0 card-shadow">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1.5" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold font-display text-[#2B1D1C] leading-tight">Ashvin Construction</h1>
              <p className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-widest mt-0.5">VADODARA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sites List */}
      <div className="screen-body px-5 pb-4">
        {sites.length === 0 ? (
          <EmptyState onAdd={() => setShowAddModal(true)} t={t} />
        ) : (
          <div className="space-y-3 mt-2">
            {/* Active Sites */}
            {activeSites.length > 0 && (
              <>
                <p className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase px-1">
                  🟢 {t.activeSites || 'Active Sites'} ({activeSites.length})
                </p>
                {activeSites.map((site) => (
                  <ActiveSiteCard
                    key={site.id}
                    site={site}
                    total={getSiteTotal(site.id)}
                    onNavigate={onNavigate}
                    t={t}
                  />
                ))}
              </>
            )}

            {/* Completed Sites */}
            {completedSites.length > 0 && (
              <>
                <p className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase px-1 mt-5">
                  ✅ {t.completedSites || 'Completed'} ({completedSites.length})
                </p>
                {completedSites.map((site) => (
                  <CompletedSiteCard
                    key={site.id}
                    site={site}
                    total={getSiteTotal(site.id)}
                    paymentsTotal={getSitePaymentsTotal(site.id)}
                    onNavigate={onNavigate}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
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
          siteName={newSiteName}
          ownerName={newOwnerName}
          ownerPhone={newOwnerPhone}
          address={newAddress}
          onSiteNameChange={setNewSiteName}
          onOwnerNameChange={setNewOwnerName}
          onOwnerPhoneChange={setNewOwnerPhone}
          onAddressChange={setNewAddress}
          onSubmit={handleAddSite}
          onClose={() => {
            setShowAddModal(false)
            setNewSiteName('')
            setNewOwnerName('')
            setNewOwnerPhone('')
            setNewAddress('')
          }}
          t={t}
        />
      )}
    </div>
  )
}

/* ── Active Site Card — full featured with action buttons ──────────────────── */
function ActiveSiteCard({ site, total, onNavigate, t }) {
  return (
    <div 
      id={`site-card-${site.id}`}
      onClick={() => onNavigate('ledger', { siteId: site.id })}
      className="w-full text-left rounded-3xl card-shadow card-stripe p-5 active:scale-[0.98] transition-transform cursor-pointer"
    >
      {/* Top row: name + total */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-[18px] font-bold font-display text-[#2B1D1C] truncate">{site.name}</h2>
          <p className="text-[12px] text-[#A0A0A0] mt-0.5">
            {new Date(site.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <p className="text-[20px] font-bold font-display text-[#2B1D1C]">{formatINR(total)}</p>
          <p className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">Total Spent</p>
        </div>
      </div>

      {/* Details info */}
      <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
        {site.ownerName && (
          <div className="flex items-center gap-2 text-[#666]">
            <User size={14} className="text-[#A0A0A0]" />
            <span className="text-[13px] font-medium">{site.ownerName}</span>
          </div>
        )}
        {site.ownerPhone && (
          <a 
            href={`tel:${site.ownerPhone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-[#666] active:text-[#FED447] w-fit"
          >
            <Phone size={14} className="text-[#A0A0A0]" />
            <span className="text-[13px] font-medium underline decoration-gray-200 underline-offset-4">{site.ownerPhone}</span>
          </a>
        )}
      </div>

      {/* Action shortcuts */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          id={`add-payment-site-${site.id}`}
          onClick={(e) => { e.stopPropagation(); onNavigate('paymentLog', { siteId: site.id }) }}
          className="h-[44px] bg-[#DCF7E3] text-[#2E7D32] font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Plus size={16} strokeWidth={2.5} />
          {t.addPayment}
        </button>
        <button
          id={`site-summary-${site.id}`}
          onClick={(e) => { e.stopPropagation(); onNavigate('siteSummary', { siteId: site.id }) }}
          className="h-[44px] bg-white border border-[#FED447] text-[#D4A800] font-bold text-[13px] rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <ArrowRight size={16} />
          {t.summary}
        </button>
      </div>
    </div>
  )
}

function CompletedSiteCard({ site, total, paymentsTotal, onNavigate }) {
  const balance = total - paymentsTotal
  return (
    <div
      onClick={() => onNavigate('ledger', { siteId: site.id })}
      className="w-full flex items-center justify-between rounded-3xl bg-[#F5F5F5] p-5 active:scale-[0.98] transition-transform text-left cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold font-display text-[#2B1D1C] truncate">{site.name}</h2>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-green-200 text-green-800 flex-shrink-0">
            ✓ Done
          </span>
        </div>
        <div className="mt-1 space-y-0.5">
          {site.ownerName && (
            <p className="text-[11px] text-[#A0A0A0] flex items-center gap-1">
              <User size={10} className="text-[#A0A0A0]" />
              {site.ownerName}
            </p>
          )}
          {site.ownerPhone && (
            <a 
              href={`tel:${site.ownerPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] text-[#A0A0A0] flex items-center gap-1 active:text-[#FED447] w-fit"
            >
              <Phone size={10} className="text-[#A0A0A0]" />
              <span className="underline decoration-gray-200 underline-offset-2">{site.ownerPhone}</span>
            </a>
          )}
        </div>
        <p className="text-[11px] text-[#A0A0A0] mt-1 italic">
          {site.completedAt
            ? `Completed ${new Date(site.completedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
            : new Date(site.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          }
        </p>
      </div>
      <div className="text-right ml-4 flex-shrink-0">
        <p className="text-[18px] font-bold font-display text-[#2B1D1C]">{formatINR(total)}</p>
        {balance > 0 && (
          <p className="text-[11px] font-semibold text-red-500">Due: {formatINR(balance)}</p>
        )}
        {balance <= 0 && (
          <p className="text-[11px] font-semibold text-green-600">Settled</p>
        )}
      </div>
    </div>
  )
}

function EmptyState({ onAdd, t }) {
  return (
    <div className="flex flex-col items-center justify-center h-[65vh] text-center px-8">
      <div className="w-24 h-24 rounded-3xl overflow-hidden mb-6 bg-[#FFF8DC] flex items-center justify-center">
        <img src="/logo.png" alt="Ashvin Construction" className="w-full h-full object-contain p-2" />
      </div>
      <h2 className="text-[22px] font-bold font-display text-[#2B1D1C] mb-2">{t.noSites || 'No Sites Yet'}</h2>
      <p className="text-[16px] text-[#A0A0A0] leading-relaxed mb-8">
        {t.noSitesDesc || 'Add your first construction site to start tracking expenses.'}
      </p>
      <button
        id="add-first-site-btn"
        onClick={onAdd}
        className="bg-[#FED447] text-[#2B1D1C] font-bold text-[16px] px-10 h-[56px] rounded-full flex items-center gap-2 shadow-md"
      >
        <Plus size={20} strokeWidth={2.5} />
        {t.addFirstSite}
      </button>
    </div>
  )
}

function AddSiteModal({
  siteName, ownerName, ownerPhone, address,
  onSiteNameChange, onOwnerNameChange, onOwnerPhoneChange, onAddressChange,
  onSubmit, onClose, t
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white w-full rounded-[32px] p-6 pb-8 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold font-display text-[#2B1D1C]">{t.newSiteTitle || 'New Construction Site'}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={18} color="#A0A0A0" />
          </button>
        </div>

        {/* Site Name */}
        <div className="mb-4">
          <label className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
            {t.siteName || 'Site Name'}
          </label>
          <input
            type="text"
            autoFocus
            autoCapitalize="words"
            value={siteName}
            onChange={(e) => onSiteNameChange(e.target.value)}
            placeholder={t.sitePlaceholder || 'e.g. Rajnagar Project'}
            className="w-full h-[48px] bg-[#F5F5F5] rounded-2xl px-5 text-[15px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447]"
          />
        </div>

        {/* Owner Name */}
        <div className="mb-4">
          <label className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
            {t.ownerName || 'Owner / Client Name'}
          </label>
          <input
            type="text"
            autoCapitalize="words"
            value={ownerName}
            onChange={(e) => onOwnerNameChange(e.target.value)}
            placeholder={t.ownerNamePlaceholder || 'e.g. Mr. Rajesh Patel'}
            className="w-full h-[48px] bg-[#F5F5F5] rounded-2xl px-5 text-[15px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447]"
          />
        </div>

        {/* Owner Phone */}
        <div className="mb-4">
          <label className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
            {t.ownerPhone || 'Mobile Number'}
          </label>
          <input
            type="tel"
            inputMode="tel"
            value={ownerPhone}
            onChange={(e) => onOwnerPhoneChange(e.target.value.replace(/[^0-9+\- ]/g, ''))}
            placeholder={t.ownerPhonePlaceholder || 'e.g. 9876543210'}
            className="w-full h-[48px] bg-[#F5F5F5] rounded-2xl px-5 text-[15px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447]"
          />
        </div>

        {/* Address / Location */}
        <div className="mb-5">
          <label className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
            {t.siteAddress || 'Location / Address'}
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder={t.siteAddressPlaceholder || 'e.g. 12, Alkapuri Society, Vadodara'}
            className="w-full h-[48px] bg-[#F5F5F5] rounded-2xl px-5 text-[15px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447]"
          />
        </div>

        <button
          id="create-site-btn"
          onClick={onSubmit}
          disabled={!siteName.trim()}
          className="w-full h-[56px] bg-[#FED447] text-[#2B1D1C] font-bold text-[17px] rounded-full disabled:opacity-40"
        >
          {t.createSite || 'Create Site'}
        </button>
        <button onClick={onClose} className="w-full mt-3 h-[44px] text-[#A0A0A0] text-[15px]">
          {t.cancel}
        </button>
      </div>
    </div>
  )
}
