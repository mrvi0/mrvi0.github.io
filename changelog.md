---
layout: default
title: История изменений (Коммиты)
---

# История изменений

Здесь отображаются последние коммиты в репозитории.

<div id="commits-list">
    <p>Загрузка коммитов...</p>
</div>

<script>
    // Параметры вашего репозитория
    const owner = 'mrvi0'; // GitHub username
    const repo = 'mrvi0.github.io'; // Repository name
    const commitsList = document.getElementById('commits-list');
    const maxCommits = 15; // Сколько коммитов показать

    // URL для запроса к GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${maxCommits}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
            }
            return response.json(); // Преобразуем ответ в JSON
        })
        .then(commits => {
            commitsList.innerHTML = ''; // Очищаем сообщение "Загрузка..."

            if (commits.length === 0) {
                commitsList.innerHTML = '<p>Коммиты не найдены.</p>';
                return;
            }

            const ul = document.createElement('ul');
            ul.className = 'commit-history'; // Добавим класс для стилизации

            commits.forEach(commitData => {
                const commit = commitData.commit;
                const li = document.createElement('li');

                // Дата коммита
                const date = new Date(commit.committer.date).toLocaleString('ru-RU', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                // Ссылка на коммит на GitHub
                const commitUrl = commitData.html_url;
                // Сообщение коммита (первая строка)
                const message = commit.message.split('\n')[0];
                // Автор
                const author = commit.author.name;
                const authorUrl = commitData.author ? commitData.author.html_url : '#'; // Ссылка на профиль автора (если есть)
                const authorAvatar = commitData.author ? commitData.author.avatar_url : ''; // Аватар автора (если есть)

                li.innerHTML = `
                    <div class="commit-info">
                        <a href="${commitUrl}" target="_blank" rel="noopener noreferrer" class="commit-message">${message}</a>
                        <div class="commit-meta">
                            <span class="commit-author">
                                ${authorAvatar ? `<img src="${authorAvatar}&s=20" alt="${author}" width="20" height="20" style="border-radius: 50%; vertical-align: middle; margin-right: 5px;">` : ''}
                                ${authorUrl !== '#' ? `<a href="${authorUrl}" target="_blank" rel="noopener noreferrer">${author}</a>` : author}
                            </span>
                            <span class="commit-date">коммитнул ${date}</span>
                            <a href="${commitUrl}" target="_blank" rel="noopener noreferrer" class="commit-sha" title="Посмотреть коммит на GitHub">${commitData.sha.substring(0, 7)}</a>
                        </div>
                    </div>
                `;
                ul.appendChild(li);
            });
            commitsList.appendChild(ul);
        })
        .catch(error => {
            console.error('Ошибка при загрузке коммитов:', error);
            commitsList.innerHTML = `<p class="error">Не удалось загрузить историю коммитов. Пожалуйста, проверьте консоль для деталей. (${error.message})</p>`;
        });
</script>