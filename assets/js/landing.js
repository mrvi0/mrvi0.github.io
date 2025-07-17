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