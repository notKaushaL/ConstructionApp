import { useState, useEffect } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import useStore from '../store/useStore'
import { todayISO } from '../utils/helpers'
import { useLang } from '../App'

// ─── Translation maps for display (keys stay English for data) ─────
const LABOR_LABEL_KEY = {
  'Majur': 'majur', 'Karigar': 'karigar', 'Mason': 'mason', 'Plumber': 'plumber',
  'Electrician': 'electrician', 'Carpenter': 'carpenter', 'Painter': 'painter',
  'Welder': 'welder', 'Salaat': 'salaat', 'Helper': 'helper',
  'Karigar + Helper': 'karigarHelper', 'Others': 'others',
}
const MATERIAL_LABEL_KEY = {
  'Cement': 'cement', 'Steel': 'steel', 'Sand': 'sand', 'Bricks': 'bricks',
  'Paint': 'paint', 'Wood': 'wood', 'Tiles': 'tiles', 'Pipes': 'pipes',
  'Gravel': 'gravel', 'Other': 'other'
}
const MISC_LABEL_KEY = {
  'Food': 'food', 'Rent': 'rent', 'Transport': 'transport',
  'Tools': 'tools', 'Others': 'others',
}

// ─── Labor categories ──────────────────────────────────────────────
const LABOR_CHIPS = [
  { label: 'Majur',           icon: '👷' },
  { label: 'Karigar',         icon: '🔨' },
  { label: 'Mason',           icon: '🧱' },
  { label: 'Plumber',         icon: '🚧' },
  { label: 'Electrician',     icon: '⚡' },
  { label: 'Carpenter',       icon: '🪵' },
  { label: 'Painter',         icon: '🎨' },
  { label: 'Welder',          icon: '🔥' },
  { label: 'Salaat',          icon: '🧱' },
  { label: 'Helper',          icon: '🙋' },
  { label: 'Karigar + Helper',icon: '👥' },
  { label: 'Others',          icon: '👤' },
]

// ─── Material presets — all support both Qty×Price and Direct Amount ────────
const MATERIAL_PRESETS = [
  { label: 'Cement',  icon: '🏗️', qtyLabel: 'No. of Bags',   unitLabel: 'bags',   priceLabel: '₹ per Bag'   },
  { label: 'Steel',   icon: '⚙️', qtyLabel: 'Weight (kg)',    unitLabel: 'kg',     priceLabel: '₹ per kg'    },
  { label: 'Sand',    icon: '🪨', qtyLabel: 'No. of Trucks',  unitLabel: 'trucks', priceLabel: '₹ per Truck' },
  { label: 'Bricks',  icon: '🧱', qtyLabel: 'No. of Bricks',  unitLabel: 'bricks', priceLabel: '₹ per Brick' },
  { label: 'Paint',   icon: '🎨', qtyLabel: 'Liters',          unitLabel: 'ltrs',   priceLabel: '₹ per Liter' },
  { label: 'Wood',    icon: '🪵', qtyLabel: 'No. of Pieces',   unitLabel: 'pcs',    priceLabel: '₹ per Piece' },
  { label: 'Tiles',   icon: '🟫', qtyLabel: 'No. of Boxes',    unitLabel: 'boxes',  priceLabel: '₹ per Box'   },
  { label: 'Pipes',   icon: '🔵', qtyLabel: 'No. of Pieces',   unitLabel: 'pcs',    priceLabel: '₹ per Piece' },
  { label: 'Gravel',  icon: '🪨', qtyLabel: 'No. of Trucks',   unitLabel: 'trucks', priceLabel: '₹ per Truck' },
  { label: 'Other',   icon: '📦', qtyLabel: 'Quantity',         unitLabel: 'units',  priceLabel: '₹ per Unit'  },
]

// ─── Misc categories ─────────────────────────────────────
const MISC_CATEGORIES = [
  { label: 'Food',      icon: '🍱' },
  { label: 'Rent',      icon: '🏠' },
  { label: 'Transport', icon: '🚛' },
  { label: 'Tools',     icon: '🔧' },
  { label: 'Others',    icon: '📦' },
]

const TABS = ['Labor', 'Material', 'Misc']

