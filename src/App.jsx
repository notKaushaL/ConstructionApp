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
import { Power } from 'lucide-react'

// ── Language context ──────────────────────────────────────────────────────────
export const LangContext = createContext(TRANSLATIONS.en)
export const useLang = () => useContext(LangContext)

const NAV_SCREENS = ['home', 'ledger', 'summary', 'settings']

export default function App() {
  const [screen, setScreen] = useState('home')
  const [params, setParams] = useState({})
  const [showExitAlert, setShowExitAlert] = useState(false)
  const [isShutdown, setIsShutdown] = useState(false)
  const [isLanding, setIsLanding] = useState(true)
  const { theme, language } = useStore()

  const screenRef = useRef('home')
  useEffect(() => { screenRef.current = screen }, [screen])

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Navigation History Management
  useEffect(() => {
    const handlePopState = (e) => {
      if (isShutdown || isLanding) return

      const state = e.state
      
      if (!state || state.type === 'ASHVIN_SENTINEL') {
        if (screenRef.current === 'home') {
          setShowExitAlert(true)
          window.history.pushState({ screen: 'home', params: {} }, '')
        } else {
          setScreen('home')
          setParams({})
          window.history.pushState({ screen: 'home', params: {} }, '')
        }
      } else if (state.screen) {
        setScreen(state.screen)
        setParams(state.params || {})
        setShowExitAlert(false)
      }
    }

    // Setup: Sentinel -> Home
    if (!window.history.state || window.history.state.type !== 'ASHVIN_SENTINEL') {
      window.history.replaceState({ type: 'ASHVIN_SENTINEL' }, '')
      window.history.pushState({ screen: 'home', params: {} }, '')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isShutdown, isLanding])

  // Handle landing screen duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLanding(false)
    }, 2800) // Slightly increased to allow for the clean text glow finish
    return () => clearTimeout(timer)
  }, [])

  const navigate = (to, newParams = {}, replace = false) => {
    if (isShutdown) return
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

  const handleExitApp = () => {
    setShowExitAlert(false);
    try {
      window.close();
      const win = window.open("", "_self");
      win.close();
    } catch (e) {}
    setIsShutdown(true);
  }

  const t = TRANSLATIONS[language] || TRANSLATIONS.en
  const showNav = NAV_SCREENS.includes(screen) && !isShutdown && !isLanding

  // ── RENDER LANDING / SPLASH SCREEN ──────────────────────────────────────────
  if (isLanding) {
    return (
      <div className="fixed inset-0 bg-white z-[20000] flex flex-col items-center justify-center overflow-hidden">
        <div className="relative flex items-center justify-center">
          {/* Anti-Clockwise Tracing Bar */}
          <svg 
            className="absolute w-48 h-48 -rotate-90" 
            viewBox="0 0 100 100"
            style={{ transform: 'rotate(-90deg) scaleX(-1)' }}
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#FED447"
              strokeWidth="2"
              strokeLinecap="round"
              className="animate-trace"
            />
          </svg>

          {/* Logo - Minimal/Subtle Animation */}
          <div className="w-32 h-32 flex items-center justify-center p-3 animate-logo-reveal relative z-10">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain animate-subtle-logo" 
            />
          </div>
        </div>
        
        <div className="mt-14 text-center animate-name-slide-up">
          <h1 className="text-[24px] font-bold font-display text-[#2B1D1C] tracking-tight uppercase animate-text-glow">
            Ashvin Construction
          </h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <div className="h-[1px] w-8 bg-[#FED447]/30"></div>
            <p className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-[0.5em]">
              VADODARA
            </p>
            <div className="h-[1px] w-8 bg-[#FED447]/30"></div>
          </div>
        </div>
      </div>
    )
  }

  // ── RENDER SHUTDOWN SCREEN ──────────────────────────────────────────────────
  if (isShutdown) {
    return (
      <div className="fixed inset-0 bg-[#2B1D1C] flex flex-col items-center justify-center p-8 z-[10001]">
        <div className="w-20 h-20 bg-[#FED447]/10 rounded-[32px] flex items-center justify-center mb-6">
          <Power size={40} className="text-[#FED447]" />
        </div>
        <h2 className="text-[24px] font-bold text-white mb-2 font-display">App Closed</h2>
        <p className="text-[14px] text-[#A0A0A0] text-center">Please swipe up to exit.</p>
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
              <div className="w-16 h-16 bg-[#FED447]/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Power size={32} className="text-[#FED447]" />
              </div>
              <h3 className="text-[20px] font-bold text-[#2B1D1C] dark:text-white mb-2 font-display">Exit App?</h3>
              <p className="text-[14px] text-[#A0A0A0] dark:text-gray-400 leading-relaxed mb-8">
                Are you sure you want to close Ashvin Construction?
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleExitApp}
                  className="w-full h-[52px] bg-[#2B1D1C] dark:bg-[#FED447] text-white dark:text-[#2B1D1C] font-bold text-[15px] rounded-2xl active:scale-95 transition-transform"
                >
                  Exit App
                </button>
                <button
                  onClick={() => setShowExitAlert(false)}
                  className="initial-class w-full h-[52px] bg-[#F5F5F5] dark:bg-white/5 border border-transparent dark:border-[#FED447]/30 text-[#2B1D1C] dark:text-white font-bold text-[15px] rounded-2xl active:scale-95 transition-transform"
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
