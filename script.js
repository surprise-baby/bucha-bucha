// --- CONFIGURATION ---
const PASSWORDS = {
    step1: "RIMU",
    step2: "BUCHABUCHA" // Case insensitive
};

const SAD_MESSAGES = [
    "ARE YOU SURE???? 💔",
    "Are you really sure?",
    "Really really sure?",
    "REALLY REALLY REALLY SURE???",
    "This is illegal.",
    "I will cry.",
    "This is emotional damage.",
    "Final warning.",
    "Are you 100000% sure?",
    "I'm uninstalling."
];

// --- STATE ---
let currentSadIndex = 0;
let audioPlaying = false;

// --- DOM ELEMENTS ---
const pages = {
    1: document.getElementById('page-1'),
    2: document.getElementById('page-2'),
    3: document.getElementById('page-3'),
    4: document.getElementById('page-4'),

    gallery: document.getElementById('page-gallery'),
    5: document.getElementById('page-5')
};

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    setupInputs();
    setupButtons();
    setupExtras();
});

// --- PAGE 1: PASSWORD ---
function setupInputs() {
    const chars = document.querySelectorAll('.char-input');
    const step1 = document.getElementById('pass-step-1');
    const step2 = document.getElementById('pass-step-2');
    const error1 = document.getElementById('error-msg-1');

    // Auto-focus logic for 4-char input
    chars.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            input.value = input.value.toUpperCase();
            if (input.value.length === 1 && index < 3) {
                chars[index + 1].focus();
            }

            // Check full word
            const word = Array.from(chars).map(i => i.value).join('');
            if (word.length === 4) {
                if (word === PASSWORDS.step1) {
                    // Success Step 1
                    confetti({ particleCount: 50, spread: 60 });
                    step1.classList.add('hidden'); // Simplified transition
                    step2.classList.remove('hidden');
                } else {
                    // Fail Step 1
                    error1.classList.remove('hidden');
                    document.getElementById('login-card').classList.add('shake');
                    setTimeout(() => document.getElementById('login-card').classList.remove('shake'), 500);
                    // Clear inputs
                    setTimeout(() => chars.forEach(i => i.value = ''), 1000);
                    chars[0].focus();
                }
            }
        });
    });

    // Step 2 Logic
    const finalInput = document.getElementById('final-pass');

    function checkStep2() {
        const val = finalInput.value.toUpperCase().trim();
        if (val === PASSWORDS.step2) {
            // Success Step 2
            fireworks();
            transitionToPage(2);
        } else {
            const card = document.getElementById('login-card');
            const err = document.getElementById('error-msg-2');

            // Only show error if length matches or it was an explict check (like button click)
            if (val.length >= PASSWORDS.step2.length) {
                err.classList.remove('hidden');
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 500);
            }
        }
    }

    document.getElementById('unlock-btn').addEventListener('click', checkStep2);

    finalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkStep2();
    });

    finalInput.addEventListener('input', () => {
        if (finalInput.value.length === PASSWORDS.step2.length) {
            checkStep2();
        }
    });
}