export default function AddEntryScreen({ siteId, entryToEdit, onNavigate }) {
  const { sites, addEntry, updateEntry } = useStore()
  const site = sites.find((s) => s.id === siteId)
  const isEditing = !!entryToEdit
  const t = useLang()
  const TAB_LABELS = { 'Labor': t.labor, 'Material': t.material, 'Misc': t.misc }

  const [activeTab, setActiveTab] = useState(() => {
    if (entryToEdit) {
      if (entryToEdit.type === 'labor') return 'Labor'
      if (entryToEdit.type === 'material') return 'Material'
      return 'Misc'
    }
    return 'Labor'
  })

  // Labor
  const [laborCategory, setLaborCategory] = useState(entryToEdit?.type === 'labor' ? entryToEdit.category : 'Majur')

  // Material
  const [matPreset, setMatPreset] = useState(() => {
    if (entryToEdit?.type === 'material') {
      return MATERIAL_PRESETS.find(p => p.label === entryToEdit.category) || MATERIAL_PRESETS[9]
    }
    return MATERIAL_PRESETS[0]
  })
  const [customMatName, setCustomMatName] = useState(
    entryToEdit?.type === 'material' && !MATERIAL_PRESETS.find(p => p.label === entryToEdit.category)
      ? entryToEdit.category : ''
  )
  const [showCustomInput, setShowCustomInput] = useState(
    entryToEdit?.type === 'material' && !MATERIAL_PRESETS.find(p => p.label === entryToEdit.category)
  )
  const [qty, setQty] = useState(entryToEdit?.qty ? String(entryToEdit.qty) : '')
  const [unitPrice, setUnitPrice] = useState(entryToEdit?.unitPrice ? String(entryToEdit.unitPrice) : '')
  const [useDirect, setUseDirect] = useState(entryToEdit?.type === 'material' && !entryToEdit?.qty)

  // Misc
  const [miscCategory, setMiscCategory] = useState(entryToEdit?.type === 'misc' ? entryToEdit.category : 'Food')

  // Shared
  const [amount, setAmount] = useState(entryToEdit?.amount ? String(entryToEdit.amount) : '')
  const [date, setDate] = useState(entryToEdit?.date || todayISO())
  const [note, setNote] = useState(entryToEdit?.note || '')

  if (!site) { onNavigate('home'); return null }

  const handleSelectPreset = (preset) => {
    setMatPreset(preset)
    setShowCustomInput(preset.label === 'Other')
    if (preset.label !== 'Other') setCustomMatName('')
  }

  const handleSelectMisc = (cat) => setMiscCategory(cat)

  const handleSave = () => {
    const finalAmount = activeTab === 'Material' && !useDirect
      ? (parseFloat(qty) || 0) * (parseFloat(unitPrice) || 0)
      : parseFloat(amount)

    if (!finalAmount || finalAmount <= 0) return

    const data = {
      siteId,
      type: activeTab.toLowerCase(),
      category: activeTab === 'Labor' ? laborCategory 
                : activeTab === 'Material' ? (showCustomInput ? customMatName : matPreset.label)
                : miscCategory,
      amount: finalAmount,
      date,
      note,
      ...(activeTab === 'Material' && !useDirect ? { qty: parseFloat(qty), unitPrice: parseFloat(unitPrice) } : {})
    }

    if (isEditing) updateEntry(entryToEdit.id, data)
    else addEntry(data)
    
    onNavigate('ledger', { siteId })
  }

  const computedTotal = (parseFloat(qty) || 0) * (parseFloat(unitPrice) || 0)
  const showQtyFields = activeTab === 'Material' && !useDirect

  return (
    <div className="screen bg-white">
      {/* Sticky Header with glassmorphism */}
      <div className="sticky top-0 z-20 px-5 pt-12 pb-3 bg-white/80 backdrop-blur-xl border-b border-gray-100/80">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => onNavigate('ledger', { siteId })}
            className="w-11 h-11 rounded-2xl bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} color="#2B1D1C" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[19px] font-bold font-display text-[#2B1D1C] leading-tight">
              {isEditing ? (t.editEntry || 'Edit Expense') : (t.addEntry || 'Add Expense')}
            </h1>
            <p
              className="text-[12px] font-medium tracking-wide truncate"
              style={{
                background: 'linear-gradient(90deg, #A0A0A0 60%, transparent 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {site.name}
            </p>
          </div>
          {/* Active tab badge */}
          <span className="flex-shrink-0 bg-[#FED447] text-[#2B1D1C] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {TAB_LABELS[activeTab] || activeTab}
          </span>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 bg-[#F5F5F5] rounded-2xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase()}`}
              onClick={() => { setActiveTab(tab); setAmount(''); setNote('') }}
              className={`flex-1 h-[40px] rounded-xl text-[14px] font-semibold transition-all
                ${activeTab === tab ? 'bg-[#FED447] text-[#2B1D1C]' : 'text-[#A0A0A0]'}`}
            >
              {TAB_LABELS[tab] || tab}
            </button>
          ))}
        </div>
      </div>

      {/* Form Body */}
      <div className="screen-body px-5 pt-4">
        <div className="space-y-6 pb-10">

          {/* ── LABOR ── */}
          {activeTab === 'Labor' && (
            <div>
              <Label>{t.laborType}</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {LABOR_CHIPS.map(({ label, icon }) => (
                  <button
                    key={label}
                    id={`labor-chip-${label.toLowerCase()}`}
                    onClick={() => setLaborCategory(label)}
                    className={`h-[64px] rounded-2xl flex flex-col items-center justify-center gap-1 text-[12px] font-semibold transition-all
                      ${laborCategory === label ? 'bg-[#FED447] text-[#2B1D1C]' : 'bg-[#F5F5F5] text-[#A0A0A0]'}`}
                  >
                    <span className="text-[20px]">{icon}</span>
                    {t[LABOR_LABEL_KEY[label]] || label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── MATERIAL ── */}
          {activeTab === 'Material' && (
            <>
              <div>
                <Label>{t.materialType}</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {MATERIAL_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      id={`material-chip-${preset.label.toLowerCase()}`}
                      onClick={() => handleSelectPreset(preset)}
                      className={`h-[64px] rounded-2xl flex flex-col items-center justify-center gap-1 text-[12px] font-semibold transition-all
                        ${matPreset.label === preset.label ? 'bg-[#FED447] text-[#2B1D1C]' : 'bg-[#F5F5F5] text-[#A0A0A0]'}`}
                    >
                      <span className="text-[20px]">{preset.icon}</span>
                      {t[MATERIAL_LABEL_KEY[preset.label]] || preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {showCustomInput && (
                <div>
                  <Label>{t.materialName}</Label>
                  <input
                    id="custom-mat-input"
                    type="text"
                    autoFocus
                    autoCapitalize="words"
                    value={customMatName}
                    onChange={(e) => setCustomMatName(e.target.value)}
                    placeholder={t.customMatPlaceholder}
                    className="w-full h-[52px] bg-[#F5F5F5] rounded-2xl px-5 text-[16px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447] mt-2"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  id="toggle-qty-mode"
                  onClick={() => { setUseDirect(false); setAmount('') }}
                  className={`flex-1 h-[44px] rounded-2xl text-[14px] font-semibold transition-all
                    ${!useDirect ? 'bg-[#2B1D1C] text-[#FED447]' : 'bg-[#F5F5F5] text-[#A0A0A0]'}`}
                >
                  {t.qtyPrice}
                </button>
                <button
                  id="toggle-direct-mode"
                  onClick={() => { setUseDirect(true); setQty(''); setUnitPrice('') }}
                  className={`flex-1 h-[44px] rounded-2xl text-[14px] font-semibold transition-all
                    ${useDirect ? 'bg-[#2B1D1C] text-[#FED447]' : 'bg-[#F5F5F5] text-[#A0A0A0]'}`}
                >
                  {t.directAmount}
                </button>
              </div>

              {!useDirect && (
                <div className="grid grid-cols-2 gap-3 bg-[#F5F5F5] rounded-3xl p-4">
                  <div>
                    <Label>{matPreset.qtyLabel}</Label>
                    <input
                      id="qty-input"
                      type="text"
                      inputMode="decimal"
                      value={qty}
                      onChange={(e) => setQty(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0"
                      className="w-full h-[52px] bg-white rounded-2xl px-5 text-[18px] font-bold text-[#2B1D1C] outline-none mt-2"
                    />
                  </div>
                  <div>
                    <Label>{matPreset.priceLabel}</Label>
                    <input
                      id="price-input"
                      type="text"
                      inputMode="decimal"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0"
                      className="w-full h-[52px] bg-white rounded-2xl px-5 text-[18px] font-bold text-[#2B1D1C] outline-none mt-2"
                    />
                  </div>
                  <div className="col-span-2 pt-2 mt-2 border-t border-gray-200/50 flex justify-between items-center">
                    <div className="text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider">
                      {t.totalSpent}
                    </div>
                    <p className="text-[26px] font-bold font-display text-[#2B1D1C]">
                      {computedTotal !== null && computedTotal > 0
                        ? `₹${computedTotal.toLocaleString('en-IN')}`
                        : '₹0'}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── MISC ── */}
          {activeTab === 'Misc' && (
            <div>
              <Label>{t.category}</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {MISC_CATEGORIES.map(({ label, icon }) => (
                  <button
                    key={label}
                    id={`misc-chip-${label.toLowerCase()}`}
                    onClick={() => handleSelectMisc(label)}
                    className={`h-[64px] rounded-2xl flex flex-col items-center justify-center gap-1 text-[12px] font-semibold transition-all
                      ${miscCategory === label ? 'bg-[#FED447] text-[#2B1D1C]' : 'bg-[#F5F5F5] text-[#A0A0A0]'}`}
                  >
                    <span className="text-[22px]">{icon}</span>
                    {t[MISC_LABEL_KEY[label]] || label}
                  </button>
                ))}
              </div>
            </div>
          )}


          {/* ── Amount field ── */}
          {!(activeTab === 'Material' && !useDirect) && (
            <div>
              <Label>{t.amount}</Label>
              <div className="relative mt-2">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[22px] font-bold text-[#A0A0A0]">₹</span>
                <input
                  id="amount-input"
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  placeholder="0"
                  className="w-full h-[64px] bg-[#FFF8DC] rounded-2xl pl-10 pr-5 text-[28px] font-bold font-display text-[#2B1D1C] placeholder-[#D4C080] outline-none focus:ring-2 focus:ring-[#FED447]"
                />
              </div>

              {activeTab === 'Labor' && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[500, 600, 800, 1000, 1200, 1400, 1500, 2000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt.toString())}
                      className={`h-[44px] rounded-xl text-[14px] font-bold transition-all border flex items-center justify-center
                        ${amount === amt.toString() 
                          ? 'bg-[#FED447] border-[#FED447] text-[#2B1D1C]' 
                          : 'bg-white border-gray-100 text-[#A0A0A0] active:bg-gray-50'
                        }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Date & Note ── */}
          <div className="grid grid-cols-1 gap-5">
            <div>
              <Label>{t.date}</Label>
              <input
                id="entry-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[52px] bg-[#F5F5F5] rounded-2xl px-5 text-[16px] text-[#2B1D1C] outline-none focus:ring-2 focus:ring-[#FED447] mt-2"
              />
            </div>
            <div>
              <Label>{t.note}</Label>
              <textarea
                id="entry-note-input"
                value={note}
                autoCapitalize="sentences"
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.notePlaceholder}
                rows={3}
                className="w-full bg-[#F5F5F5] rounded-3xl px-5 py-4 text-[16px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447] resize-none mt-2"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onNavigate('ledger', { siteId })}
              className="flex-1 h-[56px] text-[#A0A0A0] font-bold text-[16px]"
            >
              {t.cancel}
            </button>
            <button
              id="save-entry-btn"
              onClick={handleSave}
              className="flex-[2] h-[56px] bg-[#FED447] text-[#2B1D1C] font-bold text-[17px] rounded-full shadow-lg active:scale-[0.98] transition-transform btn-press"
            >
              <span className="flex items-center justify-center gap-2">
                <Plus size={20} strokeWidth={2.5} />
                {isEditing ? t.save : (t.save)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ children }) {
  return (
    <label className="text-[12px] font-bold text-[#A0A0A0] tracking-wider uppercase px-1">
      {children}
    </label>
  )
}
