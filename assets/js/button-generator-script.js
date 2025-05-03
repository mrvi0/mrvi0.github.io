// assets/js/button-generator-script.js
document.addEventListener('DOMContentLoaded', () => {

    // === Получение Элементов ===
    const previewButton = document.getElementById('previewButton');
    const cssOutput = document.getElementById('cssOutput');
    const copyCssButton = document.querySelector('.output-area .copy-button');

    // --- Текст ---
    const btnText = document.getElementById('btnText');
    const btnClassName = document.getElementById('btnClassName');
    const btnFontSizeRange = document.getElementById('btnFontSizeRange');
    const btnFontSizeInput = document.getElementById('btnFontSizeInput');
    const btnFontFamily = document.getElementById('btnFontFamily');
    const btnFontBold = document.getElementById('btnFontBold');
    const btnFontItalic = document.getElementById('btnFontItalic');

    // --- Размер (Padding) ---
    const btnPaddingVRange = document.getElementById('btnPaddingVRange');
    const btnPaddingVInput = document.getElementById('btnPaddingVInput');
    const btnPaddingHRange = document.getElementById('btnPaddingHRange');
    const btnPaddingHInput = document.getElementById('btnPaddingHInput');

    // --- Граница ---
    const btnBorderRadiusRange = document.getElementById('btnBorderRadiusRange');
    const btnBorderRadiusInput = document.getElementById('btnBorderRadiusInput');
    const btnBorderSizeRange = document.getElementById('btnBorderSizeRange');
    const btnBorderSizeInput = document.getElementById('btnBorderSizeInput');
    const btnBorderColor = document.getElementById('btnBorderColor');
    const btnBorderColorHex = document.getElementById('btnBorderColorHex');

    // --- Тень Блока (Box Shadow) ---
    const enableBoxShadow = document.getElementById('enableBoxShadow');
    const boxShadowControls = document.getElementById('boxShadowControls');
    const boxShadowVOffsetRange = document.getElementById('boxShadowVOffsetRange');
    const boxShadowVOffsetInput = document.getElementById('boxShadowVOffsetInput');
    const boxShadowHOffsetRange = document.getElementById('boxShadowHOffsetRange');
    const boxShadowHOffsetInput = document.getElementById('boxShadowHOffsetInput');
    const boxShadowBlurRange = document.getElementById('boxShadowBlurRange');
    const boxShadowBlurInput = document.getElementById('boxShadowBlurInput');
    const boxShadowSpreadRange = document.getElementById('boxShadowSpreadRange');
    const boxShadowSpreadInput = document.getElementById('boxShadowSpreadInput');
    const boxShadowColor = document.getElementById('boxShadowColor');
    const boxShadowColorHex = document.getElementById('boxShadowColorHex');
    const boxShadowOpacityRange = document.getElementById('boxShadowOpacityRange');
    const boxShadowOpacityInput = document.getElementById('boxShadowOpacityInput');
    const boxShadowInset = document.getElementById('boxShadowInset');

    // --- Тень Текста (Text Shadow) ---
    const enableTextShadow = document.getElementById('enableTextShadow');
    const textShadowControls = document.getElementById('textShadowControls');
    const textShadowVOffsetRange = document.getElementById('textShadowVOffsetRange');
    const textShadowVOffsetInput = document.getElementById('textShadowVOffsetInput');
    const textShadowHOffsetRange = document.getElementById('textShadowHOffsetRange');
    const textShadowHOffsetInput = document.getElementById('textShadowHOffsetInput');
    const textShadowBlurRange = document.getElementById('textShadowBlurRange');
    const textShadowBlurInput = document.getElementById('textShadowBlurInput');
    const textShadowColor = document.getElementById('textShadowColor');
    const textShadowColorHex = document.getElementById('textShadowColorHex');
    const textShadowOpacityRange = document.getElementById('textShadowOpacityRange');
    const textShadowOpacityInput = document.getElementById('textShadowOpacityInput');

    // --- Цвета Кнопки ---
    const btnTextColor = document.getElementById('btnTextColor');
    const btnTextColorHex = document.getElementById('btnTextColorHex');
    const btnBgColor = document.getElementById('btnBgColor');
    const btnBgColorHex = document.getElementById('btnBgColorHex');

    // === Вспомогательные Функции ===

    // Синхронизация Range и Number инпутов
    function syncRangeAndNumber(rangeInput, numberInput) {
        rangeInput.addEventListener('input', () => numberInput.value = rangeInput.value);
        numberInput.addEventListener('input', () => rangeInput.value = numberInput.value);
    }

    // Синхронизация Color и Text (Hex) инпутов
    function syncColorAndHex(colorInput, hexInput) {
        colorInput.addEventListener('input', () => hexInput.value = colorInput.value);
        // Обратное пока не делаем, т.к. hex readonly
    }

     // Конвертация HEX в RGBA (для теней)
    function hexToRgba(hex, opacity = 1) {
        hex = hex.replace(/^#/, '');
        if (!/^[a-fA-F0-9]{6}$/.test(hex)) return `rgba(0,0,0, ${opacity})`; // Возвращаем черный с прозрачностью по умолчанию

        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // === Основная Функция Обновления ===

    function updateButtonStyles() {
        // 1. Считываем все значения
        const text = btnText.value;
        const className = btnClassName.value || 'myButton'; // Дефолтное имя класса
        const fontSize = btnFontSizeInput.value + 'px';
        const fontFamily = btnFontFamily.value;
        const fontWeight = btnFontBold.checked ? 'bold' : 'normal';
        const fontStyle = btnFontItalic.checked ? 'italic' : 'normal';
        const paddingV = btnPaddingVInput.value + 'px';
        const paddingH = btnPaddingHInput.value + 'px';
        const borderRadius = btnBorderRadiusInput.value + 'px';
        const borderSize = btnBorderSizeInput.value + 'px';
        const borderColor = btnBorderColor.value;
        const textColor = btnTextColor.value;
        const bgColor = btnBgColor.value;

        // Тени (только если включены)
        let boxShadowCss = 'none';
        if (enableBoxShadow.checked) {
            const vOffset = boxShadowVOffsetInput.value + 'px';
            const hOffset = boxShadowHOffsetInput.value + 'px';
            const blur = boxShadowBlurInput.value + 'px';
            const spread = boxShadowSpreadInput.value + 'px';
            const colorHex = boxShadowColor.value;
            const opacity = boxShadowOpacityInput.value;
            const colorRgba = hexToRgba(colorHex, opacity);
            const inset = boxShadowInset.checked ? 'inset' : '';
            boxShadowCss = `${inset} ${hOffset} ${vOffset} ${blur} ${spread} ${colorRgba}`.trim();
        }

        let textShadowCss = 'none';
        if (enableTextShadow.checked) {
             const vOffset = textShadowVOffsetInput.value + 'px';
             const hOffset = textShadowHOffsetInput.value + 'px';
             const blur = textShadowBlurInput.value + 'px';
             const colorHex = textShadowColor.value;
             const opacity = textShadowOpacityInput.value;
             const colorRgba = hexToRgba(colorHex, opacity);
             textShadowCss = `${hOffset} ${vOffset} ${blur} ${colorRgba}`;
        }

        // 2. Применяем стили к кнопке превью
        previewButton.textContent = text;
        previewButton.style.fontSize = fontSize;
        previewButton.style.fontFamily = fontFamily;
        previewButton.style.fontWeight = fontWeight;
        previewButton.style.fontStyle = fontStyle;
        previewButton.style.padding = `${paddingV} ${paddingH}`;
        previewButton.style.borderRadius = borderRadius;
        previewButton.style.border = `${borderSize} solid ${borderColor}`;
        previewButton.style.color = textColor;
        previewButton.style.backgroundColor = bgColor; // Пока простой фон
        previewButton.style.boxShadow = boxShadowCss;
        previewButton.style.textShadow = textShadowCss;
        // Добавляем базовые стили, чтобы кнопка выглядела как кнопка
        previewButton.style.display = 'inline-block';
        previewButton.style.textAlign = 'center';
        previewButton.style.textDecoration = 'none'; // Убираем подчеркивание, если это была ссылка
        previewButton.style.cursor = 'pointer'; // Делаем курсор как у кнопки
        previewButton.style.transition = 'background-color 0.2s ease, box-shadow 0.2s ease'; // Плавность для будущих hover-эффектов


        // 3. Генерируем CSS код для вывода
        let cssString = `.${className} {\n`;
        cssString += `  padding: ${paddingV} ${paddingH};\n`;
        cssString += `  border-radius: ${borderRadius};\n`;
        cssString += `  border: ${borderSize} solid ${borderColor};\n`;
        cssString += `  font-family: ${fontFamily};\n`;
        cssString += `  font-size: ${fontSize};\n`;
        cssString += `  font-weight: ${fontWeight};\n`;
        cssString += `  font-style: ${fontStyle};\n`;
        cssString += `  color: ${textColor};\n`;
        cssString += `  background-color: ${bgColor};\n`; // Позже заменить на градиент
        if (enableBoxShadow.checked) {
            cssString += `  box-shadow: ${boxShadowCss};\n`;
        }
        if (enableTextShadow.checked) {
             cssString += `  text-shadow: ${textShadowCss};\n`;
        }
         // Добавляем базовые стили в CSS
         cssString += `  text-align: center;\n`;
         cssString += `  text-decoration: none;\n`;
         cssString += `  display: inline-block; /* или block */\n`;
         cssString += `  cursor: pointer;\n`;
         cssString += `  transition: all 0.3s ease; /* Плавный переход для hover */\n`;
         cssString += `}\n\n`;

         // Опционально: Добавить стили для :hover
         cssString += `.${className}:hover {\n`;
         cssString += `  /* background-color: darken(${bgColor}, 10%); */ /* Пример (нужна JS-функция darken) */\n`;
         cssString += `  /* Или просто другой цвет: */\n`;
         cssString += `  /* background-color: #someOtherColor; */\n`;
         cssString += `  /* Можно добавить изменение тени при наведении */\n`;
         cssString += `}\n`;


        cssOutput.value = cssString;
    }

    // === Инициализация и Навешивание Обработчиков ===

    // Синхронизация ползунков и числовых полей
    syncRangeAndNumber(btnFontSizeRange, btnFontSizeInput);
    syncRangeAndNumber(btnPaddingVRange, btnPaddingVInput);
    syncRangeAndNumber(btnPaddingHRange, btnPaddingHInput);
    syncRangeAndNumber(btnBorderRadiusRange, btnBorderRadiusInput);
    syncRangeAndNumber(btnBorderSizeRange, btnBorderSizeInput);
    syncRangeAndNumber(boxShadowVOffsetRange, boxShadowVOffsetInput);
    syncRangeAndNumber(boxShadowHOffsetRange, boxShadowHOffsetInput);
    syncRangeAndNumber(boxShadowBlurRange, boxShadowBlurInput);
    syncRangeAndNumber(boxShadowSpreadRange, boxShadowSpreadInput);
    syncRangeAndNumber(boxShadowOpacityRange, boxShadowOpacityInput);
    syncRangeAndNumber(textShadowVOffsetRange, textShadowVOffsetInput);
    syncRangeAndNumber(textShadowHOffsetRange, textShadowHOffsetInput);
    syncRangeAndNumber(textShadowBlurRange, textShadowBlurInput);
    syncRangeAndNumber(textShadowOpacityRange, textShadowOpacityInput);

    // Синхронизация пикеров цвета и текстовых HEX-полей
    syncColorAndHex(btnBorderColor, btnBorderColorHex);
    syncColorAndHex(boxShadowColor, boxShadowColorHex);
    syncColorAndHex(textShadowColor, textShadowColorHex);
    syncColorAndHex(btnTextColor, btnTextColorHex);
    syncColorAndHex(btnBgColor, btnBgColorHex);

    // Показ/скрытие настроек теней
    enableBoxShadow.addEventListener('change', () => {
        boxShadowControls.style.display = enableBoxShadow.checked ? 'block' : 'none';
        updateButtonStyles(); // Обновить стили при вкл/выкл
    });
    enableTextShadow.addEventListener('change', () => {
        textShadowControls.style.display = enableTextShadow.checked ? 'block' : 'none';
        updateButtonStyles(); // Обновить стили при вкл/выкл
    });

    // Собираем все инпуты, изменение которых должно обновлять стили
    const allControls = [
        btnText, btnClassName, btnFontSizeInput, btnFontFamily, btnFontBold, btnFontItalic,
        btnPaddingVInput, btnPaddingHInput, btnBorderRadiusInput, btnBorderSizeInput, btnBorderColor,
        enableBoxShadow, boxShadowVOffsetInput, boxShadowHOffsetInput, boxShadowBlurInput, boxShadowSpreadInput,
        boxShadowColor, boxShadowOpacityInput, boxShadowInset,
        enableTextShadow, textShadowVOffsetInput, textShadowHOffsetInput, textShadowBlurInput,
        textShadowColor, textShadowOpacityInput,
        btnTextColor, btnBgColor
    ];

    // Навешиваем один обработчик на все контролы
    allControls.forEach(control => {
        if (!control) { // Добавим проверку на null
             console.warn("Найден null элемент при навешивании обработчика:", control);
             return; // Пропускаем null элементы
        }
        // Используем 'input' для ползунков и текстовых полей, 'change' для чекбоксов, селектов, пикеров цвета
        const eventType = (control.type === 'range' || control.type === 'text' || control.type === 'number') ? 'input' : 'change';
        control.addEventListener(eventType, updateButtonStyles);
    });

    // Отдельные обработчики для синхронизации range/number (они тоже должны вызывать update)
    function setupSyncAndUpdate(rangeInput, numberInput) {
        rangeInput.addEventListener('input', () => {
            numberInput.value = rangeInput.value;
            updateButtonStyles(); // Вызываем обновление
        });
        numberInput.addEventListener('input', () => {
             // Добавим небольшую задержку для number, чтобы не срабатывать на каждую цифру
             // если это мешает, но пока оставим input
            rangeInput.value = numberInput.value;
            updateButtonStyles(); // Вызываем обновление
        });
    }
    // Переделываем вызовы syncRangeAndNumber
    setupSyncAndUpdate(btnFontSizeRange, btnFontSizeInput);
    setupSyncAndUpdate(btnPaddingVRange, btnPaddingVInput);
    setupSyncAndUpdate(btnPaddingHRange, btnPaddingHInput);
    setupSyncAndUpdate(btnBorderRadiusRange, btnBorderRadiusInput);
    setupSyncAndUpdate(btnBorderSizeRange, btnBorderSizeInput);
    setupSyncAndUpdate(boxShadowVOffsetRange, boxShadowVOffsetInput);
    setupSyncAndUpdate(boxShadowHOffsetRange, boxShadowHOffsetInput);
    setupSyncAndUpdate(boxShadowBlurRange, boxShadowBlurInput);
    setupSyncAndUpdate(boxShadowSpreadRange, boxShadowSpreadInput);
    setupSyncAndUpdate(boxShadowOpacityRange, boxShadowOpacityInput);
    setupSyncAndUpdate(textShadowVOffsetRange, textShadowVOffsetInput);
    setupSyncAndUpdate(textShadowHOffsetRange, textShadowHOffsetInput);
    setupSyncAndUpdate(textShadowBlurRange, textShadowBlurInput);
    setupSyncAndUpdate(textShadowOpacityRange, textShadowOpacityInput);

    // Обработчики для пикеров цвета (тоже должны вызывать update)
    function setupColorSyncAndUpdate(colorInput, hexInput) {
         colorInput.addEventListener('input', () => { // input для мгновенного обновления
             hexInput.value = colorInput.value.toUpperCase();
             updateButtonStyles(); // Вызываем обновление
         });
         // Обратное не нужно, т.к. hexInput readonly
    }

    setupColorSyncAndUpdate(btnBorderColor, btnBorderColorHex);
    setupColorSyncAndUpdate(boxShadowColor, boxShadowColorHex);
    setupColorSyncAndUpdate(textShadowColor, textShadowColorHex);
    setupColorSyncAndUpdate(btnTextColor, btnTextColorHex);
    setupColorSyncAndUpdate(btnBgColor, btnBgColorHex);

    // Копирование CSS
    copyCssButton.addEventListener('click', () => {
        cssOutput.select(); // Выделить текст
        try {
             navigator.clipboard.writeText(cssOutput.value).then(() => {
                 const originalText = copyCssButton.textContent;
                 copyCssButton.textContent = '✅ Скопировано!';
                 setTimeout(() => { copyCssButton.textContent = originalText; }, 1500);
             }).catch(err => {
                 console.error('Ошибка копирования CSS: ', err);
                 // Можно добавить fallback или сообщение об ошибке
             });
        } catch (err) {
             console.error('Ошибка копирования CSS (старый метод): ', err);
             // Fallback для старых браузеров (менее надежный)
             try {
                 document.execCommand('copy');
                 // Уведомление об успехе (если нужно)
             } catch (e) {
                 console.error('Fallback копирования не удался: ', e);
             }
        }
    });


    // Первоначальное обновление стилей при загрузке
    updateButtonStyles();

}); // Конец DOMContentLoaded