const UNCOMPLETED_READ_BOOK_ID = "listBukuBelumSelesai";
const COMPLETED_READ_BOOK_ID = "listBukuSudahSelesai";
const BOOK_ITEMID = "itemId";

function makeBook(title, author, year, isComplete) {
    const bookTitle = document.createElement("h4");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = author;

    const bookYear = document.createElement("p");
    bookYear.innerText = year;

    const bookAction = document.createElement("div");
    bookAction.classList.add("action");
    if (isComplete) {
        bookAction.append(
            createUndoButton(),
            createEditButton(),
            createTrashButton()
        );
    } else {
        bookAction.append(
            createCheckButton(),
            createEditButton(),
            createTrashButton()
        );
    }

    const container = document.createElement("article");
    container.classList.add("item_buku");
    container.append(bookTitle, bookAuthor, bookYear, bookAction);

    return container;
}

function createUndoButton() {
    return createButton("green", "Belum Selesai", function (event) {
        undoBookFromCompleted(event.target.parentElement.parentElement);
    });
}

function createEditButton() {
    return createButton("orange", "Edit Data", function (event) {
        editBook(event.target.parentElement.parentElement);
    });
}

function createTrashButton() {
    return createButton("red", "Hapus buku", function (event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

function createCheckButton() {
    return createButton("green", "Selesai Baca", function (event) {
        addBookToCompleted(event.target.parentElement.parentElement);
    });
}

function createButton(buttonTypeClass, buttonText, eventListener) {
    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });

    return button;
}

function addBook() {
    const listBukuBelumSelesai = document.getElementById(UNCOMPLETED_READ_BOOK_ID);
    const listBukuSudahSelesai = document.getElementById(COMPLETED_READ_BOOK_ID);
    const bookTitle = document.getElementById("tambahJudul").value;
    const bookAuthor = document.getElementById("tambahPenulis").value;
    const bookYear = document.getElementById("tambahTahunPublis").value;
    const isComplete = document.getElementById("tambahBukuSelesai").checked;

    const book = makeBook(bookTitle, `Penulis: ${bookAuthor}`, `Tahun: ${bookYear}`, isComplete);
    const bookObject = composeBookObject(bookTitle, bookAuthor, parseInt(bookYear), isComplete);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if (isComplete) {
        listBukuSudahSelesai.append(book);
    } else {
        listBukuBelumSelesai.append(book);
    }
    updateDataToStorage();

    alert("Buku berhasil dimasukkan ke rak buku");
}

function addBookToCompleted(bookElement) {
    const listBukuSudahSelesai = document.getElementById(COMPLETED_READ_BOOK_ID);
    const bookTitle = bookElement.querySelector("h4").innerText;
    const bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = true;
    newBook[BOOK_ITEMID] = book.id;

    listBukuSudahSelesai.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function editBook(bookElement) {
    const bookTitle = bookElement.querySelector("h4");
    const bookAuthor = bookElement.querySelectorAll("p")[0];
    const bookYear = bookElement.querySelectorAll("p")[1];  

    const newTitle = prompt("Edit judul buku:", bookTitle.innerText);
    const newAuthor = prompt("Edit penulis buku:", bookAuthor.innerText.replace("Penulis: ", ""));
    const newYear = prompt("Edit tahun buku:", bookYear.innerText.replace("Tahun: ", ""));

    if (newTitle !== null && newAuthor !== null && newYear !== null) {
        if (newTitle !== bookTitle.innerText) {
            bookTitle.innerText = newTitle;
        }
        if (newAuthor !== bookAuthor.innerText) {
            bookAuthor.innerText = `Penulis: ${newAuthor}`;
        }
        if (newYear !== bookYear.innerText) {
            bookYear.innerText = `Tahun: ${newYear}`;
        }

        const book = findBook(bookElement[BOOK_ITEMID]);
        book.title = newTitle;
        book.author = newAuthor;
        book.year = parseInt(newYear);
      
        updateDataToStorage();
        
    }
}

function removeBook(bookElement) {
    const isDelete = window.confirm("Apakah yakin ingin menghapus buku ini?");
    if (isDelete) {
        const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
        books.splice(bookPosition, 1);

        bookElement.remove();
        updateDataToStorage();
        alert("Buku berhasil dihapus");
    } else {
        alert("Buku gagal dihapus");
    }
}

function undoBookFromCompleted(bookElement) {
    const listBukuBelumSelesai = document.getElementById(UNCOMPLETED_READ_BOOK_ID);
    const bookTitle = bookElement.querySelector("h4").innerText;
    const bookAuthor = bookElement.querySelectorAll("p")[0].innerText;
    const bookYear = bookElement.querySelectorAll("p")[1].innerText;

    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);

    const book = findBook(bookElement[BOOK_ITEMID]);
    book.isComplete = false;
    newBook[BOOK_ITEMID] = book.id;

    listBukuBelumSelesai.append(newBook);
    bookElement.remove();

    updateDataToStorage();
}

function cariBuku() {
    const cariBuku = document.getElementById("cariJudulBuku");
    const filter = cariBuku.value.toUpperCase();
    const bookItem = document.querySelectorAll(".rakBuku > .list_buku > .item_buku");
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}

function checkButton() {
    const span = document.querySelector("span");
    if (tambahBukuSelesai.checked) {
        span.innerText = "Selesai dibaca";
    } else {
        span.innerText = "Belum selesai dibaca";
    }
}
