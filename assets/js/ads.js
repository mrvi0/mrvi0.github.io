// assets/js/ads.js

document.addEventListener('DOMContentLoaded', () => {
    const adPlaceholder = document.getElementById('ad-placeholder');
    const adsDataScript = document.getElementById('adsDataScript');

    if (!adPlaceholder || !adsDataScript) {
        console.warn("Не найден блок рекламы #ad-placeholder или скрипт данных #adsDataScript");
        if (adPlaceholder) adPlaceholder.innerHTML = ''; // Очищаем, если блок есть, а данных нет
        return;
    }

    let ads = [];
    try {
        // Пытаемся распарсить JSON из встроенного скрипта
        ads = JSON.parse(adsDataScript.textContent);
    } catch (e) {
        console.error("Ошибка парсинга данных рекламы из JSON:", e);
        adPlaceholder.innerHTML = '<p class="ad-error">Ошибка загрузки рекламы.</p>';
        return;
    }

    if (!Array.isArray(ads) || ads.length === 0) {
        adPlaceholder.innerHTML = '<p>Нет доступной рекламы.</p>';
        return;
    }

    // --- Логика Ротации (остается такой же) ---
    const storageKey = 'lastAdIndex';
    let lastIndex = -1;

    try {
        const storedIndex = localStorage.getItem(storageKey);
        if (storedIndex !== null) {
            lastIndex = parseInt(storedIndex, 10);
            // Проверка на случай, если количество рекламы изменилось
            if (lastIndex >= ads.length) {
                 lastIndex = -1;
            }
        }
    } catch (e) {
        console.warn("LocalStorage недоступен, ротация рекламы может не работать корректно между сессиями.", e);
        lastIndex = Math.floor(Math.random() * ads.length) -1;
    }

    // Вычисляем индекс следующей рекламы
    let nextIndex = (lastIndex + 1) % ads.length;
    // Просто показываем следующую по кругу

    // Сохраняем индекс показанной рекламы
    try {
        localStorage.setItem(storageKey, nextIndex.toString());
    } catch (e) {
         console.warn("Не удалось сохранить индекс рекламы в localStorage.", e);
    }

    // --- Отображаем выбранную рекламу ---
    const selectedAd = ads[nextIndex];

    // Генерируем HTML (если в data-файле только поля, а не готовый HTML)
    // Этот блок можно расширить для разных 'type' рекламы
    let adHtmlContent = '';
    if (selectedAd.html) {
        adHtmlContent = selectedAd.html; // Используем готовый HTML
    } else if (selectedAd.type === 'banner_image' && selectedAd.image_url && selectedAd.link_url) {
        // Генерируем HTML для простого баннера
        adHtmlContent = `
            <a href="${selectedAd.link_url}" target="_blank" rel="sponsored noopener" class="ad-link ad-banner">
                <img src="${selectedAd.image_url}" alt="${selectedAd.alt_text || 'Реклама'}" loading="lazy">
            </a>
        `;
    } else {
        adHtmlContent = '<p class="ad-error">Некорректный формат рекламы.</p>';
        console.warn("Некорректный формат для рекламного блока:", selectedAd);
    }


    adPlaceholder.innerHTML = adHtmlContent;
    adPlaceholder.setAttribute('data-ad-id', selectedAd.id || 'unknown'); // Добавляем ID для отладки

    console.log(`Показана реклама #${nextIndex + 1} (ID: ${selectedAd.id || 'unknown'})`);
});