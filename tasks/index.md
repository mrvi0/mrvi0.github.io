---
layout: tasks          # Используем новый макет
title: "Трекер Задач"  # Заголовок страницы
show_title: true      # Показываем заголовок из макета (где рядом будет кнопка "Добавить")
description: Канбан-доска для отслеживания задач.
author: Mr Vi
body_class: kanban-view
---



<!-- Фильтр для исключения задач без статуса -->
{% assign valid_tasks = site.tasks | where_exp: "item", "item.status != nil" %}
<!-- Группируем задачи по статусу -->
{% assign tasks_by_status = valid_tasks | group_by: "status" %}
<!-- Задаем желаемый порядок колонок -->
{% assign status_order = "To Do,In Progress,Blocked,Done,Archived" | split: "," %}

<div class="kanban-board">

{% for status_name in status_order %}
  {% assign column_icon = "" %}
  {% if status_name == "To Do" %}       {% assign column_icon = "📝" %}
  {% elsif status_name == "In Progress" %}{% assign column_icon = "⏳" %}
  {% elsif status_name == "Blocked" %}    {% assign column_icon = "⛔" %}
  {% elsif status_name == "Done" %}       {% assign column_icon = "✅" %}
  {% elsif status_name == "Archived" %}   {% assign column_icon = "📦" %}
  {% endif %}
  {% assign column_icon = status_map[status_name] | default: "" %}
  {% assign group = tasks_by_status | where: "name", status_name | first %}
  <div class="kanban-column status-{{ status_name | downcase | replace: ' ', '-' }}">
    <!-- Заголовок колонки -->
    <h2 class="column-title">
        <span class="column-icon">{{ column_icon }}</span>
        {{ status_name }}
        <span class="task-count">({{ group.items.size | default: 0 }})</span>
    </h2>
    <ul class="task-list">
      {% if group and group.items.size > 0 %}
        <!-- Сортировка -->
        {% assign sorted_tasks = group.items | sort: "title" %}
        {% for task in sorted_tasks %}
            <!-- Определяем иконку приоритета через if/elsif -->
            {% assign priority_icon = "⚪" %} <!-- Значение по умолчанию -->
            {% if task.priority == "High" %}     {% assign priority_icon = "🔥" %}
            {% elsif task.priority == "Medium" %} {% assign priority_icon = "🔸" %}
            {% elsif task.priority == "Low" %}    {% assign priority_icon = "🟢" %}
            {% endif %}
            <!-- Обертка LI для карточки -->
            <li class="task-card priority-{{ task.priority | downcase }}"
                data-project="{{ task.project | escape }}"
                data-priority="{{ task.priority | escape }}"
                data-status="{{ task.status | escape }}"
                >
                <!-- ЗАГОЛОВОК СТАЛ ССЫЛКОЙ -->
                <h3 class="task-title">
                    <a href="{{ task.url | relative_url }}" class="task-title-link">
                       <span class="priority-icon" title="Приоритет: {{ task.priority }}">{{ priority_icon }}</span>
                       {{ task.title | escape }}
                    </a>
                    <!-- Ссылка на редактирование -->
                    <a href="{{ site.github.repository_url }}/edit/{{ site.github.source.branch | default: 'main' }}/{{ task.path }}" target="_blank" title="Редактировать задачу" class="edit-task-link">✏️</a>
                </h3>
                <!-- Теги -->
                <div class="task-tags">
                    {% if task.project %}
                    <span class="task-project tag"><span class="tag-icon">📁</span>{{ task.project | escape }}</span>
                    {% endif %}
                    {% if task.due_date %}
                        {% assign due_date_obj = task.due_date | date: "%s" %}{% assign current_date_obj = "now" | date: "%s" %}{% assign is_overdue = false %}
                        {% if due_date_obj < current_date_obj %}{% assign task_status_lower = task.status | downcase %}{% if task_status_lower != 'done' and task_status_lower != 'archived' %}{% assign is_overdue = true %}{% endif %}{% endif %}
                        <span class="task-due-date tag {% if is_overdue %}overdue{% endif %}">
                            <span class="tag-icon">🗓️</span>{{ task.due_date | date: "%d.%m.%Y" }}{% if is_overdue %}!{% endif %}
                        </span>
                    {% endif %}
                </div>
                <!-- Описание здесь НЕ выводим -->
            </li>
        {% endfor %}
      {% else %}
        <li class="no-tasks">(пусто)</li>
      {% endif %}
    </ul>
  </div>  
{% endfor %}

</div>