import type { AppLanguage, AppPage, AppThemeId } from '../types/accounting';

export interface TranslationDict {
  appName: string;
  tagline: string;
  languageLabel: string;
  currencyLabel: string;
  helpBotButton: string;
  nav: Record<AppPage, string>;
  common: {
    save: string;
    cancel: string;
    add: string;
    search: string;
    status: string;
    paid: string;
    unpaid: string;
    date: string;
    dueDate: string;
    amount: string;
    action: string;
    description: string;
    phone: string;
    city: string;
    name: string;
    quantity: string;
    price: string;
    total: string;
    account: string;
    restoreDemo: string;
    noRecords: string;
  };
  home: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    languageCardTitle: string;
    languageCardDesc: string;
    workflowHeading: string;
    customersLane: string;
    vendorsLane: string;
    companyLane: string;
    stepNewCustomer: string;
    stepNewCustomerDesc: string;
    stepCreateInvoice: string;
    stepCreateInvoiceDesc: string;
    stepReceivePayment: string;
    stepReceivePaymentDesc: string;
    stepAddVendor: string;
    stepAddVendorDesc: string;
    stepEnterBill: string;
    stepEnterBillDesc: string;
    stepPayBills: string;
    stepPayBillsDesc: string;
    stepInventory: string;
    stepInventoryDesc: string;
    stepBanking: string;
    stepBankingDesc: string;
    stepPosSync: string;
    stepPosSyncDesc: string;
    stepReports: string;
    stepReportsDesc: string;
    cashOnHand: string;
    moneyOwedToYou: string;
    billsYouOwe: string;
    netProfit: string;
    quickActionsTitle: string;
    quickActionsSubtitle: string;
    qaRecordSale: string;
    qaRecordSaleDesc: string;
    qaLogPayment: string;
    qaLogPaymentDesc: string;
    qaUnpaidCount: string;
    qaAddCustomer: string;
    qaAddCustomerDesc: string;
    qaEnterBill: string;
    qaEnterBillDesc: string;
    qaRecordExpense: string;
    qaRecordExpenseDesc: string;
    qaViewReports: string;
    qaViewReportsDesc: string;
    dueSoonAlert: string;
    lowStockAlert: string;
    unpaidBillsAlert: string;
  };
  customers: {
    pageTitle: string;
    pageSubtitle: string;
    newInvoiceTitle: string;
    selectCustomer: string;
    selectProduct: string;
    paidNow: string;
    depositInto: string;
    createInvoiceBtn: string;
    addCustomerTitle: string;
    addCustomerBtn: string;
    invoicesListTitle: string;
    customersListTitle: string;
    receivePaymentBtn: string;
    balanceOwed: string;
    printPdfBtn: string;
    invoicePreviewTitle: string;
    printSavePdfBtn: string;
    officialInvoiceHeading: string;
    billToLabel: string;
    invoiceDetailsLabel: string;
    skuLabel: string;
    subtotalLabel: string;
    amountPaidLabel: string;
    balanceDueLabel: string;
    paidIntoAccountLabel: string;
    authorizedSignatureLabel: string;
    customerSignatureLabel: string;
    officialRecordNote: string;
    filterAll: string;
    filterUnpaid: string;
    searchPlaceholder: string;
    dueDateInput: string;
    collectIntoLabel: string;
  };
  vendors: {
    pageTitle: string;
    pageSubtitle: string;
    enterBillTitle: string;
    selectVendor: string;
    billAmountUsd: string;
    saveBillBtn: string;
    addVendorTitle: string;
    addVendorBtn: string;
    billsListTitle: string;
    vendorsListTitle: string;
    payBillBtn: string;
    payFromAccount: string;
    amountYouOwe: string;
    filterAll: string;
    filterUnpaid: string;
    searchPlaceholder: string;
  };
  inventory: {
    pageTitle: string;
    pageSubtitle: string;
    addItemTitle: string;
    itemName: string;
    sku: string;
    category: string;
    costUsd: string;
    sellPriceUsd: string;
    openingQty: string;
    addItemBtn: string;
    stockListTitle: string;
    inStock: string;
    lowStock: string;
    filterAll: string;
    filterLowStock: string;
    searchPlaceholder: string;
    totalSkusLabel: string;
    lowStockItemsLabel: string;
    totalStockValueLabel: string;
    retailValueLabel: string;
  };
  banking: {
    pageTitle: string;
    pageSubtitle: string;
    accountsTitle: string;
    recordEntryTitle: string;
    entryType: string;
    deposit: string;
    expense: string;
    amountUsd: string;
    recordBtn: string;
    registerTitle: string;
    filterAll: string;
    filterDeposits: string;
    filterExpenses: string;
    searchPlaceholder: string;
    allAccountsBtn: string;
  };
  posSync: {
    pageTitle: string;
    pageSubtitle: string;
    queueTitle: string;
    emptyTitle: string;
    emptyDesc: string;
    addSampleBtn: string;
    problemLabel: string;
    soldProductLabel: string;
    fixStepTitle: string;
    optionPickOther: string;
    optionPickOtherDesc: string;
    optionApprove: string;
    optionApproveDesc: string;
    optionCancel: string;
    optionCancelDesc: string;
    enterImeiPlaceholder: string;
    saveFixBtn: string;
    approveBtn: string;
    cancelReceiptBtn: string;
    notePlaceholder: string;
    availablePhonesLabel: string;
    fixedBanner: string;
    resolutionLogTitle: string;
    noLogs: string;
    actionReassigned: string;
    actionOverride: string;
    actionVoided: string;
  };
  reports: {
    pageTitle: string;
    pageSubtitle: string;
    printBtn: string;
    exportCsvBtn: string;
    periodReportTitle: string;
    periodReportSubtitle: string;
    periodDay: string;
    periodWeek: string;
    periodMonth: string;
    reportDateLabel: string;
    dateRangeLabel: string;
    unitsSoldLabel: string;
    totalSalesLabel: string;
    cashPaidLabel: string;
    loanGivenLabel: string;
    itemsBreakdownTitle: string;
    unitPriceLabel: string;
    cashPortionLabel: string;
    loanPortionLabel: string;
    loansWithWhomTitle: string;
    borrowerLabel: string;
    itemAndQtyLabel: string;
    loanAmountLabel: string;
    noLoansInPeriod: string;
    noSalesInPeriod: string;
    exportPeriodCsvBtn: string;
    outstandingLoansTitle: string;
    outstandingLoansSubtitle: string;
    outstandingTotalLabel: string;
    outstandingCustomersLabel: string;
    loanDateLabel: string;
    paymentDeadlineLabel: string;
    loanInvoiceLabel: string;
    deadlineOverdueLabel: string;
    deadlineDueTodayLabel: string;
    deadlineUpcomingLabel: string;
    dueWithin48hFlag: string;
    dueSoonCountLabel: string;
    paymentDueBadge: string;
    remindCustomerBtn: string;
    remindedLabel: string;
    reminderModalTitle: string;
    reminderMessageLabel: string;
    copyReminderBtn: string;
    copiedConfirm: string;
    callCustomerLabel: string;
    sendSmsLabel: string;
    markRemindedBtn: string;
    exportLoansCsvBtn: string;
    noOutstandingLoans: string;
    loanFilterAll: string;
    loanFilterDueSoon: string;
    loanFilterOverdue: string;
    collectPaymentBtn: string;
    payVendorBillBtn: string;
    todayBtn: string;
    profitLossTitle: string;
    totalSalesCollected: string;
    totalExpensesPaid: string;
    netProfitLabel: string;
    receivablesTitle: string;
    payablesTitle: string;
    stockValuationTitle: string;
    stockCostValue: string;
    stockRetailValue: string;
  };
  guide: {
    title: string;
    subtitle: string;
    askPlaceholder: string;
    askButton: string;
    currentPageTipLabel: string;
    quickTopicsLabel: string;
    stepsLabel: string;
    goToPageBtn: string;
    closeBtn: string;
  };
  backup: {
    sectionTitle: string;
    exportBtn: string;
    importBtn: string;
    exportSuccess: string;
    importSuccess: string;
    invalidJsonError: string;
    invalidStructureError: string;
    dismissBtn: string;
  };
  settings: {
    pageTitle: string;
    pageSubtitle: string;
    themeSectionTitle: string;
    themeSectionSubtitle: string;
    activeLabel: string;
    paletteBadge: string;
    sectionColorsTitle: string;
    sectionColorsDesc: string;
    themes: Record<AppThemeId, { name: string; desc: string }>;
    preferencesTitle: string;
    preferencesSubtitle: string;
    dataSafetyTitle: string;
    dataSafetyDesc: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  en: {
    appName: 'Meridian Ledger Pro',
    tagline: 'Professional Small-Business Accounting',
    languageLabel: 'Language',
    currencyLabel: 'Currency',
    helpBotButton: 'Step-by-Step Assistant',
    nav: {
      home: 'Home & Workflow',
      customers: 'Customers & Sales',
      vendors: 'Vendors & Bills',
      inventory: 'Items & Stock',
      banking: 'Banking & Cash',
      pos_sync: 'POS Sync Fixes',
      reports: 'Business Reports',
      settings: 'Settings',
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      add: 'Add',
      search: 'Search...',
      status: 'Status',
      paid: 'Paid',
      unpaid: 'Unpaid',
      date: 'Date',
      dueDate: 'Due Date',
      amount: 'Amount',
      action: 'Action',
      description: 'Description',
      phone: 'Phone',
      city: 'City',
      name: 'Name',
      quantity: 'Qty',
      price: 'Price',
      total: 'Total',
      account: 'Account',
      restoreDemo: 'Restore Demo Data',
      noRecords: 'No records found.',
    },
    home: {
      welcomeTitle: 'Business Overview & Workflow Map',
      welcomeSubtitle: 'Click any box below to open that section, or switch language right here.',
      languageCardTitle: 'Language & Currency Settings',
      languageCardDesc: 'Switch immediately between English, Pashto, and Dari.',
      workflowHeading: 'How Your Business Flows (Click Any Step)',
      customersLane: '1. Customers & Money Coming In',
      vendorsLane: '2. Suppliers & Money Going Out',
      companyLane: '3. Stock, Cash & Daily Control',
      stepNewCustomer: 'Add Customer',
      stepNewCustomerDesc: 'Save buyer name and phone',
      stepCreateInvoice: 'Create Sales Invoice',
      stepCreateInvoiceDesc: 'Bill customer & reduce stock',
      stepReceivePayment: 'Receive Payment',
      stepReceivePaymentDesc: 'Mark paid & add cash',
      stepAddVendor: 'Add Supplier',
      stepAddVendorDesc: 'Save wholesale supplier',
      stepEnterBill: 'Enter Supplier Bill',
      stepEnterBillDesc: 'Record what you owe',
      stepPayBills: 'Pay Bills',
      stepPayBillsDesc: 'Pay from cash or bank',
      stepInventory: 'Items & Stock',
      stepInventoryDesc: 'Products, prices & stock',
      stepBanking: 'Banking & Cash',
      stepBankingDesc: 'Deposits, expenses & register',
      stepPosSync: 'POS Sync Fixes',
      stepPosSyncDesc: 'Fix offline receipt problems',
      stepReports: 'Business Reports',
      stepReportsDesc: 'Daily, weekly & monthly sales, cash vs loans',
      cashOnHand: 'Total Cash & Bank',
      moneyOwedToYou: 'Customers Owe You',
      billsYouOwe: 'Bills You Owe',
      netProfit: 'Net Profit (Collected)',
      quickActionsTitle: 'Quick Actions',
      quickActionsSubtitle: 'Jump straight into your most common daily accounting tasks in one click.',
      qaRecordSale: 'Record Sale',
      qaRecordSaleDesc: 'Create cash or loan invoice',
      qaLogPayment: 'Log Payment',
      qaLogPaymentDesc: 'Collect cash on unpaid invoices',
      qaUnpaidCount: 'unpaid',
      qaAddCustomer: 'Add Customer',
      qaAddCustomerDesc: 'Save a new buyer profile',
      qaEnterBill: 'Enter Bill',
      qaEnterBillDesc: 'Record a supplier purchase',
      qaRecordExpense: 'Log Expense / Deposit',
      qaRecordExpenseDesc: 'Update cash drawer or bank',
      qaViewReports: 'Closing & Loan Report',
      qaViewReportsDesc: 'Daily sales & unpaid loans',
      dueSoonAlert: 'due within 48h',
      lowStockAlert: 'low stock',
      unpaidBillsAlert: 'unpaid',
    },
    customers: {
      pageTitle: 'Customers & Sales Invoices',
      pageSubtitle: 'Create easy invoices, track who owes you money, and collect payments.',
      newInvoiceTitle: 'Create New Sales Invoice',
      selectCustomer: 'Choose Customer',
      selectProduct: 'Choose Item Sold',
      paidNow: 'Customer paid cash right now',
      depositInto: 'Put money into',
      createInvoiceBtn: 'Save Invoice',
      addCustomerTitle: 'Add New Customer',
      addCustomerBtn: 'Add Customer',
      invoicesListTitle: 'Sales Invoices',
      customersListTitle: 'Customer Directory',
      receivePaymentBtn: 'Receive Payment',
      balanceOwed: 'Owes You',
      printPdfBtn: 'Print / PDF',
      invoicePreviewTitle: 'Official Business Invoice (Print / Save as PDF)',
      printSavePdfBtn: 'Print / Save PDF',
      officialInvoiceHeading: 'OFFICIAL SALES INVOICE',
      billToLabel: 'Bill To',
      invoiceDetailsLabel: 'Invoice Details',
      skuLabel: 'SKU',
      subtotalLabel: 'Subtotal',
      amountPaidLabel: 'Amount Paid',
      balanceDueLabel: 'Balance Due',
      paidIntoAccountLabel: 'Deposited Account',
      authorizedSignatureLabel: 'Authorized Signature',
      customerSignatureLabel: 'Customer Signature',
      officialRecordNote: 'Official business accounting record issued by Meridian Ledger Pro.',
      filterAll: 'All',
      filterUnpaid: 'Unpaid',
      searchPlaceholder: 'Search invoice #, customer, or item...',
      dueDateInput: 'Payment Deadline',
      collectIntoLabel: 'Collect into',
    },
    vendors: {
      pageTitle: 'Suppliers & Bills to Pay',
      pageSubtitle: 'Record supplier bills and pay them directly from your cash drawer or bank.',
      enterBillTitle: 'Enter New Supplier Bill',
      selectVendor: 'Choose Supplier',
      billAmountUsd: 'Bill Amount (USD equivalent)',
      saveBillBtn: 'Save Bill',
      addVendorTitle: 'Add New Supplier',
      addVendorBtn: 'Add Supplier',
      billsListTitle: 'Supplier Bills',
      vendorsListTitle: 'Supplier Directory',
      payBillBtn: 'Pay Bill',
      payFromAccount: 'Pay from account',
      amountYouOwe: 'You Owe',
      filterAll: 'All',
      filterUnpaid: 'Unpaid',
      searchPlaceholder: 'Search bill #, supplier, or details...',
    },
    inventory: {
      pageTitle: 'Items & Store Stock',
      pageSubtitle: 'Manage phone models, buy cost, sell price, and how many units are on the shelf.',
      addItemTitle: 'Add New Product',
      itemName: 'Product Name',
      sku: 'Product Code (SKU)',
      category: 'Category',
      costUsd: 'Buy Cost (USD)',
      sellPriceUsd: 'Sell Price (USD)',
      openingQty: 'Starting Qty',
      addItemBtn: 'Add Product',
      stockListTitle: 'Current Store Inventory',
      inStock: 'In Stock',
      lowStock: 'Low Stock',
      filterAll: 'All',
      filterLowStock: 'Low Stock',
      searchPlaceholder: 'Search product or SKU...',
      totalSkusLabel: 'Total Products',
      lowStockItemsLabel: 'Low Stock Alert (<= 2)',
      totalStockValueLabel: 'Inventory Cost Value',
      retailValueLabel: 'Retail Value',
    },
    banking: {
      pageTitle: 'Banking & Cash Register',
      pageSubtitle: 'Check your cash drawer and bank balances, and record daily deposits or shop expenses.',
      accountsTitle: 'Your Cash & Bank Accounts',
      recordEntryTitle: 'Record Deposit or Expense',
      entryType: 'Entry Type',
      deposit: 'Cash / Bank Deposit (+)',
      expense: 'Shop Expense / Rent (-)',
      amountUsd: 'Amount (USD)',
      recordBtn: 'Save Entry',
      registerTitle: 'Account Register History',
      filterAll: 'All',
      filterDeposits: 'Deposits',
      filterExpenses: 'Expenses',
      searchPlaceholder: 'Search description or account...',
      allAccountsBtn: 'All Accounts',
    },
    posSync: {
      pageTitle: 'Offline POS Sync Fixes (Simple Mode)',
      pageSubtitle: 'When the internet goes out, two counters might sell the same phone serial. Fix them in 1 click.',
      queueTitle: 'Receipts Waiting to Fix',
      emptyTitle: 'Everything Is Synced!',
      emptyDesc: 'There are no offline receipt problems left to fix.',
      addSampleBtn: 'Add Sample Problem',
      problemLabel: 'What went wrong',
      soldProductLabel: 'Phone on Receipt',
      fixStepTitle: 'Choose How to Fix This Receipt',
      optionPickOther: '1. Pick Different Phone (Recommended)',
      optionPickOtherDesc: 'Choose or type the 15-digit serial (IMEI) of the phone actually given to the buyer.',
      optionApprove: '2. Approve Anyway (Manager)',
      optionApproveDesc: 'Keep this receipt as-is and write a short reason (for price changes or special cases).',
      optionCancel: '3. Cancel / Refund Receipt',
      optionCancelDesc: 'Remove this offline receipt because the sale was cancelled or refunded.',
      enterImeiPlaceholder: 'Type 15-digit IMEI or click a phone below...',
      saveFixBtn: 'Save & Fix Receipt',
      approveBtn: 'Approve Receipt',
      cancelReceiptBtn: 'Cancel Receipt',
      notePlaceholder: 'Write short reason (e.g., Manager approved discount)...',
      availablePhonesLabel: 'Ready phones in stock (click one to fill automatically):',
      fixedBanner: 'Done! The receipt was fixed and added to your ledger.',
      resolutionLogTitle: 'Recent POS Sync Audit Log',
      noLogs: 'No sync fixes recorded yet.',
      actionReassigned: 'IMEI Replaced',
      actionOverride: 'Manager Approved',
      actionVoided: 'Cancelled',
    },
    reports: {
      pageTitle: 'Daily, Weekly & Monthly Business Reports',
      pageSubtitle: 'Full end-of-day, end-of-week, and end-of-month breakdown of units sold, selling prices, cash paid, and customer loans.',
      printBtn: 'Print Report',
      exportCsvBtn: 'Download Full Summary (CSV)',
      periodReportTitle: 'End-of-Period Sales, Cash & Loan Report',
      periodReportSubtitle: 'See exactly how many units were sold, at what price, how much was paid in cash, and how much is on loan with each customer.',
      periodDay: 'End of Day',
      periodWeek: 'End of Week',
      periodMonth: 'End of Month',
      reportDateLabel: 'Report Date',
      dateRangeLabel: 'Period Covered',
      unitsSoldLabel: 'Units Sold',
      totalSalesLabel: 'Total Period Sales',
      cashPaidLabel: 'Paid in Cash / Bank',
      loanGivenLabel: 'Given on Loan (Credit)',
      itemsBreakdownTitle: 'How Many Sold & At What Price',
      unitPriceLabel: 'Unit Price',
      cashPortionLabel: 'Cash Paid',
      loanPortionLabel: 'On Loan',
      loansWithWhomTitle: 'Loans Given & With Whom',
      borrowerLabel: 'Customer (With Whom)',
      itemAndQtyLabel: 'Item & Qty Sold',
      loanAmountLabel: 'Loan Amount',
      noLoansInPeriod: 'All sales in this period were paid in cash — zero loans.',
      noSalesInPeriod: 'No sales recorded for this selected period.',
      exportPeriodCsvBtn: 'Download Period Report (CSV)',
      outstandingLoansTitle: 'Outstanding Loans',
      outstandingLoansSubtitle: 'Customers with unpaid balances, showing each individual loan date and payment deadline.',
      outstandingTotalLabel: 'Total Unpaid Balance',
      outstandingCustomersLabel: 'Customers with Unpaid Balances',
      loanDateLabel: 'Loan Date',
      paymentDeadlineLabel: 'Payment Deadline',
      loanInvoiceLabel: 'Loan #',
      deadlineOverdueLabel: 'Overdue',
      deadlineDueTodayLabel: 'Due Today',
      deadlineUpcomingLabel: 'Days Left',
      dueWithin48hFlag: 'Due < 48h',
      dueSoonCountLabel: 'due within 48h',
      paymentDueBadge: 'Payment Due',
      remindCustomerBtn: 'Remind Customer',
      remindedLabel: 'Reminded',
      reminderModalTitle: 'Customer Payment Reminder',
      reminderMessageLabel: 'Reminder Message (Ready for SMS / WhatsApp)',
      copyReminderBtn: 'Copy Message',
      copiedConfirm: 'Copied!',
      callCustomerLabel: 'Call Phone',
      sendSmsLabel: 'Send SMS',
      markRemindedBtn: 'Done & Mark Reminded',
      exportLoansCsvBtn: 'Download Loans (CSV)',
      noOutstandingLoans: 'No customers currently have unpaid loan balances.',
      loanFilterAll: 'All Loans',
      loanFilterDueSoon: 'Due < 48h',
      loanFilterOverdue: 'Overdue',
      collectPaymentBtn: 'Collect Payment',
      payVendorBillBtn: 'Pay Bills',
      todayBtn: 'Today',
      profitLossTitle: 'Profit & Loss Summary',
      totalSalesCollected: 'Paid Sales Income',
      totalExpensesPaid: 'Paid Bills & Shop Expenses',
      netProfitLabel: 'Net Profit',
      receivablesTitle: 'Customers Who Still Owe You',
      payablesTitle: 'Supplier Bills You Still Owe',
      stockValuationTitle: 'Store Inventory Value',
      stockCostValue: 'Total Cost Value',
      stockRetailValue: 'Total Retail Value',
    },
    guide: {
      title: 'Easy Step-by-Step Assistant',
      subtitle: 'Ask anything about how to use any page, or click a topic below.',
      askPlaceholder: 'Ask a question (e.g., How do I make an invoice?)...',
      askButton: 'Ask',
      currentPageTipLabel: 'Guide for the screen you are looking at now:',
      quickTopicsLabel: 'Common Tasks (Click for Steps)',
      stepsLabel: 'Follow These Simple Steps:',
      goToPageBtn: 'Open That Page',
      closeBtn: 'Close Guide',
    },
    backup: {
      sectionTitle: 'Data Safety',
      exportBtn: 'Backup Data',
      importBtn: 'Import Backup',
      exportSuccess: 'Backup file downloaded safely.',
      importSuccess: 'Backup restored successfully. All ledgers and balances updated.',
      invalidJsonError: 'Could not read file: please select a valid JSON backup file.',
      invalidStructureError: 'Invalid backup file: missing required accounting records.',
      dismissBtn: 'OK',
    },
    settings: {
      pageTitle: 'User Settings & Appearance',
      pageSubtitle: 'Choose a subtle, professional color theme and manage language, currency, and backups.',
      themeSectionTitle: 'Interface Color Theme',
      themeSectionSubtitle: 'Every theme keeps each accounting section subtly distinct while staying calm on the eyes.',
      activeLabel: 'Active Theme',
      paletteBadge: '8-page palette',
      sectionColorsTitle: 'Per-Page Subtle Color Map (Click any section to preview)',
      sectionColorsDesc: 'Each accounting page uses its own calm tint and accent within the selected theme.',
      themes: {
        classic_ledger: {
          name: 'Classic Ledger',
          desc: 'Executive navy, forest sage, and warm walnut accents on crisp light paper.',
        },
        warm_parchment: {
          name: 'Warm Parchment',
          desc: 'Soft ivory paper with espresso bronze, olive sage, and muted terracotta tones.',
        },
        crisp_pewter: {
          name: 'Crisp Pewter',
          desc: 'Cool graphite neutrals paired with slate pine, steel indigo, and ochre accents.',
        },
        botanical_stone: {
          name: 'Botanical Stone',
          desc: 'Calm mineral greens, deep teal, and soft sandstone for long desk sessions.',
        },
      },
      preferencesTitle: 'Language & Currency Defaults',
      preferencesSubtitle: 'Switch display language (English, Pashto, Dari) and ledger currency anytime.',
      dataSafetyTitle: 'Backup & Data Management',
      dataSafetyDesc: 'Download a complete JSON copy of your ledgers or restore from a saved backup file.',
    },
  },
  ps: {
    appName: 'مریدین لیجر پرو',
    tagline: 'د سوداګرۍ مسلکي حسابداري',
    languageLabel: 'ژبه',
    currencyLabel: 'اسعار',
    helpBotButton: 'لارښود مرستیال',
    nav: {
      home: 'کور او کاري نقشه',
      customers: 'پیرودونکي او بلونه',
      vendors: 'عرضه کوونکي او پورونه',
      inventory: 'توکي او ګودام',
      banking: 'بانک او نغدې پیسې',
      pos_sync: 'د آفلاین پلور سمون',
      reports: 'د سوداګرۍ راپورونه',
      settings: 'تنظیمات',
    },
    common: {
      save: 'ثبت کړئ',
      cancel: 'لغوه کړئ',
      add: 'زیات کړئ',
      search: 'لټون...',
      status: 'حالت',
      paid: 'تادیه شوی',
      unpaid: 'ناتادیه شوی',
      date: 'نېټه',
      dueDate: 'وروستۍ نېټه',
      amount: 'مبلغ',
      action: 'کړنه',
      description: 'تشریح',
      phone: 'تلیفون',
      city: 'ښار',
      name: 'نوم',
      quantity: 'تعداد',
      price: 'بیه',
      total: 'ټولټال',
      account: 'حساب',
      restoreDemo: 'نمونه معلومات بېرته راوستل',
      noRecords: 'هیڅ ریکارډ ونه موندل شو.',
    },
    home: {
      welcomeTitle: 'د کاروبار عمومي کتنه او کاري نقشه',
      welcomeSubtitle: 'د هرې برخې د خلاصولو لپاره لاندې بکس کلیک کړئ، یا دلته ژبه بدله کړئ.',
      languageCardTitle: 'د ژبې او اسعارو تنظیمات',
      languageCardDesc: 'سمدستي د انګلیسي، پښتو او دري ترمنځ ژبه بدله کړئ.',
      workflowHeading: 'ستاسو د کاروبار بهیر (پر هر پړاو کلیک وکړئ)',
      customersLane: '۱. پیرودونکي او راتلوونکې پیسې',
      vendorsLane: '۲. عرضه کوونکي او تادیات',
      companyLane: '۳. ګودام، نغدې پیسې او کنټرول',
      stepNewCustomer: 'نوی پیرودونکی',
      stepNewCustomerDesc: 'د پیرودونکي نوم او شمېره ثبت کړئ',
      stepCreateInvoice: 'د پلور بل جوړول',
      stepCreateInvoiceDesc: 'بل جوړ کړئ او له ګودام څخه یې کم کړئ',
      stepReceivePayment: 'پیسې ترلاسه کول',
      stepReceivePaymentDesc: 'بل تادیه کړئ او پیسې حساب ته واچوئ',
      stepAddVendor: 'عرضه کوونکی زیاتول',
      stepAddVendorDesc: 'د عمده پلورونکي معلومات ثبت کړئ',
      stepEnterBill: 'د خرید بل ثبتول',
      stepEnterBillDesc: 'هغه پور ثبت کړئ چې تاسو یې ورکوئ',
      stepPayBills: 'د بلونو تادیه',
      stepPayBillsDesc: 'له نغدو یا بانک څخه تادیه وکړئ',
      stepInventory: 'توکي او ګودام',
      stepInventoryDesc: 'موبایلونه، بیې او شته تعداد',
      stepBanking: 'بانک او نغدې',
      stepBankingDesc: 'جمع، لګښتونه او روزنامچه',
      stepPosSync: 'د آفلاین پلور سمون',
      stepPosSyncDesc: 'د آفلاین رسید ستونزې حل کړئ',
      stepReports: 'سوداګریز راپورونه',
      stepReportsDesc: 'ورځني، اونیز او میاشتني پلور، نغد او پورونه',
      cashOnHand: 'ټولې نغدې او بانک',
      moneyOwedToYou: 'پر پیرودونکو طلبات',
      billsYouOwe: 'پر تاسو پورونه',
      netProfit: 'خالصه ګټه (راټوله شوې)',
      quickActionsTitle: 'چټکې کړنې',
      quickActionsSubtitle: 'په یوه کلیک سره د ورځني حسابدارۍ عام کارونه سمدستي پیل کړئ.',
      qaRecordSale: 'پلور ثبت کړئ',
      qaRecordSaleDesc: 'نغدي یا پور بل جوړ کړئ',
      qaLogPayment: 'تادیه ثبت کړئ',
      qaLogPaymentDesc: 'د پاتې بلونو پیسې واخلئ',
      qaUnpaidCount: 'ناتادیه',
      qaAddCustomer: 'پیرودونکی زیات کړئ',
      qaAddCustomerDesc: 'نوی پیرودونکی ثبت کړئ',
      qaEnterBill: 'د خرید بل ثبتول',
      qaEnterBillDesc: 'د عرضه کوونکي بل ولیکئ',
      qaRecordExpense: 'لګښت یا جمع ثبتول',
      qaRecordExpenseDesc: 'دخل یا بانکي حساب تازه کړئ',
      qaViewReports: 'ورځنی او د پور راپور',
      qaViewReportsDesc: 'پلور او پاتې پورونه وګورئ',
      dueSoonAlert: 'په ۴۸ ساعتونو کې سررسید',
      lowStockAlert: 'کم موجودي',
      unpaidBillsAlert: 'ناتادیه',
    },
    customers: {
      pageTitle: 'پیرودونکي او د پلور بلونه',
      pageSubtitle: 'اسانه بلونه جوړ کړئ، طلبات وګورئ او پیسې ترلاسه کړئ.',
      newInvoiceTitle: 'د پلور نوی بل جوړ کړئ',
      selectCustomer: 'پیرودونکی وټاکئ',
      selectProduct: 'پلورل شوی توکی وټاکئ',
      paidNow: 'پیرودونکي همدا اوس نغدې پیسې ورکړې',
      depositInto: 'پیسې کوم حساب ته واچول شي',
      createInvoiceBtn: 'بل ثبت کړئ',
      addCustomerTitle: 'نوی پیرودونکی زیات کړئ',
      addCustomerBtn: 'پیرودونکی ثبت کړئ',
      invoicesListTitle: 'د پلور بلونه',
      customersListTitle: 'د پیرودونکو لست',
      receivePaymentBtn: 'پیسې واخلئ',
      balanceOwed: 'پاتې حساب',
      printPdfBtn: 'چاپ / PDF',
      invoicePreviewTitle: 'د پلور رسمي بل (چاپ یا د PDF خوندي کول)',
      printSavePdfBtn: 'چاپ / PDF خوندي کړئ',
      officialInvoiceHeading: 'د پلور رسمي بل',
      billToLabel: 'پیرودونکی',
      invoiceDetailsLabel: 'د بل معلومات',
      skuLabel: 'کوډ (SKU)',
      subtotalLabel: 'فرعي مجموعه',
      amountPaidLabel: 'تادیه شوې پیسې',
      balanceDueLabel: 'پاتې مبلغ',
      paidIntoAccountLabel: 'د جمع کولو حساب',
      authorizedSignatureLabel: 'د مسؤل لاسلیک',
      customerSignatureLabel: 'د پیرودونکي لاسلیک',
      officialRecordNote: 'دا رسمي حسابداري سند د مریدین لیجر پرو لخوا صادر شوی دی.',
      filterAll: 'ټول',
      filterUnpaid: 'ناتادیه',
      searchPlaceholder: 'د بل شمېره، پیرودونکی یا توکی ولټوئ...',
      dueDateInput: 'د تادیې وروستۍ نېټه',
      collectIntoLabel: 'پیسې کوم حساب ته',
    },
    vendors: {
      pageTitle: 'عرضه کوونکي او د تادیې بلونه',
      pageSubtitle: 'د عرضه کوونکو بلونه ثبت کړئ او له دخل یا بانک څخه یې تادیه کړئ.',
      enterBillTitle: 'د عرضه کوونکي نوی بل ثبت کړئ',
      selectVendor: 'عرضه کوونکی وټاکئ',
      billAmountUsd: 'د بل مبلغ (ډالر)',
      saveBillBtn: 'بل ثبت کړئ',
      addVendorTitle: 'نوی عرضه کوونکی زیات کړئ',
      addVendorBtn: 'عرضه کوونکی ثبت کړئ',
      billsListTitle: 'د عرضه کوونکو بلونه',
      vendorsListTitle: 'د عرضه کوونکو لست',
      payBillBtn: 'بل تادیه کړئ',
      payFromAccount: 'له کوم حسابه تادیه شي',
      amountYouOwe: 'ستاسو پور',
      filterAll: 'ټول',
      filterUnpaid: 'ناتادیه',
      searchPlaceholder: 'د بل شمېره، عرضه کوونکی یا تشریح ولټوئ...',
    },
    inventory: {
      pageTitle: 'توکي او د پلورنځي ګودام',
      pageSubtitle: 'د موبایلونو ماډلونه، د اخیستو او پلور بیه او د ګودام تعداد کنټرول کړئ.',
      addItemTitle: 'نوی توکی زیات کړئ',
      itemName: 'د توکي نوم',
      sku: 'د توکي کوډ (SKU)',
      category: 'کتګوري',
      costUsd: 'د اخیستو بیه (ډالر)',
      sellPriceUsd: 'د پلور بیه (ډالر)',
      openingQty: 'لومړنی تعداد',
      addItemBtn: 'توکی ثبت کړئ',
      stockListTitle: 'په ګودام کې شته توکي',
      inStock: 'په ګودام کې شته',
      lowStock: 'کم شوی دی',
      filterAll: 'ټول',
      filterLowStock: 'کم شوي توکي',
      searchPlaceholder: 'توکی یا کوډ (SKU) ولټوئ...',
      totalSkusLabel: 'ټول محصولات',
      lowStockItemsLabel: 'کم شوي توکي (<= ۲)',
      totalStockValueLabel: 'د ګودام د اخیستو ارزښت',
      retailValueLabel: 'د پلور ارزښت',
    },
    banking: {
      pageTitle: 'بانک او د نغدو دخل',
      pageSubtitle: 'د دخل او بانکي حسابونو بیلانس وګورئ او ورځني لګښتونه یا جمع ثبت کړئ.',
      accountsTitle: 'ستاسو نغدي او بانکي حسابونه',
      recordEntryTitle: 'جمع یا لګښت ثبت کړئ',
      entryType: 'د معاملې ډول',
      deposit: 'پیسې جمع کول (+)',
      expense: 'د دوکان لګښت / کرایه (-)',
      amountUsd: 'مبلغ (ډالر)',
      recordBtn: 'معامله ثبت کړئ',
      registerTitle: 'د بانکي او نغدو معاملو تاریخچه',
      filterAll: 'ټول',
      filterDeposits: 'جمع شوې',
      filterExpenses: 'لګښتونه',
      searchPlaceholder: 'تشریح یا حساب ولټوئ...',
      allAccountsBtn: 'ټول حسابونه',
    },
    posSync: {
      pageTitle: 'د آفلاین پلور ستونزې (اسانه حل)',
      pageSubtitle: 'کله چې انټرنېټ پرې شي، شاید دوه میزونه ورته سیریل نمبر وپلوري. دلته یې په یوه کلیک حل کړئ.',
      queueTitle: 'رسیدونه چې حل ته اړتیا لري',
      emptyTitle: 'ټول رسیدونه سم شول!',
      emptyDesc: 'اوس هیڅ آفلاین ستونزه پاتې نه ده.',
      addSampleBtn: 'نمونه ستونزه زیاته کړئ',
      problemLabel: 'ستونزه څه ده',
      soldProductLabel: 'په رسید کې موبایل',
      fixStepTitle: 'د دې رسید د حل لاره وټاکئ',
      optionPickOther: '۱. بل موبایل وټاکئ (غوره لاره)',
      optionPickOtherDesc: 'د هغه موبایل ۱۵ عددي IMEI ولیکئ یا کلیک کړئ چې پیرودونکي ته ورکړل شوی دی.',
      optionApprove: '۲. په همدې ډول یې تایید کړئ',
      optionApproveDesc: 'رسید په همدې حالت ومنئ او یو لنډ دلیل ولیکئ.',
      optionCancel: '۳. رسید لغوه کړئ',
      optionCancelDesc: 'که پلور لغوه شوی وي یا پیسې بېرته ورکړل شوې وي، دا رسید پاک کړئ.',
      enterImeiPlaceholder: '۱۵ عددي IMEI ولیکئ یا لاندې موبایل کلیک کړئ...',
      saveFixBtn: 'تغییر ثبت او رسید سم کړئ',
      approveBtn: 'رسید تایید کړئ',
      cancelReceiptBtn: 'رسید لغوه کړئ',
      notePlaceholder: 'لنډ دلیل ولیکئ (لکه: د مدیر په اجازه تخفیف)...',
      availablePhonesLabel: 'په ګودام کې تیار موبایلونه (د اتومات ډکولو لپاره کلیک کړئ):',
      fixedBanner: 'بریالی شو! رسید سم شو او حساب ته اضافه شو.',
      resolutionLogTitle: 'د وروستیو سمونونو تاریخچه',
      noLogs: 'تر اوسه کوم سمون نه دی ثبت شوی.',
      actionReassigned: 'IMEI بدل شو',
      actionOverride: 'مدیر تایید کړ',
      actionVoided: 'لغوه شو',
    },
    reports: {
      pageTitle: 'ورځني، اونیز او میاشتني حسابداري راپورونه',
      pageSubtitle: 'د ورځې، اونۍ او میاشتې په پای کې د پلورل شویو توکو تعداد، بیې، نغدې پیسې او د هر پیرودونکي پور وګورئ.',
      printBtn: 'راپور چاپ کړئ',
      exportCsvBtn: 'بشپړ لنډیز ډاونلوډ (CSV)',
      periodReportTitle: 'د ورځې، اونۍ او میاشتې د پلور او پور بشپړ راپور',
      periodReportSubtitle: 'وګورئ څومره توکي وپلورل شول، په کومه بیه، څومره نغدې پیسې راغلې او څومره پور له چا سره دی.',
      periodDay: 'د ورځې پای',
      periodWeek: 'د اونۍ پای',
      periodMonth: 'د میاشتې پای',
      reportDateLabel: 'د راپور نېټه',
      dateRangeLabel: 'د راپور موده',
      unitsSoldLabel: 'پلورل شوي تعداد',
      totalSalesLabel: 'ټول پلور',
      cashPaidLabel: 'نغدې تادیه شوې',
      loanGivenLabel: 'په پور (قرض) ورکړل شوي',
      itemsBreakdownTitle: 'څومره توکي او په کومه بیه وپلورل شول',
      unitPriceLabel: 'د یوې دانې بیه',
      cashPortionLabel: 'نغدې پیسې',
      loanPortionLabel: 'پور (قرض)',
      loansWithWhomTitle: 'پورونه او له چا سره دي',
      borrowerLabel: 'پیرودونکی (له چا سره)',
      itemAndQtyLabel: 'توکی او تعداد',
      loanAmountLabel: 'د پور مبلغ',
      noLoansInPeriod: 'په دې موده کې ټول پلور په نغدو شوی — هیڅ پور نشته.',
      noSalesInPeriod: 'په دې ټاکل شوې موده کې هیڅ پلور نه دی ثبت شوی.',
      exportPeriodCsvBtn: 'د مودې راپور ډاونلوډ (CSV)',
      outstandingLoansTitle: 'پاتې پورونه (طلبونه)',
      outstandingLoansSubtitle: 'هغه پیرودونکي چې لا یې حساب نه دی تصفیه کړی، د هر پور د نېټې او وروستۍ مودې سره.',
      outstandingTotalLabel: 'ټول پاتې پورونه',
      outstandingCustomersLabel: 'پور لرونکي پیرودونکي',
      loanDateLabel: 'د پور نېټه',
      paymentDeadlineLabel: 'د تادیې وروستۍ نېټه',
      loanInvoiceLabel: 'بل شمېره',
      deadlineOverdueLabel: 'وخت یې تېر دی',
      deadlineDueTodayLabel: 'نن یې وخت دی',
      deadlineUpcomingLabel: 'پاتې ورځې',
      dueWithin48hFlag: 'تر ۴۸ ساعتو کم',
      dueSoonCountLabel: 'په ۴۸ ساعتونو کې سررسید',
      paymentDueBadge: 'تادیه پاتې ده',
      remindCustomerBtn: 'پیرودونکي ته یادونه',
      remindedLabel: 'یادونه وشوه',
      reminderModalTitle: 'د پیرودونکي د تادیې یادونه',
      reminderMessageLabel: 'د یادونې پیغام (د پیغام یا واټس‌اپ لپاره چمتو)',
      copyReminderBtn: 'پیغام کاپي کړئ',
      copiedConfirm: 'کاپي شو!',
      callCustomerLabel: 'تلیفون کول',
      sendSmsLabel: 'پیغام ولېږئ',
      markRemindedBtn: 'تایید او یادونه ثبت کړئ',
      exportLoansCsvBtn: 'د پورونو لست ډاونلوډ (CSV)',
      noOutstandingLoans: 'دا مهال هیڅ پیرودونکی ناتادیه شوی پور نه لري.',
      loanFilterAll: 'ټول پورونه',
      loanFilterDueSoon: 'تر ۴۸ ساعتو کم',
      loanFilterOverdue: 'وخت تېر شوی',
      collectPaymentBtn: 'پیسې واخلئ',
      payVendorBillBtn: 'بل تادیه کړئ',
      todayBtn: 'نن',
      profitLossTitle: 'د ګټې او تاوان لنډیز',
      totalSalesCollected: 'راټول شوي پلور (عاید)',
      totalExpensesPaid: 'تادیه شوي بلونه او لګښتونه',
      netProfitLabel: 'خالصه ګټه',
      receivablesTitle: 'هغه پیرودونکي چې لا پیسې پرې پاتې دي',
      payablesTitle: 'هغه بلونه چې تاسو یې باید تادیه کړئ',
      stockValuationTitle: 'د ګودام د توکو ارزښت',
      stockCostValue: 'د اخیستو ټول ارزښت',
      stockRetailValue: 'د پلور ټول ارزښت',
    },
    guide: {
      title: 'اسانه ګام پر ګام لارښود',
      subtitle: 'د هرې پاڼې د کارولو په اړه پوښتنه وکړئ یا لاندې موضوع کلیک کړئ.',
      askPlaceholder: 'پوښتنه ولیکئ (لکه: څنګه بل جوړ کړم؟)...',
      askButton: 'وپوښتئ',
      currentPageTipLabel: 'د اوسنۍ پاڼې لپاره لنډ لارښود:',
      quickTopicsLabel: 'عام کارونه (د ګامونو لیدلو لپاره کلیک کړئ)',
      stepsLabel: 'دا اسانه ګامونه تعقیب کړئ:',
      goToPageBtn: 'هغه پاڼه پرانیزئ',
      closeBtn: 'لارښود بند کړئ',
    },
    backup: {
      sectionTitle: 'د معلوماتو خوندیتوب',
      exportBtn: 'بیک اپ ډاونلوډ',
      importBtn: 'بیک اپ بېرته راوستل',
      exportSuccess: 'د بیک اپ فایل په بریالیتوب سره ډاونلوډ شو.',
      importSuccess: 'بیک اپ بېرته راوستل شو. ټول حسابونه او بیلانسونه تازه شول.',
      invalidJsonError: 'فایل ونه لوستل شو: مهرباني وکړئ سم JSON بیک اپ فایل وټاکئ.',
      invalidStructureError: 'ناسم بیک اپ فایل: د حسابدارۍ اړین ریکارډونه پکې نشته.',
      dismissBtn: 'سمه ده',
    },
    settings: {
      pageTitle: 'د کاروونکي تنظیمات او بڼه',
      pageSubtitle: 'یو آرام او مسلکي رنګین چوکاټ وټاکئ او ژبه، اسعار او بیک اپ مدیریت کړئ.',
      themeSectionTitle: 'د کاریال رنګین چوکاټ (Theme)',
      themeSectionSubtitle: 'په هر چوکاټ کې هره برخه لږ توپیر لرونکی آرام رنګ ساتي ترڅو پاڼې ژر وپېژندل شي.',
      activeLabel: 'فعال رنګ',
      paletteBadge: 'د ۸ پاڼو رنګ',
      sectionColorsTitle: 'د هرې پاڼې جلا رنګ (د لیدلو لپاره پرې کلیک وکړئ)',
      sectionColorsDesc: 'په ټاکل شوي چوکاټ کې د حسابدارۍ هره برخه خپل آرام او جلا رنګ لري.',
      themes: {
        classic_ledger: {
          name: 'کلاسیک لیجر (Classic Ledger)',
          desc: 'د مسلکي دفتر نیلي، نرم شین او اخروټي رنګونه پر روښانه سپین کاغذ.',
        },
        warm_parchment: {
          name: 'تود کاغذ (Warm Parchment)',
          desc: 'د سپین عاج کاغذ سره نسواري، زیتوني شین او نرم خاورین رنګونه.',
        },
        crisp_pewter: {
          name: 'فولادي خړ (Crisp Pewter)',
          desc: 'آرام خړ رنګ د صنوبر شین، نیلي او تود نصواري رنګونو سره.',
        },
        botanical_stone: {
          name: 'طبیعي ډبره (Botanical Stone)',
          desc: 'د اوږدو حسابونو لپاره آرام منرالي شین، تیاره فیروزه يي او شګلن رنګ.',
        },
      },
      preferencesTitle: 'د ژبې او اسعارو تنظیمات',
      preferencesSubtitle: 'هر وخت ژبه (انګلیسي، پښتو، دري) او اسعار (افغانی یا ډالر) بدل کړئ.',
      dataSafetyTitle: 'بیک اپ او د معلوماتو خوندیتوب',
      dataSafetyDesc: 'د خپلو حسابونو بشپړ JSON بیک اپ خوندي کړئ یا پخوانی فایل بېرته راولئ.',
    },
  },
  fa: {
    appName: 'مریدین لیجر پرو',
    tagline: 'سیستم حرفه‌ای حسابداری تجارتی',
    languageLabel: 'زبان',
    currencyLabel: 'واحد پول',
    helpBotButton: 'دستیار راهنما',
    nav: {
      home: 'صفحه اصلی و نقشه کار',
      customers: 'مشتریان و فروش',
      vendors: 'فروشندگان و بل‌ها',
      inventory: 'اجناس و گدام',
      banking: 'بانک و صندوق نقد',
      pos_sync: 'اصلاح فروش آفلاین',
      reports: 'گزارش‌های مالی',
      settings: 'تنظیمات',
    },
    common: {
      save: 'ذخیره',
      cancel: 'لغو',
      add: 'افزودن',
      search: 'جستجو...',
      status: 'وضعیت',
      paid: 'پرداخت شده',
      unpaid: 'پرداخت نشده',
      date: 'تاریخ',
      dueDate: 'سررسید',
      amount: 'مبلغ',
      action: 'عملیات',
      description: 'توضیحات',
      phone: 'تلفن',
      city: 'شهر',
      name: 'نام',
      quantity: 'تعداد',
      price: 'قیمت',
      total: 'مجموع',
      account: 'حساب',
      restoreDemo: 'بازیابی معلومات نمونه',
      noRecords: 'هیچ موردی یافت نشد.',
    },
    home: {
      welcomeTitle: 'نمای کلی کاروبار و نقشه جریان کار',
      welcomeSubtitle: 'برای باز کردن هر بخش روی جعبه آن کلیک کنید، یا همین‌جا زبان را تغییر دهید.',
      languageCardTitle: 'تنظیمات زبان و واحد پول',
      languageCardDesc: 'به‌سادگی میان انگلیسی، پشتو و دری جابه‌جا شوید.',
      workflowHeading: 'جریان کار روزانه شما (روی هر مرحله کلیک کنید)',
      customersLane: '۱. مشتریان و پول ورودی',
      vendorsLane: '۲. تامین‌کنندگان و پرداخت‌ها',
      companyLane: '۳. گدام، بانک و کنترول روزانه',
      stepNewCustomer: 'مشتری جدید',
      stepNewCustomerDesc: 'ثبت نام و شماره تماس خریدار',
      stepCreateInvoice: 'ساخت بل فروش',
      stepCreateInvoiceDesc: 'صدور بل و کسر از موجودی گدام',
      stepReceivePayment: 'دریافت پول',
      stepReceivePaymentDesc: 'تصفیه بل و واریز به صندوق',
      stepAddVendor: 'افزودن فروشنده',
      stepAddVendorDesc: 'ثبت مشخصات عمده‌فروش',
      stepEnterBill: 'ثبت بل خرید',
      stepEnterBillDesc: 'ثبت قرض و خریداری از شرکت‌ها',
      stepPayBills: 'پرداخت بل‌ها',
      stepPayBillsDesc: 'پرداخت از دخل نقد یا بانک',
      stepInventory: 'اجناس و گدام',
      stepInventoryDesc: 'مدل‌ها، قیمت و تعداد موجودی',
      stepBanking: 'بانک و صندوق',
      stepBankingDesc: 'واریز، مصارف و دفتر روزنامچه',
      stepPosSync: 'اصلاح فروش آفلاین',
      stepPosSyncDesc: 'رفع مشکل رسیدهای آفلاین',
      stepReports: 'گزارش‌های مالی',
      stepReportsDesc: 'گزارش روزانه، هفته‌وار و ماهانه نقد و قرض',
      cashOnHand: 'مجموع نقد و بانک',
      moneyOwedToYou: 'طلبات از مشتریان',
      billsYouOwe: 'بدهی‌های شما',
      netProfit: 'مفاد خالص (وصول شده)',
      quickActionsTitle: 'عملیات سریع',
      quickActionsSubtitle: 'با یک کلیک مستقیماً به کارهای روزانه و رایج حسابداری بروید.',
      qaRecordSale: 'ثبت فروش',
      qaRecordSaleDesc: 'ساخت بل فروش نقدی یا قرضی',
      qaLogPayment: 'ثبت دریافت پول',
      qaLogPaymentDesc: 'وصول پول بل‌های پرداخت‌نشده',
      qaUnpaidCount: 'پرداخت‌نشده',
      qaAddCustomer: 'افزودن مشتری',
      qaAddCustomerDesc: 'ثبت مشخصات مشتری جدید',
      qaEnterBill: 'ثبت بل خرید',
      qaEnterBillDesc: 'ثبت خریداری از فروشنده',
      qaRecordExpense: 'ثبت مصرف یا واریز',
      qaRecordExpenseDesc: 'به‌روزرسانی دخل یا بانک',
      qaViewReports: 'گزارش روزانه و قرض‌ها',
      qaViewReportsDesc: 'خلاصه فروش و قرض‌های باقیمانده',
      dueSoonAlert: 'سررسید در ۴۸ ساعت آینده',
      lowStockAlert: 'موجودی کم',
      unpaidBillsAlert: 'پرداخت‌نشده',
    },
    customers: {
      pageTitle: 'مشتریان و بل‌های فروش',
      pageSubtitle: 'به‌سادگی بل فروش بسازید، حساب مشتریان را ببینید و پول دریافت کنید.',
      newInvoiceTitle: 'ساخت بل فروش جدید',
      selectCustomer: 'انتخاب مشتری',
      selectProduct: 'انتخاب جنس فروخته شده',
      paidNow: 'مشتری همین اکنون پول نقد پرداخت کرد',
      depositInto: 'واریز پول به حساب',
      createInvoiceBtn: 'ثبت بل فروش',
      addCustomerTitle: 'افزودن مشتری جدید',
      addCustomerBtn: 'ثبت مشتری',
      invoicesListTitle: 'لیست بل‌های فروش',
      customersListTitle: 'فهرست مشتریان',
      receivePaymentBtn: 'دریافت پول',
      balanceOwed: 'باقی‌داری مشتری',
      printPdfBtn: 'چاپ / PDF',
      invoicePreviewTitle: 'بل رسمی فروش (چاپ یا ذخیره PDF)',
      printSavePdfBtn: 'چاپ / ذخیره PDF',
      officialInvoiceHeading: 'بل رسمی فروش',
      billToLabel: 'صورت‌حساب برای',
      invoiceDetailsLabel: 'مشخصات بل',
      skuLabel: 'کد جنس (SKU)',
      subtotalLabel: 'جمع فرعی',
      amountPaidLabel: 'مبلغ پرداخت‌شده',
      balanceDueLabel: 'مانده قابل پرداخت',
      paidIntoAccountLabel: 'واریز به حساب',
      authorizedSignatureLabel: 'امضای مسئول',
      customerSignatureLabel: 'امضای مشتری',
      officialRecordNote: 'این سند رسمی حسابداری توسط سیستم مریدین لیجر پرو صادر شده است.',
      filterAll: 'همه',
      filterUnpaid: 'پرداخت‌نشده',
      searchPlaceholder: 'جستجوی شماره بل، مشتری یا جنس...',
      dueDateInput: 'مهلت پرداخت',
      collectIntoLabel: 'واریز پول به حساب',
    },
    vendors: {
      pageTitle: 'تامین‌کنندگان و بل‌های پرداختنی',
      pageSubtitle: 'بل‌های خرید را ثبت کنید و مستقیماً از صندوق نقد یا حساب بانکی بپردازید.',
      enterBillTitle: 'ثبت بل جدید خرید',
      selectVendor: 'انتخاب تامین‌کننده',
      billAmountUsd: 'مبلغ بل (به دالر)',
      saveBillBtn: 'ثبت بل',
      addVendorTitle: 'افزودن تامین‌کننده جدید',
      addVendorBtn: 'ثبت تامین‌کننده',
      billsListTitle: 'لیست بل‌های پرداختنی',
      vendorsListTitle: 'فهرست تامین‌کنندگان',
      payBillBtn: 'پرداخت بل',
      payFromAccount: 'پرداخت از حساب',
      amountYouOwe: 'بدهی شما',
      filterAll: 'همه',
      filterUnpaid: 'پرداخت‌نشده',
      searchPlaceholder: 'جستجوی شماره بل، فروشنده یا توضیحات...',
    },
    inventory: {
      pageTitle: 'اجناس و موجودی گدام',
      pageSubtitle: 'مدل گوشی‌ها، قیمت خرید، قیمت فروش و تعداد موجودی در فروشگاه را مدیریت کنید.',
      addItemTitle: 'افزودن جنس جدید',
      itemName: 'نام محصول',
      sku: 'کد محصول (SKU)',
      category: 'بخش',
      costUsd: 'قیمت خرید (دالر)',
      sellPriceUsd: 'قیمت فروش (دالر)',
      openingQty: 'تعداد اولیه',
      addItemBtn: 'ثبت محصول',
      stockListTitle: 'موجودی فعلی گدام',
      inStock: 'موجود در گدام',
      lowStock: 'موجودی کم',
      filterAll: 'همه',
      filterLowStock: 'موجودی کم',
      searchPlaceholder: 'جستجوی محصول یا کد (SKU)...',
      totalSkusLabel: 'مجموع محصولات',
      lowStockItemsLabel: 'اجناس رو به اتمام (<= ۲)',
      totalStockValueLabel: 'ارزش خرید گدام',
      retailValueLabel: 'ارزش فروش',
    },
    banking: {
      pageTitle: 'بانک و صندوق نقد',
      pageSubtitle: 'موجودی دخل نقد و حساب بانکی را ببینید و واریز یا مصارف روزانه را ثبت کنید.',
      accountsTitle: 'حساب‌های نقدی و بانکی شما',
      recordEntryTitle: 'ثبت واریز یا مصرف روزانه',
      entryType: 'نوع معامله',
      deposit: 'واریز به صندوق / بانک (+)',
      expense: 'مصارف دوکان / کرایه (-)',
      amountUsd: 'مبلغ (دالر)',
      recordBtn: 'ذخیره معامله',
      registerTitle: 'دفتر تاریخچه معاملات حساب',
      filterAll: 'همه',
      filterDeposits: 'واریزها',
      filterExpenses: 'مصارف',
      searchPlaceholder: 'جستجوی توضیحات یا حساب...',
      allAccountsBtn: 'همه حساب‌ها',
    },
    posSync: {
      pageTitle: 'اصلاح رسیدهای آفلاین (حالت ساده)',
      pageSubtitle: 'وقتی انترنت قطع شود، ممکن است دو بخش یک سریال نمبر را بفروشند. با یک کلیک حل کنید.',
      queueTitle: 'رسیدهای منتظر اصلاح',
      emptyTitle: 'همه رسیدها همگام شد!',
      emptyDesc: 'هیچ مشکل آفلاینی باقی نمانده است.',
      addSampleBtn: 'افزودن مشکل نمونه',
      problemLabel: 'مشکل چیست',
      soldProductLabel: 'گوشی داخل رسید',
      fixStepTitle: 'روش اصلاح این رسید را انتخاب کنید',
      optionPickOther: '۱. انتخاب گوشی دیگر (پیشنهادی)',
      optionPickOtherDesc: 'شماره ۱۵ رقمی IMEI گوشی واقعی تحویل‌داده‌شده به مشتری را وارد یا انتخاب کنید.',
      optionApprove: '۲. تایید با اجازه مدیر',
      optionApproveDesc: 'رسید را همین‌طور قبول کنید و یک یادداشت کوتاه بنویسید.',
      optionCancel: '۳. لغو و برگشت رسید',
      optionCancelDesc: 'اگر معامله لغو شده یا پول پس داده شده است، این رسید را حذف کنید.',
      enterImeiPlaceholder: 'شماره ۱۵ رقمی IMEI را بنویسید یا از پایین کلیک کنید...',
      saveFixBtn: 'ذخیره و اصلاح رسید',
      approveBtn: 'تایید رسید',
      cancelReceiptBtn: 'لغو رسید',
      notePlaceholder: 'دلیل کوتاه بنویسید (مثلاً: تخفیف با اجازه مدیر)...',
      availablePhonesLabel: 'گوشی‌های آماده در گدام (برای انتخاب خودکار کلیک کنید):',
      fixedBanner: 'انجام شد! رسید اصلاح گردید و در حساب ثبت شد.',
      resolutionLogTitle: 'تاریخچه اصلاحات اخیر',
      noLogs: 'هنوز هیچ اصلاحی ثبت نشده است.',
      actionReassigned: 'تعویض IMEI',
      actionOverride: 'تایید مدیر',
      actionVoided: 'لغو شده',
    },
    reports: {
      pageTitle: 'گزارش‌های روزانه، هفته‌وار و ماهانه حسابداری',
      pageSubtitle: 'خلاصه کامل پایان روز، هفته و ماه: تعداد اجناس فروخته‌شده، قیمت، پول نقد دریافت‌شده و قرض‌های مشتریان.',
      printBtn: 'چاپ گزارش',
      exportCsvBtn: 'دانلود خلاصه کل (CSV)',
      periodReportTitle: 'گزارش فروش، پول نقد و قرض در پایان دوره',
      periodReportSubtitle: 'ببینید چند عدد جنس به چه قیمتی فروخته شد، چقدر پول نقد گرفته شد و چقدر قرض نزد کدام مشتری است.',
      periodDay: 'پایان روز',
      periodWeek: 'پایان هفته',
      periodMonth: 'پایان ماه',
      reportDateLabel: 'تاریخ گزارش',
      dateRangeLabel: 'بازه زمانی',
      unitsSoldLabel: 'تعداد فروخته‌شده',
      totalSalesLabel: 'مجموع فروش دوره',
      cashPaidLabel: 'پرداخت‌شده به نقد',
      loanGivenLabel: 'فروش به قرض (نسیه)',
      itemsBreakdownTitle: 'چند عدد و به چه قیمت فروخته شد',
      unitPriceLabel: 'قیمت فی واحد',
      cashPortionLabel: 'پول نقد',
      loanPortionLabel: 'قرض (نسیه)',
      loansWithWhomTitle: 'قرض‌ها و نزد چه کسی است',
      borrowerLabel: 'مشتری (نزد چه کسی)',
      itemAndQtyLabel: 'جنس و تعداد',
      loanAmountLabel: 'مبلغ قرض',
      noLoansInPeriod: 'تمام فروش‌های این دوره نقدی بوده است — هیچ قرضی وجود ندارد.',
      noSalesInPeriod: 'در این دوره هیچ فروشی ثبت نشده است.',
      exportPeriodCsvBtn: 'دانلود گزارش دوره (CSV)',
      outstandingLoansTitle: 'قرض‌های پرداخت‌نشده مشتریان',
      outstandingLoansSubtitle: 'فهرست مشتریان قرضدار همراه با تاریخ هر قرض و مهلت پرداخت برای مدیریت دقیق طلبات.',
      outstandingTotalLabel: 'مجموع قرض‌های باقیمانده',
      outstandingCustomersLabel: 'مشتریان دارای قرض',
      loanDateLabel: 'تاریخ قرض',
      paymentDeadlineLabel: 'مهلت پرداخت',
      loanInvoiceLabel: 'شماره بل',
      deadlineOverdueLabel: 'گذشته از مهلت',
      deadlineDueTodayLabel: 'سررسید امروز',
      deadlineUpcomingLabel: 'روز باقیمانده',
      dueWithin48hFlag: 'کمتر از ۴۸ ساعت',
      dueSoonCountLabel: 'در ۴۸ ساعت آینده',
      paymentDueBadge: 'سررسید پرداخت',
      remindCustomerBtn: 'یادآوری به مشتری',
      remindedLabel: 'یادآوری شد',
      reminderModalTitle: 'یادآوری پرداخت مشتری',
      reminderMessageLabel: 'متن یادآوری (آماده ارسال در پیامک / واتساپ)',
      copyReminderBtn: 'کاپی پیام',
      copiedConfirm: 'کاپی شد!',
      callCustomerLabel: 'تماس تلفنی',
      sendSmsLabel: 'ارسال پیامک',
      markRemindedBtn: 'تایید و ثبت یادآوری',
      exportLoansCsvBtn: 'دانلود فهرست قرض‌ها (CSV)',
      noOutstandingLoans: 'در حال حاضر هیچ مشتری قرض پرداخت‌نشده‌ای ندارد.',
      loanFilterAll: 'همه قرض‌ها',
      loanFilterDueSoon: 'کمتر از ۴۸ ساعت',
      loanFilterOverdue: 'گذشته از مهلت',
      collectPaymentBtn: 'دریافت پول',
      payVendorBillBtn: 'پرداخت بل',
      todayBtn: 'امروز',
      profitLossTitle: 'خلاصه مفاد و ضرر',
      totalSalesCollected: 'فروش وصول‌شده (درآمد)',
      totalExpensesPaid: 'بل‌ها و مصارف پرداخت‌شده',
      netProfitLabel: 'مفاد خالص',
      receivablesTitle: 'مشتریانی که هنوز قرضدار هستند',
      payablesTitle: 'بل‌هایی که باید پرداخت کنید',
      stockValuationTitle: 'ارزش موجودی گدام',
      stockCostValue: 'ارزش تمام‌شد (خرید)',
      stockRetailValue: 'ارزش فروش',
    },
    guide: {
      title: 'دستیار گام‌به‌گام استفاده از برنامه',
      subtitle: 'هر سوالی درباره کار با برنامه دارید بپرسید یا موضوعی را انتخاب کنید.',
      askPlaceholder: 'سوال خود را بنویسید (مثلاً: چطور بل بسازم؟)...',
      askButton: 'بپرسید',
      currentPageTipLabel: 'راهنمای صفحه‌ای که اکنون می‌بینید:',
      quickTopicsLabel: 'کارهای رایج (برای دیدن مراحل کلیک کنید)',
      stepsLabel: 'این مراحل ساده را دنبال کنید:',
      goToPageBtn: 'رفتن به آن صفحه',
      closeBtn: 'بستن راهنما',
    },
    backup: {
      sectionTitle: 'پشتیبان‌گیری و امنیت معلومات',
      exportBtn: 'پشتیبان‌گیری (Backup)',
      importBtn: 'بازیابی نسخه پشتیبان',
      exportSuccess: 'فایل پشتیبان با موفقیت دانلود شد.',
      importSuccess: 'نسخه پشتیبان بازیابی شد. تمام حساب‌ها و موجودی‌ها به‌روزرسانی گردید.',
      invalidJsonError: 'خطا در خواندن فایل: لطفاً یک فایل پشتیبان معتبر JSON انتخاب کنید.',
      invalidStructureError: 'فایل پشتیبان نامعتبر است: اطلاعات ضروری حسابداری در آن یافت نشد.',
      dismissBtn: 'تایید',
    },
    settings: {
      pageTitle: 'تنظیمات کاربر و ظاهر برنامه',
      pageSubtitle: 'یک تم رنگی ملایم و حرفه‌ای انتخاب کنید و زبان، واحد پول و پشتیبان‌گیری را مدیریت نمایید.',
      themeSectionTitle: 'تم رنگی محیط برنامه',
      themeSectionSubtitle: 'هر تم رنگ ملایم و متمایزی برای هر بخش حسابداری حفظ می‌کند تا کار راحت و چشم‌نواز باشد.',
      activeLabel: 'تم فعال',
      paletteBadge: 'پالت ۸ صفحه‌ای',
      sectionColorsTitle: 'رنگ متمایز هر بخش (برای مشاهده کلیک کنید)',
      sectionColorsDesc: 'در تم انتخاب‌شده، هر صفحه حسابداری رنگ ملایم و اختصاصی خود را دارد.',
      themes: {
        classic_ledger: {
          name: 'دفتر کلاسیک (Classic Ledger)',
          desc: 'سرمه‌ای اداری، سبز ملایم و گردویی روی پس‌زمینه کاغذی روشن.',
        },
        warm_parchment: {
          name: 'کاغذ گرم (Warm Parchment)',
          desc: 'کاغذ عاجی گرم همراه با رنگ‌های قهوه‌ای برنز، زیتونی و خاکی ملایم.',
        },
        crisp_pewter: {
          name: 'خاکستری فولادی (Crisp Pewter)',
          desc: 'خنثای گرافیتی شیک با رنگ‌های کاج تیره، سرمه‌ای و اخرایی ملایم.',
        },
        botanical_stone: {
          name: 'سنگ گیاهی (Botanical Stone)',
          desc: 'سبز معدنی آرام، فیروزه‌ای تیره و ماسه‌ای ملایم برای کار طولانی‌مدت.',
        },
      },
      preferencesTitle: 'تنظیمات زبان و واحد پول',
      preferencesSubtitle: 'هر زمان می‌توانید زبان نمایش (انگلیسی، پشتو، دری) و واحد پول را تغییر دهید.',
      dataSafetyTitle: 'مدیریت پشتیبان‌گیری و معلومات',
      dataSafetyDesc: 'نسخه کامل JSON تمام حساب‌های خود را ذخیره کنید یا از فایل قبلی بازیابی نمایید.',
    },
  },
};
