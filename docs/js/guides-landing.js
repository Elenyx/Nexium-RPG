// Guides Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('guide-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const guideCards = document.querySelectorAll('.guide-card');

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        filterGuides(searchTerm, getActiveFilter());
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            filterGuides(searchInput.value.toLowerCase().trim(), filter);
        });
    });

    function getActiveFilter() {
        const activeButton = document.querySelector('.filter-btn.active');
        return activeButton ? activeButton.dataset.filter : 'all';
    }

    function filterGuides(searchTerm, categoryFilter) {
        guideCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag =>
                tag.textContent.toLowerCase()
            );
            const cardCategory = card.dataset.category;

            // Check search term match
            const matchesSearch = !searchTerm ||
                title.includes(searchTerm) ||
                description.includes(searchTerm) ||
                tags.some(tag => tag.includes(searchTerm));

            // Check category filter
            const matchesCategory = categoryFilter === 'all' || cardCategory === categoryFilter;

            // Show/hide card
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                // Add fade-in animation
                card.style.animation = 'fadeIn 0.3s ease-in-out';
            } else {
                card.style.display = 'none';
            }
        });

        // Update results count
        updateResultsCount();
    }

    function updateResultsCount() {
        const visibleCards = document.querySelectorAll('.guide-card[style*="display: block"], .guide-card:not([style*="display"])');
        const totalCards = guideCards.length;

        // You could add a results counter here if desired
        console.log(`Showing ${visibleCards.length} of ${totalCards} guides`);
    }

    // Smooth scroll for anchor links
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

    // Add loading animation for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // Initialize with all guides visible
    filterGuides('', 'all');
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .guide-card {
        animation-fill-mode: both;
    }

    img.loaded {
        animation: fadeIn 0.5s ease-in-out;
    }

    .filter-btn.active {
        background: #7C3AED;
        color: white;
        border-color: #7C3AED;
    }

    .search-input:focus {
        outline: none;
        border-color: #7C3AED;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }
`;
document.head.appendChild(style);
