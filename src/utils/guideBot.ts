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
    id: 'create_invoice',
    targetPage: 'customers',
    keywords: ['invoice', 'sell', 'sale', 'customer', 'bill customer', 'بل', 'پلور', 'فاکتور', 'فروش', 'مشتری'],
    label: {
      en: 'How to Create a Sales Invoice',
      ps: 'څنګه د پلور بل جوړ کړو؟',
      fa: 'چطور بل فروش بسازیم؟',
    },
    summary: {
      en: 'Use this whenever you sell a phone or product to a customer. It automatically updates stock and tracks who owes you money.',
      ps: 'کله چې پیرودونکي ته موبایل یا توکی وپلورئ، دا کار وکړئ. تعداد په اتومات ډول له ګودام څخه کمېږي.',
      fa: 'هرگاه گوشی یا جنسی به مشتری می‌فروشید از این بخش استفاده کنید. موجودی گدام به‌طور خودکار کم می‌شود.',
    },
    steps: {
      en: [
        'Open "Customers & Sales" from the left menu or Home workflow.',
        'Choose the Customer name from the dropdown list (or add a new customer first).',
        'Choose the Item sold and type the Quantity.',
        'If the buyer paid cash right now, check "Customer paid cash right now" and pick Cash or Bank.',
        'Click "Save Invoice". Your stock and customer balance update automatically.',
      ],
      ps: [
        'له کیڼ اړخ یا اصلي پاڼې څخه "پیرودونکي او بلونه" خلاص کړئ.',
        'د پیرودونکي نوم وټاکئ (یا لومړی نوی پیرودونکی ثبت کړئ).',
        'پلورل شوی توکی او تعداد یې ولیکئ.',
        'که پیرودونکي نغدې پیسې درکړې وي، د "نغدې پیسې ورکړې" بکس ټیک کړئ.',
        'د "بل ثبت کړئ" تڼۍ کلیک کړئ. ګودام او حساب په اتومات ډول سمېږي.',
      ],
      fa: [
        'از منوی کناری یا صفحه اصلی بخش «مشتریان و فروش» را باز کنید.',
        'نام مشتری را انتخاب کنید (یا ابتدا مشتری جدید ثبت کنید).',
        'جنس فروخته‌شده و تعداد آن را مشخص کنید.',
        'اگر مشتری همان لحظه پول نقد داد، گزینه «پول نقد پرداخت کرد» را تیک بزنید.',
        'روی «ثبت بل فروش» کلیک کنید. موجودی گدام و حساب مشتری خودکار به‌روز می‌شود.',
      ],
    },
  },
  {
    id: 'receive_payment',
    targetPage: 'customers',
    keywords: ['receive', 'payment', 'collect', 'paid', 'debt', 'پیسې', 'ترلاسه', 'دریافت', 'پول', 'طلب'],
    label: {
      en: 'How to Receive Payment from a Customer',
      ps: 'څنګه له پیرودونکي پاتې پیسې واخلو؟',
      fa: 'چطور از مشتری پول دریافت کنیم؟',
    },
    summary: {
      en: 'When a customer comes back to pay an unpaid invoice, mark it Paid so your Cash or Bank balance goes up.',
      ps: 'کله چې پیرودونکی د پاتې بل پیسې راوړي، دلته یې تادیه ثبت کړئ ترڅو ستاسو نغدې پیسې زیاتې شي.',
      fa: 'وقتی مشتری پول بل قبلی خود را می‌آورد، اینجا پرداخت را ثبت کنید تا موجودی نقد یا بانک شما زیاد شود.',
    },
    steps: {
      en: [
        'Go to "Customers & Sales".',
        'Look at the "Sales Invoices" table and find any row marked "Unpaid".',
        'Choose whether the money goes into Main Cash Register or your Bank Account.',
        'Click "Receive Payment" next to that invoice.',
      ],
      ps: [
        '"پیرودونکي او بلونه" پاڼې ته لاړ شئ.',
        'د بلونو په جدول کې هغه بل ومومئ چې حالت یې "ناتادیه شوی" وي.',
        'وټاکئ چې پیسې نغدي دخل ته ځي که بانکي حساب ته.',
        'د هماغه بل ترڅنګ د "پیسې واخلئ" تڼۍ کلیک کړئ.',
      ],
      fa: [
        'به صفحه «مشتریان و فروش» بروید.',
        'در جدول بل‌ها، سطری را که وضعیت آن «پرداخت نشده» است پیدا کنید.',
        'انتخاب کنید پول به صندوق نقد می‌رود یا حساب بانکی.',
        'دکمه «دریافت پول» کنار همان بل را بزنید.',
      ],
    },
  },
  {
    id: 'enter_pay_bill',
    targetPage: 'vendors',
    keywords: ['vendor', 'supplier', 'bill', 'pay bill', 'expense', 'پور', 'عرضه', 'فروشنده', 'پرداخت', 'بدهی'],
    label: {
      en: 'How to Enter and Pay a Supplier Bill',
      ps: 'څنګه د عرضه کوونکي بل ثبت او تادیه کړو؟',
      fa: 'چطور بل فروشنده را ثبت و پرداخت کنیم؟',
    },
    summary: {
      en: 'Track bills you owe to wholesalers or internet/rent providers, then pay them cleanly from your cash or bank.',
      ps: 'د عمده پلورونکو یا کرایې بلونه دلته ثبت کړئ او له دخل یا بانک څخه یې تادیه کړئ.',
      fa: 'بل‌های عمده‌فروشان یا مصارف را اینجا ثبت کنید و از دخل نقد یا بانک بپردازید.',
    },
    steps: {
      en: [
        'Open "Vendors & Bills".',
        'Pick the Supplier, enter a short description and amount, then click "Save Bill".',
        'When you are ready to pay, pick Cash or Bank at the bottom/row and click "Pay Bill".',
      ],
      ps: [
        '"عرضه کوونکي او پورونه" پاڼه خلاصه کړئ.',
        'عرضه کوونکی وټاکئ، لنډه تشریح او مبلغ ولیکئ او "بل ثبت کړئ" کلیک کړئ.',
        'د تادیې پر وخت خپل نغدي یا بانکي حساب وټاکئ او "بل تادیه کړئ" کلیک کړئ.',
      ],
      fa: [
        'صفحه «فروشندگان و بل‌ها» را باز کنید.',
        'نام فروشنده، توضیحات کوتاه و مبلغ را بنویسید و «ثبت بل» را بزنید.',
        'هنگام پرداخت، حساب نقد یا بانکی را انتخاب کرده و روی «پرداخت بل» کلیک کنید.',
      ],
    },
  },
  {
    id: 'inventory_stock',
    targetPage: 'inventory',
    keywords: ['stock', 'item', 'product', 'inventory', 'add product', 'توکی', 'ګودام', 'جنس', 'گدام', 'موجودی'],
    label: {
      en: 'How to Add Products & Check Stock',
      ps: 'څنګه نوی توکی زیات او ګودام وګورو؟',
      fa: 'چطور جنس جدید اضافه کنیم و گدام را ببینیم؟',
    },
    summary: {
      en: 'Add new phone models or accessories with buy cost, sell price, and starting quantity, or adjust stock with +1 / -1.',
      ps: 'نوي موبایلونه د اخیستو او پلور بیې سره زیات کړئ، یا د +۱ او -۱ تڼیو په مرسته تعداد سم کړئ.',
      fa: 'محصولات جدید را با قیمت خرید، فروش و تعداد اولیه اضافه کنید یا با دکمه‌های +۱ و -۱ تعداد را تنظیم کنید.',
    },
    steps: {
      en: [
        'Open "Items & Stock" from the left menu.',
        'Fill in Product Name, Buy Cost, Sell Price, and Starting Quantity.',
        'Click "Add Product". You can also click +1 or -1 on any row to adjust shelf counts.',
      ],
      ps: [
        'له منو څخه "توکي او ګودام" خلاص کړئ.',
        'د توکي نوم، د اخیستو بیه، د پلور بیه او تعداد ولیکئ.',
        '"توکی ثبت کړئ" کلیک کړئ. همدارنګه په هره کرښه کې +۱ یا -۱ کارولی شئ.',
      ],
      fa: [
        'از منو بخش «اجناس و گدام» را باز کنید.',
        'نام محصول، قیمت خرید، قیمت فروش و تعداد اولیه را وارد کنید.',
        'روی «ثبت محصول» کلیک کنید. برای تغییر تعداد می‌توانید دکمه‌های +۱ یا -۱ را بزنید.',
      ],
    },
  },
  {
    id: 'banking_cash',
    targetPage: 'banking',
    keywords: ['bank', 'cash', 'deposit', 'expense', 'rent', 'drawer', 'بانک', 'نغد', 'صندوق', 'مصرف', 'دخل'],
    label: {
      en: 'How to Record Cash Deposits & Shop Expenses',
      ps: 'څنګه نغدي جمع یا د دوکان لګښت ثبت کړو؟',
      fa: 'چطور واریز نقدی یا مصارف دوکان را ثبت کنیم؟',
    },
    summary: {
      en: 'Keep your Cash Drawer and Bank Account accurate by recording owner deposits, rent, electricity, or tea expenses.',
      ps: 'خپل نغدي دخل او بانکي حساب د جمع او لګښتونو (لکه کرایه یا برق) په ثبتولو سره سم وساتئ.',
      fa: 'با ثبت واریزها و مصارف روزانه مثل کرایه یا برق، حساب صندوق و بانک خود را دقیق نگه دارید.',
    },
    steps: {
      en: [
        'Open "Banking & Cash".',
        'Select your Cash Register or Bank Account.',
        'Choose Deposit (+) or Shop Expense (-), write what it is for, and enter the amount.',
        'Click "Save Entry" to update your balance and register.',
      ],
      ps: [
        '"بانک او نغدې پیسې" پاڼې ته لاړ شئ.',
        'نغدي دخل یا بانکي حساب وټاکئ.',
        'جمع (+) یا لګښت (-) انتخاب کړئ، لنډه تشریح او مبلغ ولیکئ.',
        '"معامله ثبت کړئ" کلیک کړئ.',
      ],
      fa: [
        'به صفحه «بانک و صندوق نقد» بروید.',
        'صندوق نقد یا حساب بانکی را انتخاب کنید.',
        'نوع معامله (واریز + یا مصرف -) و توضیحات و مبلغ را بنویسید.',
        'روی «ذخیره معامله» کلیک کنید.',
      ],
    },
  },
  {
    id: 'pos_sync',
    targetPage: 'pos_sync',
    keywords: ['pos', 'offline', 'conflict', 'imei', 'serial', 'sync', 'آفلاین', 'ستونزه', 'سریال', 'اختلاف'],
    label: {
      en: 'How to Fix Offline POS Receipt Problems',
      ps: 'د آفلاین پلور ستونزې څنګه حل کړو؟',
      fa: 'چطور مشکل رسیدهای آفلاین را حل کنیم؟',
    },
    summary: {
      en: 'If internet dropped and two registers used the same phone IMEI, simply click a different available phone in stock or cancel the receipt.',
      ps: 'که د انټرنېټ د نشتوالي پر مهال دوه میزونو یو IMEI کارولی وي، له ګودام څخه بل تیار موبایل وټاکئ یا رسید لغوه کړئ.',
      fa: 'اگر هنگام قطع انترنت دو صندوق یک شماره IMEI را فروخته باشند، یک گوشی آماده دیگر از گدام انتخاب کنید یا رسید را لغو کنید.',
    },
    steps: {
      en: [
        'Open "POS Sync Fixes" from the menu.',
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
    id: 'reports',
    targetPage: 'reports',
    keywords: ['report', 'daily', 'weekly', 'monthly', 'loan', 'cash', 'profit', 'loss', 'csv', 'print', 'راپور', 'ورځنی', 'اونیز', 'میاشتنی', 'پور', 'ګټه', 'گزارش', 'روزانه', 'هفته‌وار', 'ماهانه', 'قرض', 'مفاد', 'چاپ'],
    label: {
      en: 'How to Run End-of-Day, Week & Month Reports (Cash vs Loans)',
      ps: 'څنګه د ورځې، اونۍ او میاشتې راپور (نغد او پور) وګورو؟',
      fa: 'چطور گزارش پایان روز، هفته و ماه (نقد و قرض) را بگیریم؟',
    },
    summary: {
      en: 'See how many items were sold at each price, how much was paid in cash, and how much is out on loan with each customer for any day, week, or month.',
      ps: 'د هرې ورځې، اونۍ یا میاشتې لپاره وګورئ څومره توکي په کومه بیه وپلورل شول، څومره نغد وو او څومره پور له چا سره دی.',
      fa: 'برای هر روز، هفته یا ماه ببینید چند عدد جنس به چه قیمتی فروخته شد، چقدر نقد بود و چقدر قرض نزد کدام مشتری است.',
    },
    steps: {
      en: [
        'Open "Business Reports" from the left menu.',
        'Click "End of Day", "End of Week", or "End of Month" and pick the date you want to check.',
        'Check "How Many Sold & At What Price" for unit quantities and prices, and "Loans Given & With Whom" for customer names and phones.',
        'Click "Download Period Report (CSV)" or "Print Report" to save or print the full closing sheet.',
      ],
      ps: [
        'له کیڼ منو څخه "د سوداګرۍ راپورونه" خلاص کړئ.',
        '"د ورځې پای"، "د اونۍ پای"، یا "د میاشتې پای" وټاکئ او نېټه انتخاب کړئ.',
        'لاندې د پلورل شویو توکو تعداد، بیې، نغدې پیسې او د پور اخیستونکو نومونه وګورئ.',
        'د چاپ یا CSV ډاونلوډ تڼۍ کلیک کړئ.',
      ],
      fa: [
        'از منوی کناری بخش «گزارش‌های مالی» را باز کنید.',
        'دکمه «پایان روز»، «پایان هفته» یا «پایان ماه» را بزنید و تاریخ دلخواه را انتخاب کنید.',
        'جدول تعداد و قیمت فروش و جدول «قرض‌ها و نزد چه کسی است» را بررسی کنید.',
        'برای ذخیره یا چاپ کامل، دکمه «دانلود گزارش دوره (CSV)» یا «چاپ گزارش» را بزنید.',
      ],
    },
  },
  {
    id: 'language_currency',
    targetPage: 'home',
    keywords: ['language', 'pashto', 'dari', 'afn', 'afghani', 'usd', 'currency', 'ژبه', 'پښتو', 'دري', 'زبان', 'دری', 'افغانی'],
    label: {
      en: 'How to Change Language (Pashto / Dari) & Currency',
      ps: 'څنګه ژبه (پښتو / دري) او اسعار بدل کړو؟',
      fa: 'چطور زبان (پشتو / دری) و واحد پول را تغییر دهیم؟',
    },
    summary: {
      en: 'Switch between English, Pashto, and Dari, or between Afghani (؋) and USD ($) directly from the Home screen.',
      ps: 'تاسو کولی شئ په اصلي پاڼه کې په یوه کلیک ژبه پښتو، دري یا انګلیسي او اسعار افغانیو یا ډالرو ته واړوئ.',
      fa: 'مستقیماً در صفحه اصلی می‌توانید زبان را بین انگلیسی، پشتو و دری و پول را بین افغانی (؋) و دالر ($) تغییر دهید.',
    },
    steps: {
      en: [
        'Go to "Home & Workflow".',
        'In the top Language & Currency box, click English, پښتو (Pashto), or دری (Dari).',
        'Click AFN (؋) or USD ($) to change how all prices and totals are displayed.',
      ],
      ps: [
        '"کور او کاري نقشه" پاڼې ته لاړ شئ.',
        'د ژبې په برخه کې English، پښتو، یا دری کلیک کړئ.',
        'د اسعارو لپاره AFN (؋) یا USD ($) وټاکئ.',
      ],
      fa: [
        'به صفحه «صفحه اصلی و نقشه کار» بروید.',
        'در بخش زبان، روی English، پښتو یا دری کلیک کنید.',
        'برای واحد پول، AFN (؋) یا USD ($) را انتخاب کنید.',
      ],
    },
  },
  {
    id: 'theme_settings',
    targetPage: 'settings',
    keywords: ['theme', 'color', 'settings', 'appearance', 'backup', 'رنګ', 'تنظیمات', 'رنگ', 'تم', 'ظاهر'],
    label: {
      en: 'How to Change Color Themes & Settings',
      ps: 'څنګه د کاریال رنګ او تنظیمات بدل کړو؟',
      fa: 'چطور تم رنگی و تنظیمات برنامه را تغییر دهیم؟',
    },
    summary: {
      en: 'Pick a subtle executive color theme for the interface while keeping each accounting section slightly distinct in color.',
      ps: 'د کاریال لپاره یو آرام مسلکي رنګ وټاکئ ترڅو هره پاڼه خپل نرم توپیر وساتي.',
      fa: 'یک تم رنگی آرام و اداری برای ظاهر برنامه انتخاب کنید در حالی که هر بخش رنگ متمایز خود را حفظ می‌کند.',
    },
    steps: {
      en: [
        'Click "Settings" at the bottom of the left menu.',
        'Click any theme card (Classic Ledger, Warm Parchment, Crisp Pewter, or Botanical Stone) to preview and apply it immediately.',
        'You can also switch Language, Currency, or export/import a JSON Backup from Settings.',
      ],
      ps: [
        'د کیڼ اړخ منو په پای کې "تنظیمات" کلیک کړئ.',
        'هر رنګین کارت (Classic Ledger، Warm Parchment، Crisp Pewter یا Botanical Stone) کلیک کړئ ترڅو سمدستي تطبیق شي.',
        'همدلته کولی شئ ژبه، اسعار او JSON بیک اپ هم تنظیم کړئ.',
      ],
      fa: [
        'در پایین منوی سمت چپ روی «تنظیمات» کلیک کنید.',
        'روی هر کارت تم رنگی (Classic Ledger، Warm Parchment، Crisp Pewter یا Botanical Stone) کلیک کنید تا بلافاصله اعمال شود.',
        'از همین صفحه می‌توانید زبان، واحد پول و پشتیبان‌گیری JSON را نیز مدیریت کنید.',
      ],
    },
  },
];

const PAGE_TO_TOPIC_ID: Record<AppPage, string> = {
  home: 'language_currency',
  customers: 'create_invoice',
  vendors: 'enter_pay_bill',
  inventory: 'inventory_stock',
  banking: 'banking_cash',
  pos_sync: 'pos_sync',
  reports: 'reports',
  settings: 'theme_settings',
};

export function getPageQuickGuide(page: AppPage, lang: AppLanguage): GuideTopic {
  const topicId = PAGE_TO_TOPIC_ID[page];
  return (
    GUIDE_TOPICS.find((t) => t.id === topicId) ||
    GUIDE_TOPICS[0]
  );
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
    let score = 0;
    for (const kw of topic.keywords) {
      if (q.includes(kw.toLowerCase())) {
        score += kw.length >= 5 ? 3 : 2;
      }
    }
    if (topic.label[lang].toLowerCase().includes(q)) {
      score += 4;
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestTopic || getPageQuickGuide(currentPage, lang);
}