// --- PAGE 2: MAIN QUESTION ---
function setupButtons() {
    const noBtn = document.getElementById('no-btn');
    const contentWrapper = document.querySelector('#page-2 .content-wrapper');
    let bounceCount = 0;
    let isAnimating = false;

    // Running No Button
    noBtn.addEventListener('mouseover', moveNoButton);
    // Mobile support
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    function moveNoButton() {
        if (isAnimating) return; // Prevent spam during animation
        isAnimating = true;
        bounceCount++;

        // Get current position
        const rect = noBtn.getBoundingClientRect();
        const currentX = rect.left;
        const currentY = rect.top;

        // Calculate a new random position (but bounce in a direction away from cursor)
        const maxX = Math.max(0, window.innerWidth - noBtn.offsetWidth - 100);
        const maxY = Math.max(0, window.innerHeight - noBtn.offsetHeight - 100);

        // Random target position with padding
        let targetX = Math.random() * maxX + 50;
        let targetY = Math.random() * maxY + 50;

        // Ensure minimum distance from current position
        const minDistance = 150;
        while (Math.abs(targetX - currentX) < minDistance && Math.abs(targetY - currentY) < minDistance) {
            targetX = Math.random() * maxX + 50;
            targetY = Math.random() * maxY + 50;
        }

        // Set position to fixed for full screen movement
        noBtn.style.position = 'fixed';

        // Bounce animation sequence
        const bounceKeyframes = [
            { transform: 'scale(1) rotate(0deg)', offset: 0 },
            { transform: 'scale(1.3) rotate(-10deg)', offset: 0.15 },
            { transform: 'scale(0.9) rotate(10deg)', offset: 0.3 },
            { transform: 'scale(1.1) rotate(-5deg)', offset: 0.5 },
            { transform: 'scale(1) rotate(0deg)', offset: 1 }
        ];

        // Shake/bounce effect before moving
        noBtn.animate(bounceKeyframes, {
            duration: 300,
            easing: 'ease-out'
        });

        // After a small delay, move to new position with a smooth arc
        setTimeout(() => {
            // Add transition for smooth movement
            noBtn.style.transition = 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            noBtn.style.left = `${targetX}px`;
            noBtn.style.top = `${targetY}px`;

            // Landing bounce effect
            setTimeout(() => {
                noBtn.animate([
                    { transform: 'scale(1.2)' },
                    { transform: 'scale(0.9)' },
                    { transform: 'scale(1.05)' },
                    { transform: 'scale(1)' }
                ], {
                    duration: 200,
                    easing: 'ease-out'
                });

                // Reset transition and allow next animation
                setTimeout(() => {
                    noBtn.style.transition = '';
                    isAnimating = false;
                }, 200);
            }, 400);
        }, 150);

        // Fun text changes after multiple bounces
        if (bounceCount === 3) {
            noBtn.innerText = "Nope �";
        } else if (bounceCount === 5) {
            noBtn.innerText = "Can't catch me!";
        } else if (bounceCount === 8) {
            noBtn.innerText = "Stop trying!";
        } else if (bounceCount === 12) {
            noBtn.innerText = "Just click YES 💖";
        } else if (bounceCount >= 15) {
            noBtn.innerText = "ZOOM �";
        }
    }

    document.getElementById('yes-btn').addEventListener('click', () => {
        const audio = document.getElementById('bg-music');
        if (audio) {
            audio.play().catch(e => console.log("Audio play failed:", e));
            // Update state and UI to match
            audioPlaying = true;
            const btn = document.getElementById('music-toggle');
            if (btn) btn.innerText = "⏸ Pause Music";
        }
        transitionToPage(4);
    });

    // Fallback if they somehow click No
    noBtn.addEventListener('click', () => {
        transitionToPage(3);
    });

    // Sad Page Logic
    const sadTitle = document.getElementById('sad-title');
    const sadYes = document.getElementById('sad-yes-btn');

    sadYes.addEventListener('click', () => {
        currentSadIndex = (currentSadIndex + 1) % SAD_MESSAGES.length;
        sadTitle.innerText = SAD_MESSAGES[currentSadIndex];
        sadYes.style.transform = `scale(${1 + currentSadIndex * 0.1})`;
    });

    document.getElementById('sad-no-btn').addEventListener('click', () => {
        currentSadIndex = 0; // Reset
        transitionToPage(2);
    });

    // Page 4 -> Gallery
    document.getElementById('gallery-start-btn').addEventListener('click', () => {
        transitionToPage('gallery');
        // Delay showSlides to ensure page is visible first
        setTimeout(() => {
            slideIndex = 1;
            showSlides(slideIndex);
        }, 300);
    });

    // Gallery -> Page 5
    document.getElementById('quiz-start-btn').addEventListener('click', () => {
        transitionToPage(5);
        startQuiz();
    });

    // Gallery Logic
    setupGallery();
}

// --- PAGE 5: QUIZ ---
const QUIZ_DATA = [
    {
        q: "Which is the best thing at the end of the day ?",
        options: ["Bro tujhe pata hai aaj kya hua - wala walk", "Huggieeeee", "1000 kissie", "Par tum meri baat suno naaaa"],
        correct: [1, 3] // Array of correct indices
    },
    {
        q: "What is our cutest inside reference?",
        options: ["mera petu me thoda dard ho raha hai", "Bucha-Bucha", "heart-attack", "1832901372849072340"],
        correct: [0, 1, 2] // Multiple correct!
    },
    {
        q: "Who fell harder? 👀",
        options: ["You", "Me", "Rachit (Obv)", "Both equal (lie)"],
        correct: [0, 1, 2, 3] // Multiple correct
    },
    {
        q: "Final verdict… which is the cutest one?",
        options: [
            "You normally",
            "Me when I'm a baby",
            "We both together",
            "You sleeping"
        ],
        correct: [0, 1, 2, 3]
    }

];

let quizIndex = 0;

