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

// Modal card functionality
document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('projectModalOverlay');
    
    // Function to close modal
    function closeModal() {
        document.querySelectorAll('.project-expanded-content.show').forEach(content => {
            content.classList.remove('show');
        });
        if (modalOverlay) {
            modalOverlay.classList.remove('show');
        }
        // Prevent body scroll when modal is open
        document.body.style.overflow = '';
    }
    
    // Function to open modal
    function openModal(expandedContent) {
        // Close any other open modals first
        closeModal();
        
        // Show overlay and modal
        if (modalOverlay) {
            modalOverlay.classList.add('show');
        }
        expandedContent.classList.add('show');
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    }
    
    // Click on project title to expand
    document.querySelectorAll('.expand-card').forEach(title => {
        title.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const projectId = this.getAttribute('data-project');
            const expandedContent = document.getElementById(`${projectId}-expanded`);
            
            if (expandedContent) {
                openModal(expandedContent);
            }
        });
    });

    // Close modal when clicking the X button
    document.querySelectorAll('.collapse-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    });
    
    // Close modal when clicking the overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
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