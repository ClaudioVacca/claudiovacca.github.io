(function() {
    "use strict";

    /**
     * Header toggle
     */
    const headerToggleBtn = document.querySelector('.header-toggle');
    if (headerToggleBtn) {
        function headerToggle() {
            document.querySelector('#header').classList.toggle('header-show');
            headerToggleBtn.classList.toggle('bi-list');
            headerToggleBtn.classList.toggle('bi-x');
        }
        headerToggleBtn.addEventListener('click', headerToggle);
    }

    /**
     * Hide mobile nav on same-page hash links
     */
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
        navmenu.addEventListener('click', () => {
            if (document.querySelector('.header-show')) {
                headerToggleBtn.click();
            }
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
    if (scrollTop) {
        scrollTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

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
     * Builds and initializes all dynamic portfolio sliders.
     */
    function buildAndInitPortfolios() {
        function getYoutubeID(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        }

        document.querySelectorAll('.portfolio-project-dynamic').forEach((projectElement, projectIndex) => {
            const mediaDataScript = projectElement.querySelector('.project-media-data');
            const slideshowContainer = projectElement.querySelector('.slideshow-container');
            if (!mediaDataScript || !slideshowContainer) return;

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
                  <img src="${item.url}" alt="Project media" loading="lazy">
                </a>
              </div>`;
                        thumbSlidesHTML += `
              <div class="swiper-slide">
                <img src="${item.url}" alt="Project thumbnail" loading="lazy">
              </div>`;
                    } else if (item.type === 'video') {
                        const videoId = getYoutubeID(item.url);
                        if (videoId) {
                            // OPTIMIZED: Create a placeholder div instead of an iframe
                            mainSlidesHTML += `
                <div class="swiper-slide">
                  <div class="video-placeholder ratio ratio-16x9" data-video-id="${videoId}">
                    <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video Thumbnail" loading="lazy">
                    <div class="play-button-overlay"><i class="bi bi-play-circle-fill"></i></div>
                  </div>
                </div>`;
                            thumbSlidesHTML += `
                <div class="swiper-slide thumb-video">
                  <img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video thumbnail" loading="lazy">
                  <i class="bi bi-play-fill"></i>
                </div>`;
                        }
                    }
                });

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

                slideshowContainer.innerHTML = fullSlideshowHTML;
                if (mediaItems.length <= 1) {
                    const thumbsContainer = slideshowContainer.querySelector('.thumbs-container');
                    if (thumbsContainer) thumbsContainer.style.display = 'none';
                }

            } catch (e) {
                console.error('Failed to parse JSON or build slideshow for project', projectElement, e);
            }
        });

        initAllSwipers();
        GLightbox({
            selector: '.glightbox'
        });
    }

    /**
     * Initializes all Swiper instances.
     */
    function initAllSwipers() {
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
    }

    /**
     * NEW: Handles clicks on video placeholders to lazy-load the YouTube iframe.
     */
    function initializeVideoLazyLoading() {
        document.body.addEventListener('click', function(event) {
            const placeholder = event.target.closest('.video-placeholder');
            if (!placeholder) return;

            const videoId = placeholder.dataset.videoId;
            if (!videoId) return;

            // Create the iframe HTML string
            const iframeHtml = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

            // Replace the placeholder's content with the iframe
            placeholder.innerHTML = iframeHtml;
        });
    }


    /**
     * Main function to initialize the portfolio grid correctly.
     */
    function initializePortfolioGrid() {
        buildAndInitPortfolios();
        initializeVideoLazyLoading(); // Activate the video click handler

        const isotopeLayout = document.querySelector('.isotope-layout');
        if (!isotopeLayout) return;

        const isotopeContainer = isotopeLayout.querySelector('.isotope-container');
        const filters = isotopeLayout.querySelectorAll('.isotope-filters li');

        imagesLoaded(isotopeContainer, function() {
            let layout = isotopeLayout.getAttribute('data-layout') || 'masonry';
            let filter = isotopeLayout.getAttribute('data-default-filter') || '*';
            let sort = isotopeLayout.getAttribute('data-sort') || 'original-order';

            const initIsotope = new Isotope(isotopeContainer, {
                itemSelector: '.isotope-item',
                layoutMode: layout,
                filter: filter,
                sortBy: sort
            });

            filters.forEach(function(el) {
                el.addEventListener('click', function() {
                    isotopeLayout.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
                    this.classList.add('filter-active');
                    initIsotope.arrange({
                        filter: this.getAttribute('data-filter')
                    });
                }, false);
            });
        });
    }

    window.addEventListener('load', initializePortfolioGrid);

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