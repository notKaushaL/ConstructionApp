import { useState } from 'react'
import { ArrowLeft, Plus, Trash2, ChevronRight } from 'lucide-react'
import useStore from '../store/useStore'
import { formatDisplayDate, formatINR, getCategoryIcon, getCategoryColor } from '../utils/helpers'
import { useLang } from '../App'

export default function LedgerScreen({ siteId, onNavigate }) {
  const { sites, getSiteEntriesByDate, getSiteTotal, deleteEntry } = useStore()
  const site = sites.find((s) => s.id === siteId)
  const groups = getSiteEntriesByDate(siteId)
  const total = getSiteTotal(siteId)
  const t = useLang()

  if (!site) {
    onNavigate('home')
    return null
  }

  return (
    <div className="screen bg-white">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 bg-white sticky top-0 z-10 border-b border-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <button
            id="back-btn"
            onClick={() => onNavigate('home')}
            className="w-11 h-11 rounded-2xl bg-[#F5F5F5] flex items-center justify-center"
          >
            <ArrowLeft size={20} color="#2B1D1C" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-bold font-display text-[#2B1D1C] truncate leading-tight">
              {site.name}
            </h1>
            <p className="text-[12px] text-[#A0A0A0]">{t.dailyLedger}</p>
          </div>
          <div className="bg-[#FFF8DC] px-4 py-2 rounded-2xl">
            <p className="text-[17px] font-bold font-display text-[#D4A800]">{formatINR(total)}</p>
          </div>
        </div>
      </div>

      <div className="screen-body px-5">
        {groups.length === 0 ? (
          <EmptyLedger onAdd={() => onNavigate('addEntry', { siteId })} />
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
                    <EntryCard key={entry.id} entry={entry} onDelete={() => deleteEntry(entry.id)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB — in-flow, only when entries exist */}
      {groups.length > 0 && (
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
    </div>
  )
}

function EntryCard({ entry, onDelete }) {
  const [showDelete, setShowDelete] = useState(false)
  const icon = getCategoryIcon(entry.category)
  const colorClass = getCategoryColor(entry.category)

  return (
    <div className="bg-white rounded-3xl card-shadow card-stripe p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-11 h-11 rounded-2xl bg-[#F5F5F5] flex items-center justify-center text-[20px] flex-shrink-0">
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[16px] font-semibold text-[#2B1D1C] leading-tight">
                {entry.description || entry.category}
              </p>
              <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${colorClass}`}>
                {entry.category}
              </span>
              {/* Quantity breakdown line */}
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

        {/* Delete */}
        <button
          onClick={() => setShowDelete(!showDelete)}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[#A0A0A0]"
        >
          <Trash2 size={17} />
        </button>
      </div>

      {/* Delete Confirm */}
      {showDelete && (
        <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2">
          <button
            onClick={() => setShowDelete(false)}
            className="flex-1 h-[40px] bg-[#F5F5F5] text-[#A0A0A0] text-[14px] font-medium rounded-xl"
          >
            Keep
          </button>
          <button
            onClick={onDelete}
            className="flex-1 h-[40px] bg-red-50 text-red-600 text-[14px] font-semibold rounded-xl"
          >
            Delete Entry
          </button>
        </div>
      )}
    </div>
  )
}

function EmptyLedger({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center h-[55vh] text-center px-8">
      <div className="text-[60px] mb-4">📒</div>
      <h2 className="text-[20px] font-bold font-display text-[#2B1D1C] mb-2">No Entries Yet</h2>
      <p className="text-[15px] text-[#A0A0A0] mb-8">Start adding labor or material expenses to this site.</p>
      <button onClick={onAdd} className="bg-[#FED447] text-[#2B1D1C] font-bold text-[16px] px-8 h-[52px] rounded-full">
        + Add First Entry
      </button>
    </div>
  )
}
