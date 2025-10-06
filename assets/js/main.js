/**
 * Template Name: iPortfolio
 * Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
 * Updated: Jun 29 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function() {
    "use strict";

    /**
     * Header toggle
     */
    const headerToggleBtn = document.querySelector('.header-toggle');

    function headerToggle() {
        document.querySelector('#header').classList.toggle('header-show');
        headerToggleBtn.classList.toggle('bi-list');
        headerToggleBtn.classList.toggle('bi-x');
    }
    headerToggleBtn.addEventListener('click', headerToggle);

    /**
     * Hide mobile nav on same-page/hash links
     */
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
        navmenu.addEventListener('click', () => {
            if (document.querySelector('.header-show')) {
                headerToggle();
            }
        });

    });

    /**
     * Toggle mobile nav dropdowns
     */
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
        navmenu.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentNode.classList.toggle('active');
            this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
            e.stopImmediatePropagation();
        });
    });

    /**
     * Preloader
     */
    const preloader = document.querySelector('#preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.remove();
        });
    }

    /**
     * Scroll top button
     */
    let scrollTop = document.querySelector('.scroll-top');

    function toggleScrollTop() {
        if (scrollTop) {
            window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
        }
    }
    scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);

    /**
     * Animation on scroll function and init
     */
    function aosInit() {
        AOS.init({
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    window.addEventListener('load', aosInit);

    /**
     * Init typed.js
     */
    const selectTyped = document.querySelector('.typed');
    if (selectTyped) {
        let typed_strings = selectTyped.getAttribute('data-typed-items');
        typed_strings = typed_strings.split(',');
        new Typed('.typed', {
            strings: typed_strings,
            loop: true,
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000
        });
    }

    /**
     * Initiate Pure Counter
     */
    new PureCounter();

    /**
     * Animate the skills items on reveal
     */
    let skillsAnimation = document.querySelectorAll('.skills-animation');
    skillsAnimation.forEach((item) => {
        new Waypoint({
            element: item,
            offset: '80%',
            handler: function(direction) {
                let progress = item.querySelectorAll('.progress .progress-bar');
                progress.forEach(el => {
                    el.style.width = el.getAttribute('aria-valuenow') + '%';
                });
            }
        });
    });

    /**
     * Init isotope layout and filters
     */
    document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
        let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
        let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
        let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

        let initIsotope;
        imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
            initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
                itemSelector: '.isotope-item',
                layoutMode: layout,
                filter: filter,
                sortBy: sort
            });
        });

        isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
            filters.addEventListener('click', function() {
                isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
                this.classList.add('filter-active');
                initIsotope.arrange({
                    filter: this.getAttribute('data-filter')
                });
                if (typeof aosInit === 'function') {
                    aosInit();
                }
            }, false);
        });

    });

    /**
     * Builds and initializes all dynamic portfolio sliders.
     */
    function buildAndInitPortfolios() {

        // Helper function to extract YouTube video ID from various URL formats
        function getYoutubeID(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        }

        document.querySelectorAll('.portfolio-project-dynamic').forEach((projectElement, projectIndex) => {
            const mediaDataScript = projectElement.querySelector('.project-media-data');
            const slideshowContainer = projectElement.querySelector('.slideshow-container');

            if (!mediaDataScript || !slideshowContainer) {
                console.error('Skipping a dynamic project block because it is missing data or a slideshow container.', projectElement);
                return;
            }

            try {
                const mediaItems = JSON.parse(mediaDataScript.innerHTML.trim());
                const galleryId = `project-gallery-${projectIndex + 1}`;

                let mainSlidesHTML = '';
                let thumbSlidesHTML = '';

                mediaItems.forEach(item => {
                    if (item.type === 'image') {
                        mainSlidesHTML += `
            <div class="swiper-slide">
              <a href="${item.url}" class="glightbox" data-gallery="${galleryId}">
                <img src="${item.url}" alt="Project media">
              </a>
            </div>`;
                        thumbSlidesHTML += `
            <div class="swiper-slide">
              <img src="${item.url}" alt="Project thumbnail">
            </div>`;
                    } else if (item.type === 'video') {
                        const videoId = getYoutubeID(item.url);
                        if (videoId) {
                            mainSlidesHTML += `
              <div class="swiper-slide">
                <div class="ratio ratio-16x9">
                  <iframe src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
              </div>`;
                            thumbSlidesHTML += `
              <div class="swiper-slide thumb-video">
                <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video thumbnail">
                <i class="bi bi-play-fill"></i>
              </div>`;
                        }
                    } else if (item.type === 'gdrive-video') {
                        if (item.url && item.thumbUrl) {
                            mainSlidesHTML += `
        <div class="swiper-slide">
          <div class="ratio ratio-16x9">
            <iframe src="${item.url}" title="Google Drive video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div>`;
                            thumbSlidesHTML += `
        <div class="swiper-slide thumb-video">
          <img src="${item.thumbUrl}" alt="Google Drive video thumbnail">
          <i class="bi bi-play-circle-fill"></i>
        </div>`;
                        }

                    }
                });

                // Assemble the complete HTML for the slideshow and its thumbs
                const fullSlideshowHTML = `
        <div class="portfolio-details-slider swiper">
          <div class="swiper-wrapper align-items-center">${mainSlidesHTML}</div>
        </div>
        <div class="thumbs-container">
          <div class="swiper-button-prev"></div>
          <div class="swiper thumbs-slider">
            <div class="swiper-wrapper">${thumbSlidesHTML}</div>
            <div class="swiper-scrollbar"></div>
          </div>
          <div class="swiper-button-next"></div>
        </div>`;

                // Inject the generated HTML into the placeholder
                slideshowContainer.innerHTML = fullSlideshowHTML;

                // HIDE THUMBNAILS IF THERE IS ONLY ONE ITEM
                if (mediaItems.length <= 1) {
                    const thumbsContainer = slideshowContainer.querySelector('.thumbs-container');
                    if (thumbsContainer) {
                        thumbsContainer.style.display = 'none';
                    }
                }

            } catch (e) {
                console.error('Failed to parse JSON or build slideshow for project:', projectElement, e);
            }
        });

        // Now that all slideshows are built, initialize them
        initAllSwipers();

        GLightbox({
            selector: '.glightbox'
        });
    }

    /**
     * Initializes all Swiper instances on the page (portfolio and others).
     * This function is now called AFTER the dynamic HTML has been built.
     */
    function initAllSwipers() {
        // Portfolio sliders with thumbs
        document.querySelectorAll('.slideshow-container').forEach(function(container) {
            const mainSliderEl = container.querySelector('.portfolio-details-slider');
            const thumbsSliderEl = container.querySelector('.thumbs-slider');
            if (!mainSliderEl || !thumbsSliderEl) return;

            const thumbsSwiper = new Swiper(thumbsSliderEl, {
                spaceBetween: 10,
                slidesPerView: 'auto',
                freeMode: true,
                watchSlidesProgress: true,
                scrollbar: {
                    el: thumbsSliderEl.querySelector('.swiper-scrollbar'),
                    draggable: true,
                },
            });

            new Swiper(mainSliderEl, {
                loop: false,
                effect: 'coverflow',
                speed: 600,
                autoplay: false,
                navigation: {
                    nextEl: container.querySelector('.thumbs-container .swiper-button-next'),
                    prevEl: container.querySelector('.thumbs-container .swiper-button-prev'),
                },
                thumbs: {
                    swiper: thumbsSwiper,
                },
            });
        });

        // Initialize any other simple swipers on the page here (e.g., testimonials)
        // Example: new Swiper('.testimonials-slider', { ... });
    }

// Run the main build function when the page content is loaded
    window.addEventListener('DOMContentLoaded', buildAndInitPortfolios);

    /**
     * Correct scrolling position upon page load for URLs containing hash links.
     */
    window.addEventListener('load', function(e) {
        if (window.location.hash) {
            if (document.querySelector(window.location.hash)) {
                setTimeout(() => {
                    let section = document.querySelector(window.location.hash);
                    let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
                    window.scrollTo({
                        top: section.offsetTop - parseInt(scrollMarginTop),
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    });

    /**
     * Navmenu Scrollspy
     */
    let navmenulinks = document.querySelectorAll('.navmenu a');

    function navmenuScrollspy() {
        navmenulinks.forEach(navmenulink => {
            if (!navmenulink.hash) return;
            let section = document.querySelector(navmenulink.hash);
            if (!section) return;
            let position = window.scrollY + 200;
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
                navmenulink.classList.add('active');
            } else {
                navmenulink.classList.remove('active');
            }
        })
    }
    window.addEventListener('load', navmenuScrollspy);
    document.addEventListener('scroll', navmenuScrollspy);

})();