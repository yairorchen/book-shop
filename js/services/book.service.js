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
var gRates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

var PAGE_SIZE = 5

var gPageIdx = 0

var gBooks

_createBooks()

function getRates() {
  return gRates
}

function getBooks() {
  console.log(gBooks)
  // Filtering:
  var books = gBooks.filter(
    (book) =>
      book.rate >= gFilterBy.rate &&
      book.price <= gFilterBy.price &&
      book.name.includes(gFilterBy.name)
  )

  // Paging:
  const startIdx = gPageIdx * PAGE_SIZE
  books = books.slice(startIdx, startIdx + PAGE_SIZE)
  console.log(books)
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
  if (book.rate > 10 || book.rate < 1) return
  if (val === 1 && book.rate < 10) {
    book.rate++
  }
  if (val === -1 && book.rate > 1) {
    book.rate--
  }
  console.log(book.rate)
  _saveBooksToStorage()
  updateRate(bookId)
  console.log(book)
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

  return gFilterBy
}

function movePage(value) {
  if (value < 0 && gPageIdx > 0) {
    gPageIdx--
  } else if (value > 0 && getBooks().length === PAGE_SIZE) {
    gPageIdx++
  }
}
