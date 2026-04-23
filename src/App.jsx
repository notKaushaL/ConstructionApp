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

  const screenRef = useRef('home')
  useEffect(() => { screenRef.current = screen }, [screen])

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Improved Navigation History Management
  useEffect(() => {
    const handlePopState = (e) => {
      const state = e.state
      
      // If we hit the sentinel OR a null state at the beginning
      if (!state || state.type === 'ASHVIN_SENTINEL') {
        if (screenRef.current === 'home') {
          // Show the exit alert
          setShowExitAlert(true)
          // Always push home state back to keep the user inside the app
          window.history.pushState({ screen: 'home', params: {} }, '')
        } else {
          // If we were on another screen, go back to home
          setScreen('home')
          setParams({})
          window.history.pushState({ screen: 'home', params: {} }, '')
        }
      } else if (state.screen) {
        // Normal navigation between app screens
        setScreen(state.screen)
        setParams(state.params || {})
        setShowExitAlert(false)
      }
    }

    // Force setup the history stack correctly on load
    // We replace the current (initial) entry with a sentinel
    window.history.replaceState({ type: 'ASHVIN_SENTINEL' }, '')
    // Then we push the home state as the active one
    window.history.pushState({ screen: 'home', params: {} }, '')

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, []) // Bind once on mount

  const navigate = (to, newParams = {}, replace = false) => {
    // Prevent redundant history entries for the same view
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
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="bg-white dark:bg-[#1F2937] w-full max-w-xs rounded-[32px] p-8 shadow-2xl animate-scale-in text-center border border-gray-100 dark:border-white/10">
              <div className="w-20 h-20 bg-[#FED447]/15 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <LogOut size={40} className="text-[#FED447] dark:text-[#FED447]" />
              </div>
              <h3 className="text-[22px] font-bold text-[#2B1D1C] dark:text-white mb-2 font-display">Exit App?</h3>
              <p className="text-[15px] text-[#A0A0A0] dark:text-gray-400 leading-relaxed mb-10">
                Are you sure you want to close Ashvin Construction?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    // Try to close, if fails (standard browser behavior), let them know it's safe to swipe away
                    if (window.close()) {
                      // Successfully closed
                    } else {
                      // Fallback: show a "Safe to close" state or just alert
                      alert("It is now safe to swipe up and close the app.");
                      setShowExitAlert(false);
                    }
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
