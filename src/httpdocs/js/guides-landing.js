// Guides Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('guide-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const guideCards = document.querySelectorAll('.guide-card, .featured-card');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterGuides(searchTerm, getActiveFilter());
        });
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
            filterGuides(searchTerm, filter);
        });
    });

    function getActiveFilter() {
        const activeButton = document.querySelector('.filter-btn.active');
        return activeButton ? activeButton.dataset.filter : 'all';
    }

    function filterGuides(searchTerm, categoryFilter) {
        guideCards.forEach(card => {
            const title = card.querySelector('h3');
            const description = card.querySelector('p');
            const tags = card.querySelectorAll('.tag');
            const cardCategory = card.dataset.category;

            if (!title || !description) return;

            const titleText = title.textContent.toLowerCase();
            const descText = description.textContent.toLowerCase();
            const tagTexts = Array.from(tags).map(tag => tag.textContent.toLowerCase());

            // Check search term match
            const matchesSearch = !searchTerm ||
                titleText.includes(searchTerm) ||
                descText.includes(searchTerm) ||
                tagTexts.some(tag => tag.includes(searchTerm));

            // Check category filter
            const matchesCategory = categoryFilter === 'all' || cardCategory === categoryFilter;

            // Show/hide card
            if (matchesSearch && matchesCategory) {
                card.classList.remove('hidden');
                card.style.display = 'block';
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // Update results count
        updateResultsCount();
    }

    function updateResultsCount() {
        const visibleCards = document.querySelectorAll('.guide-card:not(.hidden)');
        const searchInput = document.getElementById('guide-search');
        
        if (searchInput && visibleCards.length === 0 && searchInput.value.trim() !== '') {
            showNoResults();
        } else {
            hideNoResults();
        }
    }

    function showNoResults() {
        let noResultsDiv = document.querySelector('.no-results');
        if (!noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results';
            noResultsDiv.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <h3 style="color: var(--text-primary); margin-bottom: 1rem;">No guides found</h3>
                    <p>Try adjusting your search terms or browse all guides.</p>
                </div>
            `;
            const guidesGrid = document.getElementById('guides-grid');
            if (guidesGrid) {
                guidesGrid.appendChild(noResultsDiv);
            }
        }
        noResultsDiv.style.display = 'block';
    }

    function hideNoResults() {
        const noResultsDiv = document.querySelector('.no-results');
        if (noResultsDiv) {
            noResultsDiv.style.display = 'none';
        }
    }

    // Initialize on page load
    if (filterButtons.length > 0) {
        filterGuides('', 'all');
    }

    // Add smooth scrolling for anchor links
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
    const images = document.querySelectorAll('.guide-image img, .featured-image img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
    });
});
