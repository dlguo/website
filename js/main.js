/**
 * Personal Website - Main JavaScript
 * Handles: Dark Mode, Mobile Menu, Back-to-Top Button, Smooth Scrolling
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const themeToggle = document.querySelector('.theme-toggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const backToTop = document.querySelector('.back-to-top');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const body = document.body;

    // ============================================
    // Dark Mode Toggle
    // ============================================
    function initTheme() {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon(true);
        }
    }

    function toggleTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            updateThemeIcon(false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateThemeIcon(true);
        }
    }

    function updateThemeIcon(isDark) {
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                updateThemeIcon(true);
            } else {
                document.documentElement.removeAttribute('data-theme');
                updateThemeIcon(false);
            }
        }
    });

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    let navOverlay = null;

    function createNavOverlay() {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
        
        navOverlay.addEventListener('click', closeMenu);
    }

    function toggleMenu() {
        const isOpen = navMenu.classList.contains('active');
        
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    function openMenu() {
        navMenu.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        navOverlay.classList.add('active');
        body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        navOverlay.classList.remove('active');
        body.style.overflow = '';
    }

    // Close menu when clicking a nav link
    function handleNavLinkClick() {
        if (window.innerWidth <= 768) {
            closeMenu();
        }
    }

    // Close menu on resize if open and window becomes larger
    function handleResize() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    }

    // ============================================
    // Back to Top Button & Header Scroll State
    // ============================================
    function handleScroll() {
        const header = document.querySelector('header');
        
        // Show/hide back to top button
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Add scrolled class and shadow to header on scroll
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.classList.remove('scrolled');
            header.style.boxShadow = '';
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ============================================
    // Smooth Scroll for Navigation Links
    // ============================================
    function smoothScroll(e) {
        const href = this.getAttribute('href');
        
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    // ============================================
    // Keyboard Navigation
    // ============================================
    function handleKeyDown(e) {
        // Close menu on Escape key
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            menuToggle.focus();
        }
    }

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.research-item, .project-card, .education-item, .publication li'
        );
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ============================================
    // Initialize
    // ============================================
    function init() {
        // Initialize theme
        initTheme();
        
        // Create nav overlay for mobile
        createNavOverlay();
        
        // Initialize scroll animations
        initScrollAnimations();
        
        // Event Listeners
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMenu);
        }
        
        if (backToTop) {
            backToTop.addEventListener('click', scrollToTop);
        }
        
        // Nav link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
            link.addEventListener('click', handleNavLinkClick);
        });
        
        // Scroll events (throttled)
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    handleScroll();
                    scrollTimeout = null;
                }, 10);
            }
        });
        
        // Resize events
        window.addEventListener('resize', handleResize);
        
        // Keyboard events
        document.addEventListener('keydown', handleKeyDown);
        
        // Initial scroll check
        handleScroll();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
