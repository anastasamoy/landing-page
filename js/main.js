document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Add padding to body to account for fixed header
    document.body.style.paddingTop = document.querySelector('.header').offsetHeight + 'px';

    // Optional: Add shadow to header when scrolling
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 0) {
            header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    const contactForm = document.querySelector('.contact__form');
    if (contactForm) {
        const feedbackEl = contactForm.querySelector('.contact__feedback');
        const submitBtn = contactForm.querySelector('.contact__submit');

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (feedbackEl) {
                feedbackEl.style.color = 'rgba(0, 0, 0, 0.75)';
                feedbackEl.textContent = 'Odosielame správu...';
            }

            if (submitBtn) {
                submitBtn.disabled = true;
            }

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    headers: { 'Accept': 'application/json' },
                    body: formData
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || `Unexpected response: ${response.status}`);
                }

                contactForm.reset();

                if (feedbackEl) {
                    feedbackEl.style.color = 'var(--primary)';
                    feedbackEl.textContent = 'Ďakujeme! Správu sme prijali.';
                }
            } catch (error) {
                if (feedbackEl) {
                    feedbackEl.style.color = '#d11a2a';
                    feedbackEl.textContent = 'Momentálne sa nám nepodarilo odoslať formulár. Napíšte prosím priamo na anastasamoy@gmail.com.';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                }
            }
        });
    }
});