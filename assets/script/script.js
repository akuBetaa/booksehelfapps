document.addEventListener("DOMContentLoaded", function () {
  
    const tambahBuku = document.getElementById("tambahBuku");
    const inputSearchBook = document.getElementById("cariBuku");
    const tambahBukuSelesai = document.getElementById("tambahBukuSelesai");
  
    tambahBuku.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
    });
  
    inputSearchBook.addEventListener("keyup", function (event) {
      event.preventDefault();
      cariBuku();
    });
  
    inputSearchBook.addEventListener("submit", function (event) {
      event.preventDefault();
      cariBuku();
    });
  
    tambahBukuSelesai.addEventListener("input", function (event) {
      event.preventDefault();
      checkButton();
    });
  
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });
  
  document.addEventListener("ondatasaved", () => {
    console.log("Buku berhasil disimpan.");
  });
  
  document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
  });