const STORAGE_KEY = 'BOOKS';
let books = [];


/**
 * Mengambalikan nilai boolean tergantung apakah browser menyimpan data di local storage atau tidak
 * @returns {HTMLElement}
 */
const isStorageExist = () => {
	if (typeof Storage === undefined) {
		alert('Browser tidak mendukung web storage');
		return false;
	}

	return true;
};

/**
 * Menympimpan data book ke local storage
 */
const saveBookData = () => {
	const parsed = JSON.stringify(books);
	localStorage.setItem(STORAGE_KEY, parsed);

	document.dispatchEvent(new Event('ondatasaved'));
};

/**
 * memuat data book dari local storage
 */
const loadStorageData = () => {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		books = data;

		document.dispatchEvent(new Event('ondataloaded'));
	}
};

/**
 * update data book ke local storage
 */
const updateStorageData = () => {
	if (isStorageExist()) saveBookData();
};

/**
 * Data Buku
 * @param {*} title 
 * @param {*} author 
 * @param {*} publishedYear 
 * @param {*} isFinished 
 * @returns 
 */
function composeBookObject(title, author, publishedYear, isFinished) {
	return {
		id: +new Date(),
		title,
		author,
		publishedYear,
		isFinished,
	};
}
/**
 * Sebuah function untuk mencari buku berdasarkan id
 * @param {*} bookId 
 * @returns 
 */

const findBook = (bookId) => {
	for (book of books) {
		if (book.id === bookId) return book;
	}

	return null;
};
/**
 * Sebuah function untuk mencari buku berdasarkan index
 * @param {*} bookId 
 * @returns 
 */
const findBookIndex = (bookId) => {
	let index = 0;
	for (book of books) {
		if (book.id === bookId) return index;

		index++;
	}

	return -1;
};
/**
 * Sebuah buku untuk merefresh list buku
 */
const refreshDataFromBooks = () => {
	for (book of books) {
		const newBook = makeBook(book.title, book.author, book.publishedYear, book.isFinished);
		newBook[BOOK_ITEMID] = book.id;

		if (book.isFinished) {
			finishedList.append(newBook);
		} else {
			unfinishedList.append(newBook);
		}
	}
};
/**
 * Sebuah function untuk mencari buku berdasarkan judul buku
 * @param {} bookTitle 
 */
const searchBooks = (bookTitle) => {
	books.filter((book) => {
		if (book.title.toLowerCase().match(bookTitle.value.toLowerCase())) {
			if (book.isFinished) {
				const searchedBooks = makeBook(book.title, book.author, book.publishedYear, true);
				finishedList.append(searchedBooks);
			} else {
				const searchedBooks = makeBook(book.title, book.author, book.publishedYear, false);
				unfinishedList.append(searchedBooks);
			}
		}
	});
};

const unfinishedList = document.querySelector('.unfinished-list');
const finishedList = document.querySelector('.finished-list');
const BOOK_ITEMID = 'itemId';

const addBook = () => {
	const bookTitle = document.getElementById('title');
	const bookAuthor = document.getElementById('author');
	const bookPublishedYear = document.getElementById('published');
	const publishedYearFirstNumber = bookPublishedYear.value.split('')[0];

	if (bookTitle.value != '' && bookAuthor.value != '' && bookPublishedYear.value != '') {
		if (publishedYearFirstNumber != 0) {
			const book = makeBook(bookTitle.value, bookAuthor.value, bookPublishedYear.value);
			const bookObject = composeBookObject(bookTitle.value, bookAuthor.value, bookPublishedYear.value, false);

			book[BOOK_ITEMID] = bookObject.id;
			books.push(bookObject);

			bookTitle.value = '';
			bookAuthor.value = '';
			bookPublishedYear.value = '';

			unfinishedList.append(book);
			updateStorageData();

			Swal.fire({
				title: 'Success!',
				text: 'Book added to the shelf!',
				icon: 'success',
				confirmButtonText: 'OK',
				buttonsStyling: false,
				customClass: {
					confirmButton: 'btn finished-btn swal-btn',
				},
			});
		} else {
			Swal.fire({
				title: 'Invalid Input',
				text: 'Published year first number cannot be 0',
				icon: 'warning',
				confirmButtonText: 'OK',
				buttonsStyling: false,
				customClass: {
					confirmButton: 'btn finished-btn swal-btn',
				},
			});
		}
	} else {
		Swal.fire({
			title: 'Empty Field',
			text: 'Please fill out the form',
			icon: 'warning',
			confirmButtonText: 'OK',
			buttonsStyling: false,
			customClass: {
				confirmButton: 'btn finished-btn swal-btn',
			},
		});
	}
};

const makeBook = (title, author, publishedYear, isFinished) => {
	const bookDetails = document.createElement('div');
	bookDetails.classList.add('card', 'book-details', 'mt-3');
	bookDetails.innerHTML = `<h5 class='title'>${title}</h5>
		                     <div class='author'>Author : ${author}</div>
		                     <div class='published'>Published : ${publishedYear}</div>`;

	const actionBtnContainer = document.createElement('div');
	actionBtnContainer.classList.add('action', 'd-flex', 'justify-content-end');

	if (isFinished) {
		actionBtnContainer.append(createUnfinishedBtn(), createRemoveBtn());
	} else {
		actionBtnContainer.append(createFinishedBtn(), createRemoveBtn());
	}

	bookDetails.append(actionBtnContainer);

	return bookDetails;
};

