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
  const [amount, setAmount] = useState(entryToEdit ? String(entryToEdit.amount) : '')
  const [date, setDate] = useState(entryToEdit?.date || todayISO())
  const [note, setNote] = useState(entryToEdit?.note || '')

  if (!site) { onNavigate('home'); return null }

  // ── Derived: final category name ───────────────────────
  const materialName = matPreset.label === 'Other'
    ? (customMatName.trim() || 'Other')
    : matPreset.label

  // ── Auto-calculate amount when qty × unitPrice changes ─
  const computedTotal =
    !useDirect && qty && unitPrice
      ? (parseFloat(qty) || 0) * (parseFloat(unitPrice) || 0)
      : null

  // keep amount field synced with computed total
  useEffect(() => {
    if (computedTotal !== null) {
      setAmount(computedTotal > 0 ? String(computedTotal) : '')
    }
  }, [computedTotal])

  // Reset qty/unitPrice when switching presets
  const handleSelectPreset = (preset) => {
    setMatPreset(preset)
    setQty('')
    setUnitPrice('')
    setAmount('')
    setNote('')
    setUseDirect(false)  // always default to Qty×Price when switching material
    if (preset.label === 'Other') {
      setShowCustomInput(true)
    } else {
      setShowCustomInput(false)
      setCustomMatName('')
    }
  }

  // Reset amount when labor category changes
  const handleSelectLabor = (chip) => {
    setLaborCategory(chip)
    setAmount('')
    setNote('')
  }

  // Reset amount when misc category changes
  const handleSelectMisc = (cat) => {
    setMiscCategory(cat)
    setAmount('')
    setNote('')
  }

  // ── Build the qty detail string for saving ─────────────
  const getQtyDetail = () => {
    if (activeTab !== 'Material') return ''
    if (useDirect || matPreset.mode === 'direct') return ''
    if (qty && unitPrice) return `${qty} ${matPreset.unitLabel} × ₹${parseFloat(unitPrice).toLocaleString('en-IN')}`
    return ''
  }

  // ── Selected category for non-material tabs ────────────
  const selectedCategory =
    activeTab === 'Labor' ? laborCategory :
    activeTab === 'Material' ? materialName : miscCategory

  const type =
    activeTab === 'Labor' ? 'labor' :
    activeTab === 'Material' ? 'material' : 'misc'

  const finalAmount = parseFloat(amount) || 0
  const canSave = finalAmount > 0

  const handleSave = () => {
    if (!canSave) return
    const qtyDetail = getQtyDetail()
    const entryData = {
      siteId,
      type,
      category: selectedCategory,
      description: qtyDetail || selectedCategory,
      amount,
      date,
      note,
      qty: qty ? parseFloat(qty) : undefined,
      unitPrice: unitPrice ? parseFloat(unitPrice) : undefined,
      unitLabel: matPreset.unitLabel,
      qtyDetail,
    }
    if (isEditing) {
      updateEntry(entryToEdit.id, entryData)
    } else {
      addEntry(entryData)
    }
    onNavigate('ledger', { siteId })
  }

  // ── Determine if we show qty fields ────────────────────
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
            <h1 className="text-[19px] font-bold font-display text-[#2B1D1C] leading-tight">{isEditing ? 'Edit Entry' : 'Add Entry'}</h1>
            {/* fading site name */}
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
            {activeTab}
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
      <div className="screen-body px-5">
        <div className="mt-5 space-y-5">

          {/* ── LABOR ── */}
          {activeTab === 'Labor' && (
            <div>
              <Label>{t.laborType}</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {LABOR_CHIPS.map(({ label, icon }) => (
                  <button
                    key={label}
                    id={`labor-chip-${label.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => handleSelectLabor(label)}
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
              {/* Material Chips grid */}
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
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom material name input (when "Other" is selected) */}
              {showCustomInput && (
                <div>
                  <Label>Material Name *</Label>
                  <input
                    id="custom-mat-input"
                    type="text"
                    autoFocus
                    value={customMatName}
                    onChange={(e) => setCustomMatName(e.target.value)}
                    placeholder="e.g. Waterproofing compound, AAC blocks..."
                    className="w-full h-[52px] bg-[#F5F5F5] rounded-2xl px-5 text-[16px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447] mt-2"
                  />
                </div>
              )}

              {/* ── Input Mode Toggle — shown for ALL materials ── */}
              <div className="flex gap-2">
                <button
                  id="toggle-qty-mode"
                  onClick={() => { setUseDirect(false); setAmount('') }}
                  className={`flex-1 h-[44px] rounded-2xl text-[14px] font-semibold transition-all
                    ${!useDirect ? 'bg-[#2B1D1C] text-[#FED447]' : 'bg-[#F5F5F5] text-[#A0A0A0]'}`}
                >
                  🧮 Qty × Price
                </button>
                <button
                  id="toggle-direct-mode"
                  onClick={() => { setUseDirect(true); setQty(''); setUnitPrice(''); setAmount('') }}
                  className={`flex-1 h-[44px] rounded-2xl text-[14px] font-semibold transition-all
                    ${useDirect ? 'bg-[#2B1D1C] text-[#FED447]' : 'bg-[#F5F5F5] text-[#A0A0A0]'}`}
                >
                  ₹ Direct Amount
                </button>
              </div>

              {/* ── Smart Qty × Unit Price fields ── */}
              {showQtyFields && (
                <div className="bg-[#F8F8F8] rounded-3xl p-4 space-y-3">
                  <p className="text-[11px] font-bold text-[#A0A0A0] tracking-wider uppercase">
                    {matPreset.label} Calculation
                  </p>

                  {/* Qty */}
                  <div>
                    <Label>{matPreset.qtyLabel}</Label>
                    <input
                      id="qty-input"
                      type="number"
                      inputMode="decimal"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      placeholder="0"
                      className="w-full h-[52px] bg-white rounded-2xl px-5 text-[20px] font-bold text-[#2B1D1C] placeholder-[#D0D0D0] outline-none focus:ring-2 focus:ring-[#FED447] mt-1"
                    />
                  </div>

                  {/* Unit Price */}
                  <div>
                    <Label>{matPreset.priceLabel}</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[18px] font-bold text-[#A0A0A0]">₹</span>
                      <input
                        id="unit-price-input"
                        type="number"
                        inputMode="decimal"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        placeholder="0"
                        className="w-full h-[52px] bg-white rounded-2xl pl-10 pr-5 text-[20px] font-bold text-[#2B1D1C] placeholder-[#D0D0D0] outline-none focus:ring-2 focus:ring-[#FED447]"
                      />
                    </div>
                  </div>

                  {/* Total display */}
                  <div className="bg-[#FED447] rounded-2xl px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-[#2B1D1C]/60 uppercase tracking-wider">Total</p>
                      {qty && unitPrice && (
                        <p className="text-[12px] text-[#2B1D1C]/70">
                          {qty} {matPreset.unitLabel} × ₹{parseFloat(unitPrice || 0).toLocaleString('en-IN')}
                        </p>
                      )}
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


          {/* ── Amount field: only show for non-qty-material ── */}
          {!(activeTab === 'Material' && showQtyFields) && (
            <div>
              <Label>Amount (₹) *</Label>
              <div className="relative mt-2">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[22px] font-bold text-[#A0A0A0]">₹</span>
                <input
                  id="amount-input"
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full h-[64px] bg-[#FFF8DC] rounded-2xl pl-10 pr-5 text-[28px] font-bold font-display text-[#2B1D1C] placeholder-[#D4C080] outline-none focus:ring-2 focus:ring-[#FED447]"
                />
              </div>
            </div>
          )}

          {/* Date */}
          <div>
            <Label>{t.date}</Label>
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-[52px] bg-[#F5F5F5] rounded-2xl px-5 text-[16px] text-[#2B1D1C] outline-none focus:ring-2 focus:ring-[#FED447] mt-2"
            />
          </div>

          {/* Note */}
          <div>
            <Label>{t.note}</Label>
            <textarea
              id="note-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Supplier name, brand, grade, or any details..."
              rows={2}
              className="w-full bg-[#F5F5F5] rounded-2xl px-5 py-4 text-[16px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447] resize-none mt-2"
            />
          </div>

          {/* Save */}
          <button
            id="save-entry-btn"
            onClick={handleSave}
            disabled={!canSave}
            className="w-full h-[56px] bg-[#FED447] text-[#2B1D1C] font-bold text-[17px] rounded-full disabled:opacity-40 mt-2"
          >
            {isEditing ? (t.update || 'Update') : t.save} {activeTab === 'Material' ? materialName : (TAB_LABELS[activeTab] || activeTab)}
          </button>
          <button
            onClick={() => onNavigate('ledger', { siteId })}
            className="w-full h-[44px] text-[#A0A0A0] text-[15px] mb-6"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  )
}

function Label({ children }) {
  return (
    <p className="text-[12px] font-semibold text-[#A0A0A0] tracking-wider uppercase">{children}</p>
  )
}
