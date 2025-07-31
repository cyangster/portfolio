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

// Section toggle functionality - Fixed version
function initializeSectionToggle() {
    const showProjectsBtn = document.getElementById('showProjects');
    const showCertificationsBtn = document.getElementById('showCertifications');
    const projectsSection = document.getElementById('projectsSection');
    const certificationsSection = document.getElementById('certificationsSection');

    // Check if all elements exist
    if (!showProjectsBtn || !showCertificationsBtn || !projectsSection || !certificationsSection) {
        console.log('Toggle elements not found, retrying...');
        return false;
    }

    console.log('All toggle elements found, initializing...');

    // Projects button click handler
    showProjectsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Projects button clicked');
        
        // Show projects, hide certifications
        projectsSection.style.display = 'block';
        certificationsSection.style.display = 'none';
        
        // Update button states
        showProjectsBtn.classList.add('active');
        showCertificationsBtn.classList.remove('active');
    });

    // Certifications button click handler
    showCertificationsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Certifications button clicked');
        
        // Show certifications, hide projects
        certificationsSection.style.display = 'block';
        projectsSection.style.display = 'none';
        
        // Update button states
        showCertificationsBtn.classList.add('active');
        showProjectsBtn.classList.remove('active');
    });

    // Set default state: Show projects, hide certifications
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
    
    // Try to initialize toggle
    if (!initializeSectionToggle()) {
        // If it fails, try again after a short delay
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
            
            // Add delay for staggered animation
            setTimeout(() => {
                item.classList.add('animate');
                progressBar.style.setProperty('--progress-width', level + '%');
                progressBar.style.width = level + '%';
            }, index * 150);
        }
    });
}

// Project data
const projectData = {
    "3d-computer": {
        "title": "3D Interactive Computer",
        "fullDescription": "An educational 3D interactive computer built using HTML, CSS, JavaScript, and React. This comprehensive project serves as an educational platform designed to teach people about computer components and how they work together. The interactive 3D environment allows users to explore different parts of a computer system, including the motherboard, CPU, RAM, storage devices, and other essential components. Through this hands-on experience, users can gain a deeper understanding of computer architecture and functionality. The project combines cutting-edge web technologies with educational content, making learning about technology more accessible, engaging, and interactive for users of all skill levels.",
        "image": {
            "url": "images/3dpcimage.png",
            "alt": "3D Interactive Computer Interface"
        },
        "link": "https://3-dpc-rust.vercel.app/"
    },
    "mcas-chatbot": {
        "title": "MCAS Chatbot",
        "fullDescription": "In this project I created a chatbot that would help students in the Morrissey College of Arts and Sciences find out how many credits they need in order to graduate in a 4 year undergrade. The chatbot understands wrong user inputs and is programmed using Amazon Lambda to keep asking the user until an acceptable response is given. After a series of dialogues, the bot ultimately responds with how many more credits the student would need to take to graduate.",
        "image": {
            "url": "https://cdn.glitch.global/56504f83-839d-433a-919f-9169cfde4c5e/chatbot.png?v=1729187785430",
            "alt": "MCAS Chatbot Interface"
        },
        "link": ""
    },
    "logistic-regression": {
        "title": "Logistic Regression Test",
        "fullDescription": "In this project, I used a loan dataset and by utilizing Python, Pandas, NumPy, and scikit I was able to train the given data and test it to see the difference in the scores of machine learning algorithms. I compared the baseline by selecting a random baseline and then the majority baseline and compared them by using logisitic regression to see the best score. Logistic regression is well-suited for binary classification problems like loan approval prediction, offering both predictive power and interpretability. I trained the logistic regression model on the dataset, after performing necessary preprocessing steps such as handling missing values, encoding categorical variables, and scaling numerical features.",
        "image": {
            "url": "https://cdn.glitch.global/56504f83-839d-433a-919f-9169cfde4c5e/graph.png?v=1729190065699",
            "alt": "graphs"
        },
        "link": ""
    }
};

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Project modal functionality
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalDescription = document.getElementById('modal-description');
const modalLinkContainer = document.getElementById('modal-link-container');
const closeModal = document.querySelector('.close-modal');

// Open project details modal
document.querySelectorAll('.view-details').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const projectId = this.getAttribute('data-project');
        const project = projectData[projectId];
        
        if (project) {
            modalTitle.textContent = project.title;
            modalImage.innerHTML = `<img src="${project.image.url}" alt="${project.image.alt}">`;
            modalDescription.textContent = project.fullDescription;
            
            if (project.link && project.link.trim() !== '') {
                modalLinkContainer.innerHTML = `<a href="${project.link}" target="_blank" class="project-link">View Project</a>`;
            } else {
                modalLinkContainer.innerHTML = '';
            }
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal functionality
if (closeModal) {
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
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