const createBtn = (classType, isFinished, eventListener) => {
	const button = document.createElement('button');
	button.classList.add('btn', classType);

	if (isFinished) {
		button.innerText = `Belum Siap`;
	} else {
		button.innerText = `Sudah Siap`;
	}

	if (classType == 'remove-btn') {
		button.innerText = `Hapus`;
	}

	button.addEventListener('click', (event) => {
		eventListener(event);
	});

	return button;
};

const moveToFinished = (bookElement) => {
	const title = bookElement.querySelector('.title').innerText;
	const author = bookElement.querySelector('.author').innerText.split(':').slice(1);
	const publishedYear = bookElement.querySelector('.published').innerText.split(':').slice(1);

	const newBook = makeBook(title, author, publishedYear, true);
	const book = findBook(bookElement[BOOK_ITEMID]);

	book.isFinished = true;
	newBook[BOOK_ITEMID] = book.id;

	finishedList.append(newBook);
	bookElement.remove();
	updateStorageData();
};

const moveToUnfinished = (bookElement) => {
	const title = bookElement.querySelector('.title').innerText;
	const author = bookElement.querySelector('.author').innerText.split(':').slice(1);
	const publishedYear = bookElement.querySelector('.published').innerText.split(':').slice(1);

	const newBook = makeBook(title, author, publishedYear, false);
	const book = findBook(bookElement[BOOK_ITEMID]);

	book.isFinished = false;
	newBook[BOOK_ITEMID] = book.id;

	unfinishedList.append(newBook);
	bookElement.remove();
	updateStorageData();
};

/**
 * Sebuah function untuk menampilkan pop up
 * @param {*} bookElement 
 */

const removeBook = (bookElement) => {
	const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);

	Swal.fire({
		title: 'Apakah anda yakin?',
		text: "Anda tidak dapat mengembalikan ini",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: 'Hapus Buku',
		buttonsStyling: false,
		reverseButtons: true,
		customClass: {
			cancelButton: 'btn cancel-btn swal-btn',
			confirmButton: 'btn remove-btn swal-btn',
		},
	}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
				title: 'Hapus!',
				text: 'Buku telah dihapus di rak ini!',
				icon: 'success',
				confirmButtonText: 'OK',
				buttonsStyling: false,
				customClass: {
					confirmButton: 'btn finished-btn swal-btn',
				},
			});

			books.splice(bookPosition, 1);
			bookElement.remove();
			updateStorageData();
		}
	});
};

const searchBookByTitle = () => {
	let searchBookInput = document.querySelector('#searchForm input');
	const unfinishedBooks = document.querySelectorAll('.unfinished-list .card');
	const finishedBooks = document.querySelectorAll('.finished-list .card');

	finishedBooks.forEach((e) => e.remove());
	unfinishedBooks.forEach((e) => e.remove());

	searchBooks(searchBookInput);
};

const createFinishedBtn = () => {
	return createBtn('finished-btn', false, (event) => {
		moveToFinished(event.target.parentElement.parentElement);
	});
};

const createUnfinishedBtn = () => {
	return createBtn('unfinished-btn', true, (event) => {
		moveToUnfinished(event.target.parentElement.parentElement);
	});
};

const createRemoveBtn = () => {
	return createBtn('remove-btn', true, (event) => {
		removeBook(event.target.parentElement.parentElement);
	});
};

const maxYear = () => {
	const publishedInput = document.getElementById('published');
	const date = new Date();
	const year = date.getFullYear();

	publishedInput.setAttribute('min', 0);
	publishedInput.setAttribute('max', year);
};

const unfinishedAccordion = () => {
	const unfinishedArrow = document.querySelector('.unfinished-accordion-btn');
	unfinishedArrow.addEventListener('click', () => {
		unfinishedArrow.classList.toggle('fa-chevron-down');
		unfinishedArrow.classList.toggle('fa-chevron-up');
	});
};

const finishedAccordion = () => {
	const finishedArrow = document.querySelector('.finished-accordion-btn');
	finishedArrow.addEventListener('click', () => {
		finishedArrow.classList.toggle('fa-chevron-down');
		finishedArrow.classList.toggle('fa-chevron-up');
	});
};

const backToTop = () => {
	window.scrollTo({
		top: 0,
		left: 0,
	});
};


window.addEventListener('DOMContentLoaded', () => {
	const addBookForm = document.getElementById('addBookForm');
	addBookForm.addEventListener('submit', (event) => {
		event.preventDefault();
		addBook();
	});

	const searchForm = document.getElementById('searchForm');
	searchForm.addEventListener('submit', (event) => {
		event.preventDefault();
		searchBookByTitle();
	});

	const backToTopBtn = document.querySelector('.back-to-top-btn');
	backToTopBtn.addEventListener('click', () => {
		backToTop();
	});

	window.addEventListener('scroll', () => {
		const scrollHeight = window.scrollY;

		if (scrollHeight > 450) {
			backToTopBtn.classList.remove('hidden');
		} else {
			backToTopBtn.classList.add('hidden');
		}
	});

	maxYear();
	unfinishedAccordion();
	finishedAccordion();

	if (isStorageExist()) {
		loadStorageData();
	}
});

document.addEventListener('ondatasaved', () => {
	console.log('Data berhasil disimpan');
});

document.addEventListener('ondataloaded', () => {
	console.log('Data berhasil dimuat');
	refreshDataFromBooks();
});
