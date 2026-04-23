import { useEffect, createContext, useContext, useState, useRef } from 'react'
import HomeScreen from './screens/HomeScreen'
import LedgerScreen from './screens/LedgerScreen'
import AddEntryScreen from './screens/AddEntryScreen'
import SummaryScreen from './screens/SummaryScreen'
import SettingsScreen from './screens/SettingsScreen'
import PaymentLogScreen from './screens/PaymentLogScreen'
import SiteSummaryScreen from './screens/SiteSummaryScreen'
import BottomNav from './components/BottomNav'
import useStore from './store/useStore'
import { TRANSLATIONS } from './i18n/translations'
import { LogOut } from 'lucide-react'

// ── Language context ──────────────────────────────────────────────────────────
export const LangContext = createContext(TRANSLATIONS.en)
export const useLang = () => useContext(LangContext)

const NAV_SCREENS = ['home', 'ledger', 'summary', 'settings']

export default function App() {
  const [screen, setScreen] = useState('home')
  const [params, setParams] = useState({})
  const [showExitAlert, setShowExitAlert] = useState(false)
  const { theme, language } = useStore()

  // Track current screen in a ref for popstate handler
  const screenRef = useRef('home')
  useEffect(() => { screenRef.current = screen }, [screen])

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Navigation History Management
  useEffect(() => {
    // 1. Initial history setup
    const setupHistory = () => {
      // Sentinel state to detect bottom of stack
      window.history.replaceState({ type: 'SENTINEL' }, '')
      // Initial home state
      window.history.pushState({ screen: 'home', params: {} }, '')
    }
    
    if (!window.history.state || window.history.state.type !== 'SENTINEL') {
      setupHistory()
    }

    const handlePopState = (e) => {
      const state = e.state
      
      if (state && state.screen) {
        // Moving between app screens via back button
        setScreen(state.screen)
        setParams(state.params || {})
        setShowExitAlert(false)
      } else if (state && state.type === 'SENTINEL') {
        // Hit the bottom sentinel
        if (screenRef.current === 'home') {
          // If on home, show exit confirmation
          setShowExitAlert(true)
          // Push home state back so user doesn't exit browser tab immediately
          window.history.pushState({ screen: 'home', params: {} }, '')
        } else {
          // If elsewhere, just go home
          setScreen('home')
          setParams({})
          window.history.pushState({ screen: 'home', params: {} }, '')
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, []) // Bind once

  const navigate = (to, newParams = {}, replace = false) => {
    // Prevent duplicate states if navigating to same screen
    if (screen === to && JSON.stringify(params) === JSON.stringify(newParams)) return

    setScreen(to)
    setParams(newParams)
    setShowExitAlert(false)
    
    if (replace) {
      window.history.replaceState({ screen: to, params: newParams }, '')
    } else {
      window.history.pushState({ screen: to, params: newParams }, '')
    }
  }

  const showNav = NAV_SCREENS.includes(screen)
  const t = TRANSLATIONS[language] || TRANSLATIONS.en

  return (
    <LangContext.Provider value={t}>
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {screen === 'home' && <HomeScreen onNavigate={navigate} />}
          {screen === 'ledger' && params.siteId && <LedgerScreen siteId={params.siteId} onNavigate={navigate} />}
          {screen === 'addEntry' && params.siteId && <AddEntryScreen siteId={params.siteId} entryToEdit={params.entryToEdit} onNavigate={navigate} />}
          {screen === 'summary' && <SummaryScreen onNavigate={navigate} />}
          {screen === 'settings' && <SettingsScreen onNavigate={navigate} />}
          {screen === 'paymentLog' && params.siteId && <PaymentLogScreen siteId={params.siteId} onNavigate={navigate} />}
          {screen === 'siteSummary' && params.siteId && <SiteSummaryScreen siteId={params.siteId} onNavigate={navigate} />}
        </div>

        {showNav && (
          <BottomNav
            active={screen}
            onNavigate={(id) => {
              if (id === 'ledger') return
              navigate(id)
            }}
          />
        )}

        {/* Exit Confirmation Alert */}
        {showExitAlert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-xs rounded-[32px] p-8 shadow-2xl animate-scale-in text-center">
              <div className="w-16 h-16 bg-[#FED447]/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <LogOut size={32} className="text-[#2B1D1C]" />
              </div>
              <h3 className="text-[20px] font-bold text-[#2B1D1C] mb-2">Close App?</h3>
              <p className="text-[14px] text-[#A0A0A0] leading-relaxed mb-8">
                Are you sure you want to exit Ashvin Construction?
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = "about:blank"}
                  className="w-full h-[52px] bg-[#2B1D1C] text-white font-bold rounded-2xl active:scale-95 transition-transform"
                >
                  Exit App
                </button>
                <button
                  onClick={() => setShowExitAlert(false)}
                  className="w-full h-[52px] bg-[#F5F5F5] text-[#A0A0A0] font-bold rounded-2xl active:scale-95 transition-transform"
                >
                  Stay
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LangContext.Provider>
  )
}
