# Mr Vi - Personal Site

Персональный сайт Mr Vi, построенный на Jekyll с терминальным интерфейсом.

## 🚀 Особенности

- **Терминальный дизайн** - уникальный интерфейс в стиле командной строки
- **PWA поддержка** - работает как нативное приложение
- **Адаптивный дизайн** - оптимизирован для всех устройств
- **SEO оптимизация** - готов для поисковых систем
- **Блог** - встроенная система блога
- **Анимации** - плавные переходы и эффекты

## 🛠️ Технологии

- **Jekyll 4.3.0** - генератор статических сайтов
- **HTML5/CSS3** - современная разметка и стили
- **JavaScript** - интерактивность и анимации
- **PWA** - Progressive Web App функциональность
- **Yandex.Metrika** - аналитика

## 📦 Установка и запуск

### Предварительные требования

1. **Ruby** (версия 2.7 или выше)
2. **Bundler**

### Установка

```bash
# Клонируйте репозиторий
git clone https://github.com/mrvi0/mrvi0.github.io.git
cd mrvi0.github.io

# Установите зависимости
bundle install

# Запустите локальный сервер
bundle exec jekyll serve
```

### Сборка для продакшена

```bash
# Сборка сайта
bundle exec jekyll build --baseurl ''

# Или с минификацией
JEKYLL_ENV=production bundle exec jekyll build
```

## 📁 Структура проекта

```
mrvi0.github.io/
├── _layouts/          # Шаблоны страниц
│   └── default.html   # Основной layout
├── _includes/         # Включаемые компоненты
├── _sass/            # SCSS файлы
├── _data/            # Данные сайта
│   ├── navigation.yml # Навигация
│   ├── social.yml    # Социальные сети
│   └── skills.yml    # Навыки
├── _posts/           # Посты блога
├── _pages/           # Страницы
│   ├── about.md      # О себе
│   ├── projects.md   # Проекты
│   ├── blog.md       # Блог
│   └── contact.md    # Контакты
├── assets/           # Статические файлы
│   ├── css/         # CSS файлы
│   │   └── main.css # Основные стили
│   ├── js/          # JavaScript файлы
│   │   └── main.js  # Основной скрипт
│   └── img/         # Изображения
│       ├── favicon.svg
│       └── og-image.svg
├── _config.yml      # Конфигурация Jekyll
├── Gemfile          # Зависимости Ruby
├── manifest.json    # PWA манифест
├── sw.js           # Service Worker
├── offline.html    # Офлайн страница
├── 404.html        # Страница ошибки
└── index.html      # Главная страница
```

## 🎨 Кастомизация

### Цветовая схема

Основные цвета определены в CSS переменных:

```css
:root {
    --bg-color: #0a0a0a;           /* Фон */
    --text-color: #00ff00;         /* Основной текст */
    --link-color: #00ff00;         /* Ссылки */
    --terminal-border: #00ff00;    /* Границы терминала */
}
```

### Добавление новых страниц

1. Создайте файл в папке `_pages/`
2. Добавьте front matter с метаданными
3. Обновите навигацию в `_data/navigation.yml`

### Добавление постов блога

1. Создайте файл в папке `_posts/` с именем `YYYY-MM-DD-title.md`
2. Добавьте front matter с датой и метаданными
3. Напишите контент в markdown

## 🔧 Разработка

### Локальная разработка

```bash
# Запуск с автоматической перезагрузкой
bundle exec jekyll serve --livereload

# Запуск с отладочной информацией
bundle exec jekyll serve --verbose
```

### Плагины

Сайт использует следующие Jekyll плагины:
- `jekyll-feed` - RSS лента
- `jekyll-seo-tag` - SEO оптимизация
- `jekyll-sitemap` - карта сайта

## 📱 PWA функции

- **Офлайн режим** - работает без интернета
- **Установка** - можно установить как приложение
- **Push уведомления** - (в разработке)
- **Кэширование** - быстрая загрузка

## 🚀 Деплой

Сайт автоматически деплоится на GitHub Pages при пуше в ветку `main`.

### Ручной деплой

```bash
# Сборка
bundle exec jekyll build

# Загрузка на сервер
rsync -avz _site/ user@server:/path/to/website/
```

## 📊 Аналитика

Сайт использует Yandex.Metrika для отслеживания посещений.

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE) для деталей.

## 📞 Контакты

- **GitHub**: [@mrvi0](https://github.com/mrvi0)
- **Telegram**: [@B4DCAT](https://t.me/B4DCAT)
- **Email**: contact@mrvi.dev

---

⭐ Если проект вам понравился, поставьте звездочку! 