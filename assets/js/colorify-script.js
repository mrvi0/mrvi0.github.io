// assets/js/colorify-script.js
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы DOM
    const hexInput = document.getElementById('hexInput');
    const rInput = document.getElementById('rInput');
    const gInput = document.getElementById('gInput');
    const bInput = document.getElementById('bInput');
    const hInput = document.getElementById('hInput');
    const sInput = document.getElementById('sInput');
    const lInput = document.getElementById('lInput');
    const rgbOutput = document.getElementById('rgbOutput');
    const hslOutput = document.getElementById('hslOutput');
    const colorPreview = document.getElementById('color-preview');
    const copyButtons = document.querySelectorAll('.copy-button');
    const gradColorInputs = document.querySelectorAll('.gradient-color-input'); // Получаем НАЧАЛЬНЫЕ инпуты
    const gradAngleInput = document.getElementById('gradientAngleInput');
    const gradAngleValueSpan = document.getElementById('gradientAngleValue');
    const gradPreview = document.getElementById('gradient-preview');
    const gradCssOutput = document.getElementById('gradientCssOutput');
    const gradHexPreviews = document.querySelectorAll('.gradient-hex-preview');
    const gradAngleRange = document.getElementById('gradientAngleRange');
     // Новый элемент

    // ----- Функции Конвертации -----

    // HEX -> RGB
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        if (!/^[a-fA-F0-9]{3,6}$/.test(hex)) return null; // Базовая валидация

        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        if (hex.length !== 6) return null;

        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    // RGB -> HEX
    function rgbToHex(r, g, b) {
        if ([r, g, b].some(val => val < 0 || val > 255 || isNaN(val))) return null;
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    // RGB -> HSL (Значения H: 0-360, S: 0-100, L: 0-100)
    function rgbToHsl(r, g, b) {
         if ([r, g, b].some(val => val < 0 || val > 255 || isNaN(val))) return null;
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        return { h, s, l };
    }

    // HSL -> RGB
    function hslToRgb(h, s, l) {
        if ([h, s, l].some(val => isNaN(val)) || h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
        h /= 360; s /= 100; l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);
        return { r, g, b };
    }

    // ----- Вспомогательные Функции -----

    // Очистка ошибки ввода
    function clearError(inputElement) {
        inputElement.classList.remove('input-error');
    }
    // Установка ошибки ввода
    function setError(inputElement) {
        inputElement.classList.add('input-error');
    }
    // Очистка всех ошибок
    function clearAllErrors() {
        hexInput.classList.remove('input-error');
        rInput.classList.remove('input-error');
        gInput.classList.remove('input-error');
        bInput.classList.remove('input-error');
        hInput.classList.remove('input-error');
        sInput.classList.remove('input-error');
        lInput.classList.remove('input-error');
    }

    // Обновление UI (всех полей и превью)
    function updateUI(sourceElement = null, r, g, b) {
        clearAllErrors();

        // Обновляем RGB поля
        if (sourceElement !== rInput) rInput.value = r;
        if (sourceElement !== gInput) gInput.value = g;
        if (sourceElement !== bInput) bInput.value = b;
        rgbOutput.value = `rgb(${r}, ${g}, ${b})`;

        // Конвертируем и обновляем HEX
        const hex = rgbToHex(r, g, b);
        if (hex) { // Условие hex && sourceElement !== hexInput не нужно, т.к. picker - источник
             if (sourceElement !== hexInput) {
                 hexInput.value = hex.substring(1);
             }
             // ВСЕГДА обновляем значение color picker'а
             if (sourceElement !== colorPickerInput) {
                 colorPickerInput.value = hex; // Устанавливаем HEX с #
             }
        }

        // Конвертируем и обновляем HSL
        const hsl = rgbToHsl(r, g, b);
        if (hsl) {
            if (sourceElement !== hInput) hInput.value = hsl.h;
            if (sourceElement !== sInput) sInput.value = hsl.s;
            if (sourceElement !== lInput) lInput.value = hsl.l;
            hslOutput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        }

        // Обновляем превью
        colorPreview.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    // --- НОВЫЙ ОБРАБОТЧИК для Color Picker ---
    colorPickerInput.addEventListener('input', () => {
        const hexValue = colorPickerInput.value; // Получаем значение вида #RRGGBB
        const rgb = hexToRgb(hexValue);
        if (rgb) {
            // Обновляем все поля, считая color picker источником
            updateUI(colorPickerInput, rgb.r, rgb.g, rgb.b);
        }
    });
    // --- КОНЕЦ НОВОГО ОБРАБОТЧИКА ---

    // ----- Обработчики Событий -----

    hexInput.addEventListener('input', () => {
        clearError(hexInput);
        const hexValue = '#' + hexInput.value;
        const rgb = hexToRgb(hexValue);
        if (rgb) {
            updateUI(hexInput, rgb.r, rgb.g, rgb.b);
        } else if (hexInput.value.length > 0) {
            setError(hexInput);
        }
    });

    [rInput, gInput, bInput].forEach(input => {
        input.addEventListener('input', () => {
            clearError(rInput); clearError(gInput); clearError(bInput);
            const r = parseInt(rInput.value, 10);
            const g = parseInt(gInput.value, 10);
            const b = parseInt(bInput.value, 10);

            if ([r, g, b].some(val => isNaN(val) || val < 0 || val > 255)) {
                 if(input.value.length > 0) setError(input); // Ошибка на конкретном поле
                 return;
            }
            // Обновляем UI только если все RGB валидны
            updateUI(input, r, g, b);
        });
    });

     [hInput, sInput, lInput].forEach(input => {
        input.addEventListener('input', () => {
             clearError(hInput); clearError(sInput); clearError(lInput);
            const h = parseInt(hInput.value, 10);
            const s = parseInt(sInput.value, 10);
            const l = parseInt(lInput.value, 10);

             if (isNaN(h) || h < 0 || h > 360 ||
                 isNaN(s) || s < 0 || s > 100 ||
                 isNaN(l) || l < 0 || l > 100)
             {
                  if(input.value.length > 0) setError(input);
                  return;
             }
             // Обновляем UI только если все HSL валидны
            const rgb = hslToRgb(h, s, l);
            if (rgb) {
                updateUI(input, rgb.r, rgb.g, rgb.b);
            }
        });
    });

    // Копирование в буфер
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetInput = document.getElementById(targetId);
            if (targetInput) {
                let valueToCopy = targetInput.value;
                // Добавляем # для HEX при копировании
                if (targetId === 'hexInput' && valueToCopy) {
                    valueToCopy = '#' + valueToCopy;
                }
                navigator.clipboard.writeText(valueToCopy).then(() => {
                    // Опционально: показать уведомление об успехе
                    const originalText = button.textContent;
                    button.textContent = '✅';
                    setTimeout(() => { button.textContent = originalText; }, 1000);
                }).catch(err => {
                    console.error('Ошибка копирования: ', err);
                    // Опционально: показать уведомление об ошибке
                });
            }
        });
    });

    function updateGradientPreview() {
        const colors = [];
        document.querySelectorAll('.gradient-color-input').forEach(input => {
            colors.push(input.value);
            const hexPreview = input.closest('.color-stop')?.querySelector('.gradient-hex-preview');
            if (hexPreview) {
                hexPreview.value = input.value.toUpperCase();
            }
        });

        // Читаем значение угла из ЧИСЛОВОГО ПОЛЯ
        let angle = parseInt(gradAngleInput.value, 10);

        // Валидация угла
        if (isNaN(angle) || angle < 0) {
            angle = 0;
            // gradAngleInput.value = 0; // Опционально: исправлять некорректный ввод
        } else if (angle > 360) {
            angle = 360;
            // gradAngleInput.value = 360; // Опционально
        }

        // Синхронизируем ползунок с числовым полем (если изменилось числовое поле)
        // Это важно, чтобы ползунок отражал значение, введенное вручную
        if (parseInt(gradAngleRange.value, 10) !== angle) {
             gradAngleRange.value = angle;
        }

        // Обновляем UI (как и раньше)
        if (colors.length < 2) {
            gradPreview.style.background = '#ccc';
            gradCssOutput.value = '/* Нужно минимум 2 цвета */';
            return;
        }
        const gradientCss = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
        gradPreview.style.background = gradientCss;
        gradCssOutput.value = `background: ${gradientCss};`;
    }

    // Обработчики для НАЧАЛЬНЫХ элементов градиента
    gradColorInputs.forEach(input => {
        input.addEventListener('input', updateGradientPreview);
    });

    // Обработчик для ПОЛЗУНКА угла
    gradAngleRange.addEventListener('input', () => {
        // Обновляем числовое поле при движении ползунка
        gradAngleInput.value = gradAngleRange.value;
        updateGradientPreview(); // Обновляем градиент
    });

    // Обработчик для ЧИСЛОВОГО ПОЛЯ угла
    gradAngleInput.addEventListener('input', () => {
        // Просто вызываем обновление, т.к. updateGradientPreview
        // уже читает из gradAngleInput и синхронизирует ползунок
        updateGradientPreview();
    });

    // Инициализация градиента при загрузке
    function initializeGradient() {
        // Устанавливаем начальные значения для обоих инпутов угла
        const initialAngle = 90;
        gradAngleRange.value = initialAngle;
        gradAngleInput.value = initialAngle;
        updateGradientPreview();
    }

    initializeGradient();

    // Обработчики для НАЧАЛЬНЫХ элементов градиента
    gradColorInputs.forEach(input => {
        input.addEventListener('input', updateGradientPreview);
    });
    gradAngleInput.addEventListener('input', updateGradientPreview);


    // Инициализация градиента при загрузке
    updateGradientPreview();

    // ----- Инициализация -----
    function initialize() {
        const initialHex = "#1580FA"; // Используем HEX для инициализации
        colorPickerInput.value = initialHex; // Устанавливаем начальное значение пикера
        const initialRgb = hexToRgb(initialHex);
        if (initialRgb) {
             updateUI(null, initialRgb.r, initialRgb.g, initialRgb.b);
        }
    }

    initialize();

});