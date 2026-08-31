const axios = require("axios");

module.exports = {
  config: {
    name: "jeux",
    aliases: ["jeu", "games", "game"],
    version: "1.0.0",
    author: "Ariel Aks Otaku",
    countDown: 2,
    role: 0,
    shortDescription: "🎮 Afficher tous les jeux d'Angela",
    longDescription: "Découvre et joue à tous les jeux disponibles avec Angela",
    category: "🎮 Jeux",
    guide: "!jeux → voir la liste | !pendu | !deviner | !quiz | !morceaux | !histoire | !chiffres"
  },

  // 📋 Liste complète des jeux
  listeJeux: [
    {
      nom: "🎯 Le Pendu",
      commande: "!pendu",
      description: "Devine le mot lettre par lettre avant que le bonhomme soit pendu !",
      difficulte: "Facile"
    },
    {
      nom: "🧠 Devine le nombre",
      commande: "!chiffres",
      description: "Je pense à un nombre, essaie de le trouver en moins de coups possibles !",
      difficulte: "Facile"
    },
    {
      nom: "📚 Quiz Culture Générale",
      commande: "!quiz",
      description: "Réponds aux questions et teste tes connaissances !",
      difficulte: "Moyen"
    },
    {
      nom: "🔮 Devine ce que je pense",
      commande: "!deviner",
      description: "Je pense à un objet, un animal... Tu dois deviner en posant des questions !",
      difficulte: "Moyen"
    },
    {
      nom: "📖 Histoire Interactive",
      commande: "!histoire",
      description: "Tu es le héros d'une aventure, tes choix décident de la suite !",
      difficulte: "Moyen"
    },
    {
      nom: "🎬 Devine la chanson/film",
      commande: "!morceaux",
      description: "Je te donne une phrase ou un indice, devine de quoi ça parle !",
      difficulte: "Facile"
    },
    {
      nom: "✊ Pierre-Feuille-Ciseaux",
      commande: "!pfc",
      description: "Le classique en direct ! Pierre ✊ Feuille ✋ Ciseaux ✌️",
      difficulte: "Facile"
    },
    {
      nom: "🔤 Le Mot Mystère",
      commande: "!mot",
      description: "Retrouve un mot mélangé avant le temps imparti !",
      difficulte: "Facile"
    }
  ],

  onStart: async function({ api, event }) {
    const userName = event.senderName || "Cher joueur";
    const isCreator = userName.includes("Ariel Aks Otaku");

    // 📸 Image de la ludothèque d'Angela
    const imageUrl = "https://picsum.photos/seed/angela-games/500/350";
    const imageStream = await axios.get(imageUrl, { responseType: "stream" }).then(r => r.data);

    // 📋 Construction du message
    let message = `
🎮 ─── LA LUDOTHÈQUE D'ANGELA ─── 🎮

👤 Joueur : ${userName}
🎀 Angela — Créée par Ariel Aks Otaku

Voici TOUS les jeux auxquels on peut jouer ensemble ! 🎉

`;

    // Ajouter chaque jeu dans la liste
    this.listeJeux.forEach((jeu, index) => {
      message += `
${index + 1}. ${jeu.nom}
   ├─ ${jeu.description}
   ├─ 📝 Tape : ${jeu.commande}
   └─ 🎯 Niveau : ${jeu.difficulte}
`;
    });

    message += `
─── 🎲 COMMENT JOUER ? ───
• Tape simplement la commande du jeu pour commencer
• Tu peux changer de jeu à tout moment avec !jeux
• Pour quitter un jeu : tape "quitter"

${isCreator ? "👑 Merci à toi, mon créateur Ariel Aks Otaku, pour m'avoir donné la vie ! 💛" : ""}

Amuse-toi bien ${userName} ! 💕
    `.trim();

    // ✅ Envoyer : Message + Photo de la ludothèque
    return api.sendMessage(
      { body: message, attachment: imageStream },
      event.threadID,
      event.messageID
    );
  }
};
