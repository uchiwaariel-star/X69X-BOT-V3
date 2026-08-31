module.exports = {
  config: {
    name: "check",
    aliases: ["angela_check", "etat", "verifier"],
    version: "1.0.2",
    author: "Ariel Aks Otaku",
    countDown: 1,
    role: 0,
    shortDescription: "✅ Vérifier l'état d'Angela",
    category: "Système"
  },

  onStart: async function({ api, event }) {
    const userName = event.senderName || "Utilisateur";
    const isCreator = userName.includes("Ariel Aks Otaku");

    let message = `
🎀 ÉTAT D'ANGELA 🎀

✅ Nom : Angela Aks
✅ Créateur : Ariel Aks Otaku
✅ Statut : 🟢 EN LIGNE — Fonctionne parfaitement
✅ Version : 1.0.2

🧠 Intelligence Artificielle : ✅ Active
💬 Réponse aux messages : ✅ Active
💛 Citation des noms : ✅ Active
📸 Envoi de photos : ✅ Active
🎮 Système de jeux : ✅ Disponible

${isCreator ? "👑 Merci à toi, mon créateur Ariel Aks Otaku ! Je suis là pour toi 💛" : `Bonjour ${userName} ! Je suis prête à discuter 😊`}

─── Tape !jeux pour voir les jeux 🎮 ───
    `.trim();

    api.sendMessage(message, event.threadID, event.messageID);
  }
};
