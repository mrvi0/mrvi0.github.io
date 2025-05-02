// assets/js/task-filters.js
document.addEventListener('DOMContentLoaded', () => {
    const projectFilter = document.getElementById('projectFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const clearButton = document.getElementById('clearFilters');
    const taskCards = document.querySelectorAll('.task-card');
    const projects = new Set(); // Соберем уникальные проекты

    // 1. Собираем проекты и заполняем селектор
    taskCards.forEach(card => {
        const project = card.dataset.project;
        if (project && project !== '') {
            projects.add(project);
        }
    });
    // Сортируем проекты и добавляем в селектор
    Array.from(projects).sort().forEach(proj => {
        const option = document.createElement('option');
        option.value = proj;
        option.textContent = proj;
        projectFilter.appendChild(option);
    });

    // 2. Функция фильтрации
    function applyFilters() {
        const selectedProject = projectFilter.value;
        const selectedPriority = priorityFilter.value;

        taskCards.forEach(card => {
            const cardProject = card.dataset.project || '';
            const cardPriority = card.dataset.priority || '';

            const projectMatch = (selectedProject === 'all' || cardProject === selectedProject);
            const priorityMatch = (selectedPriority === 'all' || cardPriority === selectedPriority);

            if (projectMatch && priorityMatch) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // 3. Обработчики событий
    projectFilter.addEventListener('change', applyFilters);
    priorityFilter.addEventListener('change', applyFilters);

    clearButton.addEventListener('click', () => {
        projectFilter.value = 'all';
        priorityFilter.value = 'all';
        applyFilters();
    });

    // Применить фильтры при загрузке (если значения сохранены или установлены по умолчанию)
    // applyFilters(); // Раскомментируй, если нужно
});