---
layout: default
title: Блог
description: Блог Mr Vi - мысли, проекты и новости
keywords: Mr Vi, blog, posts, articles
---

<div class="terminal-container">
    <div class="terminal-header">
        <div class="terminal-buttons">
            <span class="terminal-button close"></span>
            <span class="terminal-button minimize"></span>
            <span class="terminal-button maximize"></span>
        </div>
        <div class="terminal-title">Mr Vi Terminal - Blog</div>
    </div>
    
    <div class="terminal-content">
        <div class="terminal-line">
            <span class="prompt">$</span>
            <span class="command">ls -la posts/</span>
        </div>
        
        <div class="output">
            <div class="file-list">
                {% for post in site.posts %}
                <a href="{{ post.url }}" class="file-item">
                    📝 {{ post.date | date: "%Y-%m-%d" }} - {{ post.title }}
                </a>
                {% endfor %}
            </div>
            
            <div class="description">
                <h3>📚 О блоге</h3>
                <p>Здесь я делюсь своими мыслями о программировании, технологиях и проектах. Буду писать о том, что изучаю, создаю и что меня вдохновляет.</p>
                
                <h3>📋 Категории</h3>
                <ul>
                    <li>💻 Программирование</li>
                    <li>🚀 Проекты</li>
                    <li>🛠️ Инструменты</li>
                    <li>📖 Обучение</li>
                    <li>💡 Идеи</li>
                </ul>
                
                <h3>📅 Архив</h3>
                <p>Все посты отсортированы по дате публикации. Используйте поиск или теги для навигации.</p>
            </div>
            
            <div class="terminal-line">
                <span class="prompt">$</span>
                <span class="command">wc -l posts/*.md</span>
            </div>
            
            <div class="output">
                <span class="success">Всего постов: {{ site.posts.size }}</span>
            </div>
            
            <div class="terminal-line">
                <span class="prompt">$</span>
                <span class="command">echo "Приятного чтения!"</span>
            </div>
            
            <div class="output">
                <span class="success">Приятного чтения!</span>
            </div>
        </div>
    </div>
</div> 