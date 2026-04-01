// Configuration des 12 photos avec messages personnalisés
const photos = [
    {
        url: "photos/photo1.jpeg",
        message: "✨ Depuis que je t'ai rencontrée, ma vie a pris des couleurs magnifiques ✨"
    },
    {
        url: "photos/photo2.jpeg",
        message: "💕 Ton sourire est la plus belle chose que j'ai vue dans ma vie 💕"
    },
    {
        url: "photos/photo3.jpeg",
        message: "🌹 Chaque jour passé avec toi est un cadeau précieux 🌹"
    },
    {
        url: "photos/photo4.jpeg",
        message: "⭐️ Tu es la raison pour laquelle je me lève chaque matin avec le sourire ⭐️"
    },
    {
        url: "photos/photo5.jpeg",
        message: "💖 Ton amour me rend meilleur chaque jour 💖"
    },
    {
        url: "photos/photo6.jpeg",
        message: "🌸 Avec toi, même les moments simples deviennent magiques 🌸"
    },
    {
        url: "photos/photo7.jpeg",
        message: "🎵 Ton rire est ma musique préférée 🎵"
    },
    {
        url: "photos/photo8.jpeg",
        message: "💫 Tu es la lumière qui éclaire mes journées 💫"
    },
    {
        url: "photos/photo9.jpeg",
        message: "🌟 Je suis tellement chanceux de t'avoir dans ma vie 🌟"
    },
    {
        url: "photos/photo10.jpeg",
        message: "💝 Mon cœur bat uniquement pour toi 💝"
    },
    {
        url: "photos/photo11.jpeg",
        message: "🌈 Ensemble, nous sommes invincibles 🌈"
    },
    {
        url: "photos/photo12.jpeg",
        message: "❤️ Je t'aime plus que tout au monde. Merci d'être toi ❤️"
    }
];

let currentIndex = 0;
let autoSlideInterval;
let isPlaying = false;
let particlesInterval;
let heartsInterval;
let wasPlayingBeforeHidden = false;
let startTime = Date.now();

const sliderContainer = document.getElementById('sliderContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const loveMessage = document.getElementById('loveMessage');
const bgMusic = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeSlider = document.getElementById('volumeSlider');
const photoCounter = document.getElementById('photoCounter');
const totalPhotos = document.getElementById('totalPhotos');
const sliderDots = document.getElementById('sliderDots');

totalPhotos.textContent = photos.length;

// Création des particules flottantes
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.background = `rgba(255, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 0.5 + 0.3})`;
        particlesContainer.appendChild(particle);
    }
}

