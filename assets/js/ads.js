// assets/js/ads.js

document.addEventListener('DOMContentLoaded', () => {
    const adPlaceholder = document.getElementById('ad-placeholder');
    if (!adPlaceholder) return; // Выходим, если нет блока для рекламы

    // --- Определяем наши рекламные материалы ---
    // Это могут быть ссылки на баннеры, партнерские ссылки, текстовые объявления и т.д.
    // Важно: Убедись, что формат соответствует правилам рекламных сетей, если используешь их.
    const ads = [
        {
            id: 'ad1',
            html: '<a href="https://example.com/partner1" target="_blank" rel="sponsored noopener"><img src="/assets/images/ads/banner1.jpg" alt="Реклама Партнера 1" style="max-width:100%; height:auto;"></a><p>Текст рекламы 1</p>'
        },
        {
            id: 'ad2',
            html: '<a href="https://example.com/partner2" target="_blank" rel="sponsored noopener">Посетите Партнера 2 - лучшие виджеты!</a>'
        },
        {
            id: 'ad3',
            // Можно вставить код от рекламной сети, если он не требует сложной инициализации
            html: '<div><p>Специальное предложение от нас!</p><button onclick="alert(\'Купон X активирован!\')">Получить купон</button></div>'
        },
         {
            id: 'ad4',
            html: '<a href="https://example.com/partner3" target="_blank" rel="sponsored noopener"><img src="/assets/images/ads/banner2.gif" alt="Анимированная реклама" style="max-width:100%; height:auto;"></a>'
        }
        // Добавь сюда больше рекламных блоков
    ];

    if (ads.length === 0) {
        adPlaceholder.innerHTML = '<p>Нет доступной рекламы.</p>';
        return;
    }

    // --- Логика Ротации ---
    const storageKey = 'lastAdIndex';
    let lastIndex = -1;

    try {
        // Пытаемся получить индекс последней показанной рекламы из localStorage
        const storedIndex = localStorage.getItem(storageKey);
        if (storedIndex !== null) {
            lastIndex = parseInt(storedIndex, 10);
        }
    } catch (e) {
        // localStorage может быть недоступен (например, в приватном режиме)
        console.warn("LocalStorage недоступен, ротация рекламы может не работать корректно между сессиями.", e);
        // Можно использовать sessionStorage для ротации в рамках одной сессии
        // Или просто показывать случайную рекламу каждый раз
        lastIndex = Math.floor(Math.random() * ads.length) -1; // Показываем случайную
    }


    // Вычисляем индекс следующей рекламы
    let nextIndex = (lastIndex + 1) % ads.length;

     // (Опционально) Проверка, чтобы не показывать одну и ту же рекламу подряд, если всего 2 объявления
     if (ads.length === 2 && nextIndex === lastIndex) {
         nextIndex = (nextIndex + 1) % ads.length;
     }

    // Сохраняем индекс показанной рекламы
    try {
        localStorage.setItem(storageKey, nextIndex.toString());
    } catch (e) {
         // Ошибка записи в localStorage
         console.warn("Не удалось сохранить индекс рекламы в localStorage.", e);
    }

    // Отображаем выбранную рекламу
    const selectedAd = ads[nextIndex];
    adPlaceholder.innerHTML = selectedAd.html;
    // (Опционально) Добавляем data-атрибут для отладки или стилизации
    adPlaceholder.setAttribute('data-ad-id', selectedAd.id);

    console.log(`Показана реклама #${nextIndex + 1} (ID: ${selectedAd.id})`);
});