const express = require("express");
const router = express.Router();
const { io, messages } = require("../app");

// On va recevoir le tableau depuis app.js
let messagesRef;

/* ============================
   Middleware protection
============================ */
const auth = (req, res, next) => {
  if (req.session.auth) return next();
  res.redirect("/connexion");
};



function setMessagesArray(arr) {
  messagesRef = arr;
}

/**
 * GET /api/messages
 * Récupère tous les messages
 */

router.get("/messages", auth, (req, res) => {
  res.json(messagesRef || []);
});

/**
 * POST /api/messages
 * Ajoute un message
 */
router.post("/", auth, (req, res) => {
  const { username, message, timestamp } = req.body;

  if (!username || !message || !timestamp) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const newMessage = { username, message, timestamp };
  messagesRef.push(newMessage);

  res.status(201).json(newMessage);
});

// GET /api/send/:name?/:text?  -> ? = optionnel
router.get("/send/:name?/:text?", (req, res) => {
  const username = req.params.name || "Invité"; // valeur par défaut si pas fourni
  const message = req.params.text || "Justin";
  const timestamp = new Date().toLocaleString();

  if (!message) {
    return res.json({ status: "error", message: "Texte vide" });
  }

  // Stocker le message dans le tableau messages
  messages.push({ username, message, timestamp });

  // Envoyer en temps réel aux clients connectés
  io.emit("chatMessage", { username, message, timestamp });

  // Réponse API
  res.json({ status: "ok", username, message, timestamp });
});


module.exports = {
  router,
  setMessagesArray
};
