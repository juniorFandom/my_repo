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
    setInterval(() => {
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
        
        img.addEventListener('click', () => {
            showMessageWithAnimation(photo.message);
            createRippleEffect(img);
        });
        
        slide.appendChild(img);
        sliderContainer.appendChild(slide);
        
        // Création des points indicateurs
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
    
    updateSlider();
    updateDots();
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
    
    // Animation supplémentaire du message
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
    
    // Animation de la photo
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
    
    // Tentative de lecture automatique
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            playPauseBtn.querySelector('.music-icon').textContent = '🔊';
            startAutoSlide();
        }).catch(() => {
            console.log("Lecture automatique bloquée");
            isPlaying = false;
            playPauseBtn.querySelector('.music-icon').textContent = '🔇';
            playPauseBtn.querySelector('.music-text').textContent = 'Clique pour jouer';
        });
    }
    
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
        title.style.opacity = '0';
        title.style.transform = 'scale(0.9)';
        setTimeout(() => {
            title.textContent = texts[index % texts.length];
            title.style.opacity = '1';
            title.style.transform = 'scale(1)';
            index++;
        }, 300);
    }, 4000);
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
    
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Animation d'entrée pour le compteur
    const counter = document.querySelector('.counter');
    setInterval(() => {
        counter.style.transform = 'scale(1.1)';
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
        }, 200);
    }, 3000);
});