---
layout: tasks # Используем новый макет
title: Мои Задачи
description: Канбан-доска или список текущих задач.
# show_title: false # Можно скрыть H1 из макета, если заголовок ниже
---

<!-- Группируем задачи по статусу -->
{% assign tasks_by_status = site.tasks | group_by: "status" | sort: 'name' %}
<!-- Задаем порядок колонок -->
{% assign status_order = "To Do,In Progress,Blocked,Done,Archived" | split: "," %}

<div class="kanban-board">

{% for status_name in status_order %}
  {% assign group = tasks_by_status | where: "name", status_name | first %}
  <div class="kanban-column status-{{ status_name | downcase | replace: ' ', '-' }}">
    <h2 class="column-title">{{ status_name }} ({{ group.items.size | default: 0 }})</h2>
    <ul class="task-list">
      {% if group %}
        <!-- Сортируем задачи внутри колонки (например, по приоритету, потом по названию) -->
        {% assign sorted_tasks = group.items | sort: "priority" | sort: "title" %}
        {% for task in sorted_tasks %}
          <li class="task-card priority-{{ task.priority | downcase }}"
              data-project="{{ task.project | escape }}"
              data-priority="{{ task.priority | escape }}"
              data-status="{{ task.status | escape }}"
              >
            <h3 class="task-title">
               <!-- Ссылка на файл на GitHub для быстрого редактирования -->
               <a href="{{ site.github.repository_url }}/edit/{{ site.github.source.branch | default: 'main' }}/{{ task.path }}" target="_blank" title="Редактировать задачу на GitHub">✏️</a>
               {{ task.title | escape }}
            </h3>
            {% if task.project %}
            <span class="task-project">{{ task.project | escape }}</span>
            {% endif %}
            {% if task.due_date %}
            <span class="task-due-date">Дедлайн: {{ task.due_date | date: "%d.%m.%Y" }}</span>
            {% endif %}
            <div class="task-content">
                {{ task.content | markdownify }} <!-- Показываем описание задачи -->
            </div>
          </li>
        {% endfor %}
      {% else %}
        <li class="no-tasks">Нет задач</li>
      {% endif %}
    </ul>
  </div>
{% endfor %}

</div>

<!-- Примечание: Чтобы ссылка "Редактировать" работала, нужно добавить в _config.yml:
github:
  repository_url: https://github.com/YOUR_USERNAME/YOUR_REPO_NAME
  source:
    branch: main # или твоя ветка
-->