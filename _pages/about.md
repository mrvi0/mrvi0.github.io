---
layout: default
title: О себе
description: Информация о Mr Vi — разработчике программного обеспечения
keywords: Mr Vi, about, developer, software
---

<div class="terminal-container">
    <div class="terminal-header">
        <div class="terminal-buttons">
            <span class="terminal-button close"></span>
            <span class="terminal-button minimize"></span>
            <span class="terminal-button maximize"></span>
        </div>
        <div class="terminal-title">Mr Vi Terminal - About</div>
    </div>
    
    <div class="terminal-content">
        <div class="terminal-line">
            <span class="prompt">$</span>
            <span class="command">cat about.txt</span>
        </div>
        
        <div class="output">
            <div class="description">
                <p>Привет! Я Mr Vi — разработчик программного обеспечения.</p>
                <p>Занимаюсь веб-разработкой, пользовательскими интерфейсами и автоматизацией процессов.</p>
                <p>Постоянно изучаю новые технологии и применяю их на практике.</p>
            </div>
        </div>

        <hr class="terminal-hr">
        
        <div class="terminal-line">
            <span class="prompt">$</span>
            <span class="command">./skills.sh</span>
        </div>
        
        <div class="output">
            <h3>Программирование</h3>
            {% for skill in site.data.skills.programming_languages %}
            <div class="skill-item">
                <div class="skill-header">
                    <span class="skill-name">{{ skill.name }}</span>
                    <span class="skill-level">{{ skill.level }}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: {{ skill.level }}%"></div>
                </div>
            </div>
            {% endfor %}

            <h3>Фреймворки</h3>
            {% for skill in site.data.skills.frameworks %}
            <div class="skill-item">
                <div class="skill-header">
                    <span class="skill-name">{{ skill.name }}</span>
                    <span class="skill-level">{{ skill.level }}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: {{ skill.level }}%"></div>
                </div>
            </div>
            {% endfor %}

            <h3>Инструменты</h3>
            {% for skill in site.data.skills.tools %}
            <div class="skill-item">
                <div class="skill-header">
                    <span class="skill-name">{{ skill.name }}</span>
                    <span class="skill-level">{{ skill.level }}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: {{ skill.level }}%"></div>
                </div>
            </div>
            {% endfor %}
        </div>
    </div>
</div> 