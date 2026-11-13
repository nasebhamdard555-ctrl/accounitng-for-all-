import type { AppLanguage, AppPage } from '../types/accounting';

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
  };
  reports: {
    pageTitle: string;
    pageSubtitle: string;
    printBtn: string;
    exportCsvBtn: string;
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
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDict> = {
  en: {
    appName: 'Meridian Accounting',
    tagline: 'Office Accounting Workspace',
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
      stepReportsDesc: 'Profit, debts & stock value',
      cashOnHand: 'Total Cash & Bank',
      moneyOwedToYou: 'Customers Owe You',
      billsYouOwe: 'Bills You Owe',
      netProfit: 'Net Profit (Collected)',
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
    },
    reports: {
      pageTitle: 'Simple Business Reports',
      pageSubtitle: 'Instant summary of your profit, unpaid customer invoices, supplier bills, and stock value.',
      printBtn: 'Print Report',
      exportCsvBtn: 'Download Summary (CSV)',
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
  },
  ps: {
    appName: 'د مریدین حسابداري',
    tagline: 'د سوداګرۍ اسانه حسابداري',
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
      stepReportsDesc: 'ګټه، طلبات او د ګودام ارزښت',
      cashOnHand: 'ټولې نغدې او بانک',
      moneyOwedToYou: 'پر پیرودونکو طلبات',
      billsYouOwe: 'پر تاسو پورونه',
      netProfit: 'خالصه ګټه (راټوله شوې)',
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
    },
    reports: {
      pageTitle: 'د کاروبار ساده راپورونه',
      pageSubtitle: 'د ګټې، طلباتو، پورونو او د ګودام د ټول ارزښت لنډیز.',
      printBtn: 'راپور چاپ کړئ',
      exportCsvBtn: 'راپور ډاونلوډ (CSV)',
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
  },
  fa: {
    appName: 'حسابداری مریدین',
    tagline: 'سیستم ساده حسابداری تجارتی',
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
      stepReportsDesc: 'مفاد، طلبات و ارزش گدام',
      cashOnHand: 'مجموع نقد و بانک',
      moneyOwedToYou: 'طلبات از مشتریان',
      billsYouOwe: 'بدهی‌های شما',
      netProfit: 'مفاد خالص (وصول شده)',
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
    },
    reports: {
      pageTitle: 'گزارش‌های ساده مالی',
      pageSubtitle: 'خلاصه فوری مفاد، طلبات مشتریان، بل‌های پرداختنی و ارزش گدام.',
      printBtn: 'چاپ گزارش',
      exportCsvBtn: 'دانلود خلاصه (CSV)',
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
  },
};
