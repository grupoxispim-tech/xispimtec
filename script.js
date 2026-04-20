// ========================================
// VARIÃVEIS GLOBAIS
// ========================================

const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contactForm');
const reviewForm = document.getElementById('reviewForm');
const reviewsList = document.getElementById('reviewsList');
const reviewsStatus = document.getElementById('reviewsStatus');
const privacyLink = document.querySelector('.privacy-link');
const privacyModal = document.getElementById('privacyModal');
const modalClose = document.querySelector('.modal-close');

const reviewsConfig = window.REVIEWS_DB_CONFIG || {};
const supabaseUrl = (reviewsConfig.supabaseUrl || '').trim();
const supabaseAnonKey = (reviewsConfig.supabaseAnonKey || '').trim();
const hasReviewsDbConfig = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('SEU') &&
    !supabaseAnonKey.includes('SEU')
);

// ========================================
// MENU RESPONSIVO
// ========================================

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ========================================
// NAVBAR STICKY COM EFEITO
// ========================================

// scroll handler removido (navbar não é mais fixa)

// ========================================
// FORMULÃRIO DE CONTATO
// ========================================

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validação básica
        if (!name || !phone || !message) {
            showNotification('Por favor, preencha todos os campos obrigatórios (*).', 'error');
            return;
        }

        // Formatar mensagem para WhatsApp
        const whatsappMessage = `
*NOVO CONTATO DO SITE XISPIMTEC*

*Nome:* ${name}
*Telefone:* ${phone}
${email ? `*E-mail:* ${email}` : ''}
*Mensagem:* ${message}
        `.trim();

        // Codificar mensagem
        const encodedMessage = encodeURIComponent(whatsappMessage);

        // Redirecionar para WhatsApp
        const whatsappUrl = `https://wa.me/5547992505922?text=${encodedMessage}`;

        // Mostrar mensagem de sucesso
        showNotification('Redirecionando para WhatsApp...', 'success');

        // Limpar formulário
        setTimeout(() => {
            contactForm.reset();
            window.open(whatsappUrl, '_blank');
        }, 1000);
    });
}

// ========================================
// FORMULÁRIO DE AVALIAÇÃO
// ========================================

