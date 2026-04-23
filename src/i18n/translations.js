// ─── Translations for English, Hindi, Gujarati ────────────────────────────
export const TRANSLATIONS = {
  en: {
    // Nav
    home: 'Home', ledger: 'Ledger', summary: 'Summary', settings: 'Settings',
    // Home
    mySites: 'My Sites', addFirstSite: 'Add First Site', newSite: 'New Site',
    addSite: 'Add Site', siteName: 'Site Name', sitePlaceholder: 'e.g. Rajnagar Project',
    activeSites: 'Active Sites', completedSites: 'Completed',
    noSites: 'No Sites Yet', noSitesDesc: 'Add your first construction site to start tracking expenses.',
    totalSpent: 'Total Spent',
    // Site details
    newSiteTitle: 'New Construction Site', createSite: 'Create Site',
    ownerName: 'Owner / Client Name', ownerNamePlaceholder: 'e.g. Mr. Rajesh Patel',
    ownerPhone: 'Mobile Number', ownerPhonePlaceholder: 'e.g. 9876543210',
    siteAddress: 'Location / Address', siteAddressPlaceholder: 'e.g. 12, Alkapuri Society, Vadodara',
    siteDetails: 'Site Details',
    // Ledger
    dailyLedger: 'Daily Ledger', addEntry: 'Add Expense', addFirstEntry: 'Add First Expense',
    editEntry: 'Edit Expense',
    noEntries: 'No Entries Yet', noEntriesDesc: 'Start adding labor or material expenses.',
    editSiteName: 'Edit Site Name',
    markCompleted: 'Mark as Completed', reopenProject: 'Reopen Project',
    markCompletedQ: 'Mark as Completed?', reopenProjectQ: 'Reopen Project?',
    willBeCompleted: 'will be moved to completed projects.',
    willBeReopened: 'will be reopened as an active project.',
    complete: 'Complete', reopen: 'Reopen',
    projectCompleted: 'This project is completed. Reopen to add new entries.',
    projectDone: 'Project Completed', projectDoneDesc: 'Reopen this project from settings to add new entries.',
    addPayment: 'Add Payment',
    // Payment Log
    logPayment: 'Log Payment', amountReceived: 'Amount Received',
    paymentMethod: 'Payment Method', dateOfReceipt: 'Date of Receipt',
    referenceNote: 'Reference / Note', notePlaceholderPayment: 'Enter transaction ID or notes...',
    savePaymentLog: 'Save Payment Log',
    bankTransfer: 'Bank Transfer', cash: 'Cash', upi: 'UPI',
    // Add Entry tabs
    labor: 'Labor', material: 'Material', misc: 'Misc',
    // Labor categories
    majur: 'Majdoor', karigar: 'Karigar', mason: 'Mason', plumber: 'Plumber',
    electrician: 'Electrician', carpenter: 'Carpenter', painter: 'Painter',
    welder: 'Welder', salaat: 'Centering', helper: 'Helper',
    karigarHelper: 'Karigar + Helper', others: 'Others',
    // Material presets
    cement: 'Cement', steel: 'Steel', sand: 'Sand', bricks: 'Bricks', paint: 'Paint',
    wood: 'Wood', tiles: 'Tiles', pipes: 'Pipes', gravel: 'Gravel', other: 'Other',
    qtyLabel: 'No. of Bags', unitLabel: 'bags', priceLabel: '₹ per Bag',
    // Misc categories
    food: 'Food', rent: 'Rent', transport: 'Transport', tools: 'Tools',
    // Form
    laborType: 'Labor Type', materialType: 'Material Type', category: 'Category',
    amount: 'Amount (₹) *', date: 'Date', note: 'Note (Optional)',
    qtyPrice: '🧮 Qty × Price', directAmount: '₹ Direct Amount',
    materialName: 'Material Name *', customMatPlaceholder: 'e.g. Waterproofing, AAC blocks...',
    notePlaceholder: 'Supplier, brand, grade, or any details...',
    save: 'Save', cancel: 'Cancel',
    // Summary
    summaryTitle: 'Summary', expenseBreakdown: 'Expense breakdown by type',
    allSites: '🏗️ All Sites', selectSite: 'Select Site', grandTotal: 'Grand Total',
    bySite: 'By Site', entries: 'entries',
    // Settings
    settingsTitle: 'Settings', managesites: 'Manage Sites',
    shareExport: 'Share & Export', dataStorage: 'Data & Storage',
    appInfo: 'App Info', appearance: 'Appearance', language: 'Language',
    darkMode: 'Dark Mode', lightMode: 'Light Mode',
    clearAll: 'Clear All Data', clearAllSub: 'Deletes all sites & entries permanently',
    exportData: 'Export All Data', exportSub: 'Download as JSON backup',
    open: 'Open',
  },
  hi: {
    // Nav
    home: 'होम', ledger: 'खाता', summary: 'सारांश', settings: 'सेटिंग',
    // Home
    mySites: 'मेरी साइट्स', addFirstSite: 'पहली साइट जोड़ें', newSite: 'नई साइट',
    addSite: 'साइट जोड़ें', siteName: 'साइट का नाम', sitePlaceholder: 'जैसे राजनगर प्रोजेक्ट',
    activeSites: 'चालू साइट्स', completedSites: 'पूर्ण',
    noSites: 'कोई साइट नहीं', noSitesDesc: 'खर्चों को ट्रैक करने के लिए पहली साइट जोड़ें।',
    totalSpent: 'कुल खर्चा',
    // Site details
    newSiteTitle: 'नई निर्माण साइट', createSite: 'साइट बनाएँ',
    ownerName: 'मालिक / ग्राहक का नाम', ownerNamePlaceholder: 'जैसे श्री राजेश पटेल',
    ownerPhone: 'मोबाइल नंबर', ownerPhonePlaceholder: 'जैसे 9876543210',
    siteAddress: 'पता / लोकेशन', siteAddressPlaceholder: 'जैसे 12, अलकापुरी सोसायटी, वडोदरा',
    siteDetails: 'साइट विवरण',
    // Ledger
    dailyLedger: 'दैनिक खाता', addEntry: 'खर्च जोड़ें', addFirstEntry: 'पहला खर्च जोड़ें',
    editEntry: 'खर्च बदलें',
    noEntries: 'कोई एंट्री नहीं', noEntriesDesc: 'मजदूरी या सामग्री खर्च जोड़ें।',
    editSiteName: 'साइट का नाम बदलें',
    markCompleted: 'पूर्ण करें', reopenProject: 'फिर से खोलें',
    markCompletedQ: 'पूर्ण करना चाहते हैं?', reopenProjectQ: 'फिर से खोलना चाहते हैं?',
    willBeCompleted: 'को पूर्ण साइट्स में ले जाया जाएगा।',
    willBeReopened: 'को फिर से चालू किया जाएगा।',
    complete: 'पूर्ण करें', reopen: 'खोलें',
    projectCompleted: 'यह प्रोजेक्ट पूर्ण है। नई एंट्री जोड़ने के लिए फिर से खोलें।',
    projectDone: 'प्रोजेक्ट पूर्ण', projectDoneDesc: 'नई एंट्री जोड़ने के लिए सेटिंग्स से फिर से खोलें।',
    addPayment: 'भुगतान जोड़ें',
    // Payment Log
    logPayment: 'भुगतान दर्ज करें', amountReceived: 'प्राप्त राशि',
    paymentMethod: 'भुगतान का तरीका', dateOfReceipt: 'प्राप्ति की तारीख',
    referenceNote: 'संदर्भ / नोट', notePlaceholderPayment: 'ट्रांजैक्शन ID या नोट...',
    savePaymentLog: 'भुगतान सेव करें',
    bankTransfer: 'बैंक ट्रांसफर', cash: 'नकद', upi: 'UPI',
    // Add Entry tabs
    labor: 'मजदूरी', material: 'सामग्री', misc: 'अन्य खर्चा',
    // Labor categories
    majur: 'मजदूर', karigar: 'कारीगर', mason: 'राजमिस्त्री', plumber: 'प्लंबर',
    electrician: 'इलेक्ट्रिशियन', carpenter: 'बढ़ई', painter: 'पेंटर',
    welder: 'वेल्डर', salaat: 'सेंटरिंग', helper: 'हेल्पर',
    karigarHelper: 'कारीगर + हेल्पर', others: 'अन्य',
    // Material presets
    cement: 'सीमेंट', steel: 'स्टील (लोहा)', sand: 'रेत (रेती)', bricks: 'ईंटें', paint: 'पेंट',
    wood: 'लकड़ी', tiles: 'टाइल्स', pipes: 'पाइप', gravel: 'कंक्रीट/कपची', other: 'अन्य',
    // Misc categories
    food: 'खाना', rent: 'किराया', transport: 'वाहन', tools: 'औज़ार',
    // Form
    laborType: 'मजदूरी का प्रकार', materialType: 'सामग्री का प्रकार', category: 'श्रेणी',
    amount: 'राशि (₹) *', date: 'तारीख', note: 'नोट (वैकल्पिक)',
    qtyPrice: '🧮 मात्रा × मूल्य', directAmount: '₹ सीधी राशि',
    materialName: 'सामग्री का नाम *', customMatPlaceholder: 'जैसे वाटरप्रूफिंग, AAC ब्लॉक...',
    notePlaceholder: 'आपूर्तिकर्ता, ब्रांड, ग्रेड...',
    save: 'सेव करें', cancel: 'रद्द करें',
    // Summary
    summaryTitle: 'सारांश', expenseBreakdown: 'प्रकार के अनुसार खर्च',
    allSites: '🏗️ सभी साइट्स', selectSite: 'साइट चुनें', grandTotal: 'कुल',
    bySite: 'साइट के अनुसार', entries: 'एंट्री',
    // Settings
    settingsTitle: 'सेटिंग', managesites: 'साइट्स प्रबंधित करें',
    shareExport: 'शेयर और एक्सपोर्ट', dataStorage: 'डेटा और स्टोरेज',
    appInfo: 'ऐप जानकारी', appearance: 'दिखावट', language: 'भाषा',
    darkMode: 'डार्क मोड', lightMode: 'लाइट मोड',
    clearAll: 'सभी डेटा हटाएं', clearAllSub: 'सभी साइट्स और एंट्री हमेशा के लिए हटा देता है',
    exportData: 'डेटा निर्यात करें', exportSub: 'JSON बैकअप डाउनलोड करें',
    open: 'खोलें',
  },
  gu: {
    // Nav
    home: 'હોમ', ledger: 'ખાતાવહી', summary: 'સારાંશ', settings: 'સેટિંગ',
    // Home
    mySites: 'મારી સાઇટો', addFirstSite: 'પહેલી સાઇટ ઉમેરો', newSite: 'નવી સાઇટ',
    addSite: 'સાઇટ ઉમેરો', siteName: 'સાઇટનું નામ', sitePlaceholder: 'દા.ત. રાજનગર પ્રોજેક્ટ',
    activeSites: 'ચાલુ સાઇટો', completedSites: 'પૂર્ણ',
    noSites: 'કોઈ સાઇટ નથી', noSitesDesc: 'ખર્ચ ટ્રૅક કરવા પહેલી સાઇટ ઉમેરો.',
    totalSpent: 'કુલ ખર્ચ',
    // Site details
    newSiteTitle: 'નવી બાંધકામ સાઇટ', createSite: 'સાઇટ બનાવો',
    ownerName: 'માલિક / પાર્ટીનું નામ', ownerNamePlaceholder: 'દા.ત. શ્રી રાજેશભાઈ પટેલ',
    ownerPhone: 'મોબાઇલ નંબર', ownerPhonePlaceholder: 'દા.ત. 9876543210',
    siteAddress: 'સરનામું / લોકેશન', siteAddressPlaceholder: 'દા.ત. 12, અલકાપુરી સોસાયટી, વડોદરા',
    siteDetails: 'સાઇટ વિગતો',
    // Ledger
    dailyLedger: 'રોજનું ખાતું', addEntry: 'ખર્ચ ઉમેરો', addFirstEntry: 'પહેલો ખર્ચ ઉમેરો',
    editEntry: 'ખર્ચ બદલો',
    noEntries: 'કોઈ એન્ટ્રી નથી', noEntriesDesc: 'મજૂરી અથવા સામાનનો ખર્ચ ઉમેરો.',
    editSiteName: 'સાઇટનું નામ બદલો',
    markCompleted: 'પૂર્ણ કરો', reopenProject: 'ફરી ચાલુ કરો',
    markCompletedQ: 'પૂર્ણ કરવું છે?', reopenProjectQ: 'ફરી ચાલુ કરવું છે?',
    willBeCompleted: 'ને પૂર્ણ થયેલ સાઇટમાં ખસેડવામાં આવશે.',
    willBeReopened: 'ને ફરી ચાલુ કરવામાં આવશે.',
    complete: 'પૂર્ણ', reopen: 'ચાલુ',
    projectCompleted: 'આ પ્રોજેક્ટ પૂર્ણ થયો છે. નવી એન્ટ્રી ઉમેરવા ફરી ચાલુ કરો.',
    projectDone: 'પ્રોજેક્ટ પૂર્ણ', projectDoneDesc: 'નવી એન્ટ્રી ઉમેરવા સેટિંગમાંથી ફરી ચાલુ કરો.',
    addPayment: 'ચુકવણી ઉમેરો',
    // Payment Log
    logPayment: 'ચુકવણી નોંધો', amountReceived: 'મળેલ રકમ',
    paymentMethod: 'ચુકવણીની રીત', dateOfReceipt: 'ચુકવણીની તારીખ',
    referenceNote: 'સંદર્ભ / નોંધ', notePlaceholderPayment: 'ટ્રાન્ઝેક્શન ID અથવા નોંધ...',
    savePaymentLog: 'ચુકવણી સેવ કરો',
    bankTransfer: 'બેંક ટ્રાન્સફર', cash: 'રોકડ', upi: 'UPI',
    // Add Entry tabs
    labor: 'મજૂરી', material: 'સામાન', misc: 'પરચુરણ',
    // Labor categories — Gujarat construction terms
    majur: 'મજૂર', karigar: 'કારીગર', mason: 'ચણતર', plumber: 'પ્લમ્બર',
    electrician: 'ઇલેક્ટ્રિશિયન', carpenter: 'સુથાર', painter: 'રંગકામ',
    welder: 'વેલ્ડર', salaat: 'સેન્ટરિંગ', helper: 'હેલ્પર',
    karigarHelper: 'કારીગર + હેલ્પર', others: 'બીજું',
    // Material presets
    cement: 'સિમેન્ટ', steel: 'લોખંડ (સ્ટીલ)', sand: 'રેતી', bricks: 'ઈંટો', paint: 'કલર/પેઇન્ટ',
    wood: 'લાકડું', tiles: 'ટાઇલ્સ', pipes: 'પાઇપ', gravel: 'કપચી', other: 'બીજું',
    // Misc categories
    food: 'જમવાનું', rent: 'ભાડું', transport: 'વાહન', tools: 'ઓજાર',
    // Form
    laborType: 'મજૂરીનો પ્રકાર', materialType: 'સામાનનો પ્રકાર', category: 'શ્રેણી',
    amount: 'રકમ (₹) *', date: 'તારીખ', note: 'નોંધ (વૈકલ્પિક)',
    qtyPrice: '🧮 જથ્થો × ભાવ', directAmount: '₹ સીધી રકમ',
    materialName: 'સામાનનું નામ *', customMatPlaceholder: 'દા.ત. વૉટરપ્રૂફિંગ, AAC બ્લૉક...',
    notePlaceholder: 'સપ્લાયર, બ્રાન્ડ, ગ્રેડ...',
    save: 'સેવ કરો', cancel: 'રદ કરો',
    // Summary
    summaryTitle: 'સારાંશ', expenseBreakdown: 'પ્રકાર પ્રમાણે ખર્ચ',
    allSites: '🏗️ બધી સાઇટો', selectSite: 'સાઇટ પસંદ કરો', grandTotal: 'કુલ',
    bySite: 'સાઇટ પ્રમાણે', entries: 'એન્ટ્રી',
    // Settings
    settingsTitle: 'સેટિંગ', managesites: 'સાઇટો સંભાળો',
    shareExport: 'શેર અને નિકાસ', dataStorage: 'ડેટા અને સ્ટોરેજ',
    appInfo: 'એપ માહિતી', appearance: 'દેખાવ', language: 'ભાષા',
    darkMode: 'ડાર્ક મોડ', lightMode: 'લાઇટ મોડ',
    clearAll: 'બધો ડેટા કાઢો', clearAllSub: 'બધી સાઇટો અને એન્ટ્રી કાયમ માટે ડિલીટ થશે',
    exportData: 'ડેટા નિકાસ કરો', exportSub: 'JSON બૅકઅપ ડાઉનલોડ',
    open: 'ખોલો',
  },
}

export const LANG_NAMES = { en: 'English', hi: 'हिंदी', gu: 'ગુજરાતી' }