// Création des coeurs flottants
function createHearts() {
    const heartsContainer = document.getElementById('floatingHearts');
    heartsInterval = setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = ['❤️', '💕', '💖', '💗', '💓', '💝'][Math.floor(Math.random() * 6)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 20 + 15}px`;
        heart.style.animationDuration = `${Math.random() * 4 + 3}s`;
        heart.style.animationDelay = '0s';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 6000);
    }, 300);
}

// Création des étincelles au clic
function createSparkles(x, y) {
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.width = '5px';
        sparkle.style.height = '5px';
        sparkle.style.backgroundColor = `hsl(${Math.random() * 60 + 340}, 100%, 60%)`;
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        sparkle.style.transition = 'all 0.6s ease-out';
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.style.transform = `translate(${tx}px, ${ty}px)`;
            sparkle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => sparkle.remove(), 600);
    }
}

// Création des miniatures
function createThumbnails() {
    const gallery = document.getElementById('thumbnailGallery');
    if (!gallery) return;
    
    photos.forEach((photo, index) => {
        const thumb = document.createElement('img');
        thumb.src = photo.url;
        thumb.className = 'thumbnail';
        thumb.alt = `Miniature ${index + 1}`;
        thumb.addEventListener('click', () => goToSlide(index));
        gallery.appendChild(thumb);
    });
}

function updateActiveThumbnail() {
    const thumbs = document.querySelectorAll('.thumbnail');
    thumbs.forEach((thumb, index) => {
        if (index === currentIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Chargement des photos
function loadPhotos() {
    photos.forEach((photo, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = `Photo ${index + 1}`;
        img.loading = 'lazy';
        
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/600x400/ff6b6b/ffffff?text=Photo+' + (index + 1);
        };
        
        img.addEventListener('click', (e) => {
            createSparkles(e.clientX, e.clientY);
            showMessageWithAnimation(photo.message);
            createRippleEffect(img);
        });
        
        slide.appendChild(img);
        sliderContainer.appendChild(slide);
        
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
    
    updateSlider();
    updateDots();
    createThumbnails();
}

function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.backgroundColor = 'rgba(255, 107, 107, 0.4)';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '100';
    
    const rect = element.getBoundingClientRect();
    ripple.style.left = `${rect.left + rect.width / 2}px`;
    ripple.style.top = `${rect.top + rect.height / 2}px`;
    ripple.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(ripple);
    
    const animation = ripple.animate([
        { width: '0', height: '0', opacity: 0.8 },
        { width: '100px', height: '100px', opacity: 0 }
    ], {
        duration: 600,
        easing: 'ease-out'
    });
    
    animation.onfinish = () => ripple.remove();
}

function showMessageWithAnimation(message) {
    loveMessage.style.opacity = '0';
    loveMessage.style.transform = 'scale(0.8)';
    setTimeout(() => {
        loveMessage.textContent = message;
        loveMessage.style.opacity = '1';
        loveMessage.style.transform = 'scale(1)';
    }, 200);
    
    const messageContainer = document.querySelector('.message');
    messageContainer.style.animation = 'none';
    setTimeout(() => {
        messageContainer.style.animation = 'messageGlow 2s ease-in-out infinite';
    }, 10);
}

function updateSlider() {
    sliderContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
    photoCounter.textContent = currentIndex + 1;
    updateDots();
    updateActiveThumbnail();
    
    const currentSlide = sliderContainer.children[currentIndex];
    const img = currentSlide.querySelector('img');
    img.style.animation = 'none';
    setTimeout(() => {
        img.style.animation = 'slideFade 0.5s ease';
    }, 10);
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function goToSlide(index) {
    currentIndex = index;
    updateSlider();
    resetAutoSlide();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % photos.length;
    updateSlider();
    resetAutoSlide();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    updateSlider();
    resetAutoSlide();
}

function resetAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
}

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 5000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Gestion de la musique
function initMusic() {
    bgMusic.volume = volumeSlider.value;
    bgMusic.load();
    
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            if (playPauseBtn) {
                playPauseBtn.querySelector('.music-icon').textContent = '🔊';
            }
            startAutoSlide();
        }).catch(() => {
            console.log("Lecture automatique bloquée");
            isPlaying = false;
            if (playPauseBtn) {
                playPauseBtn.querySelector('.music-icon').textContent = '🔇';
                playPauseBtn.querySelector('.music-text').textContent = 'Clique pour jouer';
            }
        });
    }
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    playPauseBtn.querySelector('.music-icon').textContent = '🔊';
                    playPauseBtn.querySelector('.music-text').textContent = 'Lecture/Pause';
                    startAutoSlide();
                }).catch(e => console.log("Erreur lecture:", e));
            } else {
                bgMusic.pause();
                isPlaying = false;
                playPauseBtn.querySelector('.music-icon').textContent = '🔇';
                playPauseBtn.querySelector('.music-text').textContent = 'Lecture/Pause';
                stopAutoSlide();
            }
        });
    }
    
    volumeSlider.addEventListener('input', (e) => {
        bgMusic.volume = parseFloat(e.target.value);
    });
    
    bgMusic.addEventListener('ended', () => {
        bgMusic.currentTime = 0;
        bgMusic.play();
    });
}

// Animation du titre
function animateTitle() {
    const title = document.getElementById('dynamicTitle');
    const texts = [
        "Pour ma chérie ❤️",
        "Je t'aime 💕",
        "Ma princesse 👸",
        "Mon amour 🌹",
        "Ma vie 💖",
        "Mon trésor ✨"
    ];
    let index = 0;
    
    setInterval(() => {
        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'scale(0.9)';
            setTimeout(() => {
                title.textContent = texts[index % texts.length];
                title.style.opacity = '1';
                title.style.transform = 'scale(1)';
                index++;
            }, 300);
        }
    }, 4000);
}

// Compteur de temps passé
function updateTimeCounter() {
    const timeSpent = document.getElementById('timeSpent');
    if (timeSpent) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        timeSpent.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Message du jour
function initDailyMessage() {
    const messages = [
        "💝 Chaque jour avec toi est un cadeau",
        "🌹 Tu es la plus belle chose qui me soit arrivée",
        "✨ Ton amour me fait voler",
        "💕 Je t'aime plus qu'hier et moins que demain",
        "🌟 Tu es mon rayon de soleil",
        "🎵 Ton rire est ma mélodie préférée",
        "💖 Sans toi, ma vie n'aurait pas de sens"
    ];
    
    const today = new Date().getDate();
    const messageIndex = today % messages.length;
    
    const dailyMsg = document.createElement('div');
    dailyMsg.className = 'daily-message';
    dailyMsg.innerHTML = `📅 Message du jour : ${messages[messageIndex]}`;
    dailyMsg.style.cssText = `
        text-align: center;
        margin-top: 15px;
        padding: 8px;
        font-size: 0.9em;
        color: #ff6b6b;
        background: rgba(255, 107, 107, 0.1);
        border-radius: 25px;
    `;
    
    const messageContainer = document.querySelector('.message');
    if (messageContainer && messageContainer.parentNode) {
        messageContainer.parentNode.insertBefore(dailyMsg, messageContainer.nextSibling);
    }
}

// Mode sombre
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;
    
    let isDarkMode = false;
    
    themeBtn.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        themeBtn.textContent = isDarkMode ? '☀️ Mode jour' : '🌙 Mode nuit';
        localStorage.setItem('darkMode', isDarkMode);
    });
    
    const savedTheme = localStorage.getItem('darkMode') === 'true';
    if (savedTheme) {
        themeBtn.click();
    }
}

// Étoiles filantes
function createShootingStar() {
    setInterval(() => {
        const star = document.createElement('div');
        star.style.position = 'fixed';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.backgroundColor = 'white';
        star.style.boxShadow = '0 0 10px white';
        star.style.borderRadius = '50%';
        star.style.top = Math.random() * window.innerHeight + 'px';
        star.style.left = '-10px';
        star.style.pointerEvents = 'none';
        star.style.zIndex = '999';
        
        document.body.appendChild(star);
        
        const duration = Math.random() * 2 + 1;
        star.style.transition = `all ${duration}s linear`;
        
        setTimeout(() => {
            star.style.transform = `translate(${window.innerWidth + 20}px, ${Math.random() * 200 - 100}px)`;
            star.style.opacity = '0';
        }, 10);
        
        setTimeout(() => star.remove(), duration * 1000);
    }, 8000);
}

// Boutons de partage
function initShareButtons() {
    const shareWhatsapp = document.getElementById('shareWhatsapp');
    const shareMessage = document.getElementById('shareMessage');
    
    if (shareWhatsapp) {
        shareWhatsapp.addEventListener('click', () => {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent("❤️ Découvre ce site magnifique que j'ai fait pour toi !");
            window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
        });
    }
    
    if (shareMessage) {
        shareMessage.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'Pour toi ❤️',
                    text: 'Un petit cadeau pour toi',
                    url: window.location.href
                }).catch(() => console.log('Partage annulé'));
            } else {
                alert('Le partage n\'est pas supporté sur ce navigateur. Tu peux copier le lien manuellement !');
            }
        });
    }
}

// Message de bienvenue
function showWelcomeMessage() {
    const hour = new Date().getHours();
    let greeting = "";
    
    if (hour < 12) greeting = "Bonjour ma chérie 🌅";
    else if (hour < 18) greeting = "Bon après-midi mon amour ☀️";
    else greeting = "Bonsoir ma princesse 🌙";
    
    setTimeout(() => {
        loveMessage.textContent = `${greeting} ! Prépare-toi à découvrir un petit quelque chose de spécial... 💝`;
        setTimeout(() => {
            loveMessage.textContent = "Clique sur les photos pour découvrir un message spécial...";
        }, 4000);
    }, 1000);
}

// Effet de survol pour les photos
function addHoverEffect() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.addEventListener('mouseenter', () => {
            if (autoSlideInterval) {
                stopAutoSlide();
            }
        });
        
        slide.addEventListener('mouseleave', () => {
            if (!bgMusic.paused && !autoSlideInterval) {
                startAutoSlide();
            }
        });
    });
}

// Gestion de l'onglet
function handleTabVisibility() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            wasPlayingBeforeHidden = !bgMusic.paused;
            
            if (!bgMusic.paused) {
                bgMusic.pause();
                isPlaying = false;
                if (playPauseBtn) {
                    playPauseBtn.querySelector('.music-icon').textContent = '🔇';
                }
                stopAutoSlide();
            }
        } else {
            if (wasPlayingBeforeHidden) {
                bgMusic.play().catch(e => {
                    console.log("Lecture automatique bloquée au retour");
                    if (playPauseBtn) {
                        playPauseBtn.querySelector('.music-text').textContent = 'Clique pour jouer';
                    }
                });
                isPlaying = true;
                if (playPauseBtn) {
                    playPauseBtn.querySelector('.music-icon').textContent = '🔊';
                    playPauseBtn.querySelector('.music-text').textContent = 'Lecture/Pause';
                }
                startAutoSlide();
            }
            wasPlayingBeforeHidden = false;
        }
    });
}

function handlePageUnload() {
    window.addEventListener('beforeunload', () => {
        if (bgMusic) {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
        if (heartsInterval) {
            clearInterval(heartsInterval);
        }
    });
}

// Support du clavier
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        e.preventDefault();
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    createHearts();
    loadPhotos();
    initMusic();
    animateTitle();
    addHoverEffect();
    handleTabVisibility();
    handlePageUnload();
    initThemeToggle();
    initShareButtons();
    initDailyMessage();
    createShootingStar();
    showWelcomeMessage();
    
    setInterval(updateTimeCounter, 1000);
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    const counter = document.querySelector('.counter');
    if (counter) {
        setInterval(() => {
            counter.style.transform = 'scale(1.1)';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }
});