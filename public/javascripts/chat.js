// Assurez-vous que ce script est chargé après socket.io.js
const socket = io();

// DOM
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");

let username = "";

// Liste des mots interdits (en minuscules)
const bannedWords = ["pute", "salope", "connard"];

/**
 * Remplace les mots interdits par des **** correspondant à leur longueur
 * @param {string} text
 * @returns {string}
 */
function censorText(text) {
    return text.split(/\b/).map(word => {
        return bannedWords.includes(word.toLowerCase())
            ? "*".repeat(word.length)
            : word;
    }).join("");
}

/**
 * Affiche un message dans le chat
 * @param {Object} data - { username, message, timestamp }
 */
function displayMessage(data) {
    const div = document.createElement("div");
    div.classList.add("message");

    const strong = document.createElement("strong");
    strong.textContent = `${data.username} :`;

    const span = document.createElement("span");
    span.textContent = `${censorText(data.message)} [${data.timestamp}]`;

    div.appendChild(strong);
    div.appendChild(document.createTextNode(" "));
    div.appendChild(span);

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Validation du nom
nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    username = nameInput.value.trim();
    if (!username) return;

    nameForm.style.display = "none";
    chatForm.style.display = "flex";
    messageInput.focus();
});

// Envoi d'un message
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;

    const censoredMessage = censorText(message);

    // Crée la date et l'heure complète
    const timestamp = new Date().toLocaleString(); // ex: "18/12/2025 16:45:30"

    // Envoi au serveur
    socket.emit("chatMessage", { username, message: censoredMessage, timestamp });

    messageInput.value = "";
    messageInput.focus();
});

// Réception des messages temps réel
socket.on("chatMessage", (data) => {
    displayMessage(data);
});

// Réception de l'historique à la connexion
socket.on("chatHistory", (messages) => {
    messages.forEach((data) => {
        displayMessage(data);
    });
});
