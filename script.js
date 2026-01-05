// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('show');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('show');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navLinks.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            navLinks.classList.remove('show');
        }
    });
}

// Section toggle functionality
function initializeSectionToggle() {
    const showProjectsBtn = document.getElementById('showProjects');
    const showCertificationsBtn = document.getElementById('showCertifications');
    const projectsSection = document.getElementById('projectsSection');
    const certificationsSection = document.getElementById('certificationsSection');

    if (!showProjectsBtn || !showCertificationsBtn || !projectsSection || !certificationsSection) {
        console.log('Toggle elements not found, retrying...');
        return false;
    }

    console.log('All toggle elements found, initializing...');

    // Projects button click handler
    showProjectsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Projects button clicked');
        
        projectsSection.style.display = 'block';
        certificationsSection.style.display = 'none';
        
        showProjectsBtn.classList.add('active');
        showCertificationsBtn.classList.remove('active');
    });

    // Certifications button click handler
    showCertificationsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Certifications button clicked');
        
        certificationsSection.style.display = 'block';
        projectsSection.style.display = 'none';
        
        showCertificationsBtn.classList.add('active');
        showProjectsBtn.classList.remove('active');
    });

    // Set default state
    projectsSection.style.display = 'block';
    certificationsSection.style.display = 'none';
    showProjectsBtn.classList.add('active');
    showCertificationsBtn.classList.remove('active');
    
    console.log('Toggle system initialized successfully');
    return true;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing toggle...');
    
    if (!initializeSectionToggle()) {
        setTimeout(() => {
            console.log('Retrying toggle initialization...');
            initializeSectionToggle();
        }, 100);
    }
    
    // Initialize skill bar animations
    animateSkillBars();
    
    // Re-animate skill bars when scrolling into view
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(skillsSection);
    }
});

// Function to animate skill bars
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        const progressBar = item.querySelector('.skill-progress');
        if (progressBar) {
            const level = progressBar.getAttribute('data-level');
            
            setTimeout(() => {
                item.classList.add('animate');
                progressBar.style.setProperty('--progress-width', level + '%');
                progressBar.style.width = level + '%';
            }, index * 150);
        }
    });
}

// 3D Card expansion functionality
document.addEventListener('DOMContentLoaded', function() {
    const backdropBlur = document.getElementById('projectBackdropBlur');
    let placeholder = null;
    
    // Function to close expanded card
    function closeCard() {
        const expandedCard = document.querySelector('.project-card.expanded');
        if (expandedCard) {
            // Phase 1: Shrink first (if expanding class exists)
            if (expandedCard.classList.contains('expanding')) {
                expandedCard.classList.remove('expanding');
                
                // Phase 2: After shrink, remove expanded class and placeholder
                setTimeout(() => {
                    expandedCard.classList.remove('expanded');
                    
                    // Remove placeholder if it exists
                    if (placeholder && placeholder.parentNode) {
                        placeholder.parentNode.removeChild(placeholder);
                        placeholder = null;
                    }
                }, 400); // Wait for shrink animation
            } else {
                // If not expanding, just remove immediately
                expandedCard.classList.remove('expanded');
                
                // Remove placeholder if it exists
                if (placeholder && placeholder.parentNode) {
                    placeholder.parentNode.removeChild(placeholder);
                    placeholder = null;
                }
            }
        }
        if (backdropBlur) {
            backdropBlur.classList.remove('show');
        }
        document.body.classList.remove('card-expanded');
    }
    
    // Function to expand card
    function expandCard(card) {
        // Close any other expanded cards first
        closeCard();
        
        // Get the card's current position and dimensions BEFORE any changes
        const rect = card.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(card);
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        // Store original position and dimensions for animation
        card.style.setProperty('--original-top', `${rect.top + scrollTop}px`);
        card.style.setProperty('--original-left', `${rect.left + scrollLeft}px`);
        card.style.setProperty('--original-width', `${rect.width}px`);
        card.style.setProperty('--original-height', `${rect.height}px`);
        
        // Store original dimensions as CSS custom properties for phase 1
        card.dataset.originalWidth = rect.width;
        card.dataset.originalHeight = rect.height;
        
        // Create placeholder that exactly matches the card's grid space
        placeholder = document.createElement('div');
        placeholder.className = 'project-card-placeholder';
        
        // Clone the card's computed dimensions exactly
        placeholder.style.width = rect.width + 'px';
        placeholder.style.height = rect.height + 'px';
        placeholder.style.minHeight = rect.height + 'px';
        placeholder.style.maxHeight = rect.height + 'px';
        placeholder.style.margin = computedStyle.margin;
        placeholder.style.padding = computedStyle.padding;
        placeholder.style.border = computedStyle.border;
        placeholder.style.borderWidth = computedStyle.borderWidth;
        placeholder.style.boxSizing = computedStyle.boxSizing;
        placeholder.style.visibility = 'hidden';
        placeholder.style.pointerEvents = 'none';
        placeholder.style.opacity = '0';
        placeholder.style.position = 'relative';
        placeholder.style.zIndex = '-1';
        placeholder.style.display = 'block';
        
        // Insert placeholder in the exact same position BEFORE card becomes fixed
        const parent = card.parentNode;
        parent.insertBefore(placeholder, card);
        
        // Force multiple synchronous layout recalculations to ensure placeholder is rendered
        void placeholder.offsetHeight;
        void placeholder.offsetWidth;
        void parent.offsetHeight;
        
        // Show backdrop blur first
        if (backdropBlur) {
            backdropBlur.classList.add('show');
        }
        
        // Phase 1: Make card fixed and move to center instantly (removes from grid flow immediately)
        card.classList.add('expanded');
        document.body.classList.add('card-expanded');
        
        // Force a reflow to ensure the card is removed from grid before expanding
        void card.offsetHeight;
        
        // Phase 2: After card is removed from flow, expand the size
        setTimeout(() => {
            card.classList.add('expanding');
        }, 50); // Small delay to ensure position change is applied
    }
    
    // Click on project title to expand
    document.querySelectorAll('.expand-card').forEach(title => {
        title.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const projectId = this.getAttribute('data-project');
            const card = document.getElementById(`${projectId}-card`);
            
            if (card) {
                expandCard(card);
            }
        });
    });

    // Close card when clicking the X button
    document.querySelectorAll('.collapse-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeCard();
        });
    });
    
    // Close card when clicking the backdrop
    if (backdropBlur) {
        backdropBlur.addEventListener('click', function(e) {
            if (e.target === backdropBlur) {
                closeCard();
            }
        });
    }
    
    // Close card when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCard();
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to nav items when scrolling
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});