// book class : represents a book
class Book{
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class: hanfdle UI tasks
class UI{
  static displayBooks(){
    const books = Store.getBooks();

    books.forEach((book)=>{
      UI.addBookToList(book);
    });
  }

  static addBookToList(book){
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href = "#" class = "btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static clearList(){
    document.querySelector('#title').value = "";
    document.querySelector('#author').value = "";
    document.querySelector('#isbn').value = "";
  }

  static deleteBookFromList(el){
    if(el.classList.contains('delete')){
      el.parentElement.parentElement.remove();  
    }
  }

  static showAlert(message, className){
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const form = document.querySelector('#book-form');
    const container = document.querySelector('.container');
    container.insertBefore(div,form);

    //vanish alert in 3 sec
    setTimeout(()=>{
      document.querySelector('.alert').remove();
    },3000);
  }
};

// Store Class: Handles Storage
class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
};

// events: display books
document.addEventListener('DOMContentLoaded',UI.displayBooks);

// events: add a book
document.querySelector('#book-form').addEventListener('submit',(e)=>{
  //prevent actual submit
  e.preventDefault();

  //get form values
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;

  // validate Form
  if(title === '' || author === '' || isbn === ''){
    UI.showAlert('fill all fields', 'danger');
  }
  else{
    //instansiate book
    const book =  new Book(title, author, isbn);

    //Add book to UI
    UI.addBookToList(book);

    //Add book to local storage
    Store.addBook(book);

    //clear form
    UI.clearList();

    //succes alert
    UI.showAlert('submitted!', 'success');
  }
;});

// events: remove a book
document.querySelector('#book-list').addEventListener('click', e=>{
  //remove book from UI
  UI.deleteBookFromList(e.target);

  // Remove book from store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // success Alert
  UI.showAlert('removed!', 'success');
});
