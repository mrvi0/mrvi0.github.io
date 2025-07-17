---
layout: default
title: Навыки
description: Технические навыки и компетенции Mr Vi
keywords: Mr Vi, skills, technologies, programming
---

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
            <span class="command">cat skills.txt</span>
        </div>
        
        <div class="output">
            <div class="description">
                <h3>Технические навыки</h3>
                <p>Мои основные компетенции в области разработки программного обеспечения:</p>
                
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
            
            <div class="terminal-line">
                <span class="prompt">$</span>
                <span class="command">echo "Навыки загружены успешно"</span>
            </div>
            
            <div class="output">
                <span class="success">Навыки загружены успешно</span>
            </div>
        </div>
    </div>
</div> 