import { useState } from 'react'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import useStore from '../store/useStore'
import { todayISO } from '../utils/helpers'
import { useLang } from '../App'

const METHODS = ['bankTransfer', 'cash', 'upi']
const METHOD_MAP = { 'bankTransfer': 'bank', 'cash': 'cash', 'upi': 'upi' }

export default function PaymentLogScreen({ siteId, onNavigate }) {
  const { sites, addPayment } = useStore()
  const site = sites.find((s) => s.id === siteId)
  const t = useLang()

  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bankTransfer')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')

  if (!site) { onNavigate('home'); return null }

  const canSave = parseFloat(amount) > 0

  const handleSave = () => {
    if (!canSave) return
    addPayment({
      siteId,
      amount,
      method: METHOD_MAP[method],
      date,
      note,
    })
    onNavigate('home')
  }

  return (
    <div className="screen bg-white">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 bg-white sticky top-0 z-10 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="w-11 h-11 rounded-2xl bg-[#F5F5F5] flex items-center justify-center active:scale-95 transition-transform"
          >
            <ArrowLeft size={20} color="#2B1D1C" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] font-bold font-display text-[#2B1D1C] leading-tight">{t.logPayment}</h1>
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
        </div>
      </div>

      {/* Form Body */}
      <div className="screen-body px-5">
        <div className="mt-5 space-y-5">

          {/* Amount Received */}
          <div className="bg-[#F5F5F5] rounded-3xl p-5">
            <p className="text-[11px] font-bold text-[#A0A0A0] tracking-wider uppercase mb-3">{t.amountReceived}</p>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[24px] font-bold text-[#A0A0A0]">₹</span>
              <input
                id="payment-amount-input"
                type="text"
                inputMode="decimal"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0.00"
                className="w-full h-[64px] bg-white rounded-2xl pl-12 pr-5 text-[28px] font-bold font-display text-[#2B1D1C] placeholder-[#D0D0D0] outline-none focus:ring-2 focus:ring-[#FED447]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-[#F5F5F5] rounded-3xl p-5">
            <p className="text-[11px] font-bold text-[#A0A0A0] tracking-wider uppercase mb-3">{t.paymentMethod}</p>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all
                    ${method === m
                      ? 'bg-[#FED447] text-[#2B1D1C]'
                      : 'bg-white text-[#A0A0A0]'
                    }`}
                >
                  {t[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Note */}
          <div className="bg-[#F5F5F5] rounded-3xl p-5">
            <p className="text-[11px] font-bold text-[#A0A0A0] tracking-wider uppercase mb-3">{t.dateOfReceipt}</p>
            <input
              id="payment-date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-[48px] bg-white rounded-2xl px-4 text-[15px] text-[#2B1D1C] outline-none focus:ring-2 focus:ring-[#FED447] mb-4"
            />

            <p className="text-[11px] font-bold text-[#A0A0A0] tracking-wider uppercase mb-3">{t.referenceNote}</p>
            <textarea
              id="payment-note-input"
              value={note}
              autoCapitalize="sentences"
              onChange={(e) => setNote(e.target.value)}
              placeholder={t.notePlaceholderPayment}
              rows={2}
              className="w-full bg-white rounded-2xl px-4 py-3 text-[15px] text-[#2B1D1C] placeholder-[#A0A0A0] outline-none focus:ring-2 focus:ring-[#FED447] resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            id="save-payment-btn"
            onClick={handleSave}
            disabled={!canSave}
            className="w-full h-[56px] bg-[#FED447] text-[#2B1D1C] font-bold text-[17px] rounded-full disabled:opacity-40 flex items-center justify-center gap-2 mt-4"
          >
            <CheckCircle size={20} strokeWidth={2.5} />
            {t.savePaymentLog}
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full h-[44px] text-[#A0A0A0] text-[15px] mb-6"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  )
}
