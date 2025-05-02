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

    // === ОПИСАНИЯ ТИПОВ БЕЙДЖЕЙ (Значительно расширенный список) ===
    const badgeDefinitions = {
        // Основные
        simple: { name: "Простой (Static)", params: [ { id: 'l', label: 'Текст слева', placeholder: 'label' }, { id: 'm', label: 'Текст справа', placeholder: 'message' }, { id: 'c', label: 'Цвет', placeholder: 'blue' }, { id: 's', label: 'Стиль', placeholder: 'flat-square'}, { id: 'logo', label: 'Лого', placeholder: 'github' }, { id: 'link', label: 'Ссылка URL', placeholder: 'https://...' } ], generate: (p) => { const l=p.l||'', m=p.m||'', c=p.c||'lightgrey', s=p.s?`style=${encodeURIComponent(p.s)}`:'style=flat-square', o=p.logo?`&logo=${encodeURIComponent(p.logo)}&logoColor=white`:'', u=`https://img.shields.io/badge/${encodeURIComponent(l)}-${encodeURIComponent(m)}-${encodeURIComponent(c)}.svg?${s}${o}`, a=l||m||'badge'; return p.link?`[![${a}](${u})](${p.link})`:`![${a}](${u})`; } },
        custom_url: { name: "Своя URL Картинки", params: [ { id: 'img', label: 'URL Картинки Бейджа', placeholder: 'https://img.shields.io/...' }, { id: 'alt', label: 'Alt текст', placeholder: 'Описание' }, { id: 'link', label: 'URL Ссылки', placeholder: 'https://...' } ], generate: (p) => { if (!p.img) return '<!--? URL картинки -->'; const a = p.alt || 'Badge'; return p.link ? `[![${a}](${p.img})](${p.link})` : `![${a}](${p.img})`; } },
        // GitHub
        github_license: { name: "Лицензия", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![License](https://img.shields.io/github/license/${p.u}/${p.r}?style=flat-square)](https://github.com/${p.u}/${p.r}/blob/main/LICENSE)`; } },
        github_actions: { name: "Статус Actions", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' }, { id: 'w', label: 'Workflow File', placeholder: 'ci.yml' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.u||!p.r||!p.w) return '<!--? User, Repo, Workflow -->'; const bq=p.b?`?branch=${encodeURIComponent(p.b)}`:'', wf=encodeURIComponent(p.w), u=`https://img.shields.io/github/actions/workflow/status/${p.u}/${p.r}/${wf}${bq}&style=flat-square`, l=`https://github.com/${p.u}/${p.r}/actions/workflows/${wf}`; return `[![${p.w}](${u})](${l})`; } },
        github_issues: { name: "Issues", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub issues](https://img.shields.io/github/issues/${p.u}/${p.r}?style=flat-square)](https://github.com/${p.u}/${p.r}/issues)`; } },
        github_prs: { name: "Pull Requests", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub PRs](https://img.shields.io/github/issues-pr/${p.u}/${p.r}?style=flat-square)](https://github.com/${p.u}/${p.r}/pulls)`; } },
        github_stars: { name: "Stars", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub stars](https://img.shields.io/github/stars/${p.u}/${p.r}?style=social)](https://github.com/${p.u}/${p.r}/stargazers)`; } }, // Style social
        github_forks: { name: "Forks", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub forks](https://img.shields.io/github/forks/${p.u}/${p.r}?style=social)](https://github.com/${p.u}/${p.r}/network)`; } }, // Style social
        github_watchers: { name: "Watchers", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub watchers](https://img.shields.io/github/watchers/${p.u}/${p.r}?style=social)](https://github.com/${p.u}/${p.r}/watchers)`; } }, // Style social
        github_last_commit: { name: "Последний коммит", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `![GitHub last commit](https://img.shields.io/github/last-commit/${p.u}/${p.r}${p.b?'/'+p.b:''}?style=flat-square)`; } },
        github_release: { name: "Последний релиз", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub release (latest by date)](https://img.shields.io/github/v/release/${p.u}/${p.r}?style=flat-square)](https://github.com/${p.u}/${p.r}/releases/latest)`; } },
        github_contributors: { name: "Контрибьюторы", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![GitHub contributors](https://img.shields.io/github/contributors/${p.u}/${p.r}?style=flat-square)](https://github.com/${p.u}/${p.r}/graphs/contributors)`; } },
        github_repo_size: { name: "Размер репозитория", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `![GitHub repo size](https://img.shields.io/github/repo-size/${p.u}/${p.r}?style=flat-square)`; } },
        github_downloads: { name: "Загрузки релиза", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![Github All Releases](https://img.shields.io/github/downloads/${p.u}/${p.r}/total?style=flat-square)](https://github.com/${p.u}/${p.r}/releases)`; } },
        // NPM
        npm_version: { name: "Версия", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![npm version](https://img.shields.io/npm/v/${P}?style=flat-square)](https://www.npmjs.com/package/${P})`; } },
        npm_downloads_m: { name: "Загрузки (месяц)", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![npm downloads](https://img.shields.io/npm/dm/${P}?style=flat-square)](https://www.npmjs.com/package/${P})`; } },
        npm_downloads_w: { name: "Загрузки (неделя)", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![npm downloads](https://img.shields.io/npm/dw/${P}?style=flat-square)](https://www.npmjs.com/package/${P})`; } },
        npm_downloads_y: { name: "Загрузки (год)", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![npm downloads](https://img.shields.io/npm/dy/${P}?style=flat-square)](https://www.npmjs.com/package/${P})`; } },
        npm_license: { name: "Лицензия", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; return `![npm license](https://img.shields.io/npm/l/${encodeURIComponent(p.pkg)}?style=flat-square)`; } },
        bundlephobia_minzip: { name: "Размер (minzip)", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/${P}?style=flat-square)](https://bundlephobia.com/package/${P})`; } },
        bundlephobia_min: { name: "Размер (min)", params: [ { id: 'pkg', label: 'Package Name', placeholder: 'package' } ], generate: (p) => { if (!p.pkg) return '<!--? Package -->'; const P=encodeURIComponent(p.pkg); return `[![Bundlephobia](https://img.shields.io/bundlephobia/min/${P}?style=flat-square)](https://bundlephobia.com/package/${P})`; } },
        // Качество и CI/CD
        codecov: { name: "Codecov Покрытие", params: [ { id: 's', label: 'Service (github, ...)', placeholder: 'github'}, { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' } ], generate: (p) => { if (!p.s||!p.u||!p.r) return '<!--? Service, User, Repo -->'; return `[![codecov](https://img.shields.io/codecov/c/${p.s}/${p.u}/${p.r}?style=flat-square)](https://codecov.io/${p.s}/${p.u}/${p.r})`; } },
        codefactor: { name: "CodeFactor Grade", params: [ { id: 'u', label: 'User/Org (GitHub)', placeholder: 'user' }, { id: 'r', label: 'Repo (GitHub)', placeholder: 'repo' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; const br=p.b?`/branch/${p.b}`:''; return `[![CodeFactor](https://www.codefactor.io/repository/github/${p.u}/${p.r}/badge${br}?style=flat-square)](https://www.codefactor.io/repository/github/${p.u}/${p.r}${br})`; } },
        sonar_quality: { name: "SonarQube Quality Gate", params: [ { id: 'h', label: 'Sonar Host URL', placeholder: 'https://sonarcloud.io'}, { id: 'k', label: 'Project Key', placeholder: 'project_key' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.h||!p.k) return '<!--? Host, Key -->'; try { const host=new URL(p.h).hostname; const br=p.b?`&branch=${encodeURIComponent(p.b)}`:''; return `[![Quality Gate Status](https://${host}/api/project_badges/measure?project=${encodeURIComponent(p.k)}&metric=alert_status${br})](https://${host}/dashboard?id=${encodeURIComponent(p.k)})`; } catch { return '<!-- Invalid Host URL -->'; } } },
        travis_ci: { name: "Travis CI", params: [ { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; const br=p.b?`?branch=${p.b}`:''; return `[![Travis (.com)](https://img.shields.io/travis/com/${p.u}/${p.r}${br}?style=flat-square)](https://app.travis-ci.com/github/${p.u}/${p.r})`; } },
        circle_ci: { name: "CircleCI", params: [ { id: 'vcs', label: 'VCS (github, bitbucket)', placeholder: 'github' }, { id: 'u', label: 'User/Org', placeholder: 'user' }, { id: 'r', label: 'Repo', placeholder: 'repo' }, { id: 'b', label: 'Branch (opt)', placeholder: 'main' } ], generate: (p) => { if (!p.vcs||!p.u||!p.r) return '<!--? VCS, User, Repo -->'; const br=p.b?`/tree/${p.b}`:''; return `[![CircleCI](https://img.shields.io/circleci/build/${p.vcs}/${p.u}/${p.r}${p.b?`?branch=${p.b}`:''}&style=flat-square)](https://circleci.com/${p.vcs}/${p.u}/${p.r}${br})`; } },
        // Размер и Зависимости
        dep_status: { name: "David DM (Зависимости)", params: [ { id: 'u', label: 'User/Org (GitHub)', placeholder: 'user' }, { id: 'r', label: 'Repo (GitHub)', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![dependencies Status](https://david-dm.org/${p.u}/${p.r}/status.svg)](https://david-dm.org/${p.u}/${p.r})`; } },
        dep_dev_status: { name: "David DM (Dev Зависимости)", params: [ { id: 'u', label: 'User/Org (GitHub)', placeholder: 'user' }, { id: 'r', label: 'Repo (GitHub)', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![devDependencies Status](https://david-dm.org/${p.u}/${p.r}/dev-status.svg)](https://david-dm.org/${p.u}/${p.r}?type=dev)`; } },
        snyk_vulnerabilities: { name: "Snyk Vulnerabilities", params: [ { id: 'u', label: 'User/Org (GitHub)', placeholder: 'user' }, { id: 'r', label: 'Repo (GitHub)', placeholder: 'repo' } ], generate: (p) => { if (!p.u||!p.r) return '<!--? User, Repo -->'; return `[![Known Vulnerabilities](https://snyk.io/test/github/${p.u}/${p.r}/badge.svg)](https://snyk.io/test/github/${p.u}/${p.r})`; } },
        // Социальные и Поддержка
        twitter_follow: { name: "Twitter Follow", params: [ { id: 'user', label: 'Twitter Username', placeholder: 'username' } ], generate: (p) => { if (!p.user) return '<!--? Username -->'; return `[![Twitter Follow](https://img.shields.io/twitter/follow/${encodeURIComponent(p.user)}?style=social)](https://twitter.com/intent/follow?screen_name=${encodeURIComponent(p.user)})`; } },
        patreon: { name: "Patreon", params: [ { id: 'user', label: 'Patreon Username', placeholder: 'username' } ], generate: (p) => { if (!p.user) return '<!--? Username -->'; return `[![Patreon](https://img.shields.io/badge/Patreon-Support-orange?style=flat-square&logo=patreon)](https://patreon.com/${encodeURIComponent(p.user)})`; } },
        opencollective: { name: "Open Collective", params: [ { id: 'collective', label: 'Collective Slug', placeholder: 'collective' } ], generate: (p) => { if (!p.collective) return '<!--? Collective -->'; return `[![Open Collective](https://img.shields.io/opencollective/all/${encodeURIComponent(p.collective)}?style=flat-square&logo=open-collective)](https://opencollective.com/${encodeURIComponent(p.collective)})`; } },
        discord: { name: "Discord", params: [ { id: 'invite', label: 'Invite Code', placeholder: 'inviteCode' } ], generate: (p) => { if (!p.invite) return '<!--? Invite Code -->'; return `[![Discord](https://img.shields.io/discord/${encodeURIComponent(p.invite)}?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/${encodeURIComponent(p.invite)})`; } },
        // Другое
        prs_welcome: { name: "PRs Welcome", params: [], generate: () => `[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)` }
    };


    // === ЛОГИКА КОНСТРУКТОРА БЕЙДЖЕЙ (без изменений) ===
    function displayBadgeParams() { /* ... */
        const selectedType = inputs.badge.selector.value; const definition = badgeDefinitions[selectedType]; const container = inputs.badge.paramsContainer; container.innerHTML = '';
        if (definition) {
            if (definition.params.length > 0) { definition.params.forEach(param => { const group = document.createElement('div'); group.className = 'param-group'; const label = document.createElement('label'); label.htmlFor = param.id; label.textContent = param.label + ':'; const input = document.createElement('input'); input.type = 'text'; input.id = param.id; input.name = param.id; input.placeholder = param.placeholder || ''; group.appendChild(label); group.appendChild(input); container.appendChild(group); }); }
            else { container.innerHTML = '<p><i>Параметры не требуются.</i></p>'; }
            inputs.badge.addButton.disabled = false;
        } else { container.innerHTML = '<p><i>Выберите шаблон.</i></p>'; inputs.badge.addButton.disabled = true; }
    }
    function addBadgeToArea() { /* ... */
        const selectedType = inputs.badge.selector.value; const definition = badgeDefinitions[selectedType]; if (!definition) return;
        const params = {}; const paramInputs = inputs.badge.paramsContainer.querySelectorAll('input'); paramInputs.forEach(input => { params[input.id] = input.value.trim(); });
        const markdown = definition.generate(params); const currentContent = inputs.badge.addedArea.value;
        inputs.badge.addedArea.value = currentContent + (currentContent ? '\n' : '') + markdown;
        inputs.badge.addedArea.dispatchEvent(new Event('input'));
    }
    inputs.badge.selector.addEventListener('change', displayBadgeParams);
    inputs.badge.addButton.addEventListener('click', addBadgeToArea);

    // === ЛОГИКА ДИНАМИЧЕСКИХ БЛОКОВ ===

    // Добавление нового блока секции
    function addSectionBlock() {
        if (!dynamicBlockTemplate) {
            console.error("Template #dynamic-block-template не найден!");
            return;
        }
        // Клонируем шаблон
        const newBlock = dynamicBlockTemplate.content.cloneNode(true).firstElementChild;
        inputs.dynamicBlocksContainer.appendChild(newBlock);
        // Назначаем обработчики на кнопки и инпуты нового блока
        attachBlockListeners(newBlock);
        updatePreview(); // Обновляем предпросмотр
    }

    // Удаление блока секции
    function removeSectionBlock(button) {
        const blockToRemove = button.closest('.dynamic-block');
        if (blockToRemove) {
            blockToRemove.remove();
            updatePreview();
        }
    }

    // Перемещение блока вверх
    function moveSectionBlockUp(button) {
        const blockToMove = button.closest('.dynamic-block');
        const previousBlock = blockToMove?.previousElementSibling;
        if (previousBlock) { // Нельзя двигать самый верхний блок еще выше
            inputs.dynamicBlocksContainer.insertBefore(blockToMove, previousBlock);
            updatePreview();
        }
    }

    // Перемещение блока вниз
    function moveSectionBlockDown(button) {
        const blockToMove = button.closest('.dynamic-block');
        const nextBlock = blockToMove?.nextElementSibling;
        if (nextBlock) { // Нельзя двигать самый нижний блок еще ниже
            // Вставляем следующий блок ПЕРЕД текущим, что эквивалентно перемещению текущего вниз
            inputs.dynamicBlocksContainer.insertBefore(nextBlock, blockToMove);
            updatePreview();
        }
    }

    // Обновлено: Назначаем обработчики и для select emoji
    function attachBlockListeners(blockElement) {
        const moveUpBtn = blockElement.querySelector('.move-up');
        const moveDownBtn = blockElement.querySelector('.move-down');
        const removeBtn = blockElement.querySelector('.remove-block');
        const emojiSelect = blockElement.querySelector('.section-emoji'); // Ищем select
        const titleInput = blockElement.querySelector('.section-title');
        const contentTextarea = blockElement.querySelector('.section-content');

        if (moveUpBtn) moveUpBtn.addEventListener('click', () => moveSectionBlockUp(moveUpBtn));
        if (moveDownBtn) moveDownBtn.addEventListener('click', () => moveSectionBlockDown(moveDownBtn));
        if (removeBtn) removeBtn.addEventListener('click', () => removeSectionBlock(removeBtn));

        // Обновление предпросмотра при изменении инпутов блока
        if (emojiSelect) emojiSelect.addEventListener('change', updatePreview); // Событие change для select
        if (titleInput) titleInput.addEventListener('input', updatePreview);
        if (contentTextarea) contentTextarea.addEventListener('input', updatePreview);
    }
    inputs.addSectionButton.addEventListener('click', addSectionBlock);
    inputs.dynamicBlocksContainer.querySelectorAll('.dynamic-block').forEach(attachBlockListeners);

    // Назначение обработчиков для кнопок и инпутов внутри блока
    function attachBlockListeners(blockElement) {
        const moveUpBtn = blockElement.querySelector('.move-up');
        const moveDownBtn = blockElement.querySelector('.move-down');
        const removeBtn = blockElement.querySelector('.remove-block');
        const emojiInput = blockElement.querySelector('.section-emoji');
        const titleInput = blockElement.querySelector('.section-title');
        const contentTextarea = blockElement.querySelector('.section-content');

        if (moveUpBtn) moveUpBtn.addEventListener('click', () => moveSectionBlockUp(moveUpBtn));
        if (moveDownBtn) moveDownBtn.addEventListener('click', () => moveSectionBlockDown(moveDownBtn));
        if (removeBtn) removeBtn.addEventListener('click', () => removeSectionBlock(removeBtn));

        // Обновление предпросмотра при изменении инпутов блока
        if (emojiInput) emojiInput.addEventListener('input', updatePreview);
        if (titleInput) titleInput.addEventListener('input', updatePreview);
        if (contentTextarea) contentTextarea.addEventListener('input', updatePreview);
    }

    // Назначаем обработчик на кнопку "Добавить Секцию"
    inputs.addSectionButton.addEventListener('click', addSectionBlock);

    // Назначаем обработчики на существующие при загрузке блоки (если они есть)
    inputs.dynamicBlocksContainer.querySelectorAll('.dynamic-block').forEach(attachBlockListeners);


    // === ГЕНЕРАЦИЯ И ОБНОВЛЕНИЕ README ===
    // Обновлено: читаем value из select emoji
    function generateMarkdown() {
        let md = '';
        // 1. Заголовок проекта
        md += `# ${inputs.title.value.trim() || 'Название Проекта'}\n\n`;
        // 2. Бейджи
        const badgeMarkdown = inputs.badge.addedArea.value.trim();
        if (badgeMarkdown) { md += `${badgeMarkdown}\n\n`; }
        if (badgeMarkdown || inputs.dynamicBlocksContainer.children.length > 0 || inputs.licenseText.value.trim()) { md += `---\n\n`; }
        // 3. Динамические секции
        const dynamicBlocks = inputs.dynamicBlocksContainer.querySelectorAll('.dynamic-block');
        dynamicBlocks.forEach(block => {
            const emoji = block.querySelector('.section-emoji')?.value || ''; // Получаем value из select
            const title = block.querySelector('.section-title')?.value.trim() || '';
            const content = block.querySelector('.section-content')?.value.trim() || '';
            let sectionTitle = '';
            if (emoji || title) { sectionTitle = `## ${emoji ? emoji + ' ' : ''}${title || 'Без Названия'}\n\n`; }
            if (sectionTitle || content) { md += sectionTitle; md += `${content}\n\n`; }
        });
        // 4. Секция Лицензии
        const licenseText = inputs.licenseText.value.trim();
        if (licenseText) {
             if (dynamicBlocks.length > 0) { md += `---\n\n`; }
            md += `## 📜 Лицензия\n\n${licenseText}\n`;
        }
        return md.trim();
    }

    function updatePreview() {
        const markdownContent = generateMarkdown();
        rawMarkdownOutput.value = markdownContent; // Показываем сырой MD
        try {
             const dirtyHtml = marked.parse(markdownContent);
             const cleanHtml = DOMPurify.sanitize(dirtyHtml);
             previewOutput.innerHTML = cleanHtml; // Показываем отрендеренный HTML
        } catch (e) {
            previewOutput.innerHTML = `<p style="color: red; font-weight: bold;">Ошибка рендеринга Markdown:</p><pre>${e.message}</pre>`;
            console.error("Markdown rendering error:", e);
        }
    }

    // === НАЗНАЧЕНИЕ ОБЩИХ ОБРАБОТЧИКОВ СОБЫТИЙ ===
    // Слушаем изменения в статичных полях
    inputs.title.addEventListener('input', updatePreview);
    inputs.badge.addedArea.addEventListener('input', updatePreview); // Важно для ручного редактирования бейджей
    inputs.licenseText.addEventListener('input', updatePreview);
    // Обработчики для инпутов внутри динамических блоков назначаются в attachBlockListeners

    // === ОБРАБОТЧИКИ КНОПОК Копировать/Скачать (без изменений) ===
    copyButton.addEventListener('click', () => { /* ... (код как раньше) ... */
        rawMarkdownOutput.select(); rawMarkdownOutput.setSelectionRange(0, 99999); let success = false;
        try { navigator.clipboard.writeText(rawMarkdownOutput.value).then(() => { success = true; }).catch(err => { console.error('Async Clipboard API failed: ', err); }); }
        catch (err) { console.warn('Async Clipboard API not supported:', err); try { success = document.execCommand('copy'); } catch (e) { console.error('execCommand failed: ', e); } }
        const originalText = copyButton.textContent; if (success) { copyButton.textContent = 'Скопировано!'; } else { copyButton.textContent = 'Ошибка копирования'; alert('Не удалось скопировать текст.'); }
        setTimeout(() => { copyButton.textContent = originalText; }, 1500);
    });
    downloadButton.addEventListener('click', () => { /* ... (код как раньше) ... */
        try {
            const markdownContent = generateMarkdown(); const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.setAttribute('href', url);
            const filenameBase = inputs.title.value.trim().replace(/[^a-z0-9\s_-]/gi, '').replace(/\s+/g, '-') || 'README'; link.setAttribute('download', `${filenameBase.toLowerCase()}.md`);
            document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
        } catch (e) { console.error("Download failed:", e); alert('Не удалось создать файл для скачивания.'); }
    });

    // === ПЕРВОНАЧАЛЬНЫЙ ЗАПУСК ===
    const initialBlock = inputs.dynamicBlocksContainer.querySelector('.dynamic-block');
    if (initialBlock) { initialBlock.remove(); } // Удаляем пример блока, если он был в HTML
    displayBadgeParams();
    updatePreview();
});