function startQuiz() {
    loadQuestion(0);
}

function loadQuestion(index) {
    if (index >= QUIZ_DATA.length) {
        // End of quiz
        document.querySelector('.quiz-container').innerHTML = `
            <h1 class="bounce-text">HAPPY VALENTINE’S DAY Babuuuu 💕</h1>
            <p>I love you more than you love cheesecakes <3 </p>
            <p style="font-family:'Great Vibes'; font-size: 2rem; margin-top: 20px;">— Rachit</p>
            <p > </p>
            <p style="margin-top: 20px; font-weight: bold; color: #ff0066;">Ab mujhe bhi puch lo na KI will i be your velantine? 🥺👉👈</p>
            
        `;
        fireworks();
        return;
    }

    const data = QUIZ_DATA[index];
    document.getElementById('quiz-question').innerText = data.q;
    const optsDiv = document.getElementById('quiz-options');
    optsDiv.innerHTML = '';

    data.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.className = 'quiz-btn';
        btn.onclick = () => {
            if (data.correct.includes(i)) {
                confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { y: 0.6 }
                });
                if (index === QUIZ_DATA.length - 1) {
                    loadQuestion(index + 1); // Finish
                } else {
                    setTimeout(() => loadQuestion(index + 1), 500);
                }
            } else {
                btn.classList.add('shake');
                btn.style.background = '#ffcccc';
                btn.innerText = "NOPE 🤪";
                setTimeout(() => btn.classList.remove('shake'), 500);
            }
        };
        optsDiv.appendChild(btn);
    });
}

// --- UTILS ---
function transitionToPage(pageNum) {
    // Blur any focused element (keyboard fix)
    if (document.activeElement) document.activeElement.blur();

    // First, hide ALL pages immediately
    Object.values(pages).forEach(p => {
        p.classList.remove('active');
        p.classList.add('hidden');
    });

    // Page 2 Specific: Reset buttons to hidden state BEFORE showing page
    if (pageNum === 2) {
        const btns = document.getElementById('intro-buttons');
        btns.classList.add('hidden');
        btns.classList.remove('fade-in');
    }

    // Show target page after a brief delay to ensure clean transition
    setTimeout(() => {
        const target = pages[pageNum];
        target.classList.remove('hidden');

        // Add active class after another brief delay for smooth animation
        setTimeout(() => {
            target.classList.add('active');

            // Page 2 Specific Logic: Delayed Reveal of buttons
            if (pageNum === 2) {
                const btns = document.getElementById('intro-buttons');
                setTimeout(() => {
                    btns.classList.remove('hidden');
                    btns.classList.add('fade-in');
                }, 2500); // 2.5s delay for dramatic effect
            }
        }, 100);
    }, 100);
}

function fireworks() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
    }, 250);
}

function setupExtras() {
    // Music Toggle
    const audio = document.getElementById('bg-music');
    const btn = document.getElementById('music-toggle');
    let musicTimeout = null;

    btn.addEventListener('click', () => {
        if (audioPlaying) {
            audio.pause();
            btn.innerText = "🎵 Play Music";
            if (musicTimeout) {
                clearTimeout(musicTimeout);
                musicTimeout = null;
            }
        } else {
            audio.currentTime = 0; // Start from beginning
            audio.play().catch(e => console.log("Audio play failed (needs interaction):", e));
            btn.innerText = "⏸ Pause Music";

            // Auto-stop after 30 seconds
            musicTimeout = setTimeout(() => {
                audio.pause();
                btn.innerText = "🎵 Play Music";
                audioPlaying = false;
            }, 30000);
        }
        audioPlaying = !audioPlaying;
    });

    // Cursor Trail
    document.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${e.pageX}px`;
        trail.style.top = `${e.pageY}px`;
        document.body.appendChild(trail);

        setTimeout(() => {
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 500);
        }, 100);
    });
}

// --- GALLERY LOGIC ---
let slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    // Safety check - if no slides found, exit gracefully
    if (!slides || slides.length === 0) {
        console.warn("No slides found");
        return;
    }

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
    }
}

function setupGallery() {
    const images = document.querySelectorAll('.fav-img');

    images.forEach(img => {
        img.addEventListener('click', () => {
            // Remove previous selection
            images.forEach(i => i.classList.remove('selected'));
            // Add to current
            img.classList.add('selected');

            // Celebration
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            });

            // Auto transition after a short delay
            setTimeout(() => {
                transitionToPage(5);
                startQuiz();
            }, 1000);
        });
    });
}
