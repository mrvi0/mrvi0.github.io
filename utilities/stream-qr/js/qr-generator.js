$(function () {
    $(".flippy").on("click", function () {
      $(this).parent().children(".flippanel").slideToggle("normal");
    });
});

// Генерация примера QR-кода
document.addEventListener('DOMContentLoaded', function() {
    const exampleCanvas = document.getElementById('example-qr');
    if (exampleCanvas) {
        QRCode.toCanvas(exampleCanvas, 'https://t.me/B4DCAT', {
            width: 60,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });
    }
});

document.getElementById('addBlock').onclick = function() {
    const blocksContainer = document.getElementById('blocksContainer');
    const blockIndex = blocksContainer.children.length;
    
    // Создаем новый блок
    const newBlock = document.createElement('div');
    newBlock.className = 'blockInput';
    newBlock.innerHTML = `
        <label for="url">URL для QR-кода:</label>
        <input type="text" class="url" placeholder="https://t.me/B4DCAT" required><br>

        <label for="description">Описание:</label>
        <input type="text" class="description" placeholder="ТЕЛЕГРАМ КАНАЛ"><br>

        <label for="color">Цвет фона:</label>
        <input type="color" class="color color-input" value="#5ebdf1"><br>
        
        <div class="qr-options">
            <label for="qrSize">Размер QR-кода:</label>
            <input type="number" class="qr-size qr-size-input" value="60" min="30" max="120">
            <label for="qrColor">Цвет QR-кода:</label>
            <input type="color" class="qr-color" value="#000000">
        </div>
        
        <div class="qr-preview">
            <p>Предварительный просмотр:</p>
            <canvas class="qr-canvas" width="60" height="60"></canvas>
        </div>
        
        <!-- Задержка будет только для последующих блоков -->
        <input type="hidden" class="delay" value="" required>
       
        <!-- Кнопка для удаления блока -->
        <button type='button' class='removeBlock' style="background-color: #f15e5e">Удалить QR-код</button>`;
    
    blocksContainer.appendChild(newBlock);
    
    // Добавляем обработчики событий для нового блока
    const urlInput = newBlock.querySelector('.url');
    const qrSizeInput = newBlock.querySelector('.qr-size');
    const qrColorInput = newBlock.querySelector('.qr-color');
    const qrCanvas = newBlock.querySelector('.qr-canvas');
    
    // Функция обновления QR-кода
    function updateQR() {
        const url = urlInput.value.trim();
        const size = parseInt(qrSizeInput.value);
        const color = qrColorInput.value;
        
        if (url) {
            qrCanvas.width = size;
            qrCanvas.height = size;
            QRCode.toCanvas(qrCanvas, url, {
                width: size,
                margin: 1,
                color: {
                    dark: color,
                    light: '#FFFFFF'
                }
            });
        }
    }
    
    // Обработчики событий
    urlInput.addEventListener('input', updateQR);
    qrSizeInput.addEventListener('input', updateQR);
    qrColorInput.addEventListener('input', updateQR);
    
    // Генерируем QR-код при создании блока
    setTimeout(updateQR, 100);
};

// Удаление блока
document.getElementById('blocksContainer').addEventListener('click', function(event) {
    if (event.target.classList.contains('removeBlock')) {
        event.target.parentElement.remove();
    }
});

// Генерация ссылки
document.getElementById('dataForm').onsubmit = function(event) {
    event.preventDefault();

    const blocks = [];
    const blockInputs = document.querySelectorAll('.blockInput');

    blockInputs.forEach(block => {
        const url = block.querySelector('.url').value;
        const description = block.querySelector('.description').value;
        const color = block.querySelector('.color').value;
        const qrSize = block.querySelector('.qr-size').value;
        const qrColor = block.querySelector('.qr-color').value;
        const delay = (blocks.length === 0) ? '0' : document.getElementById('blockDelay').value;

        blocks.push({ url, description, color, qrSize, qrColor, delay });
    });

    const blockDelay = parseInt(document.getElementById('blockDelay').value);
    const animationTimePerBlock = 6;
    const totalAnimationTime = animationTimePerBlock * blocks.length + blockDelay * (blocks.length - 1) + blockDelay;

    const direction = document.getElementById('direction').value;
    const params = blocks.map((block, index) => `block${index}=${encodeURIComponent(JSON.stringify(block))}`).join('&');

    const generatedUrl = `https://mrvi0.github.io/utilities/stream-qr/display.html?${params}&refreshRate=${totalAnimationTime}&direction=${direction}`;

    document.getElementById('output').innerHTML = `
        <div class='link-container'>
            <input type='text' value='${generatedUrl}' class='link-input' readonly />
            <button type='button' class='copy-button' onclick="copyToClipboard('${generatedUrl}')">
                <svg viewBox="0 0 24 24">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
            </button>
        </div>`;
};

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Ссылка скопирована в буфер обмена!");
    }, (err) => {
        console.error("Ошибка при копировании текста:", err);
    });
} 