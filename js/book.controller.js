'use strict'

var gCurrBookId
var gFilterBy = { rate: 10, price: 100, name: '', language: 'en' }
var isList = true
var addBookIsShown = false
var isDark = false

function onInit() {
  renderFilterByQueryStringParams()
  // renderRatesInFilter()
  renderBooks()
}

function updateRate(bookId) {
  var elModal = document.querySelector('.side-modal')
  const book = getBookById(bookId)
  elModal.querySelector('h2 p').innerText = book.rate
  renderBooks()
}

function onReadBook(bookId) {
  var elModal = document.querySelector('.side-modal')
  const book = getBookById(bookId)
  elModal.querySelector('h3').innerText = book.name
  elModal.querySelector('h4 span').innerText = book.price + '$'
  elModal.querySelector('p').innerText = book.desc
  elModal.querySelector('h2 p').innerText = book.rate
  elModal.querySelector('h1').innerHTML =
    '<img onerror="this.src=\'img/how-to-read-a-book.png\'"  src="img/' +
    book.name +
    '.png"></img>'
  elModal.classList.add('open')
  gCurrBookId = bookId
  // renderBooks()
  return gCurrBookId
}

function onCloseModal() {
  document.querySelector('.side-modal').classList.remove('open')
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
    PAGE_SIZE = 6
  } else {
    isList = true
    PAGE_SIZE = 6
  }
  console.log(isList)
  saveToStorage('isList', isList)
  renderBooks()
}

////////

function renderBooks() {
  const books = getBooks()
  if (loadFromStorage('isList')) {
    var strHtmls = books.map(
      (book) => `
        <tr>
          <td>${book.id}</td>
          <td>${book.name}</td>
          <td>${book.price} $</td>
          <td class="actions"><button data-trans="read" class="btn btn-primary" onclick="onReadBook('${book.id}')">read</button>
          <button data-trans="update" type="button" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#exampleModal" onclick="onCurrClickId('${book.id}')">Update</button>
          <button data-trans="delete" class="btn btn-danger" onclick="onRemoveBook('${book.id}')">delete</button></div>
        </tr>
        `
    )
    // var strHtmls = books.map(
    //   (book) => `
    //     <tr>
    //       <td>${book.id}</td>
    //       <td>${book.name}</td>
    //       <td>${book.price} $</td>
    //       <div class="actions"><td><button data-trans="read" class="btn btn-primary" onclick="onReadBook('${book.id}')">read</button></td>
    //       <td><button data-trans="update" type="button" class="btn btn-warning" data-bs-toggle="modal"
    //         data-bs-target="#exampleModal" onclick="onCurrClickId('${book.id}')">Update</button></td>
    //       <td><button data-trans="delete" class="btn btn-danger" onclick="onRemoveBook('${book.id}')">delete</button></td></div>
    //     </tr>
    //     `
    // )
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
        <button data-trans="detail" type="button" class="btn btn-primary" onclick="onReadBook('${book.id}')">Details</button>
        <button data-trans="update" type="button" class="btn btn-warning" data-bs-toggle="modal"
            data-bs-target="#exampleModal" onclick="onCurrClickId('${book.id}')">Update</button>
            <img onerror="this.src='img/how-to-read-a-book.png'" src="img/${book.name}.png"></img>
            </article> 
            `
    )

    {
    }

    document.querySelector('.books-container-cards').innerHTML =
      strHtmls.join('')
    document.querySelector('.books-container tbody').innerHTML = ''
    document.querySelector('.books-container').classList.add('hide')
  }
  doTrans()
}

function onUpdatePrice() {
  var newPrice = document.querySelector('.new-price').value
  document.querySelector('.new-price').value = ''
  console.log(newPrice)
  console.log(gCurrBookClickId)
  if (!newPrice) return
  updateBook(gCurrBookClickId, newPrice)
  renderBooks()
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
  doTrans()
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
  doTrans()
}

function onSetFilterBy(filterBy) {
  filterBy = setBookFilter(filterBy)

  const queryStringParams = `?rate=${filterBy.rate}&price=${filterBy.price}&name=${filterBy.name}&language=${filterBy.language}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
  renderBooks()
  doTrans()
}

function renderFilterByQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const filterBy = {
    rate: queryStringParams.get('rate') || 10,
    price: +queryStringParams.get('price') || 100,
    name: queryStringParams.get('name') || '',
    language: queryStringParams.get('language') || '',
  }

  if (!filterBy.rate && !filterBy.price && !filterBy.name && !filterBy.language)
    return

  document.querySelector('.filter-rate-range').value = filterBy.rate
  document.querySelector('.filter-price-range').value = filterBy.price
  document.querySelector('.filter-name-input').value = filterBy.name
  document.querySelector('.filter-lang-select').value = filterBy.language
  getTrans(filterBy.language)
  onSetLang(filterBy.language)
  setBookFilter(filterBy)
}

