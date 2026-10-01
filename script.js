const weddingDate = new Date(
    "December 1, 2026 15:00:00"
).getTime();


/* Opening */

const opening = document.getElementById("opening");
const openButton = document.getElementById("openButton");

document.body.classList.add("locked");

openButton.addEventListener("click", function() {

    opening.classList.add("hide");

    document.body.classList.remove("locked");

    playChime();

    setTimeout(function() {
        opening.style.display = "none";
    }, 1200);

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

const soundButton =
    document.getElementById("soundButton");

const soundText =
    document.getElementById("soundText");


function createAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return null;
        }

        audioContext = new AudioContext();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;
}


function playChime() {

    if (!soundEnabled) {
        return;
    }

    const context = createAudioContext();

    if (!context) {
        return;
    }

    const notes = [
        523.25,
        659.25,
        783.99
    ];

    notes.forEach(function(frequency, index) {

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();

        const start =
            context.currentTime +
            index * 0.15;

        oscillator.type = "sine";
        oscillator.frequency.value = frequency;

        oscillator.connect(gain);
        gain.connect(context.destination);

        gain.gain.setValueAtTime(
            0,
            start
        );

        gain.gain.linearRampToValueAtTime(
            0.04,
            start + 0.05
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            start + 1
        );

        oscillator.start(start);
        oscillator.stop(start + 1.1);

    });

}


soundButton.addEventListener("click", function() {

    createAudioContext();

    soundEnabled = !soundEnabled;

    if (soundEnabled) {

        soundText.textContent = "Sound On";

        soundButton.classList.add("active");

        playChime();

    } else {

        soundText.textContent = "Sound";

        soundButton.classList.remove("active");

    }

});


/* Scroll reveal */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const observer =
        new IntersectionObserver(
            function(entries, observer) {

                entries.forEach(function(entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            }, {
                threshold: 0.12
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
    "&text=Sheen%20%26%20Lloyd%27s%20Wedding" +
    "&dates=" +
    startDate +
    "%2F" +
    endDate +
    "&details=Join%20us%20for%20the%20wedding%20celebration%20of%20Sheen%20and%20Lloyd." +
    "&location=San%20Jose%2C%20Occidental%20Mindoro";


document.getElementById(
    "calendarButton"
).href = calendarUrl;


/* RSVP */

const rsvpForm =
    document.getElementById("rsvpForm");

const successMessage =
    document.getElementById("successMessage");


rsvpForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
        document.getElementById("name")
        .value
        .trim();

    if (!name) {
        return;
    }

    successMessage.textContent =
        "Thank you, " +
        name +
        ". We can't wait to celebrate with you.";

    successMessage.classList.add("show");

    const fields =
        rsvpForm.querySelectorAll(
            "input, select, textarea, button"
        );

    fields.forEach(function(field) {

        field.disabled = true;

    });

});