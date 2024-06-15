document.addEventListener('DOMContentLoaded', function () {

    const formAddBook = document.getElementById('form-add-book');
    const inputTitle = document.getElementById('input-title');
    const inputAuthor = document.getElementById('input-author');
    const inputYear = document.getElementById('input-year');
    const inputStatus = document.getElementById('input-status');
  
    formAddBook.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const title = inputTitle.value.trim();
      const author = inputAuthor.value.trim();
      const year = inputYear.value.trim();
      const status = inputStatus.value;
  
      if (title === '' || author === '' || year === '') {
        alert('Judul, penulis, dan tahun harus diisi!');
        return;
      }
  
      const book = {
        id: Date.now().toString(),
        title: title,
        author: author,
        year: parseInt(year),
        isComplete: status === 'read'
      };
  
      addBookToShelf(book);
      saveBook(book);
      formAddBook.reset();
    });
  
    function addBookToShelf(book) {
      const shelfId = book.isComplete ? 'shelf-read' : 'shelf-unread';
      const shelf = document.getElementById(shelfId);
  
      const li = document.createElement('li');
      li.setAttribute('data-id', book.id);
      li.innerHTML = `<strong>${book.title}</strong> - ${book.author} (${book.year})
        <button class="btn-move">Pindahkan</button>
        <button class="btn-delete">Hapus</button>`;
  
      const btnMove = li.querySelector('.btn-move');
      btnMove.addEventListener('click', function () {
        moveBook(book.id);
      });
  
      const btnDelete = li.querySelector('.btn-delete');
      btnDelete.addEventListener('click', function () {
        deleteBook(book.id);
      });
  
      shelf.appendChild(li);
    }
  
    function moveBook(bookId) {
      let books = getBooksFromStorage();
      let book = books.find(b => b.id === bookId);
      
      if (book) {
        book.isComplete = !book.isComplete;
        saveBooksToStorage(books);
        refreshBooks();
      }
    }
  
    function deleteBook(bookId) {
      let books = getBooksFromStorage();
      books = books.filter(book => book.id !== bookId);
      saveBooksToStorage(books);
      refreshBooks();
    }
  
    function saveBook(book) {
      let books = getBooksFromStorage();
      books.push(book);
      saveBooksToStorage(books);
    }
  
    function saveBooksToStorage(books) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    function getBooksFromStorage() {
      let books = localStorage.getItem('books');
      return books ? JSON.parse(books) : [];
    }
  
    function refreshBooks() {
      const shelfUnread = document.getElementById('shelf-unread');
      const shelfRead = document.getElementById('shelf-read');
      shelfUnread.innerHTML = '';
      shelfRead.innerHTML = '';
      
      const books = getBooksFromStorage();
      books.forEach(book => {
        addBookToShelf(book);
      });
    }
  
    // Initialize books from localStorage
    refreshBooks();
  });
  