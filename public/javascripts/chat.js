// Assurez-vous que ce script est chargé après socket.io.js
const socket = io();

// DOM
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");

let username = "";

// 1️⃣ Validation du nom
nameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    username = nameInput.value.trim();
    if (!username) return;

    nameForm.style.display = "none";
    chatForm.style.display = "flex";
});

// 2️⃣ Envoi d'un message
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;

    // Envoi au serveur
    socket.emit("chatMessage", { username, message });

    messageInput.value = "";
});

// 3️⃣ Réception des messages
socket.on("chatMessage", (data) => {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    chatBox.appendChild(div);

    // Scroll automatique
    chatBox.scrollTop = chatBox.scrollHeight;
});
