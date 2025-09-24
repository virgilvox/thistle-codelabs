/**
 * Thistle Codelab Framework
 * Enhanced functionality for reveal.js presentations
 */

class ThistleCodelab {
  constructor(config = {}) {
    this.config = {
      copyButtonText: 'Copy',
      copiedText: '✓ Copied',
      copyTimeout: 2000,
      ...config
    };

    this.init();
  }

  init() {
    this.addCopyButtons();
    this.enhanceCodeBlocks();
    this.setupProgressTracking();
    this.setupKeyboardShortcuts();
    this.setupAccessibility();
  }

  // Add copy buttons to code blocks
  addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach((codeBlock, index) => {
      const pre = codeBlock.parentElement;
      const button = document.createElement('button');

      button.className = 'copy-button';
      button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>`;
      button.setAttribute('aria-label', `Copy code block ${index + 1}`);
      button.setAttribute('title', 'Copy to clipboard');

      // Style the button
      Object.assign(button.style, {
        position: 'absolute',
        top: '0.75rem',
        right: '0.75rem',
        background: 'var(--primary)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-medium)',
        borderRadius: '6px',
        padding: '0.5rem',
        fontSize: '0.75rem',
        fontWeight: '500',
        cursor: 'pointer',
        opacity: '0',
        transition: 'all 0.2s ease',
        zIndex: '10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px'
      });

      // Make pre relative for absolute positioning
      pre.style.position = 'relative';

      // Show button on hover
      pre.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
      });

      pre.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
      });

      // Copy functionality
      button.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(codeBlock.textContent);
          button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>`;
          button.style.background = 'var(--success)';
          button.setAttribute('title', 'Copied!');

          setTimeout(() => {
            button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>`;
            button.style.background = 'var(--primary)';
            button.setAttribute('title', 'Copy to clipboard');
          }, this.config.copyTimeout);
        } catch (err) {
          console.error('Failed to copy text: ', err);
          // Fallback for older browsers
          this.fallbackCopy(codeBlock.textContent);
        }
      });

      pre.appendChild(button);
    });
  }

  // Fallback copy method for older browsers
  fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }

    document.body.removeChild(textArea);
  }

  // Enhance code blocks with syntax highlighting hints
  enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(codeBlock => {
      // Add language detection
      const text = codeBlock.textContent;

      if (text.includes('#!/bin/bash') || text.includes('curl ') || text.includes('sudo ')) {
        codeBlock.className += ' language-bash';
      } else if (text.includes('export ') || text.includes('./trh ') || text.includes('./tuc ')) {
        codeBlock.className += ' language-bash';
      } else if (text.includes('{') && text.includes('}') && text.includes('"')) {
        codeBlock.className += ' language-json';
      }
    });
  }

  // Setup progress tracking
  setupProgressTracking() {
    const totalSlides = Reveal.getTotalSlides();
    const progressContainer = document.createElement('div');
    progressContainer.className = 'codelab-progress';

    Object.assign(progressContainer.style, {
      position: 'fixed',
      top: '1rem',
      left: '1rem',
      background: 'rgba(20, 179, 194, 0.9)',
      color: 'var(--bg-primary)',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      fontSize: '0.875rem',
      fontWeight: '500',
      zIndex: '100'
    });

    document.body.appendChild(progressContainer);

    const updateProgress = () => {
      const currentSlide = Reveal.getIndices().h + 1;
      progressContainer.textContent = `${currentSlide} / ${totalSlides}`;
    };

    Reveal.addEventListener('slidechanged', updateProgress);
    updateProgress(); // Initial call
  }

  // Setup custom keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // 'C' key to copy current slide's first code block
      if (event.key === 'c' && !event.metaKey && !event.ctrlKey) {
        const currentSlide = Reveal.getCurrentSlide();
        const firstCodeBlock = currentSlide.querySelector('pre code');

        if (firstCodeBlock) {
          navigator.clipboard.writeText(firstCodeBlock.textContent).then(() => {
            this.showToast('Code copied to clipboard!');
          });
        }
      }

      // 'T' key to toggle between light and dark theme
      if (event.key === 't' && !event.metaKey && !event.ctrlKey) {
        this.toggleTheme();
      }
    });
  }

  // Setup accessibility enhancements
  setupAccessibility() {
    // Add skip navigation
    const skipNav = document.createElement('a');
    skipNav.href = '#main-content';
    skipNav.textContent = 'Skip to main content';
    skipNav.className = 'skip-nav';

    Object.assign(skipNav.style, {
      position: 'absolute',
      top: '-40px',
      left: '6px',
      background: 'var(--thistle-primary)',
      color: 'var(--bg-primary)',
      padding: '8px',
      textDecoration: 'none',
      borderRadius: '4px',
      zIndex: '1000'
    });

    skipNav.addEventListener('focus', () => {
      skipNav.style.top = '6px';
    });

    skipNav.addEventListener('blur', () => {
      skipNav.style.top = '-40px';
    });

    document.body.insertBefore(skipNav, document.body.firstChild);

    // Add main content landmark
    const slides = document.querySelector('.reveal .slides');
    slides.id = 'main-content';
    slides.setAttribute('role', 'main');
    slides.setAttribute('aria-label', 'Codelab presentation slides');

    // Improve slide navigation announcements
    Reveal.addEventListener('slidechanged', (event) => {
      const currentSlide = event.currentSlide;
      const slideTitle = currentSlide.querySelector('h1, h2, h3');

      if (slideTitle) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Slide: ${slideTitle.textContent}`;

        document.body.appendChild(announcement);

        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      }
    });
  }

  // Show toast notification
  showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = 'toast';

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--success)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '4px',
      fontSize: '0.875rem',
      fontWeight: '500',
      zIndex: '1000',
      opacity: '0',
      transition: 'opacity 0.3s ease'
    });

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  }

  // Toggle theme (placeholder for future implementation)
  toggleTheme() {
    // This could toggle between light/dark themes
    console.log('Theme toggle - future feature');
  }

  // Utility method to check if step is completed
  markStepComplete(stepId) {
    const step = document.querySelector(`[data-step="${stepId}"]`);
    if (step) {
      step.classList.add('completed');
      step.setAttribute('aria-label', `Step ${stepId} completed`);
    }
  }

  // Method to validate prerequisites
  validatePrerequisites() {
    // This could check if user has completed previous steps
    // Useful for interactive codelabs
    return true;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for Reveal.js to initialize
  Reveal.addEventListener('ready', () => {
    window.thistleCodelab = new ThistleCodelab();
  });
});

// Screen reader only utility class
const srOnlyStyles = `
  .sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    border: 0 !important;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = srOnlyStyles;
document.head.appendChild(styleSheet);