javascript
const petals = document.getElementById('petals-container');

for (let i = 0; i < 15; i++) {
    const petal = document.createElement('div');
    const size = Math.random() * 10 + 8;

    petal.className = 'petal';
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.4}px`;
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = '-10%';
    petal.style.animationDuration = `${Math.random() * 8 + 6}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;

    petals.appendChild(petal);
}

const weddingDate = new Date('October 18, 2026 15:00:00').getTime();

function updateCountdown() {
    const now = Date.now();
    const distance = weddingDate - now;

    if (distance <= 0) {
        document.getElementById('countdown').innerHTML =
            '<div class="col-span-4 text-xs font-serif text-champagne font-bold">The Wedding Day Has Arrived!</div>';
        return;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

let audioContext;
let playing = false;
let audioTimer;

const audioButton = document.getElementById('audio-toggle');
const audioIcon = document.getElementById('audio-icon');

function playChime() {
    if (!playing || !audioContext) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const frequency = notes[Math.floor(Math.random() * notes.length)];

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.05, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 3
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 3);
}

function startAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    playing = true;

    audioIcon.className = 'fa-solid fa-volume-high text-sm';
    audioButton.classList.add('bg-champagne', 'text-cream');

    playChime();

    clearInterval(audioTimer);
    audioTimer = setInterval(playChime, 3500);
}

function stopAudio() {
    playing = false;

    audioIcon.className = 'fa-solid fa-volume-xmark text-sm';
    audioButton.classList.remove('bg-champagne', 'text-cream');

    clearInterval(audioTimer);
    audioTimer = null;
}

audioButton.addEventListener('click', () => {
    if (playing) {
        stopAudio();
    } else {
        startAudio();
    }
});

const openButton = document.getElementById('open-btn');
const cover = document.getElementById('cover-screen');
const content = document.getElementById('main-content');

openButton.addEventListener('click', () => {
    cover.style.transform = 'translateY(-100%)';
    cover.style.opacity = '0';

    setTimeout(() => {
        cover.style.display = 'none';
        content.style.opacity = '1';
        content.style.pointerEvents = 'auto';

        audioButton.classList.remove('hidden');
        startAudio();
    }, 800);
});

document.getElementById('add-calendar-btn').addEventListener('click', () => {
    const title = encodeURIComponent("Sophia & Liam's Wedding");
    const details = encodeURIComponent(
        'Wedding ceremony at Villa Cora Chapel followed by reception at Grand Ballroom & Gardens.'
    );
    const location = encodeURIComponent(
        'Villa Cora, Viale Machiavelli 18, 50125 Firenze FI, Italy'
    );
    const dates = '20261018T130000Z/20261018T220000Z';

    const url =
        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;

    window.open(url, '_blank');
});

const form = document.getElementById('rsvp-form');
const success = document.getElementById('rsvp-success');
const successMessage = document.getElementById('success-msg');
const resetButton = document.getElementById('reset-rsvp');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('guest-name').value;
    const attendance = document.getElementById('attendance').value;
    const guests = document.getElementById('guest-count').value;

    if (attendance === 'accept') {
        successMessage.textContent =
            `Thank you, ${name}! We have reserved ${guests} seat(s) for you. We can't wait to celebrate in Tuscany!`;
    } else {
        successMessage.textContent =
            `Thank you, ${name}, for letting us know. We will miss you on our special day!`;
    }

    form.style.display = 'none';
    success.classList.remove('hidden');
});

resetButton.addEventListener('click', () => {
    form.reset();
    success.classList.add('hidden');
    form.style.display = 'block';
});
