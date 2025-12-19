var express = require("express");
var router = express.Router();

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

router.get("/messages",auth, (req, res) => {
  res.json(messagesRef || []);
});

/**
 * GET /api
 * Vérifie que l'API fonctionne
 */
// router.get("/", (req, res) => {
//   res.json({ status: "ok", message: "L'API fonctionne !" });
// });


/**
 * POST /api/messages
 * Ajoute un message
 */
router.post("/", (req, res) => {
  const { username, message, timestamp } = req.body;

  if (!username || !message || !timestamp) {
    return res.status(400).json({ error: "Données manquantes" });
  }

  const newMessage = { username, message, timestamp };
  messagesRef.push(newMessage);

  res.status(201).json(newMessage);
});

module.exports = {
  router,
  setMessagesArray
};
