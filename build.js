const fs = require('fs');
const path = require('path');

// Простая минификация CSS
function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Удаляем комментарии
        .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
        .replace(/\s*{\s*/g, '{') // Убираем пробелы вокруг {
        .replace(/\s*}\s*/g, '}') // Убираем пробелы вокруг }
        .replace(/\s*:\s*/g, ':') // Убираем пробелы вокруг :
        .replace(/\s*;\s*/g, ';') // Убираем пробелы вокруг ;
        .replace(/\s*,\s*/g, ',') // Убираем пробелы вокруг ,
        .replace(/;\s*}/g, '}') // Убираем ; перед }
        .trim();
}

// Простая минификация JS
function minifyJS(js) {
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '') // Удаляем многострочные комментарии
        .replace(/\/\/.*$/gm, '') // Удаляем однострочные комментарии
        .replace(/\s+/g, ' ') // Заменяем множественные пробелы на один
        .replace(/\s*{\s*/g, '{') // Убираем пробелы вокруг {
        .replace(/\s*}\s*/g, '}') // Убираем пробелы вокруг }
        .replace(/\s*:\s*/g, ':') // Убираем пробелы вокруг :
        .replace(/\s*;\s*/g, ';') // Убираем пробелы вокруг ;
        .replace(/\s*,\s*/g, ',') // Убираем пробелы вокруг ,
        .replace(/\s*\(\s*/g, '(') // Убираем пробелы вокруг (
        .replace(/\s*\)\s*/g, ')') // Убираем пробелы вокруг )
        .replace(/\s*\[\s*/g, '[') // Убираем пробелы вокруг [
        .replace(/\s*\]\s*/g, ']') // Убираем пробелы вокруг ]
        .trim();
}

// Функция для обработки файлов
function processFile(filePath, minifyFunction) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const minified = minifyFunction(content);
        const dir = path.dirname(filePath);
        const ext = path.extname(filePath);
        const name = path.basename(filePath, ext);
        const minPath = path.join(dir, `${name}.min${ext}`);
        
        fs.writeFileSync(minPath, minified);
        console.log(`✅ Минифицирован: ${filePath} -> ${minPath}`);
        
        // Показываем размеры файлов
        const originalSize = fs.statSync(filePath).size;
        const minifiedSize = fs.statSync(minPath).size;
        const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        
        console.log(`   Размер: ${originalSize} -> ${minifiedSize} байт (экономия: ${savings}%)`);
        
    } catch (error) {
        console.error(`❌ Ошибка при обработке ${filePath}:`, error.message);
    }
}

// Функция для рекурсивного поиска файлов
function findFiles(dir, extensions) {
    const files = [];
    
    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                traverse(fullPath);
            } else if (stat.isFile()) {
                const ext = path.extname(item);
                if (extensions.includes(ext)) {
                    files.push(fullPath);
                }
            }
        }
    }
    
    traverse(dir);
    return files;
}

// Основная функция
function build() {
    console.log('🚀 Начинаем минификацию...\n');
    
    // Минифицируем CSS файлы
    console.log('📝 Обрабатываем CSS файлы:');
    const cssFiles = findFiles('./assets/css', ['.css']);
    for (const file of cssFiles) {
        if (!file.includes('.min.css')) { // Пропускаем уже минифицированные
            processFile(file, minifyCSS);
        }
    }
    
    console.log('\n📝 Обрабатываем JS файлы:');
    const jsFiles = findFiles('./assets/js', ['.js']);
    for (const file of jsFiles) {
        if (!file.includes('.min.js')) { // Пропускаем уже минифицированные
            processFile(file, minifyJS);
        }
    }
    
    console.log('\n✅ Минификация завершена!');
}

// Запускаем если файл вызван напрямую
if (require.main === module) {
    build();
}

module.exports = { build, minifyCSS, minifyJS }; 