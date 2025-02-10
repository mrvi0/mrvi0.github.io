
        // Получаем параметры из URL
        const urlParams = new URLSearchParams(window.location.search);
        const direction = urlParams.get('direction'); // Получаем направление
        const refreshRate = urlParams.get('refreshRate'); // Получаем время обновления
        

        console.log('Направление:', direction); // Отладочное сообщение
        console.log('Время обновления:', refreshRate); // Отладочное сообщение

        // Добавляем мета-тег для автоматического обновления страницы
        if (refreshRate) {
            const metaTag = document.createElement('meta');
            metaTag.httpEquiv = 'refresh';
            metaTag.content = refreshRate;
            document.head.appendChild(metaTag);
            console.log('Мета-тег добавлен:', metaTag); // Отладочное сообщение
        }

        const blocks = [];
        urlParams.forEach((value, key) => {
            if (key.startsWith('block')) {
                try {
                    const blockData = JSON.parse(decodeURIComponent(value));
                    blocks.push(blockData);
                } catch (error) {
                    console.error('Ошибка при парсинге блока:', error);
                }
            }
        });
        console.log('Блоки:', blocks); // Отладочное сообщение

        // Показываем блоки для выбранного направления
        const container = document.getElementById('container');
        if (!container) {
            console.error('Контейнер не найден!');
        } else {
            console.log('Контейнер найден:', container);
        }

        // Генерация стилей для анимаций
        function generateStyles(blocks, direction) {
            let styles = '';
            let totalDelay = 0;

            blocks.forEach((block, index) => {
                const delayIn = totalDelay + parseInt(block.delay);
                const delayOut = delayIn + 5;

                styles += `
                    .block-${index}.${direction} {
                        animation:
                            slideIn${capitalizeFirstLetter(direction)} 1s forwards ${delayIn}s,
                            shake 5s infinite alternate ${delayIn}s,
                            slideOut${capitalizeFirstLetter(direction)} 1s forwards ${delayOut}s;
                        opacity: 1; /* Показываем блок */
                        visibility: visible;
                    }
                `;

                totalDelay = delayOut + 1;
            });

            return styles;
        }

        // Вспомогательная функция для капитализации первой буквы
        function capitalizeFirstLetter(string) {
            return string.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        }

        const styleTag = document.createElement('style');
        styleTag.textContent = generateStyles(blocks, direction);
        document.head.appendChild(styleTag);

        // Отображение блоков
        blocks.forEach((block, index) => {
            const div = document.createElement('div');
            div.className = `block block-${index} ${direction} ${block.logo}`; // Добавляем отладочный класс
            div.style.backgroundColor = decodeURIComponent(block.color);
            div.innerHTML = `
                <p class="russo-one-regular">${decodeURIComponent(block.link)}</p>
                <p>${decodeURIComponent(block.description)}</p>`;
            
            container.appendChild(div);
        });