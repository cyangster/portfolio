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

// 3D Card expansion functionality - New approach using separate modal
document.addEventListener('DOMContentLoaded', function() {
    const backdropBlur = document.getElementById('projectBackdropBlur');
    const modalContainer = document.getElementById('projectModalContainer');
    const modalCard = document.getElementById('projectModalCard');
    const modalContent = document.getElementById('projectModalContent');
    
    // Store original dimensions of all cards
    const originalCardSizes = new Map();
    
    // Function to store original card sizes
    function storeOriginalSizes() {
        const allCards = document.querySelectorAll('.project-card');
        allCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            originalCardSizes.set(card.id, {
                width: rect.width,
                height: rect.height
            });
        });
    }
    
    // Store original sizes on page load
    storeOriginalSizes();
    
    // Also store after window resize (in case layout changes)
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!document.body.classList.contains('card-expanded')) {
                storeOriginalSizes();
            }
        }, 250);
    });
    
    // Function to close expanded card
    function closeCard() {
        const expandedCard = document.querySelector('.project-card.expanded');
        
        // Hide modal first
        if (modalContainer) {
            modalContainer.classList.remove('show');
        }
        
        if (backdropBlur) {
            backdropBlur.classList.remove('show');
        }
        
        // Hide modal and backdrop first (instant, no animation)
        // This makes the expanded view disappear immediately
        
        // Keep body.card-expanded temporarily to maintain other cards' locked sizes
        // Remove expanded class from the card (this makes it visible again, but it's still hidden by modal)
        if (expandedCard) {
            expandedCard.classList.remove('expanded');
        }
        
        // Remove body.card-expanded after modal is hidden to allow expanded card to return to normal
        // The expanded card will shrink back to normal size with animation
        // Other cards keep their locked sizes
        setTimeout(() => {
            document.body.classList.remove('card-expanded');
            
            // Only remove locks from the expanded card (if it exists)
            // This allows it to shrink back to normal size with animation
            if (expandedCard) {
                // Add shrinking class for animation
                expandedCard.classList.add('shrinking');
                // Remove locks to allow natural sizing
                expandedCard.style.removeProperty('--locked-width');
                expandedCard.style.removeProperty('--locked-height');
                
                // Remove shrinking class after animation
                setTimeout(() => {
                    expandedCard.classList.remove('shrinking');
                }, 500);
            }
            
            // Re-store original sizes after the shrink animation completes
            setTimeout(() => {
                storeOriginalSizes();
            }, 500);
        }, 100);
        
        // Clear modal content after animation
        setTimeout(() => {
            if (modalContent) {
                modalContent.innerHTML = '';
            }
        }, 500);
    }
    
    // Function to expand card
    function expandCard(card) {
        // Close any other expanded cards first - ensure only one card is expanded
        const allCards = document.querySelectorAll('.project-card');
        allCards.forEach(c => {
            if (c !== card && c.classList.contains('expanded')) {
                c.classList.remove('expanded');
            }
        });
        
        // Lock the size of all other cards BEFORE expanding
        // Use stored original sizes if available, otherwise use current sizes
        // This ensures other cards don't change size when one expands
        allCards.forEach(c => {
            if (c !== card && !c.classList.contains('expanded')) {
                // Check if card already has locks (from previous expansion)
                const hasLock = c.style.getPropertyValue('--locked-width');
                
                if (!hasLock) {
                    // Only set locks if they don't exist (preserve existing locks)
                    const originalSize = originalCardSizes.get(c.id);
                    if (originalSize) {
                        // Use stored original size
                        c.style.setProperty('--locked-width', `${originalSize.width}px`);
                        c.style.setProperty('--locked-height', `${originalSize.height}px`);
                    } else {
                        // Fallback: use current size
                        const rect = c.getBoundingClientRect();
                        c.style.setProperty('--locked-width', `${rect.width}px`);
                        c.style.setProperty('--locked-height', `${rect.height}px`);
                        // Store it for future use
                        originalCardSizes.set(c.id, {
                            width: rect.width,
                            height: rect.height
                        });
                    }
                }
            }
        });
        
        // Hide modal and backdrop if they're showing
        if (modalContainer) {
            modalContainer.classList.remove('show');
        }
        if (backdropBlur) {
            backdropBlur.classList.remove('show');
        }
        
        // Find the expanded content inside the clicked card only
        const projectId = card.id.replace('-card', '');
        const expandedContent = document.getElementById(`${projectId}-expanded`);
        
        if (!expandedContent || !modalContent) {
            console.error('Expanded content or modal content not found');
            return;
        }
        
        // Clone the expanded content to the modal
        const clonedContent = expandedContent.cloneNode(true);
        
        // Remove the collapse button from clone (we have one in modal)
        const cloneCollapseBtn = clonedContent.querySelector('.collapse-btn');
        if (cloneCollapseBtn) {
            cloneCollapseBtn.remove();
        }
        
        // Clear and add cloned content to modal
        modalContent.innerHTML = '';
        modalContent.appendChild(clonedContent);
        
        // Hide ONLY the clicked card (but keep it in grid flow)
        card.classList.add('expanded');
        
        // Show backdrop first
        if (backdropBlur) {
            backdropBlur.classList.add('show');
        }
        
        document.body.classList.add('card-expanded');
        
        // Force a reflow to ensure content is ready
        void modalContent.offsetHeight;
        
        // Show modal with animation - use double requestAnimationFrame to ensure content is rendered
        if (modalContainer) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    modalContainer.classList.add('show');
                });
            });
        }
    }
    
    // Click on project title to expand - ensure only the clicked card expands
    document.querySelectorAll('.expand-card').forEach(title => {
        title.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get the specific card that was clicked
            const projectId = this.getAttribute('data-project');
            const card = document.getElementById(`${projectId}-card`);
            
            if (card) {
                // Only expand this specific card
                expandCard(card);
            }
        });
    });

    // Close card when clicking the X button (both original and modal)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('collapse-btn') || e.target.classList.contains('modal-close-btn')) {
            e.preventDefault();
            e.stopPropagation();
            closeCard();
        }
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