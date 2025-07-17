---
layout: default
title: Навыки
description: Технические навыки и компетенции Mr Vi
keywords: Mr Vi, skills, technologies, programming
---

{% include terminal_nav.html %}

<div class="terminal-container">
    <div class="terminal-header">
        <div class="terminal-buttons">
            <span class="terminal-button close"></span>
            <span class="terminal-button minimize"></span>
            <span class="terminal-button maximize"></span>
        </div>
        <div class="terminal-title">Mr Vi Terminal - Skills</div>
    </div>
    <div class="terminal-content">
        <div class="terminal-line">
            <span class="prompt">$</span>
            <span class="command">./skills.sh</span>
        </div>
        <div class="output">
            <div class="description">
                <h3>Языки программирования</h3>
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
            </div>
            <hr class="terminal-hr">
            <div class="description">
                <h3>Фреймворки и библиотеки</h3>
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
            </div>
            <hr class="terminal-hr">
            <div class="description">
                <h3>Инструменты и технологии</h3>
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
</div> 