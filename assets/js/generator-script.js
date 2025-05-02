document.addEventListener('DOMContentLoaded', () => {
    // === DOM Элементы ===
    const inputs = {
        title: document.getElementById('projTitle'),
        badge: { selector: document.getElementById('badgeTypeSelector'), paramsContainer: document.getElementById('badgeParamsContainer'), addButton: document.getElementById('addBadgeButton'), addedArea: document.getElementById('addedBadgesArea') },
        dynamicBlocksContainer: document.getElementById('dynamicBlocksContainer'), addSectionButton: document.getElementById('addSectionButton'), licenseText: document.getElementById('licenseText')
    };
    const previewOutput = document.getElementById('previewOutput');
    const rawMarkdownOutput = document.getElementById('rawMarkdownOutput');
    const copyButton = document.getElementById('copyMdButton');
    const downloadButton = document.getElementById('downloadMdButton');
    const dynamicBlockTemplate = document.getElementById('dynamic-block-template');
    const langButtons = document.querySelectorAll('.lang-button');

    // === СЛОВАРЬ ПЕРЕВОДОВ ===
    const translations = {
        // Ключи интерфейса
        pageTitle: { en: 'Dynamic README Builder | Boost Your GitHub Profile', ru: 'Генератор README.md | Улучшите свой GitHub профиль' },
        headerTitle: { en: '🚀 Dynamic README Builder', ru: '🚀 Генератор README.md' },
        headerSubtitle: { en: 'Create unique and informative README.md!', ru: 'Создавайте уникальные и информативные README.md!' },
        editorTitle: { en: 'Content Editor', ru: 'Редактор Контента' },
        projTitleLabel: { en: 'Project name:', ru: 'Название проекта:' },
        projTitlePlaceholder: { en: 'My Amazing Project', ru: 'Мой Потрясающий Проект' },
        badgeDesignerLegend: { en: 'Badge Designer', ru: 'Конструктор Бейджей' },
        badgeTemplateLabel: { en: 'Badge Template:', ru: 'Шаблон бейджа:' },
        badgeSelectDefault: { en: '-- Select a template --', ru: '-- Выберите шаблон --' },
        badgeParamsPlaceholder: { en: '<i>Select a template to see the options.</i>', ru: '<i>Выберите шаблон, чтобы увидеть параметры.</i>' },
        addBadgeButton: { en: 'Add a badge to the list', ru: 'Добавить Бейдж в список' },
        addedBadgesLabel: { en: 'Badges (Markdown):', ru: 'Бейджи (Markdown):' },
        hint: { en: 'Hint', ru: 'Подсказка' }, // Текст для самого триггера
        // Ключ для тултипа бейджей (можно оставить без перевода или добавить)
        // badgesHintTooltip: { en: '<p>Paste Markdown...</p>', ru: '<p>Вставьте Markdown...</p>' },
        addedBadgesPlaceholder: { en: 'Badges of your project...', ru: 'Бейджи вашего проекта...' },
        customSectionsTitle: { en: 'Custom Sections', ru: 'Кастомные Секции' },
        addSectionButton: { en: 'Add A New Section', ru: 'Добавить Новую Секцию' },
        licenseTextLabel: { en: 'The text of the License section:', ru: 'Текст раздела Лицензия:' },
        licenseTextPlaceholder: { en: 'MIT / See the badge above / See the LICENSE file', ru: 'MIT / Смотрите бейдж выше / См. файл LICENSE' },
        adTitle: { en: '✨ Support Development / Useful Resources ✨', ru: '✨ Поддержите Разработку / Полезные Ресурсы ✨' },
        adHostingStrong: { en: '🚀 Need reliable hosting?', ru: '🚀 Нужен надежный хостинг?' },
        adHostingTry: { en: 'Try', ru: 'Попробуйте' },
        adSupportNote: { en: '(Using partner links helps us keep this tool free. Thank you!)', ru: '(Использование ссылок партнеров помогает нам поддерживать этот инструмент бесплатным. Спасибо!)' },
        copyButton: { en: 'Copy Markdown', ru: 'Копировать Markdown' },
        downloadButton: { en: 'Download .md', ru: 'Скачать .md' },
        previewTitle: { en: 'Preview README.md', ru: 'Предпросмотр README.md' },
        generatedTitle: { en: 'Generated Markdown', ru: 'Сгенерированный Markdown' },
        // --- Переводы для шаблона ---
        moveUpTooltip: { en: 'Move up', ru: 'Переместить вверх' },
        moveDownTooltip: { en: 'Move down', ru: 'Переместить вниз' },
        removeSectionTooltip: { en: 'Remove section', ru: 'Удалить секцию' },
        sectionTitleLabel: { en: 'Section heading (H2):', ru: 'Заголовок секции (H2):' },
        selectEmojiTooltip: { en: 'Select Emoji', ru: 'Выберите Emoji' },
        emojiNone: { en: 'No', ru: 'Нет' },
        sectionTitlePlaceholder: { en: 'Section name', ru: 'Название секции' },
        sectionContentLabel: { en: 'Section Content:', ru: 'Содержимое секции:' },
        sectionContentPlaceholder: { en: 'Write the contents of the section here...', ru: 'Напишите здесь содержимое секции...' },
        // Дефолтные значения и сообщения
        projTitleDefault: { en: 'Project Title', ru: 'Название Проекта' },
        sectionTitleDefault: { en: 'Section', ru: 'Секция' },
        licenseSectionTitle: { en: 'License', ru: 'Лицензия' },
        badgeParamsNoneNeeded: { en: 'No parameters required.', ru: 'Параметры не требуются.' },
        markdownRenderError: { en: 'Markdown Rendering Error:', ru: 'Ошибка рендеринга Markdown:' },
        copiedSuccess: { en: 'Copied!', ru: 'Скопировано!' },
        copyError: { en: 'Copy Error', ru: 'Ошибка копирования' },
        copyManual: { en: 'Failed to copy. Please copy manually.', ru: 'Не удалось скопировать. Пожалуйста, скопируйте вручную.' },
        downloadError: { en: 'Failed to create download file.', ru: 'Не удалось создать файл для скачивания.' },
        footerMadeWith: { en: 'Dynamic README Builder - Made with ❤️ and a little Gemini', ru: 'Dynamic README Builder - Сделано с ❤️ и немного Gemini' },
    };

    // === ОПРЕДЕЛЕНИЕ ЯЗЫКА ===
    let currentLang = localStorage.getItem('preferredLang') || 'en'; // Английский по умолчанию
    if (currentLang !== 'en' && currentLang !== 'ru') {
        currentLang = 'en';
    }

    // === ФУНКЦИЯ ПЕРЕВОДА ===
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLang', lang);
        document.documentElement.lang = lang;

        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Переводим ВСЕ элементы с атрибутами
        const elements = document.querySelectorAll('[data-translate-key], [data-translate-placeholder-key], [data-translate-title]');
        elements.forEach(el => {
            translateElement(el, lang);
        });

        // Обновляем параметры бейджей, если выбраны
        displayBadgeParams();

        updatePreview();
    }

    // **ИСПРАВЛЕННАЯ** вспомогательная функция для перевода одного элемента
    function translateElement(el, lang) {
         const key = el.dataset.translateKey;
         const placeholderKey = el.dataset.translatePlaceholderKey;
         const titleKey = el.dataset.translateTitle;

         // Перевод основного текста/HTML
         if (key && translations[key]) {
            const translation = translations[key][lang] || translations[key]['en']; // Получаем нужный перевод

            // СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ ТРИГГЕРА ТУЛТИПА
            if (el.classList.contains('tooltip-trigger')) {
                // Ищем первый текстовый узел внутри span и заменяем его содержимое
                for (let i = 0; i < el.childNodes.length; i++) {
                    if (el.childNodes[i].nodeType === Node.TEXT_NODE) {
                        el.childNodes[i].nodeValue = translation; // Меняем только текст "Hint"/"Подсказка"
                        break; // Нашли и изменили, выходим
                    }
                }
                // Если текстового узла нет (маловероятно), можно добавить
                // else { el.insertBefore(document.createTextNode(translation), el.firstChild); }
            }
            // Обработка для всех остальных элементов
            else {
                 if (translation.includes('<')) { // Если перевод содержит HTML
                     el.innerHTML = translation;
                 } else {
                     el.textContent = translation;
                 }
            }
         }
         // Перевод плейсхолдера
         if (placeholderKey && translations[placeholderKey]) {
             el.placeholder = translations[placeholderKey][lang] || translations[placeholderKey]['en'];
         }
         // Перевод title
         if (titleKey && translations[titleKey]) {
            el.title = translations[titleKey][lang] || translations[titleKey]['en'];
         }
    }

    // === ОПИСАНИЯ ТИПОВ БЕЙДЖЕЙ ===
    const badgeDefinitions = { /* ... Полный объект badgeDefinitions ... */
        simple: { name: "Static", params: [ { id: 'l', label: 'Label', placeholder: 'label' }, { id: 'm', label: 'Message', placeholder: 'message' }, { id: 'c', label: 'Color', placeholder: 'blue' }, { id: 's', label: 'Style', placeholder: 'flat-square'}, { id: 'logo', label: 'Logo', placeholder: 'github' }, { id: 'link', label: 'Link URL', placeholder: 'https://...' } ], generate: (p) => { const l=p.l||'', m=p.m||'', c=p.c||'lightgrey', s=p.s?`style=${encodeURIComponent(p.s)}`:'style=flat-square', o=p.logo?`&logo=${encodeURIComponent(p.logo)}&logoColor=white`:'', u=`https://img.shields.io/badge/${encodeURIComponent(l)}-${encodeURIComponent(m)}-${encodeURIComponent(c)}.svg?${s}${o}`, a=l||m||'badge'; return p.link?`[![${a}](${u})](${p.link})`:`![${a}](${u})`; } },
        custom_url: { name: "Own Image URL", params: [ { id: 'img', label: 'Badge Image URL', placeholder: 'https://img.shields.io/...' }, { id: 'alt', label: 'Alt text', placeholder: 'Description' }, { id: 'link', label: 'Link URL', placeholder: 'https://...' } ], generate: (p) => { if (!p.img) return '<!--? Image URL -->'; const a = p.alt || 'Badge'; return p.link ? `[![${a}](${p.img})](${p.link})` : `![${a}](${p.img})`; } },
        github_license: { name: "License", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![License](https://img.shields.io/github/license/${p.u}/${p.r}?style=flat-square)](https://github.com/${p.u}/${p.r}/blob/main/LICENSE)`; } },
        github_actions: { name: "Actions status", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' }, { id: 'w', label: 'Workflow File', placeholder: 'ci.yml' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.u||!p.r||!p.w) return '<!--? User, Repo, Workflow -->'; const bq=p.b?`?branch=${encodeURIComponent(p.b)}`:'', wf=encodeURIComponent(p.w), u=`https://img.shields.io/github/actions/workflow/status/${p.u}/${p.r}/${wf}${bq}&style=flat-square`, l=`https://github.com/${p.u}/${p.r}/actions/workflows/${wf}`; return `[![${p.w}](${u})](${l})`; } },
        github_issues: { name: "Issues", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub issues](https://img.shields.io/github/issues/${p.u}/${p.r}?style=flat-square)](https://github.com/${p.u}/${p.r}/issues)`; } },
        github_prs: { name: "Pull Requests", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub PRs](https://img.shields.io/github/issues-pr/${p.u}/${p.r}?style=flat-square)](https://github.com/${p.u}/${p.r}/pulls)`; } },
        github_stars: { name: "Stars", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub stars](https://img.shields.io/github/stars/${p.u}/${p.r}?style=social)](https://github.com/${p.u}/${p.r}/stargazers)`; } },
        github_forks: { name: "Forks", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub forks](https://img.shields.io/github/forks/${p.u}/${p.r}?style=social)](https://github.com/${p.u}/${p.r}/network)`; } },
        github_watchers: { name: "Watchers", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub watchers](https://img.shields.io/github/watchers/${p.u}/${p.r}?style=social)](https://github.com/${p.u}/${p.r}/watchers)`; } },
        github_last_commit: { name: "Last commit", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `![GitHub last commit](https://img.shields.io/github/last-commit/${p.u}/${p.r}${p.b?'/'+p.b:''}?style=flat-square)`; } },
        github_release: { name: "Latest release", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub release (latest by date)](https://img.shields.io/github/v/release/${p.u}/${p.r}?style=flat-square)](https://github.com/${p.u}/${p.r}/releases/latest)`; } },
        github_contributors: { name: "Contributors", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub contributors](https://img.shields.io/github/contributors/${p.u}/${p.r}?style=flat-square)](https://github.com/${p.u}/${p.r}/graphs/contributors)`; } },
        github_repo_size: { name: "Repository size", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `![GitHub repo size](https://img.shields.io/github/repo-size/${p.u}/${p.r}?style=flat-square)`; } },
        github_downloads: { name: "Release Downloads", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![Github All Releases](https://img.shields.io/github/downloads/${p.u}/${p.r}/total?style=flat-square)](https://github.com/${p.u}/${p.r}/releases)`; } },
        npm_version: { name: "Version", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![npm version](https://img.shields.io/npm/v/${P}?style=flat-square)](https://www.npmjs.com/package/${P})`; } },
        npm_downloads_m: { name: "Downloads (month)", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![npm downloads](https://img.shields.io/npm/dm/${P}?style=flat-square)](https://www.npmjs.com/package/${P})`; } },
        npm_downloads_w: { name: "Downloads (week)", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![npm downloads](https://img.shields.io/npm/dw/${P}?style=flat-square)](https://www.npmjs.com/package/${P})`; } },
        npm_downloads_y: { name: "Downloads (year)", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![npm downloads](https://img.shields.io/npm/dy/${P}?style=flat-square)](https://www.npmjs.com/package/${P})`; } },
        npm_license: { name: "License", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; return `![npm license](https://img.shields.io/npm/l/${encodeURIComponent(p.pkg)}?style=flat-square)`; } },
        bundlephobia_minzip: { name: "Size (minzip)", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/${P}?style=flat-square)](https://bundlephobia.com/package/${P})`; } },
        bundlephobia_min: { name: "Size (min)", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![Bundlephobia](https://img.shields.io/bundlephobia/min/${P}?style=flat-square)](https://bundlephobia.com/package/${P})`; } },
        codecov: { name: "Codecov Coverage", params: [ { id: 's', label: 'Service (github, ...)', placeholder: 'github'}, { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.s||!p.u||!p.r) return '<!--? Service, User, Repo -->'; return `[![codecov](https://img.shields.io/codecov/c/${p.s}/${p.u}/${p.r}?style=flat-square)](https://codecov.io/${p.s}/${p.u}/${p.r})`; } },
        codefactor: { name: "CodeFactor Grade", params: [ { id: 'u', label: 'User/Org (GitHub)', placeholder: 'user' }, { id: 'r', label: 'Repo (GitHub)', placeholder: 'repo' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; const br=p.b?`/branch/${p.b}`:''; return `[![CodeFactor](https://www.codefactor.io/repository/github/${p.u}/${p.r}/badge${br}?style=flat-square)](https://www.codefactor.io/repository/github/${p.u}/${p.r}${br})`; } },
        sonar_quality: { name: "SonarQube Quality Gate", params: [ { id: 'h', label: 'Sonar Host URL', placeholder: 'https://sonarcloud.io'}, { id: 'k', label: 'Project Key', placeholder: 'project_key' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.h||!p.k) return '<!--? Host, Key -->'; try { const host=new URL(p.h).hostname; const br=p.b?`&branch=${encodeURIComponent(p.b)}`:''; return `[![Quality Gate Status](https://${host}/api/project_badges/measure?project=${encodeURIComponent(p.k)}&metric=alert_status${br})](https://${host}/dashboard?id=${encodeURIComponent(p.k)})`; } catch { return '<!-- Invalid Host URL -->'; } } },
        travis_ci: { name: "Travis CI", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; const br=p.b?`?branch=${p.b}`:''; return `[![Travis (.com)](https://img.shields.io/travis/com/${p.u}/${p.r}${br}?style=flat-square)](https://app.travis-ci.com/github/${p.u}/${p.r})`; } },
        circle_ci: { name: "CircleCI", params: [ { id: 'vcs', label: 'VCS (github, bitbucket)', placeholder: 'github' }, { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.vcs||!p.u||!p.r) return '<!--? VCS, User, Repo -->'; const br=p.b?`/tree/${p.b}`:''; return `[![CircleCI](https://img.shields.io/circleci/build/${p.vcs}/${p.u}/${p.r}${p.b?`?branch=${p.b}`:''}&style=flat-square)](https://circleci.com/${p.vcs}/${p.u}/${p.r}${br})`; } },
        dep_status: { name: "David DM (Dependencies)", params: [ { id: 'u', label: 'User/Org (GitHub)', placeholder: 'user' }, { id: 'r', label: 'Repo (GitHub)', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![dependencies Status](https://david-dm.org/${p.u}/${p.r}/status.svg)](https://david-dm.org/${p.u}/${p.r})`; } },
        dep_dev_status: { name: "David DM (Dev Dependencies)", params: [ { id: 'u', label: 'User/Org (GitHub)', placeholder: 'user' }, { id: 'r', label: 'Repo (GitHub)', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![devDependencies Status](https://david-dm.org/${p.u}/${p.r}/dev-status.svg)](https://david-dm.org/${p.u}/${p.r}?type=dev)`; } },
        snyk_vulnerabilities: { name: "Snyk Vulnerabilities", params: [ { id: 'u', label: 'User/Org (GitHub)', placeholder: 'user' }, { id: 'r', label: 'Repo (GitHub)', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![Known Vulnerabilities](https://snyk.io/test/github/${p.u}/${p.r}/badge.svg)](https://snyk.io/test/github/${p.u}/${p.r})`; } },
        twitter_follow: { name: "Twitter Follow", params: [ { id: 'user', label: 'Twitter Username', placeholder: 'username' } ], generate: (p) => { if (!p.user) return '<!--? Username -->'; return `[![Twitter Follow](https://img.shields.io/twitter/follow/${encodeURIComponent(p.user)}?style=social)](https://twitter.com/intent/follow?screen_name=${encodeURIComponent(p.user)})`; } },
        patreon: { name: "Patreon", params: [ { id: 'user', label: 'Patreon Username', placeholder: 'username' } ], generate: (p) => { if (!p.user) return '<!--? Username -->'; return `[![Patreon](https://img.shields.io/badge/Patreon-Support-orange?style=flat-square&logo=patreon)](https://patreon.com/${encodeURIComponent(p.user)})`; } },
        opencollective: { name: "Open Collective", params: [ { id: 'collective', label: 'Collective Slug', placeholder: 'collective' } ], generate: (p) => { if (!p.collective) return '<!--? Collective -->'; return `[![Open Collective](https://img.shields.io/opencollective/all/${encodeURIComponent(p.collective)}?style=flat-square&logo=open-collective)](https://opencollective.com/${encodeURIComponent(p.collective)})`; } },
        discord: { name: "Discord", params: [ { id: 'invite', label: 'Invite Code', placeholder: 'inviteCode' } ], generate: (p) => { if (!p.invite) return '<!--? Invite Code -->'; return `[![Discord](https://img.shields.io/discord/${encodeURIComponent(p.invite)}?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/${encodeURIComponent(p.invite)})`; } },
        prs_welcome: { name: "PRs Welcome", params: [], generate: () => `[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)` }

     };

    // === ЛОГИКА КОНСТРУКТОРА БЕЙДЖЕЙ ===
    function displayBadgeParams() {
        const selectedType = inputs.badge.selector.value;
        const definition = badgeDefinitions[selectedType];
        const container = inputs.badge.paramsContainer;
        container.innerHTML = ''; // Очищаем

        if (definition) {
            if (definition.params.length > 0) {
                definition.params.forEach(param => {
                    const group = document.createElement('div');
                    group.className = 'param-group';
                    const label = document.createElement('label');
                    label.htmlFor = param.id;
                    // Пытаемся найти ключ перевода для label, если нет - используем оригинал
                    const labelKey = param.label.toLowerCase().replace(/[^a-z0-9_]/gi, '_'); // Пример генерации ключа
                    label.textContent = (translations[labelKey] && translations[labelKey][currentLang]) || param.label + ':';
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = param.id;
                    input.name = param.id;
                    input.placeholder = param.placeholder || '';
                    group.appendChild(label);
                    group.appendChild(input);
                    container.appendChild(group);
                });
            } else {
                 const noParamsKey = 'badgeParamsNoneNeeded';
                 container.innerHTML = `<p><i>${translations[noParamsKey]?.[currentLang] || 'No parameters required.'}</i></p>`;
            }
            inputs.badge.addButton.disabled = false;
        } else {
             container.innerHTML = translations['badgeParamsPlaceholder']?.[currentLang] || '<i>Select a template to see the options.</i>';
            inputs.badge.addButton.disabled = true;
        }
    }
    function addBadgeToArea() {
        const selectedType = inputs.badge.selector.value;
        const definition = badgeDefinitions[selectedType];
        if (!definition) return;
        const params = {};
        const paramInputs = inputs.badge.paramsContainer.querySelectorAll('input');
        paramInputs.forEach(input => { params[input.id] = input.value.trim(); });
        const markdown = definition.generate(params);
        const currentContent = inputs.badge.addedArea.value;
        inputs.badge.addedArea.value = currentContent + (currentContent ? ' ' : '') + markdown;
        inputs.badge.addedArea.dispatchEvent(new Event('input'));
    }
    inputs.badge.selector.addEventListener('change', displayBadgeParams);
    inputs.badge.addButton.addEventListener('click', addBadgeToArea);

    // === ЛОГИКА ДИНАМИЧЕСКИХ БЛОКОВ ===
    function addSectionBlock() {
        if (!dynamicBlockTemplate) { console.error("Template #dynamic-block-template не найден!"); return; }
        const newBlock = dynamicBlockTemplate.content.cloneNode(true).firstElementChild;

        // Переводим элементы ВНУТРИ нового блока СРАЗУ ПОСЛЕ клонирования
        const elementsToTranslate = newBlock.querySelectorAll('[data-translate-key], [data-translate-placeholder-key], [data-translate-title]');
        elementsToTranslate.forEach(el => translateElement(el, currentLang));

        inputs.dynamicBlocksContainer.appendChild(newBlock);
        attachBlockListeners(newBlock); // Назначаем слушатели ПОСЛЕ перевода
        updatePreview();
    }
    function removeSectionBlock(button) {
        const blockToRemove = button.closest('.dynamic-block');
        if (blockToRemove) { blockToRemove.remove(); updatePreview(); }
    }
    function moveSectionBlockUp(button) {
        const blockToMove = button.closest('.dynamic-block');
        const previousBlock = blockToMove?.previousElementSibling;
        if (previousBlock) { inputs.dynamicBlocksContainer.insertBefore(blockToMove, previousBlock); updatePreview(); }
    }
    function moveSectionBlockDown(button) {
        const blockToMove = button.closest('.dynamic-block');
        const nextBlock = blockToMove?.nextElementSibling;
        if (nextBlock) { inputs.dynamicBlocksContainer.insertBefore(nextBlock, blockToMove); updatePreview(); }
    }

    // ЕДИНСТВЕННАЯ ВЕРСИЯ attachBlockListeners
    function attachBlockListeners(blockElement) {
        const moveUpBtn = blockElement.querySelector('.move-up');
        const moveDownBtn = blockElement.querySelector('.move-down');
        const removeBtn = blockElement.querySelector('.remove-block');
        const emojiSelect = blockElement.querySelector('.section-emoji');
        const titleInput = blockElement.querySelector('.section-title');
        const contentTextarea = blockElement.querySelector('.section-content');

        if (moveUpBtn) moveUpBtn.addEventListener('click', () => moveSectionBlockUp(moveUpBtn));
        if (moveDownBtn) moveDownBtn.addEventListener('click', () => moveSectionBlockDown(moveDownBtn));
        if (removeBtn) removeBtn.addEventListener('click', () => removeSectionBlock(removeBtn));
        if (emojiSelect) emojiSelect.addEventListener('change', updatePreview); // Используем change для select
        if (titleInput) titleInput.addEventListener('input', updatePreview);
        if (contentTextarea) contentTextarea.addEventListener('input', updatePreview);
    }
    inputs.addSectionButton.addEventListener('click', addSectionBlock);
    inputs.dynamicBlocksContainer.querySelectorAll('.dynamic-block').forEach(attachBlockListeners); // Для начальных блоков, если они есть

    // === ГЕНЕРАЦИЯ И ОБНОВЛЕНИЕ README ===
    function generateMarkdown() {
        let md = '';
        const projTitleKey = 'projTitleDefault';
        md += `# ${inputs.title.value.trim() || (translations[projTitleKey]?.[currentLang] || 'Project Title')}\n\n`;
        const badgeMarkdown = inputs.badge.addedArea.value.trim();
        if (badgeMarkdown) { md += `${badgeMarkdown}\n\n`; }
        if (badgeMarkdown || inputs.dynamicBlocksContainer.children.length > 0 || inputs.licenseText.value.trim()) { md += `---\n\n`; }
        const dynamicBlocks = inputs.dynamicBlocksContainer.querySelectorAll('.dynamic-block');
        dynamicBlocks.forEach(block => {
            const emoji = block.querySelector('.section-emoji')?.value || '';
            const title = block.querySelector('.section-title')?.value.trim() || '';
            const content = block.querySelector('.section-content')?.value.trim() || '';
            let sectionTitle = '';
            const defaultSectionTitleKey = 'sectionTitleDefault';
            if (emoji || title) { sectionTitle = `## ${emoji ? emoji + ' ' : ''}${title || (translations[defaultSectionTitleKey]?.[currentLang] || 'Section')}\n\n`; }
            if (sectionTitle || content) { md += sectionTitle; md += `${content}\n\n`; }
        });
        const licenseText = inputs.licenseText.value.trim();
        if (licenseText) {
             if (dynamicBlocks.length > 0) { md += `---\n\n`; }
             const licenseSectionTitleKey = 'licenseSectionTitle';
             md += `## 📜 ${translations[licenseSectionTitleKey]?.[currentLang] || 'License'}\n\n${licenseText}\n`;
        }
        return md.trim();
    }
    function updatePreview() {
        const markdownContent = generateMarkdown();
        rawMarkdownOutput.value = markdownContent;
        try {
             const dirtyHtml = marked.parse(markdownContent);
             const cleanHtml = DOMPurify.sanitize(dirtyHtml, { USE_PROFILES: { html: true } });
             previewOutput.innerHTML = cleanHtml;
        } catch (e) {
             const errorMsgKey = 'markdownRenderError';
             previewOutput.innerHTML = `<p style="color: red; font-weight: bold;">${translations[errorMsgKey]?.[currentLang] || 'Markdown Rendering Error:'}</p><pre>${e.message}</pre>`;
             console.error("Markdown rendering error:", e);
         }
    }

    // === НАЗНАЧЕНИЕ ОБЩИХ ОБРАБОТЧИКОВ СОБЫТИЙ ===
    const allStaticInputs = [ inputs.title, inputs.badge.addedArea, inputs.licenseText ];
    allStaticInputs.forEach(input => { if (input) { input.addEventListener('input', updatePreview); } });

    // === ОБРАБОТЧИКИ КНОПОК ===
    langButtons.forEach(button => { button.addEventListener('click', () => { setLanguage(button.dataset.lang); }); });
    copyButton.addEventListener('click', () => {
        rawMarkdownOutput.select(); rawMarkdownOutput.setSelectionRange(0, 99999); let success = false;
        try { navigator.clipboard.writeText(rawMarkdownOutput.value).then(() => { success = true; }).catch(err => { console.error('Async Clipboard API failed: ', err); }); }
        catch (err) { console.warn('Async Clipboard API not supported:', err); try { success = document.execCommand('copy'); } catch (e) { console.error('execCommand failed: ', e); } }
        const originalText = translations['copyButton'][currentLang] || 'Copy Markdown';
        if (success) { copyButton.textContent = translations['copiedSuccess'][currentLang] || 'Copied!'; }
        else { copyButton.textContent = translations['copyError'][currentLang] || 'Copy Error'; alert(translations['copyManual'][currentLang] || 'Failed to copy. Please copy manually.'); }
        setTimeout(() => { copyButton.textContent = originalText; }, 1500);
    });
    downloadButton.addEventListener('click', () => {
        try {
            const markdownContent = generateMarkdown(); const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.setAttribute('href', url);
            const filenameBase = inputs.title.value.trim().replace(/[^a-z0-9\s_-]/gi, '').replace(/\s+/g, '-') || 'README'; link.setAttribute('download', `${filenameBase.toLowerCase()}.md`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
        } catch (e) { console.error("Download failed:", e); alert(translations['downloadError'][currentLang] || 'Failed to create download file.'); }
    });

    // === ПЕРВОНАЧАЛЬНЫЙ ЗАПУСК ===
    const initialBlock = inputs.dynamicBlocksContainer.querySelector('.dynamic-block');
    if (initialBlock) { initialBlock.remove(); }
    setLanguage(currentLang); // Устанавливаем язык
    displayBadgeParams(); // Инициализация параметров бейджей
    // updatePreview() вызывается внутри setLanguage()
});