if (reviewForm) {
    const ratingInput = document.getElementById('reviewRating');
    const ratingStars = reviewForm.querySelectorAll('.rating-star');
    const ratingAverageEl = document.getElementById('ratingAverage');
    const ratingPct5El = document.getElementById('ratingPct5');
    const ratingPct4El = document.getElementById('ratingPct4');
    const ratingPct3El = document.getElementById('ratingPct3');
    const ratingPct2El = document.getElementById('ratingPct2');
    const ratingTotalCountEl = document.getElementById('ratingTotalCount');

    const escapeHtml = (value) => {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const renderRatingStats = (reviews) => {
        if (!reviews.length) {
            ratingAverageEl.textContent = '-';
            ratingPct5El.textContent = '0%';
            ratingPct4El.textContent = '0%';
            ratingPct3El.textContent = '0%';
            ratingPct2El.textContent = '0%';
            ratingTotalCountEl.textContent = 'Baseado em 0 avaliações verificadas.';
            return;
        }

        const total = reviews.length;
        const sum = reviews.reduce((acc, item) => acc + Number(item.rating || 0), 0);
        const average = (sum / total).toFixed(1);
        const five = reviews.filter((item) => Number(item.rating) === 5).length;
        const four = reviews.filter((item) => Number(item.rating) === 4).length;
        const three = reviews.filter((item) => Number(item.rating) === 3).length;
        const twoOrLess = reviews.filter((item) => Number(item.rating) <= 2).length;

        const pct = (value) => `${Math.round((value / total) * 100)}%`;

        ratingAverageEl.textContent = average;
        ratingPct5El.textContent = pct(five);
        ratingPct4El.textContent = pct(four);
        ratingPct3El.textContent = pct(three);
        ratingPct2El.textContent = pct(twoOrLess);
        ratingTotalCountEl.textContent = `Baseado em ${total} avaliações verificadas.`;
    };

    const renderReviews = (reviews) => {
        if (!reviewsList) {
            return;
        }

        if (!reviews.length) {
            reviewsList.innerHTML = '';
            if (reviewsStatus) {
                reviewsStatus.textContent = 'Ainda não há comentários publicados.';
            }
            return;
        }

        if (reviewsStatus) {
            reviewsStatus.textContent = `${reviews.length} comentário(s) mais recente(s).`;
        }

        reviewsList.innerHTML = reviews.map((item) => {
            const safeName = escapeHtml(item.name || 'Cliente');
            const safeComment = escapeHtml(item.comment || '');
            const rating = Math.max(1, Math.min(5, Number(item.rating || 0)));
            const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
            const createdAt = item.created_at ? new Date(item.created_at) : null;
            const dateText = createdAt && !Number.isNaN(createdAt.getTime())
                ? createdAt.toLocaleDateString('pt-BR')
                : 'agora';

            return `
                <article class="review-item">
                    <div class="review-item-header">
                        <span class="review-item-name">${safeName}</span>
                        <span class="review-item-date">${dateText}</span>
                    </div>
                    <div class="review-item-stars" aria-label="${rating} de 5 estrelas">${stars}</div>
                    <p class="review-item-comment">${safeComment}</p>
                </article>
            `;
        }).join('');
    };

    const setConfigMessage = () => {
        renderRatingStats([]);
        if (reviewsStatus) {
            reviewsStatus.textContent = 'Configure o banco para ativar comentários permanentes para todos.';
        }
    };

    const fetchReviews = async () => {
        if (!hasReviewsDbConfig) {
            setConfigMessage();
            return;
        }

        if (reviewsStatus) {
            reviewsStatus.textContent = 'Carregando comentários...';
        }

        try {
            const endpoint = `${supabaseUrl}/rest/v1/reviews?select=id,name,rating,comment,created_at&order=created_at.desc&limit=50`;
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    apikey: supabaseAnonKey,
                    Authorization: `Bearer ${supabaseAnonKey}`
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar comentários');
            }

            const reviews = await response.json();
            renderRatingStats(reviews);
            renderReviews(reviews);
        } catch (error) {
            renderRatingStats([]);
            if (reviewsStatus) {
                reviewsStatus.textContent = 'Não foi possível carregar os comentários agora.';
            }
        }
    };

    const paintStars = (value) => {
        ratingStars.forEach((star) => {
            const starValue = Number(star.dataset.rating);
            const icon = star.querySelector('i');

            if (starValue <= value) {
                star.classList.add('active');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            } else {
                star.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            }
        });
    };

    ratingStars.forEach((star) => {
        star.addEventListener('click', () => {
            const selectedValue = Number(star.dataset.rating);
            ratingInput.value = selectedValue;
            paintStars(selectedValue);
        });
    });

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('reviewName').value.trim();
        const comment = document.getElementById('reviewComment').value.trim();
        const rating = Number(ratingInput.value);

        if (!name || !comment || rating < 1) {
            showNotification('Preencha nome, comentário e escolha uma nota de 1 a 5 estrelas.', 'error');
            return;
        }

        if (!hasReviewsDbConfig) {
            showNotification('Configure o banco para salvar comentários para todos os visitantes.', 'error');
            return;
        }

        const payload = {
            name: name.slice(0, 80),
            rating,
            comment: comment.slice(0, 1000)
        };

        fetch(`${supabaseUrl}/rest/v1/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Prefer: 'return=representation',
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`
            },
            body: JSON.stringify(payload)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Falha ao salvar comentário');
                }

                showNotification('Comentário publicado com sucesso!', 'success');
                reviewForm.reset();
                ratingInput.value = '0';
                paintStars(0);
                fetchReviews();
            })
            .catch(() => {
                showNotification('Não foi possível salvar o comentário agora.', 'error');
            });
    });

    fetchReviews();
}

// ========================================
// NOTIFICAÃ‡Ã•ES
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 20px 25px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #2A9DCC, #53BCE6)' : type === 'error' ? '#ff6b6b' : '#2A9DCC'};
        color: ${type === 'success' ? '#0a1a1a' : 'white'};
        border-radius: 8px;
        box-shadow: 0 6px 30px rgba(42, 157, 204, 0.3);
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ========================================
// MODAL POLÃTICA DE PRIVACIDADE
// ========================================

if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        privacyModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
}

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    if (e.target === privacyModal) {
        privacyModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// ========================================
// ANIMAÃ‡Ã•ES AO SCROLL
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animaÃ§Ã£o
document.querySelectorAll('.service-card, .testimonial-card, .portfolio-item, .differential-item, .stat-card').forEach(el => {
    observer.observe(el);
});

// ========================================
// SCROLL SUAVE
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') {
            e.preventDefault();
            return;
        }
        if (document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// CONTADOR DE ESTATÃSTICAS (ANIMAÃ‡ÃƒO)
// ========================================

function animateCounter(element, target) {
    const duration = 2000;
    const start = Date.now();
    const startValue = 0;

    const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Extrair nÃºmero do texto target
        const numericTarget = parseInt(target.toString().replace(/\D/g, ''));
        const current = Math.floor(numericTarget * progress);
        
        element.textContent = current + (target.includes('%') ? '%' : target.includes('+') ? '+' : '');
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target;
        }
    };

    requestAnimationFrame(animate);
}

