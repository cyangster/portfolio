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
    
    // Function to close expanded card
    function closeCard() {
        const expandedCard = document.querySelector('.project-card.expanded');
        if (expandedCard) {
            expandedCard.classList.remove('expanded');
        }
        
        // Hide modal
        if (modalContainer) {
            modalContainer.classList.remove('show');
        }
        
        if (backdropBlur) {
            backdropBlur.classList.remove('show');
        }
        
        document.body.classList.remove('card-expanded');
        
        // Clear modal content after animation
        setTimeout(() => {
            if (modalContent) {
                modalContent.innerHTML = '';
            }
        }, 500);
    }
    
    // Function to expand card
    function expandCard(card) {
        // Close any other expanded cards first
        closeCard();
        
        // Find the expanded content inside the card
        const projectId = card.id.replace('-card', '');
        const expandedContent = document.getElementById(`${projectId}-expanded`);
        
        if (!expandedContent || !modalContent) return;
        
        // Clone the expanded content to the modal
        const clonedContent = expandedContent.cloneNode(true);
        clonedContent.style.display = 'block';
        clonedContent.style.maxHeight = 'none';
        clonedContent.style.opacity = '1';
        clonedContent.style.visibility = 'visible';
        clonedContent.style.padding = '0';
        
        // Remove the collapse button from clone (we have one in modal)
        const cloneCollapseBtn = clonedContent.querySelector('.collapse-btn');
        if (cloneCollapseBtn) {
            cloneCollapseBtn.remove();
        }
        
        // Clear and add cloned content to modal
        modalContent.innerHTML = '';
        modalContent.appendChild(clonedContent);
        
        // Hide the original card (but keep it in grid flow)
        card.classList.add('expanded');
        
        // Show backdrop and modal
        if (backdropBlur) {
            backdropBlur.classList.add('show');
        }
        
        document.body.classList.add('card-expanded');
        
        // Show modal with animation
        if (modalContainer) {
            // Small delay to ensure content is ready
            requestAnimationFrame(() => {
                modalContainer.classList.add('show');
            });
        }
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