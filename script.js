function showVersionModal(gameType) {
    const modalId = gameType === 'clicker' ? 'clickerModal' : 'quizModal';
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add animation
    const modal = document.getElementById(modalId);
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translateY(-50px)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transform = 'translateY(0)';
        modalContent.style.opacity = '1';
        modalContent.style.transition = 'all 0.3s ease';
    }, 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.style.transform = 'translateY(-50px)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const clickerModal = document.getElementById('clickerModal');
    const quizModal = document.getElementById('quizModal');
    
    if (event.target === clickerModal) {
        closeModal('clickerModal');
    }
    if (event.target === quizModal) {
        closeModal('quizModal');
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal('clickerModal');
        closeModal('quizModal');
    }
});

// Add loading state to version links
document.addEventListener('DOMContentLoaded', function() {
    const versionLinks = document.querySelectorAll('.version-link');
    
    versionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only add loading for actual downloads/demos
            if (this.classList.contains('link-download') || this.classList.contains('link-demo')) {
                this.classList.add('loading');
                
                // Remove loading state after 2 seconds
                setTimeout(() => {
                    this.classList.remove('loading');
                }, 2000);
            }
        });
    });
});

// Smooth scrolling for any internal links
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

// Add particle effect to background (optional)
function createParticles() {
    const particles = document.createElement('div');
    particles.className = 'particles';
    document.body.appendChild(particles);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particles.appendChild(particle);
    }
}

// Initialize particles (uncomment if you want particle effect)
// createParticles();
