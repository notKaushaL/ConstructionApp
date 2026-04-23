import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { nanoid } from '../utils/nanoid'

/**
 * ASHVIN CONSTRUCTION — ZUSTAND STORE
 *
 * Data Shape:
 * sites: [{ id, name, createdAt, status: 'active'|'completed', completedAt? }]
 * entries: [{
 *   id, siteId, type: 'labor'|'material'|'misc',
 *   category, description, amount, date, note, createdAt
 * }]
 * payments: [{
 *   id, siteId, amount, method: 'bank'|'cash'|'upi', date, note, createdAt
 * }]
 */

const useStore = create(
  persist(
    (set, get) => ({
      // ─── STATE ─────────────────────────────────────────────
      sites: [],
      entries: [],
      payments: [],
      theme: 'light',        // 'light' | 'dark'
      language: 'en',        // 'en' | 'hi' | 'gu'

      // ─── THEME & LANGUAGE ───────────────────────────────────
      setTheme: (t) => set({ theme: t }),
      setLanguage: (l) => set({ language: l }),

      // ─── SITE ACTIONS ───────────────────────────────────────
      addSite: (name, details = {}) => {
        const site = {
          id: nanoid(),
          name: name.trim(),
          createdAt: new Date().toISOString(),
          status: 'active',
          ownerName: details.ownerName || '',
          ownerPhone: details.ownerPhone || '',
          address: details.address || '',
        }
        set((state) => ({ sites: [...state.sites, site] }))
        return site.id
      },

      deleteSite: (siteId) => {
        set((state) => ({
          sites: state.sites.filter((s) => s.id !== siteId),
          entries: state.entries.filter((e) => e.siteId !== siteId),
          payments: state.payments.filter((p) => p.siteId !== siteId),
        }))
      },

      updateSiteName: (siteId, name) => {
        set((state) => ({
          sites: state.sites.map((s) => (s.id === siteId ? { ...s, name: name.trim() } : s)),
        }))
      },

      updateSiteDetails: (siteId, details) => {
        set((state) => ({
          sites: state.sites.map((s) =>
            s.id === siteId ? { ...s, ...details } : s
          ),
        }))
      },

      setSiteStatus: (siteId, status) => {
        set((state) => ({
          sites: state.sites.map((s) =>
            s.id === siteId
              ? {
                  ...s,
                  status,
                  completedAt: status === 'completed' ? new Date().toISOString() : null,
                }
              : s
          ),
        }))
      },

      // ─── ENTRY ACTIONS ──────────────────────────────────────
      addEntry: ({ siteId, type, category, description, amount, date, note, qty, unitPrice, unitLabel, qtyDetail }) => {
        const entry = {
          id: nanoid(),
          siteId,
          type,                      // 'labor' | 'material' | 'misc'
          category,                  // e.g. 'Majur', 'Cement', 'Food'
          description: description?.trim() || '',
          amount: parseFloat(amount) || 0,
          date: date || new Date().toISOString().split('T')[0], // YYYY-MM-DD
          note: note?.trim() || '',
          // Quantity breakdown (material tab)
          qty: qty || null,
          unitPrice: unitPrice || null,
          unitLabel: unitLabel || null,
          qtyDetail: qtyDetail || '',
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ entries: [...state.entries, entry] }))
        return entry.id
      },

      deleteEntry: (entryId) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== entryId),
        }))
      },

      updateEntry: (entryId, updates) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === entryId ? { ...e, ...updates, amount: parseFloat(updates.amount) || e.amount } : e
          ),
        }))
      },

      // ─── PAYMENT ACTIONS ────────────────────────────────────
      addPayment: ({ siteId, amount, method, date, note }) => {
        const payment = {
          id: nanoid(),
          siteId,
          amount: parseFloat(amount) || 0,
          method: method || 'cash',   // 'bank' | 'cash' | 'upi'
          date: date || new Date().toISOString().split('T')[0],
          note: note?.trim() || '',
          createdAt: new Date().toISOString(),
        }
        set((state) => ({ payments: [...state.payments, payment] }))
        return payment.id
      },

      deletePayment: (paymentId) => {
        set((state) => ({
          payments: state.payments.filter((p) => p.id !== paymentId),
        }))
      },

      // ─── COMPUTED SELECTORS ─────────────────────────────────
      // Total spent on a site
      getSiteTotal: (siteId) => {
        return get()
          .entries.filter((e) => e.siteId === siteId)
          .reduce((sum, e) => sum + e.amount, 0)
      },

      // Total payments received for a site
      getSitePaymentsTotal: (siteId) => {
        return get()
          .payments.filter((p) => p.siteId === siteId)
          .reduce((sum, p) => sum + p.amount, 0)
      },

      // All payments for a site sorted by date desc
      getSitePayments: (siteId) => {
        return get()
          .payments.filter((p) => p.siteId === siteId)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      },

      // Entries for a site, sorted by date desc
      getSiteEntries: (siteId) => {
        return get()
          .entries.filter((e) => e.siteId === siteId)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      },

      // Entries grouped by date for ledger view
      getSiteEntriesByDate: (siteId) => {
        const entries = get()
          .entries.filter((e) => e.siteId === siteId)
          .sort((a, b) => new Date(b.date) - new Date(a.date))

        const grouped = {}
        entries.forEach((entry) => {
          if (!grouped[entry.date]) grouped[entry.date] = []
          grouped[entry.date].push(entry)
        })

        return Object.entries(grouped).map(([date, entries]) => ({
          date,
          entries,
          total: entries.reduce((sum, e) => sum + e.amount, 0),
        }))
      },

      // Daily total for a specific site+date
      getDayTotal: (siteId, date) => {
        return get()
          .entries.filter((e) => e.siteId === siteId && e.date === date)
          .reduce((sum, e) => sum + e.amount, 0)
      },

      // Category-wise breakdown for a site
      getCategoryBreakdown: (siteId) => {
        const entries = get().entries.filter((e) => e.siteId === siteId)
        const breakdown = {}
        entries.forEach((e) => {
          if (!breakdown[e.category]) breakdown[e.category] = 0
          breakdown[e.category] += e.amount
        })
        return Object.entries(breakdown)
          .map(([category, total]) => ({ category, total }))
          .sort((a, b) => b.total - a.total)
      },

      // Summary across all sites
      getGrandTotal: () => {
        return get().entries.reduce((sum, e) => sum + e.amount, 0)
      },

      // ─── WHATSAPP SHARE ─────────────────────────────────────
      generateWhatsAppSummary: (siteId) => {
        const { sites, entries } = get()
        const site = sites.find((s) => s.id === siteId)
        if (!site) return ''

        const siteEntries = entries
          .filter((e) => e.siteId === siteId)
          .sort((a, b) => new Date(a.date) - new Date(b.date))

        if (siteEntries.length === 0) return `🏗️ *${site.name}* — No entries yet.`

        const total = siteEntries.reduce((sum, e) => sum + e.amount, 0)
        const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`

        // Fix timezone: parse YYYY-MM-DD as local date
        const parseDate = (dateStr) => {
          const [y, m, d] = dateStr.split('-').map(Number)
          return new Date(y, m - 1, d)
        }
        const fmtDate = (dateStr) =>
          parseDate(dateStr).toLocaleDateString('en-IN', {
            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
          })

        // Type labels
        const TYPE_LABEL = { labor: '👷 Labour', material: '🏗️ Material', misc: '📦 Misc' }
        const TYPE_ORDER = ['labor', 'material', 'misc']

        // Group by date
        const byDate = {}
        siteEntries.forEach((e) => {
          if (!byDate[e.date]) byDate[e.date] = []
          byDate[e.date].push(e)
        })

        // ── Header ──────────────────────────────────────────────
        let msg = `🏗️ *${site.name}*\n`
        msg += `📋 Expense Report\n`
        msg += `📅 ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}\n`
        msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`

        // ── Daily breakdown ──────────────────────────────────────
        const dateKeys = Object.keys(byDate)
        dateKeys.forEach((date, idx) => {
          const dayEntries = byDate[date]
          const dayTotal = dayEntries.reduce((sum, e) => sum + e.amount, 0)

          msg += `\n📅 *${fmtDate(date)}*\n`
          msg += `💵 Day Total: *${fmt(dayTotal)}*\n`

          // Group by type within each day
          const byType = {}
          dayEntries.forEach((e) => {
            const t = e.type || 'misc'
            if (!byType[t]) byType[t] = []
            byType[t].push(e)
          })

          TYPE_ORDER.forEach((type) => {
            if (!byType[type]) return
            const sectionTotal = byType[type].reduce((sum, e) => sum + e.amount, 0)
            msg += `\n  ${TYPE_LABEL[type]}  ›  *${fmt(sectionTotal)}*\n`
            byType[type].forEach((e) => {
              msg += `    • *${e.category}*`
              if (e.qtyDetail) msg += `  _(${e.qtyDetail})_`
              msg += `  ${fmt(e.amount)}\n`
              if (e.note) msg += `      💬 _${e.note}_\n`
            })
          })

          if (idx < dateKeys.length - 1)
            msg += `\n┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄\n`
        })

        // ── Grand total ──────────────────────────────────────────
        msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━\n`
        msg += `💰 *Grand Total: ${fmt(total)}*\n`
        msg += `📋 ${siteEntries.length} entries  ·  ${dateKeys.length} day${dateKeys.length > 1 ? 's' : ''}\n`
        msg += `\n_Ashvin Construction · Vadodara_ 🏗️`

        return msg
      },

      // ─── DATA MANAGEMENT ────────────────────────────────────
      clearAllData: () => set({ sites: [], entries: [], payments: [] }),

      exportData: () => {
        const { sites, entries, payments } = get()
        return JSON.stringify({ sites, entries, payments, exportedAt: new Date().toISOString() }, null, 2)
      },
    }),
    {
      name: 'ashvin-construction-storage', // LocalStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useStore
