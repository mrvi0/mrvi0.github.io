// assets/js/colorify-script.js
document.addEventListener('DOMContentLoaded', () => {

    // ==================================================
    // ===== ФУНКЦИИ КОНВЕРТАЦИИ (Общие) ==============
    // ==================================================
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        if (!/^[a-fA-F0-9]{3,6}$/.test(hex)) return null;
        if (hex.length === 3) hex = hex.split('').map(char => char + char).join('');
        if (hex.length !== 6) return null;
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    function rgbToHex(r, g, b) {
        if ([r, g, b].some(val => val < 0 || val > 255 || isNaN(val) || val === null || val === undefined)) return null;
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }

    function rgbToHsl(r, g, b) { // Возвращает H: 0-360, S: 0-100, L: 0-100
        if ([r, g, b].some(val => val < 0 || val > 255 || isNaN(val) || val === null || val === undefined)) return null;
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) { h = s = 0; }
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                // Добавим default на всякий случай, хотя не должен сработать
                default: h = 0; break;
            }
            h /= 6;
        }
        h = Math.round(h * 360); s = Math.round(s * 100); l = Math.round(l * 100);
        return { h, s, l };
    }

    function hslToRgb(h, s, l) { // Принимает H: 0-360, S: 0-100, L: 0-100
         if ([h, s, l].some(val => isNaN(val)) || h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
        h /= 360; s /= 100; l /= 100; let r, g, b;
        if (s === 0) { r = g = b = l; }
        else {
            const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
        }
        r = Math.round(r * 255); g = Math.round(g * 255); b = Math.round(b * 255);
        return { r, g, b };
    }

    function parseRgba(rgbaString) {
        const match = rgbaString.match(/rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([0-9.]+))?\)/i);
        if (!match) return null;
        return {
            r: parseInt(match[1], 10), g: parseInt(match[2], 10), b: parseInt(match[3], 10),
            a: match[4] !== undefined ? parseFloat(match[4]) : 1,
        };
    }

    function parseHsla(hslaString) {
         const match = hslaString.match(/hsla?\((\d{1,3}),\s*(\d{1,3})%?,\s*(\d{1,3})%?(?:,\s*([0-9.]+))?\)/i);
         if (!match) return null;
         return {
             h: parseInt(match[1], 10), s: parseInt(match[2], 10), l: parseInt(match[3], 10),
             a: match[4] !== undefined ? parseFloat(match[4]) : 1,
         };
    }

    function rgbaToHex(r, g, b, a = 1) {
         if (a < 1) return null;
         return rgbToHex(r,g,b);
    }

    function rgbaToHsla(r, g, b, a = 1) {
        if ([r, g, b].some(val => val < 0 || val > 255 || isNaN(val) || val === null || val === undefined)) return null;
        const hsl = rgbToHsl(r,g,b);
        const safeA = (isNaN(a) || a === null || a === undefined) ? 1 : parseFloat(a.toFixed(2));
        return hsl ? { ...hsl, a: safeA } : null;
    }

    function hslaToRgba(h, s, l, a = 1) {
        if ([h, s, l].some(val => isNaN(val)) || h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
        const rgb = hslToRgb(h,s,l);
        const safeA = (isNaN(a) || a === null || a === undefined) ? 1 : parseFloat(a.toFixed(2));
        return rgb ? { ...rgb, a: safeA } : null;
    }

    function hslaToHex(h, s, l, a = 1) {
        if (a < 1) return null;
        const rgb = hslToRgb(h,s,l);
        return rgb ? rgbToHex(rgb.r, rgb.g, rgb.b) : null;
    }

    function hexToRgba(hex) {
        const rgb = hexToRgb(hex);
        return rgb ? { ...rgb, a: 1} : null;
    }

    function hexToHsla(hex) {
        const rgb = hexToRgb(hex);
        if(!rgb) return null;
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        return hsl ? { ...hsl, a: 1 } : null;
    }

    // ==================================================
    // ===== ЛОГИКА КОНВЕРТЕРА ЦВЕТОВ (Секция 1) ======
    // ==================================================
    function initColorConverter() {
        const pickerInput = document.getElementById('converterColorPickerInput');
        const hexInput = document.getElementById('converterHexInput');
        const rInput = document.getElementById('converterRInput');
        const gInput = document.getElementById('converterGInput');
        const bInput = document.getElementById('converterBInput');
        const aInput = document.getElementById('converterAInput'); // Alpha input RGB
        const hInput = document.getElementById('converterHInput');
        const sInput = document.getElementById('converterSInput');
        const lInput = document.getElementById('converterLInput');
        const alphaInput = document.getElementById('converterAlphaInput'); // Alpha input HSL
        const rgbaOutput = document.getElementById('converterRgbaOutput');
        const hslaOutput = document.getElementById('converterHslaOutput');
        const colorPreviewBg = document.getElementById('converter-color-preview')?.querySelector('.color-layer');
        const converterCopyButtons = document.querySelectorAll('#color-converter-section .copy-button');

        function updateConverterUI(rgba, source = null) {
            if (!rgba || typeof rgba.r !== 'number') { return; } // Защита

            const { r, g, b } = rgba;
            let a = (rgba.a === undefined || rgba.a === null || isNaN(rgba.a)) ? 1 : parseFloat(rgba.a.toFixed(2));
            if (a < 0) a = 0; if (a > 1) a = 1; // Валидация Alpha

            const hsla = rgbaToHsla(r, g, b, a);
            const hex = rgbaToHex(r, g, b, a);

            if (colorPreviewBg) colorPreviewBg.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;

            if (source !== hexInput) {
                hexInput.value = hex ? hex.substring(1) : '';
                hexInput.disabled = (a < 1);
            }

            if (source !== rInput) rInput.value = r;
            if (source !== gInput) gInput.value = g;
            if (source !== bInput) bInput.value = b;
            if (source !== aInput) aInput.value = a;
            rgbaOutput.value = `rgba(${r}, ${g}, ${b}, ${a})`;

            if (hsla) {
                if (source !== hInput) hInput.value = hsla.h;
                if (source !== sInput) sInput.value = hsla.s;
                if (source !== lInput) lInput.value = hsla.l;
                if (source !== alphaInput) alphaInput.value = hsla.a;
                hslaOutput.value = `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`;
            } else {
                if (source !== hInput) hInput.value = ''; if (source !== sInput) sInput.value = '';
                if (source !== lInput) lInput.value = ''; if (source !== alphaInput) alphaInput.value = '';
                hslaOutput.value = '';
            }

            if (source !== pickerInput && hex) pickerInput.value = hex;
        }

        pickerInput.addEventListener('input', (e) => {
            const rgba = hexToRgba(e.target.value);
            if (rgba) updateConverterUI(rgba, pickerInput);
        });

        hexInput.addEventListener('input', () => {
            const rgba = hexToRgba('#' + hexInput.value);
            if (rgba) updateConverterUI(rgba, hexInput);
        });

        [rInput, gInput, bInput, aInput].forEach(input => {
            input.addEventListener('input', () => {
                const r = parseInt(rInput.value, 10);
                const g = parseInt(gInput.value, 10);
                const b = parseInt(bInput.value, 10);
                let a = parseFloat(aInput.value);
                if (isNaN(a)) a = 1; // Если Alpha не число, считаем 1
                if (a < 0) a = 0; if (a > 1) a = 1;

                if ([r, g, b].some(val => isNaN(val) || val < 0 || val > 255)) return;
                updateConverterUI({ r, g, b, a: parseFloat(a.toFixed(2)) }, input);
            });
        });

         [hInput, sInput, lInput, alphaInput].forEach(input => {
            input.addEventListener('input', () => {
                const h = parseInt(hInput.value, 10);
                const s = parseInt(sInput.value, 10);
                const l = parseInt(lInput.value, 10);
                let a = parseFloat(alphaInput.value);
                 if (isNaN(a)) a = 1;
                 if (a < 0) a = 0; if (a > 1) a = 1;

                 if (isNaN(h) || h < 0 || h > 360 || isNaN(s) || s < 0 || s > 100 || isNaN(l) || l < 0 || l > 100) return;
                const rgba = hslaToRgba(h, s, l, parseFloat(a.toFixed(2)));
                if (rgba) updateConverterUI(rgba, input);
            });
        });

        // Инициализация конвертера
        const initialRgba = { r: 21, g: 128, b: 250, a: 1 };
        updateConverterUI(initialRgba);
    }

    // ==================================================
    // ===== ЛОГИКА ГЕНЕРАТОРА ГРАДИЕНТОВ (Секция 2) ====
    // ==================================================
    function initGradientGenerator() {
        const gradContainer = document.getElementById('gradientStopsList');
        const gradStopTemplate = document.getElementById('gradient-stop-list-item-template');
        const addGradColorButton = document.getElementById('addGradientColorButton');
        const gradAngleRange = document.getElementById('gradientAngleRange');
        const gradAngleInput = document.getElementById('gradientAngleInput');
        const gradPreviewBar = document.getElementById('gradient-preview-bar');
        const gradCssOutput = document.getElementById('gradientCssOutput');
        const gradCopyCssButton = document.querySelector('.gradient-output-area .copy-button');


        let gradientStops = []; // Массив { id: number, color: "#hex", position: number, element: liElement }
        let nextStopId = 0;

        function getGradientStopsData() {
             // Просто возвращает текущее состояние массива
             return [...gradientStops]; // Возвращаем копию
        }

        function updateGradientPreviewAndCss() {
            const currentStops = getGradientStopsData(); // Получаем текущие стопы
 
            // --- Сортировка ТОЛЬКО для генерации CSS ---
            const stopsForCss = [...currentStops]; // Копируем для сортировки
            if (stopsForCss.length > 2) {
                const first = stopsForCss.shift();
                const last = stopsForCss.pop();
                stopsForCss.sort((a, b) => a.position - b.position);
                stopsForCss.unshift(first);
                stopsForCss.push(last);
            }
            // --- КОНЕЦ СОРТИРОВКИ ДЛЯ CSS ---
 
            // Обновляем ТОЛЬКО значения позиции в существующих инпутах (на случай валидации)
            currentStops.forEach(stop => {
                 if(stop.element.dataset.isEndpoint !== 'true'){
                     const posInput = stop.element.querySelector('.stop-position-input');
                     if(posInput) posInput.value = stop.position;
                  }
            });
 
 
            let angle = parseInt(gradAngleInput.value, 10);
            if (isNaN(angle) || angle < 0) angle = 0; else if (angle > 360) angle = 360;
            if (parseInt(gradAngleRange.value, 10) !== angle) gradAngleRange.value = angle;
            gradAngleInput.value = angle;
 
 
            if (currentStops.length < 2) { // Используем оригинальный массив для проверки длины
                gradPreviewBar.style.background = '#ccc';
                gradCssOutput.value = '/* Нужно минимум 2 цвета */';
                return;
            }
 
            // Формируем CSS строку с позициями ИЗ ОТСОРТИРОВАННОГО МАССИВА
            const colorStopsString = stopsForCss.map(stop => `${stop.color} ${stop.position}%`).join(', ');
            const gradientCss = `linear-gradient(${angle}deg, ${colorStopsString})`;
 
            gradPreviewBar.style.background = gradientCss;
            gradCssOutput.value = `background: ${gradientCss};`;
        }

        function createStopElement(color = '#FFFFFF', position = 50, isEndpoint = false) {
            if (!gradStopTemplate) return null;
            const id = nextStopId++;
            const clone = gradStopTemplate.content.cloneNode(true);
            const listItem = clone.querySelector('.gradient-stop-item');
            const colorInput = clone.querySelector('.stop-color-input');
            const hexLabel = clone.querySelector('.stop-hex-label');
            const posInput = clone.querySelector('.stop-position-input');
            const removeButton = clone.querySelector('.remove-stop-button');

            listItem.dataset.id = id;
            listItem.dataset.isEndpoint = isEndpoint;
            colorInput.value = color;
            hexLabel.textContent = color.toUpperCase();
            posInput.value = position;

            if (isEndpoint) {
                posInput.disabled = true;
                if (removeButton) removeButton.remove();
            } else {
                posInput.addEventListener('input', (e) => handleStopPositionInputChange(e, id));
                if (removeButton) removeButton.addEventListener('click', (e) => { e.stopPropagation(); removeStop(id); });
            }
            colorInput.addEventListener('input', (e) => handleStopColorInputChange(e, id));

            return { id, color, position, element: listItem };
        }

        function addStop() {
            console.log('Add Stop button clicked'); // Диагностика
            if (!gradStopTemplate) {
                console.error("Template not found!");
                return;
            }
    
            const stopsCount = gradientStops.length;
            if (stopsCount < 2) {
                 console.error("Cannot add stop if less than 2 stops exist.");
                 return;
            }
    
            let defaultPosition = 50;
            const prevStopData = gradientStops[stopsCount - 2]; // Предпоследний стоп
            if (prevStopData) {
                 defaultPosition = Math.round(prevStopData.position + (100 - prevStopData.position) / 2);
            }
            if(defaultPosition >= 100) defaultPosition = 99; // Гарантируем < 100
    
            const newStopData = createStopElement('#EEEEEE', defaultPosition, false);
            if (!newStopData || !newStopData.element) {
                console.error("Failed to create new stop element");
                return;
            }
    
            // Вставляем перед последним элементом в DOM
            const lastStopData = gradientStops[gradientStops.length - 1];
            if (lastStopData && lastStopData.element) {
                 // Используем try-catch на случай проблем с insertBefore
                 try {
                     // Используем ПРАВИЛЬНОЕ имя: gradContainer
                    gradContainer.insertBefore(newStopData.element, lastStopData.element);
                 } catch (e) {
                     console.error("Error inserting stop element:", e);
                     // Как fallback, просто добавляем в конец контейнера (но до последнего стопа)
                     // Используем ПРАВИЛЬНОЕ имя: gradContainer
                     gradContainer.appendChild(newStopData.element);
                     // Используем ПРАВИЛЬНОЕ имя: gradContainer
                     gradContainer.appendChild(lastStopData.element); // Перемещаем последний в конец
                 }
            } else {
                console.error("Cannot find last stop element to insert before.");
                 // Используем ПРАВИЛЬНОЕ имя: gradContainer
                gradContainer.appendChild(newStopData.element);
            }
    
            gradientStops.splice(stopsCount - 1, 0, newStopData); // Вставляем в массив
    
            gradientStops.forEach((stop, index) => stop.element.dataset.index = index);
            updateGradientPreviewAndCss();
        }

        function removeStop(idToRemove) {
             const indexToRemove = gradientStops.findIndex(s => s.id === idToRemove);
             if (indexToRemove <= 0 || indexToRemove >= gradientStops.length - 1) return;
             const stopData = gradientStops[indexToRemove];
             stopData.element.remove();
             gradientStops.splice(indexToRemove, 1);
             gradientStops.forEach((stop, index) => stop.element.dataset.index = index);
             updateGradientPreviewAndCss();
        }

        function handleStopColorInputChange(event, stopId) {
             const newColor = event.target.value;
             const stopData = gradientStops.find(s => s.id === stopId);
             if (stopData) {
                 stopData.color = newColor;
                 const hexLabel = stopData.element.querySelector('.stop-hex-label');
                 if (hexLabel) hexLabel.textContent = newColor.toUpperCase();
                 updateGradientPreviewAndCss();
             }
         }

         function handleStopPositionInputChange(event, stopId) {
              let newPos = parseInt(event.target.value, 10);
              if (isNaN(newPos) || newPos < 1) newPos = 1; if (newPos > 99) newPos = 99;
              event.target.value = newPos;
              const stopData = gradientStops.find(s => s.id === stopId);
              if (stopData) { stopData.position = newPos; updateGradientPreviewAndCss(); }
          }

        addGradColorButton.addEventListener('click', addStop);
        gradAngleRange.addEventListener('input', () => { gradAngleInput.value = gradAngleRange.value; updateGradientPreviewAndCss(); });
        gradAngleInput.addEventListener('input', updateGradientPreviewAndCss);

        function initializeGradientStops() {
            gradientStops = [];
            gradContainer.querySelectorAll('.gradient-stop-item').forEach(li => {
                const colorInput = li.querySelector('.stop-color-input');
                const posInput = li.querySelector('.stop-position-input');
                const removeBtn = li.querySelector('.remove-stop-button');
                const hexLabel = li.querySelector('.stop-hex-label');
                const id = nextStopId++;
                li.dataset.id = id;

                const stopData = {
                   id: id, color: colorInput.value, position: parseInt(posInput.value, 10), element: li
                };
                gradientStops.push(stopData);

                // Навешиваем обработчики на НАЧАЛЬНЫЕ элементы
                colorInput.addEventListener('input', (e) => handleStopColorInputChange(e, id));
                if (li.dataset.isEndpoint !== 'true') { // Только для средних точек
                    if (posInput) posInput.addEventListener('input', (e) => handleStopPositionInputChange(e, id));
                    if (removeBtn) removeBtn.addEventListener('click', (e) => { e.stopPropagation(); removeStop(id); });
                }
           });
           // Обновляем индексы после инициализации
            gradientStops.forEach((stop, index) => stop.element.dataset.index = index);

           // Инициализация угла
           const initialAngle = 90; gradAngleRange.value = initialAngle; gradAngleInput.value = initialAngle;
           updateGradientPreviewAndCss(); // Первичная отрисовка
       }

        initializeGradientStops();
    }

    // ==================================================
    // ===== ОБЩАЯ ИНИЦИАЛИЗАЦИЯ и Копирование ========
    // ==================================================
    initColorConverter();
    initGradientGenerator();

    // Общий обработчик для ВСЕХ кнопок копирования
     document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetInput = document.getElementById(targetId);
            if (!targetInput) return;
            let valueToCopy = targetInput.value; // Работает для input[text], input[readonly], textarea

            // Особый случай для HEX конвертера
            if (targetId === 'converterHexInput' && valueToCopy) {
                 valueToCopy = '#' + valueToCopy;
            }

            navigator.clipboard.writeText(valueToCopy).then(() => {
                const originalText = button.textContent; button.textContent = '✅';
                setTimeout(() => { button.textContent = originalText; }, 1000);
            }).catch(err => console.error('Ошибка копирования: ', err));
        });
    });

}); // Конец DOMContentLoaded