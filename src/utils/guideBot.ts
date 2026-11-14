import type { AppLanguage, AppPage } from '../types/accounting';

export interface GuideTopic {
  id: string;
  targetPage: AppPage;
  keywords: string[];
  label: Record<AppLanguage, string>;
  summary: Record<AppLanguage, string>;
  steps: Record<AppLanguage, string[]>;
}

export const GUIDE_TOPICS: GuideTopic[] = [
  {
    id: 'daily_market_pulse',
    targetPage: 'home',
    keywords: [
      'market', 'pulse', 'daily', 'summary', 'today', 'how much', 'owe', 'loan', 'overview',
      'بازار', 'نننی', 'ورځنی', 'قرض', 'پیسې', 'امروز', 'بازار', 'طلب', 'بدهی', 'مصارف',
    ],
    label: {
      en: 'How to Check Daily Market Loans, Supplier Debt & Shop Expenses',
      ps: 'څنګه وګورو نن څومره پیسې په بازار کې پور دي او څومره لګښت شوی؟',
      fa: 'چطور ببینیم روزانه چقدر پول در بازار قرض است و مصارف ما چقدر است؟',
    },
    summary: {
      en: 'The Home screen gives you an instant daily snapshot of how much money is out in the market with customers, how much you owe suppliers, today’s shop & employee expenses, and today’s gross profit.',
      ps: 'اصلي پاڼه سمدستي ښيي چې څومره پیسې له پیرودونکو سره په بازار کې پور دي، پر عرضه کوونکو څومره پاتې دي، او د دوکان و کارکوونکو لګښت څومره دی.',
      fa: 'صفحه اصلی فوراً نشان می‌دهد چقدر پول شما در بازار نزد مشتریان قرض است، چقدر به فروشندگان بدهکار هستید، مصارف دوکان و کارمندان چقدر است و مفاد امروز چقدر شده است.',
    },
    steps: {
      en: [
        'Open "Home & Workflow" from the left menu.',
        'Look at the "Daily Business & Market Trust Pulse" section right under the top boxes.',
        'Check "Money in Market (Trust Loans)" to see total loans out and overdue/48h alerts, and click "Collect Loan" to collect cash.',
        'Check "Shop & Employee Expenses" to see Shop Rent, Employee Salaries, Utilities, and Transport separately.',
      ],
      ps: [
        'د کیڼ اړخ له منو څخه "کور او کاري نقشه" خلاصه کړئ.',
        'د پورتنیو کارتونو لاندې د "ورځني کاروبار او بازار نبض" برخه وګورئ.',
        'په "په بازار کې پیسې (پورونه)" کې ټول پورونه، وخت تېر شوي پورونه او د راټولولو تڼۍ وګورئ.',
        'په "د دوکان او کارکوونکو لګښتونه" کې د کرایې، معاشونو، برق او ټرانسپورټ تفصیل وګورئ.',
      ],
      fa: [
        'از منوی کناری صفحه «صفحه اصلی و نقشه کار» را باز کنید.',
        'درست زیر کارت‌های بالا، بخش «نبض روزانه کاروبار و قرض‌های بازار» را ببینید.',
        'در کارت «پول در بازار (قرض مشتریان)» جمع کل طلبات و تعداد سررسیدهای فوری را ببینید و با یک کلیک پول بگیرید.',
        'در کارت «مصارف دوکان و کارمندان» کرایه، معاش کارمندان و مصارف برق/انترنت را جداگانه مشاهده کنید.',
      ],
    },
  },
  {
    id: 'create_invoice',
    targetPage: 'customers',
    keywords: [
      'invoice', 'sell', 'sale', 'customer', 'bill customer', 'credit', 'trust', 'cash sale',
      'بل', 'پلور', 'پیرودونکی', 'نغد', 'نسیه', 'فاکتور', 'فروش', 'مشتری', 'نسیه',
    ],
    label: {
      en: 'How to Create a Sales Invoice (Cash or Trust Loan)',
      ps: 'څنګه د پلور بل (نغد یا په پور) جوړ کړو؟',
      fa: 'چطور بل فروش (نقد یا قرضی) بسازیم؟',
    },
    summary: {
      en: 'Use this whenever you sell a phone or product to a customer. You can mark it paid cash right away OR leave it as a trust loan with a payment deadline date.',
      ps: 'هر کله چې موبایل یا توکی پلورئ، دلته یې ثبت کړئ. کولی شئ نغد یې کړئ یا د تادیې وروستۍ نېټې سره په پور ورکړئ.',
      fa: 'هرگاه گوشی یا جنسی می‌فروشید اینجا ثبت کنید. می‌توانید همان لحظه نقد ثبت کنید یا با تاریخ سررسید به‌صورت قرض (نسیه) ذخیره نمایید.',
    },
    steps: {
      en: [
        'Open "Customers & Sales" from the left menu (or click "Record Sale" on Home).',
        'Choose the Customer name (or add a new customer on the right side first).',
        'Choose the Item sold and type the Quantity.',
        'If the customer paid cash now, tick "Customer paid cash right now". Otherwise set the Payment Deadline date for their trust loan.',
        'Click "Save Invoice". Inventory stock and customer loan balance update automatically.',
      ],
      ps: [
        'له منو څخه "پیرودونکي او بلونه" خلاص کړئ (یا په کور پاڼه کې "پلور ثبت کړئ" کلیک کړئ).',
        'د پیرودونکي نوم وټاکئ (یا لومړی ښي اړخ ته نوی پیرودونکی ثبت کړئ).',
        'پلورل شوی موبایل یا توکی او تعداد یې وټاکئ.',
        'که پیرودونکي نغدې درکړې وي، "نغدې پیسې ورکړې" ټیک کړئ؛ که نه وي، د پور د تادیې نېټه وټاکئ.',
        'د "بل ثبت کړئ" تڼۍ کلیک کړئ. ګودام او د پیرودونکي حساب په اتومات ډول سمېږي.',
      ],
      fa: [
        'بخش «مشتریان و فروش» را باز کنید (یا در صفحه اصلی روی «ثبت فروش» کلیک کنید).',
        'نام مشتری را انتخاب کنید (یا ابتدا در فرم کناری مشتری جدید بسازید).',
        'جنس فروخته‌شده و تعداد آن را مشخص کنید.',
        'اگر نقد داد تیک «مشتری همین اکنون پول نقد پرداخت کرد» را بزنید؛ اگر قرض است مهلت پرداخت را تعیین کنید.',
        'روی «ثبت بل فروش» کلیک کنید تا گدام و حساب مشتری خودکار به‌روز شود.',
      ],
    },
  },
  {
    id: 'partial_loan_payment',
    targetPage: 'customers',
    keywords: [
      'partial', 'installment', 'part payment', 'receive', 'payment', 'collect', 'paid', 'debt', 'loan back',
      'قسط', 'نیمه', 'پیسې', 'ترلاسه', 'راټول', 'دریافت', 'قسطی', 'پول', 'طلب', 'باقی',
    ],
    label: {
      en: 'How to Collect Full or Partial Loan Payments from a Customer',
      ps: 'څنګه له پیرودونکي ټولې یا نیمې (قسطي) پور پیسې واخلو؟',
      fa: 'چطور پول کامل یا قسمتی (قسطی) قرض مشتری را دریافت کنیم؟',
    },
    summary: {
      en: 'Customers in trust businesses often pay part of their loan today and the rest later. You can record either the full balance or any custom partial amount in seconds.',
      ps: 'پیرودونکي کولی شي د خپل پور یوه برخه نن او پاتې وروسته راوړي. تاسو دلته بشپړ یا نیم مبلغ ثبتولی شئ.',
      fa: 'در بازار ممکن است مشتری بخشی از قرض خود را امروز بدهد و بقیه را بعداً بیاورد. اینجا می‌توانید مبلغ کامل یا هر مقدار قسمتی را ثبت کنید.',
    },
    steps: {
      en: [
        'Go to "Customers & Sales".',
        'At the top of the Sales Invoices table, select "Collect into" (Main Cash Register or Bank Account).',
        'Find any invoice marked "Unpaid" or "Partial" and click "Receive Payment".',
        'Enter the amount the customer brought today (or leave it at the full remaining amount) and click Confirm.',
        'Your cash register goes up immediately and the customer’s remaining balance updates cleanly.',
      ],
      ps: [
        '"پیرودونکي او بلونه" پاڼې ته لاړ شئ.',
        'د جدول پورته وټاکئ چې پیسې نغدي دخل ته ځي که بانکي حساب ته.',
        'هر ناتادیه یا نیمه‌تادیه شوی بل ومومئ او "پیسې واخلئ" کلیک کړئ.',
        'هغه مبلغ ولیکئ چې پیرودونکي نن راوړی (یا ټول پاتې مبلغ پرېږدئ) او تایید یې کړئ.',
        'ستاسو دخل زیاتېږي او پاتې پور په اتومات ډول کمېږي.',
      ],
      fa: [
        'به صفحه «مشتریان و فروش» بروید.',
        'در بالای جدول بل‌ها، حساب مقصد (صندوق نقد یا بانک) را انتخاب کنید.',
        'روی «دریافت پول» کنار بل پرداخت‌نشده یا نیمه‌پرداخت کلیک کنید.',
        'مبلغی را که مشتری امروز آورده وارد کنید (یا کل مانده را نگه دارید) و تایید بزنید.',
        'موجودی صندوق فوراً زیاد شده و مانده بدهی مشتری دقیق به‌روز می‌شود.',
      ],
    },
  },
  {
    id: 'customer_vendor_ledger',
    targetPage: 'customers',
    keywords: [
      'ledger', 'statement', 'account', 'khata', 'history', 'debit', 'credit', 'party', 'balance sheet',
      'کهاته', 'روزنامچه', 'صورت حساب', 'حساب', 'لیجر', 'معاملات', 'صورت‌حساب', 'بیلانس',
    ],
    label: {
      en: 'How to View & Print a Customer or Supplier Ledger (Ledger A/c)',
      ps: 'څنګه د پیرودونکي یا عرضه کوونکي بشپړ حساب (کھاتہ / Ledger) وګورو؟',
      fa: 'چطور صورت‌حساب کامل مشتری یا فروشنده (Ledger A/c) را ببینیم و چاپ کنیم؟',
    },
    summary: {
      en: 'See every single invoice, cash payment, partial installment, and return for any customer or supplier in one clean statement with Debit, Credit, and Running Balance — ready to print.',
      ps: 'د هر پیرودونکي یا عرضه کوونکي ټول بلونه، نغدي رسیدونه، قسطونه او واپسۍ په یوه منظم حساب (Debit/Credit) کې وګورئ او چاپ یې کړئ.',
      fa: 'تمام بل‌ها، پرداخت‌های نقدی، اقساط و برگشتی‌های هر مشتری یا فروشنده را در یک صورت‌حساب با جمع بدهکار/بستانکار و مانده لحظه‌ای ببینید و چاپ کنید.',
    },
    steps: {
      en: [
        'Open "Customers & Sales" (for a customer) or "Vendors & Bills" (for a supplier), or use the Party Ledger section in "Business Reports".',
        'Scroll to the Customer Directory or Supplier Directory and click "Ledger" next to any person or shop.',
        'Review every transaction line by line along with Total Billed, Total Paid, and Balance Due.',
        'Click "Print / Save PDF" to give an official paper or PDF copy to your customer or supplier.',
      ],
      ps: [
        '"پیرودونکي او بلونه" یا "عرضه کوونکي او پورونه" پاڼه پرانیزئ (یا په راپورونو کې د حساب لټون وکاروئ).',
        'د پیرودونکو یا عرضه کوونکو په لست کې د هر کس ترڅنګ "حساب / Ledger" تڼۍ کلیک کړئ.',
        'هره معامله له نېټې، بل شمېرې او پاتې بیلانس سره په روښانه ډول وګورئ.',
        'د "چاپ / PDF" تڼۍ په وهلو سره رسمی کاپي چاپ یا خوندي کړئ.',
      ],
      fa: [
        'به صفحه «مشتریان و فروش» یا «فروشندگان و بل‌ها» بروید (یا در «گزارش‌های مالی» بخش صورت‌حساب طرفین را باز کنید).',
        'در فهرست مشتریان یا فروشندگان روی دکمه «صورت‌حساب / Ledger» کنار نام فرد کلیک کنید.',
        'تمام معاملات را به ترتیب تاریخ همراه با جمع کل و مانده حساب مشاهده کنید.',
        'برای چاپ یا ذخیره PDF رسمی روی «چاپ / ذخیره PDF» کلیک کنید.',
      ],
    },
  },
  {
    id: 'sales_purchase_return',
    targetPage: 'customers',
    keywords: [
      'return', 'refund', 's/r', 'p/r', 'exchange', 'back', 'damaged',
      'واپس', 'مسترد', 'برگشت', 'مرجوع', 'پس دادن',
    ],
    label: {
      en: 'How to Record a Sales Return (S/R) or Purchase Return (P/R)',
      ps: 'څنګه د پلور واپسي (S/R) یا د خرید واپسي (P/R) ثبت کړو؟',
      fa: 'چطور برگشت از فروش (S/R) یا برگشت از خرید (P/R) را ثبت کنیم؟',
    },
    summary: {
      en: 'If a customer returns a phone (S/R) or you send stock back to a wholesaler (P/R), reverse it in 1 click so inventory count, cash, and balances stay 100% accurate.',
      ps: 'که پیرودونکی موبایل واپس راوړي (S/R) یا تاسو توکی عرضه کوونکي ته واپس ولېږئ (P/R)، په یوه کلیک یې سم کړئ ترڅو ګودام او حساب سم پاتې شي.',
      fa: 'اگر مشتری گوشی را پس بیاورد (S/R) یا جنسی را به عمده‌فروش برگردانید (P/R)، با یک کلیک ثبت کنید تا موجودی گدام و حساب‌ها دقیق بماند.',
    },
    steps: {
      en: [
        'For a customer return (S/R): open "Customers & Sales", find the invoice in the table, and click "Return (S/R)". Stock automatically goes back up and debt/cash adjusts.',
        'For a supplier return (P/R): open "Vendors & Bills", find the supplier bill, and click "Return (P/R)" to reduce what you owe that supplier.',
      ],
      ps: [
        'د پیرودونکي واپسي (S/R): "پیرودونکي او بلونه" ته لاړ شئ او د بل ترڅنګ "واپسي (S/R)" کلیک کړئ. توکی بېرته ګودام ته ورزیاتېږي.',
        'د عرضه کوونکي واپسي (P/R): "عرضه کوونکي او پورونه" ته لاړ شئ او د بل ترڅنګ "واپسي (P/R)" کلیک کړئ ترڅو ستاسو پور کم شي.',
      ],
      fa: [
        'برای برگشت فروش مشتری (S/R): در صفحه «مشتریان و فروش» کنار بل مورد نظر روی «برگشت (S/R)» کلیک کنید تا موجودی به گدام برگردد و حساب اصلاح شود.',
        'برای برگشت خرید به فروشنده (P/R): در صفحه «فروشندگان و بل‌ها» کنار بل مربوطه روی «برگشت (P/R)» کلیک کنید.',
      ],
    },
  },
  {
    id: 'enter_pay_bill',
    targetPage: 'vendors',
    keywords: [
      'vendor', 'supplier', 'bill', 'pay bill', 'wholesaler', 'pur',
      'عرضه', 'فروشنده', 'عمده', 'خرید', 'پرداخت', 'بدهی', 'بل خرید',
    ],
    label: {
      en: 'How to Enter & Pay Supplier Bills (Full or Partial)',
      ps: 'څنګه د عرضه کوونکي بل ثبت او تادیه (بشپړ یا قسطي) کړو؟',
      fa: 'چطور بل فروشنده را ثبت و پرداخت (کامل یا قسمتی) کنیم؟',
    },
    summary: {
      en: 'Keep clear track of what you owe wholesalers in Kabul or Dubai, and pay full bills or partial installments from your cash register or bank.',
      ps: 'د عمده پلورونکو ټول پورونه دلته ثبت کړئ او له خپل نغدي دخل یا بانک څخه یې په بشپړه توګه یا قسط وار تادیه کړئ.',
      fa: 'حساب بدهی خود به عمده‌فروشان را ثبت کنید و از صندوق نقد یا بانک به‌صورت کامل یا قسطی بپردازید.',
    },
    steps: {
      en: [
        'Open "Vendors & Bills".',
        'Choose the Supplier, write a short description (e.g., 5x iPhone batch), enter the total amount, and click "Save Bill".',
        'To pay later (full or partial), choose your Cash or Bank account, click "Pay Bill" on the row, and type the exact amount you are paying today.',
      ],
      ps: [
        '"عرضه کوونکي او پورونه" پاڼه خلاصه کړئ.',
        'عرضه کوونکی وټاکئ، لنډه تشریح او مبلغ ولیکئ او "بل ثبت کړئ" ووهئ.',
        'د تادیې پر مهال حساب وټاکئ، پر "بل تادیه کړئ" کلیک وکړئ او هغه مبلغ ولیکئ چې نن یې ورکوئ.',
      ],
      fa: [
        'صفحه «فروشندگان و بل‌ها» را باز کنید.',
        'نام فروشنده، توضیحات و مبلغ را وارد کرده و روی «ثبت بل» کلیک کنید.',
        'هنگام پرداخت، حساب نقد یا بانک را انتخاب کرده و روی «پرداخت بل» کلیک کنید و مبلغ پرداختی امروز را وارد نمایید.',
      ],
    },
  },
  {
    id: 'inventory_stock',
    targetPage: 'inventory',
    keywords: [
      'stock', 'item', 'product', 'inventory', 'add product', 'margin', 'cost', 'rate',
      'توکی', 'ګودام', 'جنس', 'گدام', 'موجودی', 'قیمت', 'مفاد',
    ],
    label: {
      en: 'How to Add Products, Check Profit Margin % & Adjust Stock',
      ps: 'څنګه نوی توکی زیات کړو، د ګټې فیصدي (Margin %) او تعداد وګورو؟',
      fa: 'چطور جنس جدید اضافه کنیم، درصد مفاد (Margin %) و موجودی را ببینیم؟',
    },
    summary: {
      en: 'Manage all phone models and accessories with Brand, Buy Cost, Sell Price, automatic Margin %, and quick +1 / -1 shelf adjustments.',
      ps: 'ټول موبایلونه د برانډ، اخیستو بیه، پلور بیه، اتومات ګټه (%) او +۱ / -۱ تڼیو سره کنټرول کړئ.',
      fa: 'همه مدل‌ها را با نام برند، قیمت خرید، قیمت فروش، درصد سود خودکار و دکمه‌های +۱ / -۱ مدیریت کنید.',
    },
    steps: {
      en: [
        'Open "Items & Stock" from the left menu.',
        'Enter Product Name, Brand (e.g., Apple, Samsung), SKU, Buy Cost, Sell Price, Starting Qty, and Re-Order Alert Level.',
        'Click "Add Product". The table immediately shows your Margin % per unit and total stock cost/retail value.',
      ],
      ps: [
        'له منو څخه "توکي او ګودام" خلاص کړئ.',
        'د توکي نوم، برانډ، کوډ، د اخیستو او پلور بیه، تعداد او د کمښت حد ولیکئ.',
        '"توکی ثبت کړئ" کلیک کړئ. جدول ستاسو د ګټې فیصدي (%) په اتومات ډول ښيي.',
      ],
      fa: [
        'از منو بخش «اجناس و گدام» را باز کنید.',
        'نام جنس، برند، کد (SKU)، قیمت خرید، قیمت فروش، تعداد اولیه و حد هشدار سفارش را بنویسید.',
        'روی «ثبت محصول» کلیک کنید تا درصد مفاد هر گوشی و ارزش کل گدام نمایش داده شود.',
      ],
    },
  },
  {
    id: 'inventory_imei_detail',
    targetPage: 'inventory',
    keywords: [
      'imei', 'serial', 'days in stock', 'register', 'aging', 'lookup', 'find imei', 'box',
      'ایمي', 'سیریل', 'راجستر', 'ورځې', 'سریال', 'شماره ایمی', 'گوشی',
    ],
    label: {
      en: 'How to Check 15-Digit IMEI Details, Days in Stock & Item Register',
      ps: 'څنګه د ۱۵ عددي IMEI تفصیل، په ګودام کې ورځې او د توکي تاریخچه وګورو؟',
      fa: 'چطور جزئیات IMEI، روزهای ماندن در گدام و تاریخچه فروش هر مدل را ببینیم؟',
    },
    summary: {
      en: 'Just like advanced shop systems, click "IMEI Detail" or "Register" on any phone model to see every 15-digit IMEI, which supplier it came from, purchase invoice #, Days in Stock, and add new incoming IMEIs.',
      ps: 'په هر موبایل باندې "IMEI تفصیل" یا "راجستر" کلیک وکړئ ترڅو هر ۱۵ عددي IMEI، عرضه کوونکی، د خرید بل شمېره، په ګودام کې تېرې شوې ورځې او د پلور تاریخچه وګورئ.',
      fa: 'روی «جزئیات IMEI» یا «دفتر جنس» کنار هر مدل کلیک کنید تا تک‌تک شماره‌های ۱۵ رقمی IMEI، نام تامین‌کننده، روزهای ماندن در گدام و تاریخچه فروش آن را ببینید.',
    },
    steps: {
      en: [
        'Open "Items & Stock". You can also type any 15-digit IMEI directly into the top Search box to find which model it belongs to.',
        'Click "IMEI Detail" on any product row to inspect every serial unit, supplier name, purchase date, Days in Stock, and status (In Stock / Sold).',
        'Use "+ Add Incoming IMEI" inside that window to register newly arrived phone boxes with their 15-digit IMEI.',
        'Switch to the "Item Register" tab to view every sale and return recorded for that product.',
      ],
      ps: [
        '"توکي او ګودام" خلاص کړئ. تاسو همدارنګه ۱۵ عددي IMEI مستقیم د لټون په خانه کې هم لټولی شئ.',
        'پر هر محصول باندې "IMEI تفصیل" کلیک کړئ ترڅو عرضه کوونکی، نېټه، په ګودام کې ورځې او حالت وګورئ.',
        'د نوي موبایلونو د ثبتولو لپاره همدلته "+ نوی IMEI زیات کړئ" وکاروئ.',
        'د "توکي راجستر" برخه د دې ماډل ټول پلورونه او واپسۍ ښيي.',
      ],
      fa: [
        'صفحه «اجناس و گدام» را باز کنید. حتی می‌توانید شماره ۱۵ رقمی IMEI را مستقیم در کادر جستجو بنویسید.',
        'روی «جزئیات IMEI» کلیک کنید تا فروشنده، تاریخ خرید، تعداد روزهای ماندن در گدام و وضعیت هر گوشی نمایش داده شود.',
        'برای ثبت گوشی‌های جدید، از بخش «+ افزودن IMEI جدید» استفاده کنید.',
        'در تب «دفتر جنس» همه فروش‌ها و برگشتی‌های آن مدل را ببینید.',
      ],
    },
  },
  {
    id: 'inventory_reorder',
    targetPage: 'inventory',
    keywords: [
      'reorder', 're-order', 'shortage', 'low stock', 'out of stock', 'minimum', 'restock',
      'کم', 'خلاص', 'سفارش', 'کمبود', 'تمام شدن',
    ],
    label: {
      en: 'How to Find Low Stock & Items Ready to Re-Order',
      ps: 'څنګه کم شوي توکي (Re-Order) ژر ومومو؟',
      fa: 'چطور اجناس کم‌شده و نیازمند سفارش مجدد (Re-Order) را پیدا کنیم؟',
    },
    summary: {
      en: 'Never run out of fast-selling phone models. Filter your inventory to show only items at or below your Re-Order level.',
      ps: 'هیڅکله مو مهم موبایلونه مه خلاصوئ. په یوه کلیک یوازې هغه توکي وګورئ چې تعداد یې د کمښت تر حد لاندې راغلی دی.',
      fa: 'اجناس پرفروش را همیشه موجود نگه دارید. با یک کلیک فقط مدل‌هایی را ببینید که به حد سفارش مجدد رسیده‌اند.',
    },
    steps: {
      en: [
        'Open "Items & Stock".',
        'Click the "Low Stock / Re-Order" summary card at the top OR click the "Low Stock / Re-Order" filter button above the table.',
        'Review items flagged in red and restock them from your wholesale suppliers.',
      ],
      ps: [
        '"توکي او ګودام" خلاص کړئ.',
        'پورته د "کم شوي توکي" کارت کلیک کړئ یا د جدول سر ته د "کم شوي / Re-Order" فلټر وټاکئ.',
        'په سور رنګ نښه شوي توکي له خپل عرضه کوونکي څخه بیا راوړئ.',
      ],
      fa: [
        'به صفحه «اجناس و گدام» بروید.',
        'روی کارت «اجناس رو به اتمام» یا دکمه فیلتر «موجودی کم / سفارش مجدد» کلیک کنید.',
        'اجناس علامت‌گذاری‌شده را بررسی کرده و از فروشنده سفارش دهید.',
      ],
    },
  },
  {
    id: 'shop_employee_expenses',
    targetPage: 'banking',
    keywords: [
      'bank', 'cash', 'deposit', 'expense', 'rent', 'salary', 'salaries', 'employee', 'staff', 'electricity', 'internet', 'transport', 'drawer',
      'بانک', 'نغد', 'لګښت', 'کرایه', 'معاش', 'کارکوونکی', 'برق', 'صندوق', 'مصرف', 'کرایه', 'معاش', 'کارمند',
    ],
    label: {
      en: 'How to Record Shop Rent, Employee Salaries & Daily Expenses',
      ps: 'څنګه د دوکان کرایه، د کارکوونکو معاشونه او ورځني لګښتونه ثبت کړو؟',
      fa: 'چطور کرایه دوکان، معاش کارمندان و مصارف روزانه را ثبت کنیم؟',
    },
    summary: {
      en: 'Separate your expenses by category (Shop Rent, Employee Salary & Incentives, Utilities & Internet, Transport, Other) so you know exactly where cash goes each day and month.',
      ps: 'خپل لګښتونه په کټګوریو (د دوکان کرایه، د کارکوونکو معاش، برق او انټرنېټ، ټرانسپورټ) وویشئ ترڅو دقیق پوه شئ پیسې چېرته لګېږي.',
      fa: 'مصارف را بر اساس نوع (کرایه دوکان، معاش و انعام کارمندان، برق و انترنت، ترانسپورت، متفرقه) دسته‌بندی کنید تا دقیق بدانید پول کجا خرج می‌شود.',
    },
    steps: {
      en: [
        'Open "Banking & Cash".',
        'Select Main Cash Register or your Bank Account, and choose "Shop Expense (-)" (or "Deposit (+)").',
        'Pick the Expense Category: Employee Salary & Bonus, Shop Rent, Utilities & Internet, Transport, or Other.',
        'Write a short note and amount, then click "Save Entry". Totals update immediately on Home and Reports.',
      ],
      ps: [
        '"بانک او نغدې پیسې" پاڼې ته لاړ شئ.',
        'نغدي دخل یا بانکي حساب او بیا "د دوکان لګښت (-)" وټاکئ.',
        'د لګښت کټګوري (د کارکوونکو معاش، کرایه، برق/انټرنېټ، ټرانسپورټ) انتخاب کړئ.',
        'لنډه تشریح او مبلغ ولیکئ او "معامله ثبت کړئ" کلیک کړئ.',
      ],
      fa: [
        'به صفحه «بانک و صندوق نقد» بروید.',
        'حساب نقد یا بانکی و گزینه «مصارف دوکان (-)» را انتخاب کنید.',
        'بخش مصرف (معاش کارمندان، کرایه دوکان، برق و انترنت، ترانسپورت یا متفرقه) را تعیین کنید.',
        'توضیحات و مبلغ را وارد کرده و «ذخیره معامله» را بزنید.',
      ],
    },
  },
  {
    id: 'reports_period',
    targetPage: 'reports',
    keywords: [
      'report', 'daily report', 'weekly', 'monthly', 'end of day', 'closing', 'csv', 'how many sold',
      'راپور', 'ورځنی', 'اونیز', 'میاشتنی', 'پای', 'گزارش', 'روزانه', 'هفته‌وار', 'ماهانه',
    ],
    label: {
      en: 'How to Run End-of-Day, Week & Month Sales Reports (Cash vs Loans)',
      ps: 'څنګه د ورځې، اونۍ او میاشتې پای راپور (نغد او پور) وګورو؟',
      fa: 'چطور گزارش پایان روز، هفته و ماه (نقد و قرض) را ببینیم؟',
    },
    summary: {
      en: 'See how many items were sold at each price, how much came in cash, and who took loans for any day, week, or month — plus export to Excel (CSV) or print.',
      ps: 'د هرې ورځې، اونۍ یا میاشتې لپاره وګورئ څومره توکي وپلورل شول، څومره نغد وو او چا پور وړی دی.',
      fa: 'برای هر روز، هفته یا ماه ببینید چند عدد جنس به چه قیمتی فروخته شد، چقدر نقد شد و چه کسانی قرض بردند.',
    },
    steps: {
      en: [
        'Open "Business Reports" from the left menu.',
        'Click "End of Day", "End of Week", or "End of Month" and pick any date (or click "Today").',
        'Check "How Many Sold & At What Price" and "Loans Given & With Whom".',
        'Click "Download Period Report (CSV)" or "Print Report".',
      ],
      ps: [
        '"د سوداګرۍ راپورونه" پاڼه پرانیزئ.',
        '"د ورځې پای"، "د اونۍ پای" یا "د میاشتې پای" وټاکئ او نېټه انتخاب کړئ.',
        'لاندې د پلورل شویو توکو تعداد، بیې او د پور اخیستونکو جدول وګورئ.',
        'د CSV ډاونلوډ یا چاپ تڼۍ کلیک کړئ.',
      ],
      fa: [
        'صفحه «گزارش‌های مالی» را باز کنید.',
        'دکمه «پایان روز»، «پایان هفته» یا «پایان ماه» را زده و تاریخ را انتخاب کنید.',
        'جدول تعداد و قیمت اجناس و جدول قرض‌ها را بررسی کنید.',
        'برای ذخیره یا چاپ، دکمه CSV یا «چاپ گزارش» را بزنید.',
      ],
    },
  },
  {
    id: 'reports_pnl_mis',
    targetPage: 'reports',
    keywords: [
      'profit', 'loss', 'p&l', 'gross profit', 'net profit', 'mis', 'margin', 'trading',
      'ګټه', 'تاوان', 'خالصه', 'مفاد', 'ضرر', 'ناخالص', 'سود',
    ],
    label: {
      en: 'How to Read Your Profit & Loss (P&L) & Gross Profit Report',
      ps: 'څنګه د خپل کاروبار د ناخالصه او خالصه ګټې او تاوان (P&L) راپور ولولو؟',
      fa: 'چطور گزارش مفاد ناخالص، مفاد خالص و بیلان سود و زیان (P&L) را بخوانیم؟',
    },
    summary: {
      en: 'Compare Net Sales minus Cost of Goods Sold to get Gross Profit %, then subtract Shop Rent, Employee Salaries, and Shop Expenses to see your true Net Profit.',
      ps: 'د پلور له پیسو څخه د توکو د اخیستو بیه (COGS) کمېږي ترڅو ناخالصه ګټه وښيي، او بیا ترې د دوکان و کارکوونکو لګښتونه کمېږي ترڅو رښتینې خالصه ګټه معلومه شي.',
      fa: 'از فروش خالص، قیمت تمام‌شده اجناس کم می‌شود تا مفاد ناخالص (%) به دست آید؛ سپس مصارف دوکان و معاش کارمندان کسر شده و مفاد خالص واقعی نمایش داده می‌شود.',
    },
    steps: {
      en: [
        'Open "Business Reports" and scroll to "Trading & Profit & Loss Statement (P&L)".',
        'Left/Top shows Net Sales, Cost of Goods Sold, and Gross Profit with Margin %.',
        'Below/Right lists all Shop & Employee Expenses (Rent, Staff Salaries, Utilities, Transport) subtracted to show your true Net Profit.',
      ],
      ps: [
        '"د سوداګرۍ راپورونه" ته لاړ شئ او "د ګټې او تاوان بشپړ راپور (P&L)" برخه وګورئ.',
        'هلته به خالص پلور، د توکو بیه، ناخالصه ګټه (%) او ټول لګښتونه (کرایه، معاشونه) په جلا ډول ووینئ.',
        'په پای کې ستاسو خالصه ګټه او فیصدي ښودل شوې ده.',
      ],
      fa: [
        'در صفحه «گزارش‌های مالی» به بخش «صورت‌حساب کامل مفاد و ضرر (P&L)» بروید.',
        'فروش خالص، قیمت خرید اجناس و مفاد ناخالص (%) در بخش درآمد نمایش داده شده است.',
        'مصارف دوکان و معاش کارمندان تفکیک شده و در نهایت مفاد خالص نهایی را می‌بینید.',
      ],
    },
  },
  {
    id: 'loan_48h_reminders',
    targetPage: 'reports',
    keywords: [
      '48', '48h', 'due', 'overdue', 'warning', 'remind', 'reminder', 'sms', 'whatsapp', 'call',
      'یادونه', 'سررسید', 'وخت', 'تلیفون', 'پیغام', 'یادآوری', 'مهلت', 'پیامک',
    ],
    label: {
      en: 'How to Spot Due < 48h Loans & Send Customer Reminders',
      ps: 'څنګه هغه پورونه وګورو چې وخت یې نږدې دی (۴۸ ساعته) او یادونه ولېږو؟',
      fa: 'چطور قرض‌های نزدیک به سررسید (۴۸ ساعت) را ببینیم و یادآوری بفرستیم؟',
    },
    summary: {
      en: 'Loans due within 48 hours automatically show a yellow "Payment Due" warning badge and a 1-click "Remind Customer" button with pre-written English/Pashto/Dari messages.',
      ps: 'هغه پورونه چې تر ۴۸ ساعتونو کم وخت یې پاتې وي په ژېړ رنګ نښه کېږي او تاسو کولی شئ په یوه کلیک چمتو شوی پیغام یا SMS ولېږئ.',
      fa: 'قرض‌هایی که کمتر از ۴۸ ساعت به مهلت‌شان مانده با نشان هشدار زرد مشخص می‌شوند و با یک کلیک پیام آماده یادآوری برای مشتری می‌فرستید.',
    },
    steps: {
      en: [
        'Open "Business Reports" and scroll to "Outstanding Loans" (or click the 48h alert on Home).',
        'Filter by "Due < 48h" or "Overdue" to see urgent customers at the top.',
        'Click "Remind Customer" next to any customer or loan row.',
        'Copy the ready message for WhatsApp, tap Send SMS / Call Phone, and click "Done & Mark Reminded".',
      ],
      ps: [
        '"د سوداګرۍ راپورونه" پرانیزئ او "پاتې پورونه" برخه وګورئ.',
        'د "تر ۴۸ ساعتو کم" یا "وخت تېر شوی" فلټر کلیک کړئ.',
        'د پیرودونکي ترڅنګ "پیرودونکي ته یادونه" کلیک وکړئ.',
        'پیغام کاپي کړئ، SMS یا تلیفون ووهئ او "تایید" کلیک کړئ.',
      ],
      fa: [
        'در صفحه «گزارش‌های مالی» به بخش «قرض‌های پرداخت‌نشده مشتریان» بروید.',
        'فیلتر «کمتر از ۴۸ ساعت» یا «گذشته از مهلت» را انتخاب کنید.',
        'روی «یادآوری به مشتری» کلیک کنید.',
        'پیام را برای واتساپ کاپی کنید یا مستقیم پیامک و تماس بگیرید و در پایان «تایید» را بزنید.',
      ],
    },
  },
  {
    id: 'printable_pdf_invoice',
    targetPage: 'customers',
    keywords: [
      'print', 'pdf', 'official', 'paper', 'signature', 'receipt',
      'چاپ', 'سند', 'رسید', 'کاپي', 'پرنټ', 'چاپ', 'فاکتور',
    ],
    label: {
      en: 'How to Print or Save an Official PDF Sales Invoice',
      ps: 'څنګه د پلور رسمي بل چاپ یا د PDF په توګه خوندي کړو؟',
      fa: 'چطور بل رسمی فروش را چاپ یا به‌صورت PDF ذخیره کنیم؟',
    },
    summary: {
      en: 'Generate a clean, official business invoice with customer details, amount paid, balance due, and signature lines ready for printing or PDF download.',
      ps: 'د پیرودونکي معلوماتو، تادیه شوي مبلغ، پاتې حساب او لاسلیک ځای سره رسمي بل چاپ یا خوندي کړئ.',
      fa: 'بل رسمی همراه با مشخصات مشتری، مبلغ پرداخت‌شده، مانده حساب و جای امضا آماده چاپ یا ذخیره PDF بسازید.',
    },
    steps: {
      en: [
        'Open "Customers & Sales".',
        'Find the invoice in the "Sales Invoices" table and click "Print / PDF".',
        'Review the clean preview sheet, then click "Print / Save PDF" to print or choose "Save as PDF".',
      ],
      ps: [
        '"پیرودونکي او بلونه" پاڼه خلاصه کړئ.',
        'د بلونو په جدول کې پر هر بل د "چاپ / PDF" تڼۍ کلیک کړئ.',
        'رسمي بڼه وګورئ او د "چاپ / PDF خوندي کړئ" تڼۍ ووهئ.',
      ],
      fa: [
        'صفحه «مشتریان و فروش» را باز کنید.',
        'در جدول بل‌ها روی دکمه «چاپ / PDF» کنار بل مورد نظر کلیک کنید.',
        'پیش‌نمایش رسمی را بررسی کرده و روی «چاپ / ذخیره PDF» بزنید.',
      ],
    },
  },
  {
    id: 'pos_sync',
    targetPage: 'pos_sync',
    keywords: [
      'pos', 'offline', 'conflict', 'sync', 'duplicate', 'mismatch',
      'آفلاین', 'ستونزه', 'تکرار', 'اختلاف', 'همگام',
    ],
    label: {
      en: 'How to Fix Offline POS Receipt Conflicts',
      ps: 'د آفلاین پلور ستونزې څنګه حل کړو؟',
      fa: 'چطور مشکل رسیدهای آفلاین را حل کنیم؟',
    },
    summary: {
      en: 'If internet dropped and two registers used the same phone IMEI, simply click a different available phone in stock, approve with a note, or cancel the receipt.',
      ps: 'که د انټرنېټ د نشتوالي پر مهال دوه میزونو یو IMEI کارولی وي، له ګودام څخه بل تیار موبایل وټاکئ یا رسید لغوه کړئ.',
      fa: 'اگر هنگام قطع انترنت دو صندوق یک شماره IMEI را فروخته باشند، یک گوشی آماده دیگر از گدام انتخاب کنید یا رسید را لغو کنید.',
    },
    steps: {
      en: [
        'Open "POS Sync Fixes" from the left menu.',
        'Click a flagged receipt in the left list.',
        'Option 1 (Easiest): Click one of the green "Ready phones in stock" buttons to fill the right IMEI, then click "Save & Fix Receipt".',
        'Or use Option 2 (Manager Approval) or Option 3 (Cancel Receipt).',
      ],
      ps: [
        'له منو څخه "د آفلاین پلور سمون" خلاص کړئ.',
        'په کیڼ لست کې پر ستونزه لرونکي رسید کلیک کړئ.',
        'لومړۍ لاره (اسانه): لاندې د "تیار موبایلونو" له لست څخه یو کلیک کړئ او بیا "تغییر ثبت" ووهئ.',
        'یا د دویمې (تایید) او دریمې (لغوه) تڼۍ څخه کار واخلئ.',
      ],
      fa: [
        'بخش «اصلاح فروش آفلاین» را باز کنید.',
        'از لیست سمت راست/چپ روی رسید مشکل‌دار کلیک کنید.',
        'روش ۱ (ساده‌ترین): روی یکی از گوشی‌های آماده در گدام کلیک کنید تا کد آن پر شود، سپس «ذخیره و اصلاح رسید» را بزنید.',
        'یا از روش ۲ (تایید مدیر) و روش ۳ (لغو رسید) استفاده کنید.',
      ],
    },
  },
  {
    id: 'backup_restore',
    targetPage: 'settings',
    keywords: [
      'backup', 'restore', 'export', 'import', 'json', 'save file', 'data safety', 'copy',
      'بیک اپ', 'خوندي', 'بېرته', 'پشتیبان', 'بازیابی', 'ذخیره فایل',
    ],
    label: {
      en: 'How to Backup & Restore All Your Business Data',
      ps: 'څنګه د خپل ټول کاروبار معلومات خوندي (Backup) او بېرته راولئ؟',
      fa: 'چطور از تمام اطلاعات کاروبار پشتیبان (Backup) بگیریم و بازیابی کنیم؟',
    },
    summary: {
      en: 'Download a full copy of all customers, loans, suppliers, stock, IMEIs, and cash registers as one safe JSON file anytime.',
      ps: 'د ټولو پیرودونکو، پورونو، عرضه کوونکو، ګودام او نغدو حسابونو بشپړ فایل خوندي کړئ ترڅو هیڅ معلومات ورک نه شي.',
      fa: 'همیشه می‌توانید یک نسخه کامل از مشتریان، قرض‌ها، فروشندگان، گدام و صندوق‌ها را در یک فایل امن دانلود یا بازیابی کنید.',
    },
    steps: {
      en: [
        'Click "Backup Data" in the bottom-left sidebar (or inside "Settings") to save a dated JSON file to your computer or phone.',
        'To restore data on another device or after clearing browser history, click "Import Backup" and choose your saved `.json` file.',
      ],
      ps: [
        'په کیڼ منو یا "تنظیمات" کې "بیک اپ ډاونلوډ" کلیک وکړئ ترڅو فایل ستاسو کمپیوټر یا موبایل ته خوندي شي.',
        'د معلوماتو د بېرته راوستلو لپاره "بیک اپ بېرته راوستل" ووهئ او خپل خوندي شوی فایل وټاکئ.',
      ],
      fa: [
        'در پایین منو یا صفحه «تنظیمات» روی «پشتیبان‌گیری (Backup)» کلیک کنید تا فایل تاریخ‌دار ذخیره شود.',
        'برای بازیابی در دستگاه دیگر، روی «بازیابی نسخه پشتیبان» زده و فایل `.json` خود را انتخاب کنید.',
      ],
    },
  },
  {
    id: 'theme_settings',
    targetPage: 'settings',
    keywords: [
      'theme', 'color', 'settings', 'appearance', 'dark', 'light', 'mobile', 'quick actions',
      'رنګ', 'تنظیمات', 'بڼه', 'رنگ', 'تم', 'ظاهر', 'موبایل',
    ],
    label: {
      en: 'How to Change Color Themes & Mobile Quick Actions',
      ps: 'څنګه د کاریال رنګ، ژبه او د موبایل چټکې تڼۍ وکاروو؟',
      fa: 'چطور تم رنگی برنامه را تغییر دهیم و از عملیات سریع موبایل استفاده کنیم؟',
    },
    summary: {
      en: 'Pick from 4 calm, professional color themes where every page retains a slightly distinct hue, plus use the persistent Quick Actions bar at the bottom of the mobile drawer.',
      ps: 'له ۴ آرامو مسلکي رنګونو څخه یو وټاکئ؛ په هر رنګ کې هره پاڼه لږ توپیر لري. په موبایل کې د منو په پای کې چټکې تڼۍ هم شته.',
      fa: 'از بین ۴ تم رنگی ملایم و حرفه‌ای انتخاب کنید که در همه آن‌ها هر بخش رنگ متمایز خود را دارد؛ در موبایل هم دکمه عملیات سریع همیشه در پایین منو در دسترس است.',
    },
    steps: {
      en: [
        'Click "Settings" at the bottom of the left menu.',
        'Click Classic Ledger, Warm Parchment, Crisp Pewter, or Botanical Stone to preview and apply it immediately.',
        'On phones, tap the top-left menu icon and use the "Quick Actions" button pinned at the bottom of the drawer to log a sale or loan payment in 1 tap.',
      ],
      ps: [
        'د منو په پای کې "تنظیمات" کلیک کړئ.',
        'د ۴ رنګونو څخه خپل د خوښې چوکاټ کلیک کړئ ترڅو سمدستي تطبیق شي.',
        'په موبایل کې پورته کیڼ منو خلاص کړئ او په پای کې د "چټکې کړنې" تڼۍ څخه کار واخلئ.',
      ],
      fa: [
        'در پایین منو روی «تنظیمات» کلیک کنید.',
        'یکی از ۴ تم رنگی را انتخاب کنید تا فوراً ظاهر کل برنامه تغییر کند.',
        'در گوشی موبایل منو را باز کرده و با دکمه «عملیات سریع» در پایین منو فوراً فروش یا پرداخت ثبت کنید.',
      ],
    },
  },
  {
    id: 'language_currency',
    targetPage: 'home',
    keywords: [
      'language', 'pashto', 'dari', 'english', 'afn', 'afghani', 'usd', 'dollar', 'currency', 'rtl',
      'ژبه', 'پښتو', 'دري', 'افغانۍ', 'ډالر', 'اسعار', 'زبان', 'پشتو', 'دری', 'افغانی', 'دالر', 'واحد پول',
    ],
    label: {
      en: 'How to Switch Language (English / Pashto / Dari) & Currency (AFN / USD)',
      ps: 'څنګه ژبه (پښتو / دري / انګلیسي) او اسعار (افغانی / ډالر) بدل کړو؟',
      fa: 'چطور زبان (پشتو / دری / انگلیسی) و واحد پول (افغانی / دالر) را تغییر دهیم؟',
    },
    summary: {
      en: 'Switch the entire app cleanly between English, Pashto (RTL), and Dari (RTL), and view all amounts in Afghani (؋) or USD ($) anytime.',
      ps: 'ټول کاریال په یوه کلیک پښتو، دري یا انګلیسي ته واړوئ او ټول حسابونه په افغانیو (؋) یا ډالرو ($) وګورئ.',
      fa: 'کل برنامه را در یک لحظه بین انگلیسی، پشتو (راست‌چین) و دری (راست‌چین) جابه‌جا کنید و مبالغ را به افغانی (؋) یا دالر ($) ببینید.',
    },
    steps: {
      en: [
        'On "Home & Workflow" (or inside "Settings"), click English, پښتو (Pashto), or دری (Dari).',
        'Click AFN (؋) or USD ($) next to Currency to update all invoices, loans, stock values, and reports immediately.',
      ],
      ps: [
        'په "کور او کاري نقشه" (یا "تنظیمات") پاڼه کې English، پښتو یا دری کلیک کړئ.',
        'د اسعارو لپاره AFN (؋) یا USD ($) وټاکئ ترڅو ټول بلونه او راپورونه سم شي.',
      ],
      fa: [
        'در «صفحه اصلی» یا «تنظیمات»، روی English، پښتو یا دری کلیک کنید.',
        'برای واحد پول، AFN (؋) یا USD ($) را بزنید تا تمام مبالغ به‌روز شوند.',
      ],
    },
  },
];

