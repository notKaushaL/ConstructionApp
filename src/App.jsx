import { useEffect, createContext, useContext } from 'react'
import HomeScreen from './screens/HomeScreen'
import LedgerScreen from './screens/LedgerScreen'
import AddEntryScreen from './screens/AddEntryScreen'
import SummaryScreen from './screens/SummaryScreen'
import SettingsScreen from './screens/SettingsScreen'
import BottomNav from './components/BottomNav'
import useStore from './store/useStore'
import { TRANSLATIONS } from './i18n/translations'
import { useState } from 'react'

// ── Language context ──────────────────────────────────────────────────────────
export const LangContext = createContext(TRANSLATIONS.en)
export const useLang = () => useContext(LangContext)

const NAV_SCREENS = ['home', 'ledger', 'summary', 'settings']

export default function App() {
  const [screen, setScreen] = useState('home')
  const [params, setParams] = useState({})
  const { theme, language } = useStore()

  // Apply theme to #root element
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) root.setAttribute('data-theme', theme)
  }, [theme])

  const navigate = (to, newParams = {}) => {
    setScreen(to)
    setParams(newParams)
  }

  const showNav = NAV_SCREENS.includes(screen)
  const t = TRANSLATIONS[language] || TRANSLATIONS.en

  return (
    <LangContext.Provider value={t}>
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {screen === 'home' && <HomeScreen onNavigate={navigate} />}
          {screen === 'ledger' && params.siteId && <LedgerScreen siteId={params.siteId} onNavigate={navigate} />}
          {screen === 'addEntry' && params.siteId && <AddEntryScreen siteId={params.siteId} onNavigate={navigate} />}
          {screen === 'summary' && <SummaryScreen onNavigate={navigate} />}
          {screen === 'settings' && <SettingsScreen onNavigate={navigate} />}
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
      </div>
    </LangContext.Provider>
  )
}
