const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('upload');

dropArea.addEventListener('click', () => {
    fileInput.click();
});

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; // Изменение цвета при перетаскивании
});

dropArea.addEventListener('dragleave', () => {
    dropArea.style.backgroundColor = ''; // Возврат к исходному цвету
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length) {
        fileInput.files = files; // Установка загруженных файлов в input
        dropArea.textContent = `Файл загружен: ${files[0].name}`; // Отображение имени файла
    }
});