function onMovePage(value, btn) {
  // var firstPage = document.querySelector('.btn-p-1')
  // var secondPage = document.querySelector('.btn-p-2')
  // var thirdPage = document.querySelector('.btn-p-3')
  // console.log(getPageIdx())
  // if (getPageIdx() <= 1) switchButtonColors(getPageIdx())
  // if (getPageIdx() >= 1) {
  //   console.log('yess')

  //   if (value > 0) {
  //     console.log('first')
  //     firstPage.innerText = getPageIdx() + 1
  //     secondPage.innerText = getPageIdx() + 2
  //     thirdPage.innerText = getPageIdx() + 3
  //   } else if (value < 0) {
  //     console.log('second')
  //     firstPage.innerText = getPageIdx() - 1
  //     secondPage.innerText = getPageIdx()
  //     thirdPage.innerText = getPageIdx() + 1
  //   }
  // }
  // console.log(btn.innerHTML - getPageIdx() - 1)
  if (value === 0) {
    movePage(value, btn.innerHTML - getPageIdx() - 1)
  } else {
    movePage(value)
  }
  console.log(value)
  renderBooks()
  doTrans()
  document.querySelector('.page-display').innerText = getPageIdx() + 1
  // document.querySelector('.page-display').innerText = movePage()
}

// function onPortalPage(btn) {
//   pagesLength()
//   var firstPage = document.querySelector('.btn-p-1')
//   var secondPage = document.querySelector('.btn-p-2')
//   var thirdPage = document.querySelector('.btn-p-3')
//   console.log(btn.innerHTML)
//   switchButtonColors(btn.innerHTML)
//   portalPage(btn.innerHTML)
//   if (getPageIdx() > 0) {
//     console.log('in')
//     firstPage.innerText = getPageIdx()
//     secondPage.innerText = getPageIdx() + 1
//     thirdPage.innerText = getPageIdx() + 2
//   }
//   portalPage(btn.innerHTML)
//   renderBooks()
//   doTrans()
// }

function onSetLang(lang) {
  console.log(lang)
  setLang(lang)
  setDirection(lang)
  renderBooks()
  doTrans()
  onSetFilterBy({ language: lang })
}
function setDirection(lang) {
  if (lang === 'he') {
    document.body.classList.add('rtl')
    document.body.classList.remove('ltr')
  } else {
    document.body.classList.remove('rtl')
    document.body.classList.add('ltr')
  }
}

function toggleDarkMode(btn) {
  if (!isDark) {
    isDark = true
    document.querySelector('body').classList.add('bg-dark')
    document.querySelector('.container').classList.add('bg-dark')
    document.querySelector('.table').classList.add('table-dark')
    document.querySelector('h1').classList.add('text-light')
    document.querySelector('.book-filter').classList.add('book-filter-dark')
    document.querySelector('.side-modal').classList.add('side-modal-dark')
    document.querySelector('p').style.color = 'white'
    // document.querySelector('.book-preview').classList.add('book-preview-dark')

    console.log('dark')
    btn.innerHTML = '☀️️'
  } else {
    isDark = false
    document.querySelector('body').classList.remove('bg-dark')
    document.querySelector('.container').classList.remove('bg-dark')
    document.querySelector('.table').classList.remove('table-dark')
    document.querySelector('h1').classList.remove('text-light')
    document.querySelector('.side-modal').classList.remove('side-modal-dark')
    // document.querySelector('.book-filter').classList.remove('book-filter-dark')
    document
      .querySelector('.book-preview')
      .classList.remove('book-preview-dark')
    btn.innerHTML = '️🌙'
  }
}

function switchButtonColors(val) {
  var firstPage = document.querySelector('.btn-p-1')
  var secondPage = document.querySelector('.btn-p-2')
  console.log('hehre')
  if (+val === 0) {
    console.log(val)
    console.log('one')
    firstPage.classList.add('btn-secondary')
    firstPage.classList.remove('btn-primary')
    secondPage.classList.add('btn-primary')
    secondPage.classList.remove('btn-secondary')
  } else if (+val === 1) {
    console.log('two')
    secondPage.classList.remove('btn-primary')
    secondPage.classList.add('btn-secondary')
    firstPage.classList.add('btn-primary')
    firstPage.classList.remove('btn-secondary')
  }
}
