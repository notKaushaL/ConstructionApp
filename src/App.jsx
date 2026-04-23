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
import { LogOut, Power } from 'lucide-react'

// ── Language context ──────────────────────────────────────────────────────────
export const LangContext = createContext(TRANSLATIONS.en)
export const useLang = () => useContext(LangContext)

const NAV_SCREENS = ['home', 'ledger', 'summary', 'settings']

export default function App() {
  const [screen, setScreen] = useState('home')
  const [params, setParams] = useState({})
  const [showExitAlert, setShowExitAlert] = useState(false)
  const [isShutdown, setIsShutdown] = useState(false)
  const { theme, language } = useStore()

  const screenRef = useRef('home')
  useEffect(() => { screenRef.current = screen }, [screen])

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // ── Navigation History Management ───────────────────────────────────────────
  useEffect(() => {
    const handlePopState = (e) => {
      if (isShutdown) return // Do nothing if shutdown

      const state = e.state
      
      // If we hit the sentinel or bottom of history
      if (!state || state.type === 'ASHVIN_SENTINEL') {
        if (screenRef.current === 'home') {
          // Trigger the exit alert
          setShowExitAlert(true)
          // Re-push home to keep the user from actually leaving the app history
          window.history.pushState({ screen: 'home', params: {} }, '')
        } else {
          // If on another screen, go to home
          setScreen('home')
          setParams({})
          window.history.pushState({ screen: 'home', params: {} }, '')
        }
      } else if (state.screen) {
        // Normal app navigation
        setScreen(state.screen)
        setParams(state.params || {})
        setShowExitAlert(false)
      }
    }

    // Setup: Sentinel -> Home
    // We only do this once. replaceState is important here.
    window.history.replaceState({ type: 'ASHVIN_SENTINEL' }, '')
    window.history.pushState({ screen: 'home', params: {} }, '')

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, []) // Empty deps ensures this only runs once on app mount

  const navigate = (to, newParams = {}, replace = false) => {
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

  if (isShutdown) {
    return (
      <div className="fixed inset-0 bg-[#2B1D1C] flex flex-col items-center justify-center p-8 z-[10000]">
        <div className="w-24 h-24 bg-[#FED447]/10 rounded-[40px] flex items-center justify-center mb-8 animate-pulse">
          <Power size={48} className="text-[#FED447]" />
        </div>
        <h2 className="text-[28px] font-bold text-white mb-4 font-display">App Exited</h2>
        <p className="text-[16px] text-[#A0A0A0] text-center leading-relaxed">
          The session has been safely closed.<br />
          You can now swipe the app away.
        </p>
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="w-1 h-8 bg-white/10 rounded-full animate-bounce"></div>
          <span className="text-[12px] font-bold text-white/30 uppercase tracking-widest">Swipe Up to Close</span>
        </div>
      </div>
    )
  }

  return (
    <LangContext.Provider value={t}>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
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

        {/* Exit Confirmation Alert Overlay */}
        {showExitAlert && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-[#1F2937] w-full max-w-xs rounded-[32px] p-8 shadow-2xl animate-scale-in text-center border border-gray-100 dark:border-white/10">
              <div className="w-20 h-20 bg-[#FED447]/15 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Power size={40} className="text-[#FED447]" />
              </div>
              <h3 className="text-[22px] font-bold text-[#2B1D1C] dark:text-white mb-2 font-display">Exit App?</h3>
              <p className="text-[15px] text-[#A0A0A0] dark:text-gray-400 leading-relaxed mb-10">
                Are you sure you want to close Ashvin Construction?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    // Try to close, then shutdown
                    try { window.close(); } catch (e) {}
                    setIsShutdown(true);
                  }}
                  className="w-full h-[56px] bg-[#2B1D1C] dark:bg-[#FED447] text-white dark:text-[#2B1D1C] font-bold text-[16px] rounded-2xl active:scale-95 transition-transform shadow-lg shadow-black/20"
                >
                  Exit App
                </button>
                <button
                  onClick={() => setShowExitAlert(false)}
                  className="w-full h-[52px] bg-[#F5F5F5] dark:bg-white/5 border border-transparent dark:border-[#FED447]/30 text-[#2B1D1C] dark:text-white font-bold text-[15px] rounded-2xl active:scale-95 transition-transform"
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
