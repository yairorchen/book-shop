const gTrans = {
  title: {
    en: 'books app',
    he: 'חנות ספרים',
  },
  rate: {
    en: 'Rate',
    he: 'לפי דירוג',
  },
  'max-price': {
    en: 'max-price',
    he: 'הכל',
  },
  'create-new-book': {
    en: 'Add new book',
    he: 'הוסף ספר חדש',
  },
  descending: {
    en: 'Descending',
    he: 'הפוך סדר',
  },
  'select-sorting': {
    en: ['Select sorting', 'By rate', 'By price', 'By name'],
    he: ['מיין לפי', 'לפי דירוג', 'לפי מחיר', 'לפי שם'],
  },
  'change-layout': {
    en: 'Change layout',
    he: 'שנה תצוגה',
  },
  detail: {
    en: 'Detail',
    he: 'פרטים',
  },
  update: {
    en: 'Update',
    he: 'עדכון',
  },
  id: {
    en: 'id',
    he: 'מ.סידורי',
  },
  name: {
    en: 'Name',
    he: 'שם',
  },
  price: {
    en: 'Price',
    he: 'מחיר',
  },
  action: {
    en: 'Action',
    he: 'פעולות',
  },
  read: {
    en: 'Read',
    he: 'עיין',
  },
  delete: {
    en: 'Delete',
    he: 'מחק',
  },
  'book-summary': {
    en: 'Book summary',
    he: 'תקציר הספר',
  },
  placeholder: {
    en: 'search something...',
    he: 'חפש משהו...',
  },
  'placeholder-1': {
    en: 'the name of the book...',
    he: 'מהו שם הספר?',
  },
  'placeholder-2': {
    en: 'the price of the book...',
    he: 'מה המחיר המבוקש?',
  },
  'book-title': {
    en: 'Book title:',
    he: 'שם הספר:',
  },
  'book-price': {
    en: 'Book price:',
    he: 'מחיר הספר:',
  },
  submit: {
    en: 'Submit',
    he: 'שלח',
  },
  'next-arrow': {
    en: '⇨',
    he: '⇦',
  },
  'prev-arrow': {
    en: '⇦',
    he: '⇨',
  },
  'sort-by': {
    en: 'Sort by',
    he: 'מיין לפי',
  },
}
let gCurrLang
if (!gCurrLang) {
  gCurrLang = 'en'
} else gCurrLang = gFilterBy.language

function getTrans(transKey) {
  const transMap = gTrans[transKey]
  if (!transMap) return 'UNKNOWN'

  let trans = transMap[gCurrLang]
  if (!trans) trans = transMap.en
  return trans
}

function doTrans() {
  const els = document.querySelectorAll('[data-trans]')
  els.forEach((el) => {
    const transKey = el.dataset.trans
    const trans = getTrans(transKey)
    el.innerText = trans
    if (el.placeholder) el.placeholder = trans
    if (el.button) el.innerText = trans
  })
}

function setLang(lang) {
  gCurrLang = lang
  gFilterBy.language = lang
}

function formatNum(num) {
  return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatDate(time) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }
  return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}
