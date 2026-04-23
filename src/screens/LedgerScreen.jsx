import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Pencil, Settings, Check, X, RotateCcw, Phone, User } from 'lucide-react'
import useStore from '../store/useStore'
import { formatDisplayDate, formatINR, getCategoryIcon, getCategoryColor } from '../utils/helpers'
import { useLang } from '../App'

export default function LedgerScreen({ siteId, onNavigate }) {
  const { sites, getSiteEntriesByDate, getSiteTotal, deleteEntry, updateSiteName, setSiteStatus, updateSiteDetails } = useStore()
  const site = sites.find((s) => s.id === siteId)
  const groups = getSiteEntriesByDate(siteId)
  const total = getSiteTotal(siteId)
  const t = useLang()

  const [showSettings, setShowSettings] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)
  const [pendingStatus, setPendingStatus] = useState(null)
  const [showSiteInfo, setShowSiteInfo] = useState(false)
  const [editOwner, setEditOwner] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')

  if (!site) {
    onNavigate('home')
    return null
  }

  const isCompleted = site.status === 'completed'

  const handleStartEditName = () => {
    setNewName(site.name)
    setEditingName(true)
    setShowSettings(false)
  }

  const handleSaveName = () => {
    if (newName.trim() && newName.trim() !== site.name) {
      updateSiteName(siteId, newName)
    }
    setEditingName(false)
  }

  const handleStatusChange = (newStatus) => {
    setPendingStatus(newStatus)
    setShowStatusConfirm(true)
    setShowSettings(false)
  }

  const confirmStatusChange = () => {
    if (pendingStatus) {
      setSiteStatus(siteId, pendingStatus)
    }
    setShowStatusConfirm(false)
    setPendingStatus(null)
  }

  const handleOpenSiteInfo = () => {
    setEditOwner(site.ownerName || '')
    setEditPhone(site.ownerPhone || '')
    setEditAddress(site.address || '')
    setShowSiteInfo(true)
    setShowSettings(false)
  }

  const handleSaveSiteInfo = () => {
    updateSiteDetails(siteId, {
      ownerName: editOwner.trim(),
      ownerPhone: editPhone.trim(),
      address: editAddress.trim(),
    })
    setShowSiteInfo(false)
  }

  return (
    <div className="screen bg-white">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 bg-white sticky top-0 z-10 border-b border-gray-50">
        <div className="flex items-center gap-3 mb-1">
          <button
            id="back-btn"
            onClick={() => onNavigate('home')}
            className="w-11 h-11 rounded-2xl bg-[#F5F5F5] flex items-center justify-center"
          >
            <ArrowLeft size={20} color="#2B1D1C" />
          </button>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="flex-1 h-[36px] bg-[#F5F5F5] rounded-xl px-3 text-[16px] font-bold text-[#2B1D1C] outline-none focus:ring-2 focus:ring-[#FED447]"
                />
                <button onClick={handleSaveName} className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
                  <Check size={18} color="#16a34a" />
                </button>
                <button onClick={() => setEditingName(false)} className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                  <X size={18} color="#dc2626" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-[20px] font-bold font-display text-[#2B1D1C] truncate leading-tight">
                    {site.name}
                  </h1>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0
                    ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                  >
                    {isCompleted ? '✓ Done' : 'Active'}
                  </span>
                </div>
                {(site.ownerName || site.ownerPhone) ? (
                  <div className="mt-1 space-y-0.5">
                    {site.ownerName && (
                      <p className="text-[11px] font-medium text-[#A0A0A0] flex items-center gap-1 leading-tight truncate">
                        <User size={10} className="flex-shrink-0" />
                        {site.ownerName}
                      </p>
                    )}
                    {site.ownerPhone && (
                      <p className="text-[11px] font-medium text-[#A0A0A0] flex items-center gap-1 leading-tight truncate">
                        <Phone size={10} className="flex-shrink-0" />
                        {site.ownerPhone}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[12px] text-[#A0A0A0]">{t.dailyLedger}</p>
                )}
              </>
            )}
          </div>

          {!editingName && (
            <>
              <div className="bg-[#FFF8DC] px-4 py-2 rounded-2xl">
                <p className="text-[17px] font-bold font-display text-[#D4A800]">{formatINR(total)}</p>
              </div>
              {/* Settings gear */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-10 h-10 rounded-2xl bg-[#F5F5F5] flex items-center justify-center relative z-[51]"
              >
                <Settings size={18} color="#2B1D1C" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Settings overlay + dropdown */}
      {showSettings && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowSettings(false)} />
          <div className="absolute right-5 top-[100px] bg-white rounded-2xl card-shadow z-[52] overflow-hidden min-w-[210px] border border-gray-100">
            <button
              onClick={handleStartEditName}
              className="w-full px-4 py-3.5 text-left text-[14px] font-semibold text-[#2B1D1C] flex items-center gap-3 active:bg-[#F5F5F5] transition-colors"
            >
              <Pencil size={16} /> {t.editSiteName || 'Edit Site Name'}
            </button>
            <button
              onClick={handleOpenSiteInfo}
              className="w-full px-4 py-3.5 text-left text-[14px] font-semibold text-[#2B1D1C] flex items-center gap-3 active:bg-[#F5F5F5] transition-colors border-t border-gray-50"
            >
              <User size={16} /> {t.siteDetails || 'Site Details'}
            </button>
            {isCompleted ? (
              <button
                onClick={() => handleStatusChange('active')}
                className="w-full px-4 py-3.5 text-left text-[14px] font-semibold text-blue-600 flex items-center gap-3 active:bg-blue-50 transition-colors border-t border-gray-50"
              >
                <RotateCcw size={16} /> {t.reopenProject || 'Reopen Project'}
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange('completed')}
                className="w-full px-4 py-3.5 text-left text-[14px] font-semibold text-green-600 flex items-center gap-3 active:bg-green-50 transition-colors border-t border-gray-50"
              >
                <Check size={16} /> {t.markCompleted || 'Mark as Completed'}
              </button>
            )}
            <button
              onClick={() => setShowSettings(false)}
              className="w-full px-4 py-3.5 text-left text-[14px] text-[#A0A0A0] border-t border-gray-50 active:bg-[#F5F5F5] transition-colors"
            >
              {t.cancel}
            </button>
          </div>
        </>
      )}

      <div className="screen-body px-5">
        {/* Completed banner */}
        {isCompleted && (
          <div className="mt-3 mb-1 bg-green-50 rounded-2xl p-3 text-center">
            <p className="text-[13px] font-semibold text-green-700">
              🏁 {t.projectCompleted || 'This project is completed. Reopen to add new entries.'}
            </p>
          </div>
        )}

        {groups.length === 0 ? (
          <EmptyLedger onAdd={isCompleted ? null : () => onNavigate('addEntry', { siteId })} isCompleted={isCompleted} t={t} />
        ) : (
          <div className="mt-4 space-y-6 pb-4">
            {groups.map(({ date, entries, total: dayTotal }) => (
              <div key={date}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold text-[#A0A0A0] tracking-wider uppercase">
                    {formatDisplayDate(date)}
                  </span>
                  <span className="text-[14px] font-bold font-display text-[#D4A800]">
                    Daily: {formatINR(dayTotal)}
                  </span>
                </div>
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <EntryCard
                      key={entry.id}
                      entry={entry}
                      isCompleted={isCompleted}
                      onDelete={() => deleteEntry(entry.id)}
                      onEdit={() => onNavigate('addEntry', { siteId, entryToEdit: entry })}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB — only show when project is NOT completed */}
      {groups.length > 0 && !isCompleted && (
        <div className="px-5 pb-4 pt-2">
          <button
            id="add-entry-fab"
            onClick={() => onNavigate('addEntry', { siteId })}
            className="w-full bg-[#FED447] text-[#2B1D1C] font-bold text-[16px] h-[56px] rounded-full shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Plus size={22} strokeWidth={2.5} />
            {t.addEntry}
          </button>
        </div>
      )}

      {/* Status Change Confirm Modal */}
      {showStatusConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowStatusConfirm(false)}>
          <div className="bg-white rounded-3xl p-6 mx-6 max-w-[340px] w-full" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="text-[48px] mb-3">
                {pendingStatus === 'completed' ? '🏁' : '🔄'}
              </div>
              <h3 className="text-[18px] font-bold font-display text-[#2B1D1C] mb-2">
                {pendingStatus === 'completed'
                  ? (t.markCompletedQ || 'Mark as Completed?')
                  : (t.reopenProjectQ || 'Reopen Project?')
                }
              </h3>
              <p className="text-[14px] text-[#A0A0A0]">
                {pendingStatus === 'completed'
                  ? `"${site.name}" ${t.willBeCompleted || 'will be moved to completed projects.'}`
                  : `"${site.name}" ${t.willBeReopened || 'will be reopened as an active project.'}`
                }
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStatusConfirm(false)}
                className="flex-1 h-[48px] bg-[#F5F5F5] text-[#A0A0A0] text-[15px] font-semibold rounded-2xl"
              >
                {t.cancel}
              </button>
              <button
                onClick={confirmStatusChange}
                className={`flex-1 h-[48px] text-[15px] font-bold rounded-2xl
                  ${pendingStatus === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white'
                  }`}
              >
                {pendingStatus === 'completed' ? (t.complete || 'Complete') : (t.reopen || 'Reopen')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Site Info Edit Modal */}
      {showSiteInfo && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={() => setShowSiteInfo(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6 pb-10" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
            <h2 className="text-[20px] font-bold font-display text-[#2B1D1C] mb-5">{t.siteDetails || 'Site Details'}</h2>

            <div className="mb-4">
              <label className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
                {t.ownerName || 'Owner / Client Name'}
              </label>
              <input
                type="text"
                autoFocus
                autoCapitalize="words"
                value={editOwner}
                onChange={(e) => setEditOwner(e.target.value)}
                placeholder={t.ownerNamePlaceholder || 'e.g. Mr. Rajesh Patel'}
                className="w-full h-[48px] bg-[#F5F5F5] rounded-2xl px-5 text-[15px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447]"
              />
            </div>
            <div className="mb-4">
              <label className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
                {t.ownerPhone || 'Mobile Number'}
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value.replace(/[^0-9+\- ]/g, ''))}
                placeholder={t.ownerPhonePlaceholder || 'e.g. 9876543210'}
                className="w-full h-[48px] bg-[#F5F5F5] rounded-2xl px-5 text-[15px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447]"
              />
            </div>
            <div className="mb-5">
              <label className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase block mb-2">
                {t.siteAddress || 'Location / Address'}
              </label>
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder={t.siteAddressPlaceholder || 'e.g. 12, Alkapuri Society, Vadodara'}
                className="w-full h-[48px] bg-[#F5F5F5] rounded-2xl px-5 text-[15px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447]"
              />
            </div>

            <button
              onClick={handleSaveSiteInfo}
              className="w-full h-[52px] bg-[#FED447] text-[#2B1D1C] font-bold text-[17px] rounded-full"
            >
              {t.save}
            </button>
            <button onClick={() => setShowSiteInfo(false)} className="w-full mt-3 h-[44px] text-[#A0A0A0] text-[15px]">
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function EntryCard({ entry, isCompleted, onDelete, onEdit }) {
  const [showActions, setShowActions] = useState(false)
  const icon = getCategoryIcon(entry.category)
  const colorClass = getCategoryColor(entry.category)

  return (
    <div className="bg-white rounded-3xl card-shadow card-stripe p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-11 h-11 rounded-2xl bg-[#F5F5F5] flex items-center justify-center text-[20px] flex-shrink-0">
          {icon}
        </div>

        {/* Content — tap to toggle actions (only if not completed) */}
        <div className="flex-1 min-w-0" onClick={() => !isCompleted && setShowActions(!showActions)}>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-[#2B1D1C] leading-tight">
                {entry.description || entry.category}
              </p>
              <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${colorClass}`}>
                {entry.category}
              </span>
              {entry.qtyDetail ? (
                <p className="text-[12px] font-medium text-[#D4A800] mt-1">
                  📦 {entry.qtyDetail}
                </p>
              ) : null}
              {entry.note && (
                <p className="text-[13px] text-[#A0A0A0] mt-1 leading-snug">{entry.note}</p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[19px] font-bold font-display text-[#2B1D1C]">{formatINR(entry.amount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons — hidden when project is completed */}
      {showActions && !isCompleted && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 h-[40px] bg-[#FFF8DC] text-[#D4A800] text-[14px] font-semibold rounded-xl flex items-center justify-center gap-1.5"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => setShowActions(false)}
            className="flex-1 h-[40px] bg-[#F5F5F5] text-[#A0A0A0] text-[14px] font-medium rounded-xl"
          >
            Close
          </button>
          <button
            onClick={onDelete}
            className="flex-1 h-[40px] bg-red-50 text-red-600 text-[14px] font-semibold rounded-xl flex items-center justify-center gap-1.5"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

function EmptyLedger({ onAdd, isCompleted, t }) {
  return (
    <div className="flex flex-col items-center justify-center h-[55vh] text-center px-8">
      <div className="text-[60px] mb-4">{isCompleted ? '🏁' : '📒'}</div>
      <h2 className="text-[20px] font-bold font-display text-[#2B1D1C] mb-2">
        {isCompleted ? (t.projectDone || 'Project Completed') : (t.noEntries)}
      </h2>
      <p className="text-[15px] text-[#A0A0A0] mb-8">
        {isCompleted
          ? (t.projectDoneDesc || 'Reopen this project from settings to add new entries.')
          : t.noEntriesDesc
        }
      </p>
      {onAdd && (
        <button onClick={onAdd} className="bg-[#FED447] text-[#2B1D1C] font-bold text-[16px] px-8 h-[52px] rounded-full flex items-center justify-center gap-2">
          <Plus size={20} strokeWidth={2.5} />
          {t.addFirstEntry}
        </button>
      )}
    </div>
  )
}