const PAGE_TO_TOPIC_ID: Record<AppPage, string> = {
  home: 'daily_market_pulse',
  customers: 'create_invoice',
  vendors: 'enter_pay_bill',
  inventory: 'inventory_stock',
  banking: 'shop_employee_expenses',
  pos_sync: 'pos_sync',
  reports: 'reports_period',
  settings: 'theme_settings',
};

export const SUGGESTED_QUESTIONS: Record<AppLanguage, string[]> = {
  en: [
    'How much money is in the market as loans?',
    'How to collect partial loan payment?',
    'How to check 15-digit IMEI & days in stock?',
    'How to view customer ledger statement?',
    'How to record employee salary & shop rent?',
    'How to return a sold phone (S/R)?',
  ],
  ps: [
    'څومره پیسې په بازار کې پور دي؟',
    'څنګه نیمه یا قسطي پیسې واخلو؟',
    'څنګه د ۱۵ عددي IMEI تفصیل وګورو؟',
    'څنګه د پیرودونکي کھاتہ / لیجر وګورو؟',
    'څنګه د کارکوونکو معاش او کرایه ثبت کړو؟',
    'څنګه د پلور واپسي (S/R) ثبت کړو؟',
  ],
  fa: [
    'چقدر پول ما در بازار قرض است؟',
    'چطور قسطی از مشتری پول بگیریم؟',
    'چطور جزئیات IMEI و روزهای گدام را ببینیم؟',
    'چطور صورت‌حساب مشتری (Ledger) را چاپ کنیم؟',
    'چطور معاش کارمندان و کرایه دوکان را ثبت کنیم؟',
    'چطور برگشت از فروش (S/R) بزنیم؟',
  ],
};

