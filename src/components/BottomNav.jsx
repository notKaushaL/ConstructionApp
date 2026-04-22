import { Home, BookOpen, BarChart2, Settings } from 'lucide-react'
import { useLang } from '../App'

export default function BottomNav({ active, onNavigate }) {
  const t = useLang()

  const NAV_ITEMS = [
    { id: 'home',     label: t.home,     Icon: Home },
    { id: 'ledger',   label: t.ledger,   Icon: BookOpen },
    { id: 'summary',  label: t.summary,  Icon: BarChart2 },
    { id: 'settings', label: t.settings, Icon: Settings },
  ]

  return (
    <div className="w-full px-4 pb-3 pt-1 bg-white border-t border-gray-100/60">
      <nav className="nav-blur rounded-3xl shadow-md">
        <div className="flex items-center justify-around h-[60px] px-2">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive =
              active === id ||
              (active === 'ledger'   && id === 'ledger') ||
              (active === 'addEntry' && id === 'ledger')
            return (
              <button
                key={id}
                id={`nav-${id}`}
                onClick={() => onNavigate(id)}
                className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 active:scale-95 transition-transform"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all
                  ${isActive ? 'bg-[#2B1D1C]' : ''}`}
                >
                  <Icon size={20} color={isActive ? '#FED447' : '#A0A0A0'} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-semibold tracking-wide
                  ${isActive ? 'text-[#2B1D1C]' : 'text-[#A0A0A0]'}`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
