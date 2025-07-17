// B4DCAT - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Typing animation
    const typingCommand = document.getElementById('typing-command');
    const commands = [
        'help',
        'ls -la',
        'cat README.md',
        'echo "Hello, World!"',
        'git status',
        'npm start',
        'python3 main.py',
        'docker ps',
        'kubectl get pods',
        'terraform plan'
    ];
    
    let currentCommandIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentCommand = commands[currentCommandIndex];
        
        if (isDeleting) {
            // Deleting text
            typingCommand.textContent = currentCommand.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            // Typing text
            typingCommand.textContent = currentCommand.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        // Set typing speed
        let typeSpeed = isDeleting ? 50 : 100;
        
        // If word is complete
        if (!isDeleting && currentCharIndex === currentCommand.length) {
            // Make pause at end
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentCommandIndex = (currentCommandIndex + 1) % commands.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    // Start typing animation after a delay
    setTimeout(typeText, 1000);
    
    // File list hover effects
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Terminal button effects (visual only)
    const terminalButtons = document.querySelectorAll('.terminal-button');
    terminalButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click effect
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation
    const terminalContent = document.querySelector('.terminal-content');
    if (terminalContent) {
        terminalContent.style.opacity = '0';
        terminalContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            terminalContent.style.transition = 'all 0.5s ease';
            terminalContent.style.opacity = '1';
            terminalContent.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Console logging for debugging
    console.log('B4DCAT Terminal initialized');
    console.log('Available commands:', commands);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus on command line
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const typingCommand = document.getElementById('typing-command');
            if (typingCommand) {
                typingCommand.focus();
            }
        }
        
        // Escape to clear command line
        if (e.key === 'Escape') {
            const typingCommand = document.getElementById('typing-command');
            if (typingCommand) {
                typingCommand.textContent = '';
            }
        }
    });
}); 