export function getPageQuickGuide(page: AppPage, _lang: AppLanguage): GuideTopic {
  const topicId = PAGE_TO_TOPIC_ID[page];
  return GUIDE_TOPICS.find((t) => t.id === topicId) || GUIDE_TOPICS[0];
}

function scoreTopic(topic: GuideTopic, rawQuery: string, lang: AppLanguage): number {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return 0;

  const tokens = q
    .split(/[\s,?.!؟،/()]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2);

  let score = 0;

  for (const kw of topic.keywords) {
    const kwLower = kw.toLowerCase();
    if (q.includes(kwLower)) {
      score += kwLower.length >= 5 ? 4 : 3;
    } else if (tokens.some((tok) => kwLower.includes(tok) || tok.includes(kwLower))) {
      score += 2;
    }
  }

  const labelText = `${topic.label.en} ${topic.label.ps} ${topic.label.fa}`.toLowerCase();
  const summaryText = `${topic.summary[lang]} ${topic.summary.en}`.toLowerCase();

  if (topic.label[lang].toLowerCase().includes(q)) {
    score += 6;
  }

  for (const tok of tokens) {
    if (labelText.includes(tok)) score += 2;
    if (summaryText.includes(tok)) score += 1;
  }

  return score;
}

export function answerGuideQuestion(
  query: string,
  lang: AppLanguage,
  currentPage: AppPage
): GuideTopic {
  const q = query.trim().toLowerCase();
  if (!q) {
    return getPageQuickGuide(currentPage, lang);
  }

  let bestTopic: GuideTopic | null = null;
  let bestScore = 0;

  for (const topic of GUIDE_TOPICS) {
    const score = scoreTopic(topic, q, lang);
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestTopic || getPageQuickGuide(currentPage, lang);
}

export function findMatchingGuideTopics(
  query: string,
  lang: AppLanguage,
  limit = 4
): GuideTopic[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return GUIDE_TOPICS.slice(0, limit);
  }
  return GUIDE_TOPICS.map((topic) => ({ topic, score: scoreTopic(topic, q, lang) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.topic);
}
