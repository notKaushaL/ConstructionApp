import { ArrowLeft, Trash2 } from 'lucide-react'
import { useState } from 'react'
import useStore from '../store/useStore'
import { formatINR, formatDisplayDate } from '../utils/helpers'

const METHOD_LABEL = { bank: '🏦 Bank Transfer', cash: '💵 Cash', upi: '📱 UPI' }

export default function SiteSummaryScreen({ siteId, onNavigate }) {
  const { sites, getSiteTotal, getSitePaymentsTotal, getSitePayments, entries, deletePayment } = useStore()
  const site = sites.find((s) => s.id === siteId)

  if (!site) { onNavigate('home'); return null }

  const totalExpense = getSiteTotal(siteId)
  const totalPayment = getSitePaymentsTotal(siteId)
  const balance = totalExpense - totalPayment
  const payments = getSitePayments(siteId)

  // Expense breakdown by type
  const siteEntries = entries.filter((e) => e.siteId === siteId)
  const laborTotal = siteEntries.filter(e => e.type === 'labor').reduce((s, e) => s + e.amount, 0)
  const materialTotal = siteEntries.filter(e => e.type === 'material').reduce((s, e) => s + e.amount, 0)
  const miscTotal = siteEntries.filter(e => e.type === 'misc').reduce((s, e) => s + e.amount, 0)

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
            <h1 className="text-[20px] font-bold font-display text-[#2B1D1C] leading-tight">Site Summary</h1>
            <p className="text-[12px] text-[#A0A0A0] truncate">{site.name}</p>
          </div>
        </div>
      </div>

      <div className="screen-body px-5 pb-6">
        <div className="mt-4 space-y-4">

          {/* Balance Overview Card */}
          <div className="grand-total-card bg-[#2B1D1C] rounded-3xl p-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[10px] font-semibold text-[#FED447]/60 uppercase tracking-widest mb-1">Total Expense</p>
                <p className="text-[20px] font-bold font-display text-red-400">{formatINR(totalExpense)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-[#FED447]/60 uppercase tracking-widest mb-1">Total Received</p>
                <p className="text-[20px] font-bold font-display text-green-400">{formatINR(totalPayment)}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold text-[#FED447]/70 uppercase tracking-widest">
                {balance >= 0 ? 'Balance Due' : 'Overpaid'}
              </p>
              <p className={`text-[24px] font-bold font-display ${balance >= 0 ? 'text-[#FED447]' : 'text-green-400'}`}>
                {formatINR(Math.abs(balance))}
              </p>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-3xl card-shadow overflow-hidden">
            <div className="px-4 py-3 bg-[#F5F5F5]">
              <p className="text-[11px] font-bold text-[#A0A0A0] tracking-wider uppercase">Expense Breakdown</p>
            </div>
            <div className="divide-y divide-gray-50">
              {laborTotal > 0 && (
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px]">👷</span>
                    <span className="text-[14px] font-semibold text-[#2B1D1C]">Labour</span>
                  </div>
                  <span className="text-[15px] font-bold font-display text-[#2B1D1C]">{formatINR(laborTotal)}</span>
                </div>
              )}
              {materialTotal > 0 && (
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px]">🏗️</span>
                    <span className="text-[14px] font-semibold text-[#2B1D1C]">Material</span>
                  </div>
                  <span className="text-[15px] font-bold font-display text-[#2B1D1C]">{formatINR(materialTotal)}</span>
                </div>
              )}
              {miscTotal > 0 && (
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px]">📦</span>
                    <span className="text-[14px] font-semibold text-[#2B1D1C]">Misc</span>
                  </div>
                  <span className="text-[15px] font-bold font-display text-[#2B1D1C]">{formatINR(miscTotal)}</span>
                </div>
              )}
              {totalExpense === 0 && (
                <div className="px-4 py-6 text-center text-[#A0A0A0] text-[14px]">No expenses recorded</div>
              )}
            </div>
          </div>

          {/* Payments Received List */}
          <div className="bg-white rounded-3xl card-shadow overflow-hidden">
            <div className="px-4 py-3 bg-[#E8F5E9] flex items-center justify-between">
              <p className="text-[11px] font-bold text-green-700 tracking-wider uppercase">Payments Received</p>
              <p className="text-[13px] font-bold font-display text-green-700">{formatINR(totalPayment)}</p>
            </div>
            <div className="divide-y divide-gray-50">
              {payments.length === 0 ? (
                <div className="px-4 py-6 text-center text-[#A0A0A0] text-[14px]">No payments logged yet</div>
              ) : (
                payments.map((p) => (
                  <PaymentRow key={p.id} payment={p} onDelete={() => deletePayment(p.id)} />
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function PaymentRow({ payment, onDelete }) {
  const [showDelete, setShowDelete] = useState(false)
  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[14px] flex-shrink-0 mt-0.5">
          {payment.method === 'bank' ? '🏦' : payment.method === 'upi' ? '📱' : '💵'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#2B1D1C]">
                {METHOD_LABEL[payment.method] || '💵 Cash'}
              </p>
              <p className="text-[12px] text-[#A0A0A0] mt-0.5">{formatDisplayDate(payment.date)}</p>
              {payment.note && <p className="text-[12px] text-[#A0A0A0] mt-0.5 italic">"{payment.note}"</p>}
            </div>
            <p className="text-[17px] font-bold font-display text-green-600 flex-shrink-0">{formatINR(payment.amount)}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDelete(!showDelete)}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[#A0A0A0]"
        >
          <Trash2 size={15} />
        </button>
      </div>
      {showDelete && (
        <div className="mt-2 pt-2 border-t border-gray-50 flex gap-2">
          <button onClick={() => setShowDelete(false)} className="flex-1 h-[36px] bg-[#F5F5F5] text-[#A0A0A0] text-[13px] font-medium rounded-xl">Keep</button>
          <button onClick={onDelete} className="flex-1 h-[36px] bg-red-50 text-red-600 text-[13px] font-semibold rounded-xl">Delete</button>
        </div>
      )}
    </div>
  )
}
