const weddingDate = new Date("October 18, 2026 15:00:00").getTime();

const openButton = document.getElementById("openButton");
const opening = document.getElementById("opening");
const invitation = document.getElementById("invitation");

const soundButton = document.getElementById("soundButton");
const soundText = document.getElementById("soundText");

const rsvpForm = document.getElementById("rsvpForm");
const successMessage = document.getElementById("successMessage");

const calendarButton = document.getElementById("calendarButton");


/* Opening */

openButton.addEventListener("click", function() {

    opening.classList.add("hide");

    document.body.style.overflow = "auto";

    startChime();

    setTimeout(function() {
        opening.style.display = "none";
    }, 1000);

});


/* Countdown */

function updateCountdown() {

    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

}

updateCountdown();

setInterval(updateCountdown, 1000);


/* Sound */

let audioContext = null;
let soundEnabled = false;

function startChime() {

    if (!soundEnabled) {
        return;
    }

    if (!audioContext) {
        audioContext = new(
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    const notes = [
        523.25,
        659.25,
        783.99
    ];

    notes.forEach(function(frequency, index) {

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        const startTime =
            audioContext.currentTime +
            index * 0.15;

        gain.gain.setValueAtTime(
            0,
            startTime
        );

        gain.gain.linearRampToValueAtTime(
            0.05,
            startTime + 0.05
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + 1
        );

        oscillator.start(startTime);
        oscillator.stop(startTime + 1.1);

    });

}


soundButton.addEventListener("click", function() {

    if (!audioContext) {
        audioContext = new(
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    soundEnabled = !soundEnabled;

    if (soundEnabled) {

        soundText.textContent = "Sound On";
        soundButton.classList.add("active");

        startChime();

    } else {

        soundText.textContent = "Sound";
        soundButton.classList.remove("active");

    }

});


/* Scroll animations */

const revealElements =
    document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
        function(entries, observer) {

            entries.forEach(function(entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.15
        }
    );

    revealElements.forEach(function(element) {
        observer.observe(element);
    });

} else {

    revealElements.forEach(function(element) {
        element.classList.add("show");
    });

}


/* Google Calendar */

const startDate = "20261018T130000Z";
const endDate = "20261018T190000Z";

const calendarUrl =
    "https://calendar.google.com/calendar/render" +
    "?action=TEMPLATE" +
    "&text=Sophia%20%26%20Liam%27s%20Wedding" +
    "&dates=" + startDate + "/" + endDate +
    "&details=Join%20us%20for%20the%20wedding%20celebration%20of%20Sophia%20and%20Liam." +
    "&location=Villa%20Cora%2C%20Florence%2C%20Italy";

calendarButton.href = calendarUrl;


/* RSVP */

rsvpForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    if (!name) {
        return;
    }

    successMessage.textContent =
        "Thank you, " + name +
        ". Your RSVP has been received.";

    successMessage.classList.add("show");

    const fields =
        rsvpForm.querySelectorAll(
            "input, select, textarea, button"
        );

    fields.forEach(function(field) {
        field.disabled = true;
    });

});