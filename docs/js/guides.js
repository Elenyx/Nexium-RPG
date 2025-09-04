// Guides JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for table of contents
    const tocLinks = document.querySelectorAll('.toc-nav a');

    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active TOC link
                tocLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Highlight active TOC section on scroll
    const sections = document.querySelectorAll('h2[id], h3[id]');
    const tocNav = document.querySelector('.toc-nav');

    if (sections.length > 0 && tocNav) {
        window.addEventListener('scroll', function() {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            tocLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Copy code blocks functionality
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.title = 'Copy to clipboard';

        pre.style.position = 'relative';
        pre.appendChild(copyButton);

        copyButton.addEventListener('click', function() {
            const text = block.textContent;
            navigator.clipboard.writeText(text).then(function() {
                copyButton.textContent = 'Copied!';
                copyButton.classList.add('copied');

                setTimeout(function() {
                    copyButton.textContent = 'Copy';
                    copyButton.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // Article reading progress
    const article = document.querySelector('.main-article');
    if (article) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;

            const progress = Math.min(100, Math.max(0,
                ((scrollTop - articleTop + windowHeight) / articleHeight) * 100
            ));

            progressBar.style.width = progress + '%';
        });
    }
});

// Add CSS for copy button and progress bar
const style = document.createElement('style');
style.textContent = `
    .copy-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        opacity: 0;
        transition: opacity 0.2s;
    }

    pre:hover .copy-button {
        opacity: 1;
    }

    .copy-button.copied {
        background: #10b981;
    }

    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #7C3AED, #3B82F6);
        z-index: 1000;
        transition: width 0.1s ease;
    }

    .toc-nav a.active {
        color: #7C3AED;
        border-left-color: #7C3AED;
        font-weight: 600;
    }
`;
document.head.appendChild(style);
