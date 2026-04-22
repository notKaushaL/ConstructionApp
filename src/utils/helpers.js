import { format, parseISO, isToday, isYesterday } from 'date-fns'

// Format date string (YYYY-MM-DD) to display format
export const formatDisplayDate = (dateStr) => {
  try {
    const date = parseISO(dateStr)
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'd MMM yyyy')
  } catch {
    return dateStr
  }
}

// Format amount to Indian currency style
export const formatINR = (amount) => {
  return `₹${Number(amount || 0).toLocaleString('en-IN')}`
}

// Today's date in YYYY-MM-DD
export const todayISO = () => new Date().toISOString().split('T')[0]

// Get category icon
export const getCategoryIcon = (category) => {
  const icons = {
    // Labor
    Majur: '👷',
    Karigar: '🔨',
    Salaat: '🧱',
    Helper: '🙋',
    'Karigar + Helper': '👥',
    // Materials
    Cement: '🏗️',
    Steel: '⚙️',
    Sand: '🪨',
    Bricks: '🧱',
    Paint: '🎨',
    Wood: '🪵',
    // Misc
    Food: '🍱',
    Rent: '🏠',
    Transport: '🚛',
    Tools: '🔧',
    Misc: '📦',
  }
  return icons[category] || '📋'
}

// Get category color class (Tailwind bg)
export const getCategoryColor = (category) => {
  const laborCats = ['Majur', 'Karigar', 'Salaat', 'Helper', 'Karigar + Helper']
  const materialCats = ['Cement', 'Steel', 'Sand', 'Bricks', 'Paint', 'Wood']
  if (laborCats.includes(category)) return 'bg-blue-50 text-blue-700'
  if (materialCats.includes(category)) return 'bg-amber-50 text-amber-700'
  return 'bg-gray-50 text-gray-600'
}
