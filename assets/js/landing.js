// --- tsParticles Initialization ---
tsParticles.load("tsparticles", {
    fullScreen: {
        enable: true,
        zIndex: -1 // Помещает фон за контентом
    },
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" }, // Цвет частиц
        shape: { type: "circle" },
        opacity: { value: 0.5, random: false, anim: { enable: false } },
        size: { value: 3, random: true, anim: { enable: false } },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 }, // Линии между частицами
        move: {
            enable: true,
            speed: 2, // Скорость движения
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out", // Поведение при выходе за пределы экрана
            bounce: false,
            attract: { enable: false }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "repulse" }, // Отталкивание при наведении мыши
            onclick: { enable: true, mode: "push" },    // Добавление частиц при клике
            resize: true
        },
        modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { particles_nb: 4 }
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
        'пространство для идей!'
    ],
    typeSpeed: 50,  // Скорость печати
    backSpeed: 25,   // Скорость стирания
    backDelay: 1500, // Пауза перед стиранием
    startDelay: 500, // Пауза перед началом
    loop: true,      // Повторять анимацию
    showCursor: true, // Показывать курсор
    cursorChar: '|',  // Символ курсора
};

const typed = new Typed('#typed-element', options); 