
        $(function () {
            $(".flippy").on("click", function () {
              $(this).parent().children(".flippanel").slideToggle("normal");
            });
          });
          
       document.getElementById('addBlock').onclick = function() {
           const blocksContainer = document.getElementById('blocksContainer');
            
           // Создаем новый блок
           const newBlock = document.createElement('div');
           newBlock.className = 'blockInput';
           newBlock.innerHTML = `
                <label for="link">Заголовок:</label>
                <input type="text" class="link"><br>

                <label for="description">Описание:</label>
                <input type="text" class="description"><br>

                <label for="color">Цвет блока:</label>
                <input type="color" class="color color-input" value="#5ebdf1"><br>
                
                <p>Логотип</p>
                <select id="logo" name="logo">
                    <option value="none-logo" selected>Без logo</option>
                    <option value="tg-logo">Telegram</option>
                    <option value="boosty-logo">Boosty</option>
                    <option value="discord-logo">Discord</option>
                </select>
                <br>
                <!-- Задержка будет только для последующих блоков -->
                <input type="hidden" class="delay" value="" required> <!-- Скрытое поле для задержки -->
               
                <!-- Кнопка для удаления блока -->
                <button type='button' class='removeBlock' style="background-color: #f15e5e">Удалить блок</button>`;
           
           blocksContainer.appendChild(newBlock);
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
            const link = encodeURIComponent(block.querySelector('.link').value);
            const description = encodeURIComponent(block.querySelector('.description').value);
            const color = encodeURIComponent(block.querySelector('.color').value);
            const delay = (blocks.length === 0) ? '0' : document.getElementById('blockDelay').value;
            const logo = block.querySelector('#logo').value;

            blocks.push({ link, description, color,logo, delay });
        });
    
        const blockDelay = parseInt(document.getElementById('blockDelay').value);
        const animationTimePerBlock = 6;
        const totalAnimationTime = animationTimePerBlock * blocks.length + blockDelay * (blocks.length - 1) + blockDelay;
    
        const direction = document.getElementById('direction').value; // Получаем выбранное направление
        const params = blocks.map((block, index) => `block${index}=${JSON.stringify(block)}`).join('&');
    
        const generatedUrl = `https://mrvi0.github.io/utilities/stream-popup/display.html?${params}&refreshRate=${totalAnimationTime}&direction=${direction}`;
    
        document.getElementById('output').innerHTML = `
            <div class='link-container'>
                <input type='text' value='${generatedUrl}' class='link-input' readonly />
            </div>`;
    };

       function copyToClipboard(text) {
          navigator.clipboard.writeText(text).then(() => {
              alert("Ссылка скопирована в буфер обмена!");
          }, (err) => {
              console.error("Ошибка при копировании текста:", err);
          });
      }