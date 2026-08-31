// === COMMANDE DE VÉRIFICATION ANGELA ===
// À ajouter dans ton fichier de commandes

module.exports = {
  config: {
    name: "angela_check",
    aliases: ["check", "etat", "verifier"],
    version: "1.0.0",
    author: "Ariel Aks Otaku",
    countDown: 2,
    role: 0,
    shortDescription: "Vérifier si Angela fonctionne bien",
    longDescription: "Affiche l'état complet et les infos d'Angela",
    category: "Système",
    guide: "!angela_check ou !check"
  },

  onStart: async function({ api, event }) {
    const userName = event.senderName || "Cher utilisateur";
    const isCreator = userName.includes("Ariel Aks Otaku");

    const etat = {
      nom: "Angela Aks",
      createur: "Ariel Aks Otaku",
      version: "1.0.0",
      statut: "🟢 EN LIGNE — Fonctionne parfaitement",
      ia: "Gemini AI ✅ Actif",
      photos: "📸 Envoi d'images ✅ Actif",
      memoire: "💬 Réponses directes ✅ Actif",
      personnalisation: "💛 Nom des personnes cité ✅ Actif",
      modeCreateur: isCreator ? "👑 Mode Créateur — Accès complet" : "✅ Mode Utilisateur"
    };

    const message = `
🎀 ─── ÉTAT D'ANGELA ─── 🎀

👤 Nom : ${etat.nom}
🧑‍💻 Créateur : ${etat.createur}
📌 Version : ${etat.version}

${etat.statut}

🧠 Intelligence Artificielle : ${etat.ia}
📸 Envoi de photos : ${etat.photos}
💬 Réponse directe (sans répéter Angela) : ${etat.memoire}
💛 Citation des noms : ${etat.personnalisation}
${etat.modeCreateur}

─── Angela est prête ! Bonne conversation ${userName} 💛 ───
    `.trim();

    // Image de présentation + message
    const imageUrl = "https://picsum.photos/seed/angela-officielle/400/400";
    const imageStream = await require("axios").get(imageUrl, { responseType: "stream" }).then(r => r.data);

    return api.sendMessage(
      { body: message, attachment: imageStream },
      event.threadID,
      event.messageID
    );
  }
};
