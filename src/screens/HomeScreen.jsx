import { useState } from 'react'
import { Plus, BarChart3, IndianRupee, MapPin, Phone, User } from 'lucide-react'
import useStore from '../store/useStore'
import { formatINR } from '../utils/helpers'
import { useLang } from '../App'

export default function HomeScreen({ onNavigate }) {
  const { sites, addSite, getSiteTotal, getSitePaymentsTotal } = useStore()
  const t = useLang()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSiteName, setNewSiteName] = useState('')
  const [newOwnerName, setNewOwnerName] = useState('')
  const [newOwnerPhone, setNewOwnerPhone] = useState('')
  const [newAddress, setNewAddress] = useState('')

  const handleAddSite = () => {
    if (!newSiteName.trim()) return
    const id = addSite(newSiteName, {
      ownerName: newOwnerName.trim(),
      ownerPhone: newOwnerPhone.trim(),
      address: newAddress.trim(),
    })
    setNewSiteName('')
    setNewOwnerName('')
    setNewOwnerPhone('')
    setNewAddress('')
    setShowAddModal(false)
    onNavigate('ledger', { siteId: id })
  }

  // Separate active and completed sites
  const activeSites = sites.filter(s => (s.status || 'active') === 'active')
  const completedSites = sites.filter(s => s.status === 'completed')

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
    <div className="w-full text-left rounded-3xl card-shadow card-stripe p-5">
      {/* Top row: name + total */}
      <button
        id={`site-card-${site.id}`}
        onClick={() => onNavigate('ledger', { siteId: site.id })}
        className="w-full text-left flex items-center justify-between active:scale-[0.98] transition-transform"
      >
        <div className="flex-1 min-w-0">
          <h2 className="text-[18px] font-bold font-display text-[#2B1D1C] truncate">{site.name}</h2>
          {site.ownerName && (
            <p className="text-[12px] text-[#D4A800] mt-0.5 flex items-center gap-1">
              <User size={11} /> {site.ownerName}
            </p>
          )}
          <p className="text-[12px] text-[#A0A0A0] mt-0.5">
            {new Date(site.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            {site.address ? ` · ${site.address}` : ''}
          </p>
        </div>
        <div className="text-right ml-4 flex-shrink-0">
          <p className="text-[22px] font-bold font-display text-[#2B1D1C]">{formatINR(total)}</p>
          <p className="text-[12px] text-[#A0A0A0]">{t.totalSpent || 'Total Spent'}</p>
        </div>
      </button>

      {/* Action Buttons Row */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        <button
          id={`payment-log-${site.id}`}
          onClick={() => onNavigate('paymentLog', { siteId: site.id })}
          className="flex-1 h-[38px] bg-[#FFF8DC] text-[#D4A800] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <IndianRupee size={14} strokeWidth={2.5} />
          {t.addPayment || 'Add Payment'}
        </button>
        <button
          id={`site-summary-${site.id}`}
          onClick={() => onNavigate('siteSummary', { siteId: site.id })}
          className="flex-1 h-[38px] bg-[#F5F5F5] text-[#A0A0A0] text-[12px] font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <BarChart3 size={14} strokeWidth={2.5} />
          {t.summary}
        </button>
      </div>
    </div>
  )
}

/* ── Completed Site Card — muted, compact, with green accent ───────────────── */
function CompletedSiteCard({ site, total, paymentsTotal, onNavigate }) {
  const balance = total - paymentsTotal

  return (
    <button
      id={`site-card-${site.id}`}
      onClick={() => onNavigate('ledger', { siteId: site.id })}
      className="completed-card w-full text-left rounded-2xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold font-display text-[#2B1D1C] truncate">{site.name}</h2>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-green-200 text-green-800 flex-shrink-0">
            ✓ Done
          </span>
        </div>
        {site.ownerName && (
          <p className="text-[11px] text-[#A0A0A0] mt-0.5">{site.ownerName}</p>
        )}
        <p className="text-[12px] text-[#A0A0A0] mt-0.5">
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
    </button>
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

function AddSiteModal({ siteName, ownerName, ownerPhone, address, onSiteNameChange, onOwnerNameChange, onOwnerPhoneChange, onAddressChange, onSubmit, onClose, t }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <h2 className="text-[20px] font-bold font-display text-[#2B1D1C] mb-5">{t.newSiteTitle || 'New Construction Site'}</h2>

        {/* Site Name — required */}
        <div className="mb-4">
          <label className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
            {t.siteName} *
          </label>
          <input
            id="site-name-input"
            type="text"
            autoFocus
            value={siteName}
            onChange={(e) => onSiteNameChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            placeholder={t.sitePlaceholder || 'e.g. Shyamal Villa, Gorwa Road...'}
            className="w-full h-[52px] bg-[#F5F5F5] rounded-2xl px-5 text-[17px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447]"
          />
        </div>

        {/* Owner Name */}
        <div className="mb-4">
          <label className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
            {t.ownerName || 'Owner / Client Name'}
          </label>
          <input
            type="text"
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
            inputMode="numeric"
            value={ownerPhone}
            onChange={(e) => onOwnerPhoneChange(e.target.value)}
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
