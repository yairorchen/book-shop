'use strict'
const STORAGE_KEY = 'bookDB'

const gTitles = [
  'harry-potter',
  '12-rules-for-life',
  'lean-startup',
  'think-and-grow-rich',
  'atlas-shrugged',
  'the-bible',
  'sapiens',
  'the-biology-of-belief',
  'the-seasons-of-life',
  'how-to-read-a-book',
]

var PAGE_SIZE = 6

var gPageIdx = 0

var gBooks

var gCurrBookClickId

_createBooks()
console.log(gBooks)

function getBooks() {
  // Filtering:
  var books = gBooks.filter(
    (book) =>
      book.rate <= gFilterBy.rate &&
      book.price <= gFilterBy.price &&
      book.name.includes(gFilterBy.name)
  )

  // Paging:
  const startIdx = gPageIdx * PAGE_SIZE
  books = books.slice(startIdx, startIdx + PAGE_SIZE)
  return books
}

function getTitles() {
  return gTitles
}

function addBook(bookName, bookPrice) {
  var book = _createBook(bookName, bookPrice)
  gBooks.unshift(book)
  _saveBooksToStorage()
  return book
}

function _createBooks() {
  var books = loadFromStorage(STORAGE_KEY)
  if (!books || !books.length) {
    books = []
    for (let i = 0; i < 120; i++) {
      var title = gTitles[getRandomIntInclusive(0, gTitles.length - 1)]
      books.push(_createBook(title))
    }
  }
  gBooks = books
  _saveBooksToStorage()
  return gBooks
}

function _createBook(title, price = getRandomIntInclusive(20, 100)) {
  return {
    id: makeId(),
    name: title,
    price,
    desc: makeLorem(70),
    rate: getRandomIntInclusive(1, 10),
  }
}

function _saveBooksToStorage() {
  saveToStorage(STORAGE_KEY, gBooks)
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex((book) => bookId === book.id)
  gBooks.splice(bookIdx, 1)
  _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
  const book = getBookById(bookId)
  book.price = newPrice
  _saveBooksToStorage()
  return book
}

function getBookById(bookId) {
  const book = gBooks.find((book) => bookId === book.id)
  return book
}

function rating(val, bookId) {
  var book = getBookById(bookId)
  if ((book.rate >= 10 && val === 1) || (book.rate <= 1 && val === -1)) return
  book.rate += val
  _saveBooksToStorage()
  updateRate(bookId)
}

function setBookSort(sortBy = {}) {
  if (sortBy.price !== undefined) {
    gBooks.sort((b1, b2) => (b1.price - b2.price) * sortBy.price)
  } else if (sortBy.rate !== undefined) {
    gBooks.sort((b1, b2) => (b1.rate - b2.rate) * sortBy.rate)
  } else if (sortBy.name !== undefined) {
    if (sortBy.name === 1) {
      gBooks.sort((b1, b2) => (b1.name < b2.name) * -1)
    } else {
      gBooks.sort((b1, b2) => (b1.name > b2.name) * -1)
    }
    console.log(sortBy.name)
  }
}

function setBookFilter(filterBy = {}) {
  if (filterBy.price !== undefined) gFilterBy.price = filterBy.price

  if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate

  if (filterBy.name !== undefined) gFilterBy.name = filterBy.name

  if (filterBy.language !== undefined) gFilterBy.language = filterBy.language

  return gFilterBy
}

// function movePage(val) {
//   console.log(val)
//   if (gPageIdx >= 0 || getBooks().length === PAGE_SIZE) {
//     console.log(+val)
//     gPageIdx += val
//     console.log('lala')
//   }

//   console.log(gPageIdx + 1)
//   return gPageIdx + 1
// }

function movePage(value, btnVal) {
  if (value === 0) {
    gPageIdx += btnVal
  }
  if (value === -1 && gPageIdx > 0) {
    gPageIdx--
  } else if (value === 1 && getBooks().length === PAGE_SIZE) {
    gPageIdx++
  }
  console.log(gPageIdx + 1)
  return gPageIdx
}

function pagesLength() {
  var pagesLength = gBooks.length / PAGE_SIZE
  console.log(pagesLength)
  return pagesLength
}

function portalPage(val) {
  if (getBooks().length === PAGE_SIZE) {
    gPageIdx = val - 1
    return gPageIdx
    // } else return gPageIdx - 1
  }
}
function getPageIdx() {
  return gPageIdx
}

function onCurrClickId(id) {
  gCurrBookClickId = id
  console.log(gCurrBookClickId)
  return gCurrBookClickId
}
