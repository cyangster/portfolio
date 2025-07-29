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
}// Project data from JSON
const projectData = {
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
            
            // Set image
            modalImage.innerHTML = `<img src="${project.image.url}" alt="${project.image.alt}">`;
            
            // Set description
            modalDescription.textContent = project.fullDescription;
            
            // Set link if available
            if (project.link && project.link.trim() !== '') {
                modalLinkContainer.innerHTML = `<a href="${project.link}" target="_blank" class="project-link">View Project</a>`;
            } else {
                modalLinkContainer.innerHTML = '';
            }
            
            // Show modal
            modal.style.display = 'block';
            
            // Disable body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal functionality
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Also close modal when clicking outside of it
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