// Observar stats para ativar animaÃ§Ã£o
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumber = entry.target.querySelector('.stat-number');
            const targetValue = statNumber.textContent;
            animateCounter(statNumber, targetValue);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => {
    statsObserver.observe(card);
});

// ========================================
// EFEITO PARALLAX SUAVE
// ========================================

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Parallax na hero
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `0 ${scrolled * 0.5}px`;
    }

    // Parallax nos Ã­cones
    const hexElements = document.querySelectorAll('.hex');
    hexElements.forEach((hex, index) => {
        hex.style.transform = `translateY(${scrolled * (0.1 + index * 0.05)}px)`;
    });
});

// ========================================
// VALIDAÃ‡ÃƒO DE TELEFONE
// ========================================

const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 2) {
                value = `(${value}`;
            } else if (value.length <= 7) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
            }
        }
        
        e.target.value = value;
    });
}

// ========================================
// VALIDAÃ‡ÃƒO DE E-MAIL EM TEMPO REAL
// ========================================

const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            showNotification('Por favor, insira um e-mail válido.', 'error');
        }
    });
}

// ========================================
// EFEITO NO HOVER DE CARDS
// ========================================

const cards = document.querySelectorAll('.service-card, .testimonial-card, .portfolio-item');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// LAZY LOADING DE IMAGENS
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========================================
// DETECÃ‡ÃƒO DE DISPOSITIVO MÃ“VEL
// ========================================

const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// ========================================
// OTIMIZAÃ‡ÃƒO DE PERFORMANCE
// ========================================

// Debounce para eventos de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle para eventos contÃ­nuos
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// PRELOAD DE RECURSOS
// ========================================

// Precarregar fontes do Google Fonts
const link = document.createElement('link');
link.rel = 'preconnect';
link.href = 'https://fonts.googleapis.com';
document.head.appendChild(link);

// ========================================
// DARK MODE DETECTOR
// ========================================

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
if (prefersDark.matches) {
    document.documentElement.style.colorScheme = 'dark';
}

// ========================================
// INICIALIZAÃ‡ÃƒO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // AnimaÃ§Ã£o ao carregar
    document.body.style.animation = 'fadeIn 0.5s ease-out';
    
    // Log de inicialização (remover em produção)
    console.log('%cXispimtec - Site carregado com sucesso!', 'color: #2A9DCC; font-size: 14px; font-weight: bold;');
});

// ========================================
// SERVICE WORKER (PWA - OPCIONAL)
// ========================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service Worker nÃ£o disponÃ­vel
    });
}

// ========================================
// ANALYTICS (Google Analytics - OPCIONAL)
// ========================================

// Descomente e configure com seu ID do GA
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_ID');
*/

// ========================================
// FEEDBACK DE CLIQUES
// ========================================

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Criar ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ========================================
// FUNCIONALIDADES EXTRAS
// ========================================

// Copiar telefone
document.querySelectorAll('.contact-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.classList.contains('copy-phone')) {
            e.preventDefault();
            const phone = this.textContent;
            navigator.clipboard.writeText(phone).then(() => {
                showNotification('Telefone copiado para a área de transferência!', 'success');
            });
        }
    });
});

// ========================================
// SUPORTE A TEMAS (FUTURO)
// ========================================

// Sistema de temas pronto para expansÃ£o
const theme = {
    current: 'dark',
    toggle: function() {
        this.current = this.current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.current);
    }
};

// ========================================
// MONITORAMENTO DE PERFORMANCE
// ========================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`%cTempo de carregamento: ${loadTime.toFixed(0)}ms`, 'color: #2A9DCC; font-weight: bold;');
    });
}

// ========================================
// EASTERGG - COMANDO SECRETO
// ========================================

let keyPresses = [];
const secretCode = ['x', 'i', 's', 'p', 'i', 'm'];

document.addEventListener('keydown', (e) => {
    keyPresses.push(e.key.toLowerCase());
    keyPresses = keyPresses.slice(-secretCode.length);
    
    if (keyPresses.join('') === secretCode.join('')) {
        document.documentElement.style.filter = 'hue-rotate(180deg)';
        setTimeout(() => {
            document.documentElement.style.filter = 'hue-rotate(0deg)';
            showNotification('Você descobriu o modo invertido!', 'success');
        }, 500);
        keyPresses = [];
    }
});

// ========================================
// FIM DO SCRIPT
// ========================================

