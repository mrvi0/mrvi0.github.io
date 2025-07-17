// --- tsParticles Initialization ---
tsParticles.load("tsparticles", {
    fullScreen: {
        enable: true,
        zIndex: -1
    },
    particles: {
        number: { 
            value: 60, 
            density: { 
                enable: true, 
                value_area: 1000 
            } 
        },
        color: { 
            value: ["#6366f1", "#8b5cf6", "#06b6d4", "#3b82f6"] 
        },
        shape: { 
            type: "circle" 
        },
        opacity: { 
            value: 0.3, 
            random: true, 
            anim: { 
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            } 
        },
        size: { 
            value: 4, 
            random: true, 
            anim: { 
                enable: true,
                speed: 2,
                size_min: 2,
                sync: false
            } 
        },
        line_linked: { 
            enable: true, 
            distance: 150, 
            color: "#6366f1", 
            opacity: 0.2, 
            width: 1 
        },
        move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "bounce",
            bounce: true,
            attract: { 
                enable: true,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { 
                enable: true, 
                mode: "grab" 
            },
            onclick: { 
                enable: true, 
                mode: "push" 
            },
            resize: true
        },
        modes: {
            grab: { 
                distance: 140, 
                line_linked: { 
                    opacity: 0.5 
                } 
            },
            push: { 
                particles_nb: 3 
            }
        }
    },
    detectRetina: true
});

// --- Typed.js Initialization ---
const options = {
    strings: [
        'моя цифровая площадка.',
        'место для утилит.',
        'персональная вики.',
        'пространство для идей!',
        'центр разработки.'
    ],
    typeSpeed: 60,
    backSpeed: 30,
    backDelay: 2000,
    startDelay: 800,
    loop: true,
    showCursor: true,
    cursorChar: '|',
};

const typed = new Typed('#typed-element', options); 

// Терминальный эффект печати
document.addEventListener('DOMContentLoaded', function() {
    const typingCommand = document.getElementById('typing-command');
    const commands = [
        'help',
        'ls -la',
        'cat README.md',
        'echo "Hello, World!"',
        'git status',
        'npm install',
        'python --version',
        'node --version'
    ];
    
    let currentCommandIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeCommand() {
        const currentCommand = commands[currentCommandIndex];
        
        if (isDeleting) {
            // Удаляем символы
            typingCommand.textContent = currentCommand.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            // Добавляем символы
            typingCommand.textContent = currentCommand.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        // Скорость печати
        let typeSpeed = isDeleting ? 50 : 100;
        
        // Если команда напечатана полностью
        if (!isDeleting && currentCharIndex === currentCommand.length) {
            // Пауза перед удалением
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            // Переходим к следующей команде
            isDeleting = false;
            currentCommandIndex = (currentCommandIndex + 1) % commands.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeCommand, typeSpeed);
    }
    
    // Запускаем печать через 2 секунды
    setTimeout(typeCommand, 2000);
    
    // Добавляем интерактивность к кнопкам терминала
    const terminalButtons = document.querySelectorAll('.terminal-button');
    
    terminalButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Добавляем эффект нажатия
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Добавляем эффект фокуса для навигационных кнопок
    const navButtons = document.querySelectorAll('.nav-button');
    
    navButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Добавляем эффект для файлов в списке
    const fileItems = document.querySelectorAll('.file-item');
    
    fileItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.color = 'var(--terminal-text)';
            this.style.transform = 'translateX(4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.color = 'var(--terminal-text-dim)';
            this.style.transform = 'translateX(0)';
        });
    });
}); 