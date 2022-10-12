'use strict'

var gCurrBookId
var gFilterBy = { rate: 0, price: 0, name: '' }
var isList = true
var addBookIsShown = false

function onInit() {
  renderFilterByQueryStringParams()
  renderRatesInFilter()
  renderBooks()
}

function updateRate(bookId) {
  var elModal = document.querySelector('.modal')
  const book = getBookById(bookId)
  elModal.querySelector('h2 p').innerText = book.rate
  renderBooks()
}

function onReadBook(bookId) {
  var elModal = document.querySelector('.modal')
  const book = getBookById(bookId)
  elModal.querySelector('h3').innerText = book.name
  elModal.querySelector('h4 span').innerText = book.price + ' $'
  elModal.querySelector('p').innerText = book.desc
  elModal.querySelector('h2 p').innerText = book.rate
  elModal.querySelector('h1').innerHTML =
    '<img onerror="this.src=\'img/how-to-read-a-book.png\'"  src="img/' +
    book.name +
    '.png"></img>'
  elModal.classList.add('open')
  console.log(bookId)
  gCurrBookId = bookId
  // renderBooks()
  return gCurrBookId
}

function onCloseModal() {
  document.querySelector('.modal').classList.remove('open')
}

function onUpdateBook(bookId, currPrice) {
  console.log(bookId)
  console.log(currPrice)
  var newPrice = +prompt('Please enter new price of the book', currPrice)
  if (!newPrice) return
  updateBook(bookId, newPrice)
  renderBooks()
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
}

function onAddBook() {
  var bookName = document.querySelector('.book-name-input').value
  var bookPrice = document.querySelector('.book-price-input').value
  console.log(bookName)
  console.log(bookPrice)
  addBook(bookName, bookPrice)
  renderBooks()
  document.querySelector('.book-name-input').value = ''
  document.querySelector('.book-price-input').value = ''
  document.querySelector('.add-book').classList.add('hide')
}

function toggleAddBook() {
  if (!addBookIsShown) {
    addBookIsShown = true
    document.querySelector('.add-book').classList.remove('hide')
    document.querySelector('.add-book').classList.add('shadow-drop-center')
  } else {
    addBookIsShown = false
    document.querySelector('.add-book').classList.add('hide')
    document.querySelector('.add-book').classList.remove('shadow-drop-center')
  }
}

function onRating(val) {
  console.log(gCurrBookId)
  rating(val, gCurrBookId)
}

function changeLayout() {
  if (isList) {
    isList = false
    PAGE_SIZE = 5
  } else {
    isList = true
    PAGE_SIZE = 5
  }
  console.log(isList)
  saveToStorage('isList', isList)
  renderBooks()
}

function renderBooks() {
  const books = getBooks()
  console.log(books)
  if (loadFromStorage('isList')) {
    var strHtmls = books.map(
      (book) => `
        <tr>
          <td>${book.id}</td>
          <td>${book.name}</td>
          <td>${book.price} $</td>
          <td><button class="rectangular-btn read-btn" onclick="onReadBook('${book.id}')">read</button></td>
          <td><button class="rectangular-btn update-btn" onclick="onUpdateBook('${book.id}','${book.price}')">update</button></td>
          <td><button class="rectangular-btn delete-btn" onclick="onRemoveBook('${book.id}')">delete</button></td>
        </tr>
        `
    )
    document.querySelector('.books-container tbody').innerHTML =
      strHtmls.join('')
    document.querySelector('.books-container-cards').innerHTML = ''
    document.querySelector('.books-container').classList.remove('hide')
  } else {
    ///
    var strHtmls = books.map(
      (book) => `
        <article class="book-preview shadow-drop-center">
        <button class="btn-remove" onclick="onRemoveBook('${book.id}')">X</button>
        <h5>${book.name}</h5>
        <h6> <span>${book.price}</span> $</h6>
        <button class="rectangular-btn" onclick="onReadBook('${book.id}')">Details</button>
        <button class="rectangular-btn" onclick="onUpdateBook('${book.id}')">Update</button>
            <img onerror="this.src='img/how-to-read-a-book.png'" src="img/${book.name}.png"></img>
            </article> 
            `
    )

    document.querySelector('.books-container-cards').innerHTML =
      strHtmls.join('')
    document.querySelector('.books-container tbody').innerHTML = ''
    document.querySelector('.books-container').classList.add('hide')
  }
}

function onSetSortBy(val) {
  const prop = document.querySelector('.sort-by').value
  // const prop = val
  const isDesc = document.querySelector('.sort-desc').checked

  // const sortBy = {}
  // sortBy[prop] = (isDesc)? -1 : 1

  // Shorter Syntax:
  const sortBy = {
    [prop]: isDesc ? -1 : 1,
  }

  setBookSort(sortBy)
  renderBooks()
}
function onSetSortByHeader(val) {
  // const prop = document.querySelector('.sort-by').value
  const prop = val
  const isDesc = document.querySelector('.sort-desc').checked

  // const sortBy = {}
  // sortBy[prop] = (isDesc)? -1 : 1

  // Shorter Syntax:
  const sortBy = {
    [prop]: isDesc ? -1 : 1,
  }

  setBookSort(sortBy)
  renderBooks()
}

function onSetFilterBy(filterBy) {
  filterBy = setBookFilter(filterBy)
  renderBooks()

  const queryStringParams = `?rate=${filterBy.rate}&price=${filterBy.price}&name=${filterBy.name}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)

  console.log(filterBy.rate)
  console.log(filterBy.price)
  console.log(filterBy.name)
}

function renderFilterByQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const filterBy = {
    rate: queryStringParams.get('rate') || '',
    price: +queryStringParams.get('price') || 0,
    name: queryStringParams.get('name') || '',
  }

  if (!filterBy.rate && !filterBy.price && !filterBy.name) return

  document.querySelector('.filter-rate-select').value = filterBy.rate
  document.querySelector('.filter-price-range').value = filterBy.price
  document.querySelector('.filter-name-input').value = filterBy.name
  setBookFilter(filterBy)
}

function renderRatesInFilter() {
  const rates = getRates()

  const strHTMLs = rates.map((rate) => `<option>${rate}</option>`)
  strHTMLs.unshift('<option value="">rate</option>')

  const elSelect = document.querySelector('.filter-rate-select')
  elSelect.innerHTML = strHTMLs.join('')
  // renderBooks()
}

function onMovePage(value) {
  movePage(value)
  renderBooks()
}
