module.exports = {
  config: {
    name: "jeux",
    aliases: ["jeu", "games", "game"],
    version: "1.0.0",
    author: "Ariel Aks Otaku",
    countDown: 1,
    role: 0,
    shortDescription: "🎮 Jeux d'Angela — liste + jouer",
    category: "🎮 Jeux"
  },

  // 📋 Liste des jeux
  jeux: [
    { id: "pfc", nom: "✊ Pierre-Feuille-Ciseaux", desc: "Le classique ! Pierre ✊ Feuille ✋ Ciseaux ✌️" },
    { id: "nombre", nom: "🔢 Devine le nombre", desc: "Je pense à un nombre entre 1 et 100, trouve-le !" },
    { id: "pendu", nom: "🎯 Le Pendu", desc: "Devine le mot avant que le bonhomme soit dessiné !" },
    { id: "quiz", nom: "📚 Quiz Rapide", desc: "Une question, une réponse ! Teste tes connaissances !" },
    { id: "couleur", nom: "🎨 Devine la couleur", desc: "Je te décris une couleur, devine laquelle c'est !" }
  ],

  // 🧠 Quiz questions
  quizQuestions: [
    { q: "Quelle est la capitale de la France ?", r: "paris" },
    { q: "Combien y a-t-il de jours dans une année ?", r: "365" },
    { q: "Quel est le plus grand océan du monde ?", r: "pacifique" },
    { q: "Qui a inventé l'ampoule ?", r: "edison" },
    { q: "Combien de continents y a-t-il ?", r: "7" }
  ],

  onStart: async function({ api, event }) {
    const userName = event.senderName || "Joueur";
    const args = event.body.trim().split(" ").slice(1).join(" ").toLowerCase();

    // 🎯 Si aucun argument → AFFICHER LA LISTE
    if (!args) {
      let liste = `
🎮 🎀 LA LUDOTHÈQUE D'ANGELA 🎀 🎮

Bonjour ${userName} ! Choisis un jeu et joue directement :

`;
      this.jeux.forEach((jeu, i) => {
        liste += `${i + 1}. ${jeu.nom}\n   └─ ${jeu.desc}\n   📝 Tape : !jeux ${jeu.id}\n\n`;
      });

      liste += `
💡 Comment jouer ?
→ Tape : !jeux pfc → pour Pierre-Feuille-Ciseaux
→ Tape : !jeux nombre → pour Deviner le nombre
→ Tape : !jeux pendu → pour le Pendu
→ Tape : !jeux quiz → pour le Quiz
→ Tape : !jeux couleur → pour Deviner la couleur

🎀 Angela — Créée par Ariel Aks Otaku 💛
      `.trim();

      return api.sendMessage(liste, event.threadID, event.messageID);
    }

    // 🎮 LANCER LE JEU SELON LE CHOIX
    const jeuChoisi = this.jeux.find(j => j.id === args);
    if (!jeuChoisi) {
      return api.sendMessage(`❌ Jeu introuvable ${userName}... Tape juste !jeux pour voir la liste 😊`, event.threadID, event.messageID);
    }

    // ✊ PIERRE-FEUILLE-CISEAUX
    if (args === "pfc") {
      const choix = ["Pierre ✊", "Feuille ✋", "Ciseaux ✌️"];
      const angela = choix[Math.floor(Math.random() * 3)];
      return api.sendMessage(
        `✊ PIERRE-FEUILLE-CISEAUX ✌️\n\n${userName}, à toi !\nRéponds par : Pierre ✊ / Feuille ✋ / Ciseaux ✌️`,
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "jeux",
            author: event.senderID,
            userName: userName,
            jeu: "pfc",
            angelaChoix: angela
          });
        },
        event.messageID
      );
    }

    // 🔢 DEVINE LE NOMBRE
    if (args === "nombre") {
      const nombre = Math.floor(Math.random() * 100) + 1;
      return api.sendMessage(
        `🔢 DEVINE LE NOMBRE 🔢\n\n${userName}, je pense à un nombre entre 1 et 100 !\nTape un nombre pour deviner 😊`,
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "jeux",
            author: event.senderID,
            userName: userName,
            jeu: "nombre",
            nombreSecret: nombre,
            essais: 0
          });
        },
        event.messageID
      );
    }

    // 🎯 LE PENDU (mots simples)
    if (args === "pendu") {
      const mots = ["chat", "chien", "soleil", "fleur", "arbre", "lune", "étoile", "pain", "eau", "maison"];
      const mot = mots[Math.floor(Math.random() * mots.length)];
      const cache = "_ ".repeat(mot.length);
      return api.sendMessage(
        `🎯 LE PENDU 🎯\n\n${userName}, trouve ce mot : ${cache}\nTape une lettre !`,
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "jeux",
            author: event.senderID,
            userName: userName,
            jeu: "pendu",
            motSecret: mot,
            lettresTrouvees: [],
            lettresRatees: [],
            essais: 0
          });
        },
        event.messageID
      );
    }

    // 📚 QUIZ
    if (args === "quiz") {
      const q = this.quizQuestions[Math.floor(Math.random() * this.quizQuestions.length)];
      return api.sendMessage(
        `📚 QUIZ 📚\n\n${userName}, question :\n${q.q}\n\nTape ta réponse !`,
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "jeux",
            author: event.senderID,
            userName: userName,
            jeu: "quiz",
            bonneReponse: q.r
          });
        },
        event.messageID
      );
    }

    // 🎨 DEVINE LA COULEUR
    if (args === "couleur") {
      const couleurs = [
        { nom: "rouge", indice: "La couleur du feu et des pommes rouges 🍎" },
        { nom: "bleu", indice: "La couleur du ciel et de la mer 🌊" },
        { nom: "vert", indice: "La couleur de l'herbe et des feuilles 🌿" },
        { nom: "jaune", indice: "La couleur du soleil 🌞" },
        { nom: "noir", indice: "La couleur de la nuit 🌑" }
      ];
      const c = couleurs[Math.floor(Math.random() * couleurs.length)];
      return api.sendMessage(
        `🎨 DEVINE LA COULEUR 🎨\n\n${userName}, indice : ${c.indice}\nQuelle couleur est-ce ?`,
        event.threadID,
        (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: "jeux",
            author: event.senderID,
            userName: userName,
            jeu: "couleur",
            bonneCouleur: c.nom
          });
        },
        event.messageID
      );
    }
  },

  // 💬 RÉPONSE EN COURS DE JEU
  onReply: async function({ api, event, Reply }) {
    const { userName, jeu } = Reply;
    const reponse = event.body.trim().toLowerCase();

    // ✊ PFC — RÉPONSE
    if (jeu === "pfc") {
      const { angelaChoix } = Reply;
      let joueurChoix = "";
      if (reponse.includes("pierre")) joueurChoix = "Pierre ✊";
      else if (reponse.includes("feuille")) joueurChoix = "Feuille ✋";
      else if (reponse.includes("ciseaux")) joueurChoix = "Ciseaux ✌️";
      else return api.sendMessage(`Je n'ai pas compris ${userName}... Réponds par : Pierre, Feuille ou Ciseaux 😊`, event.threadID, event.messageID);

      let resultat = "";
      if (joueurChoix === angelaChoix) resultat = "🤝 ÉGALITÉ ! On a choisi la même chose !";
      else if (
        (joueurChoix === "Pierre ✊" && angelaChoix === "Ciseaux ✌️") ||
        (joueurChoix === "Feuille ✋" && angelaChoix === "Pierre ✊") ||
        (joueurChoix === "Ciseaux ✌️" && angelaChoix === "Feuille ✋")
      ) resultat = `🎉 TU AS GAGNÉ ${userName} ! 🎊`;
      else resultat = `😈 J'ai gagné ! ${angelaChoix} bat ${joueurChoix} !`;

      return api.sendMessage(
        `🎮 RÉSULTAT 🎮\n\nToi : ${joueurChoix}\nAngela : ${angelaChoix}\n\n${resultat}\n\n🔄 Rejoue : !jeux pfc`,
        event.threadID,
        event.messageID
      );
    }

    // 🔢 NOMBRE — RÉPONSE
    if (jeu === "nombre") {
      const { nombreSecret, essais } = Reply;
      const nombre = parseInt(reponse);
      if (isNaN(nombre)) return api.sendMessage(`Ce n'est pas un nombre ${userName}... Réessaie ! 😊`, event.threadID, event.messageID);

      if (nombre === nombreSecret) {
        return api.sendMessage(
          `🎉 BRAVO ${userName} ! Tu as trouvé le nombre ${nombreSecret} en ${essais + 1} essais ! 🎊\n🔄 Rejoue : !jeux nombre`,
          event.threadID,
          event.messageID
        );
      } else if (nombre < nombreSecret) {
        api.sendMessage(`📈 Trop petit ${userName} ! Essaie encore 😊`, event.threadID, event.messageID);
      } else {
        api.sendMessage(`📉 Trop grand ${userName} ! Essaie encore 😊`, event.threadID, event.messageID);
      }

      // Mettre à jour les essais
      global.GoatBot.onReply.set(event.messageID, {
        commandName: "jeux",
        author: event.senderID,
        userName: userName,
        jeu: "nombre",
        nombreSecret: nombreSecret,
        essais: essais + 1
      });
      return;
    }

    // 📚 QUIZ — RÉPONSE
    if (jeu === "quiz") {
      const { bonneReponse } = Reply;
      const estJuste = reponse.includes(bonneReponse);
      return api.sendMessage(
        estJuste
          ? `🎉 BRAVO ${userName} ! C'est exactement ça ! 🎊\n🔄 Autre question : !jeux quiz`
          : `😏 Presque ${userName}... La bonne réponse était : ${bonneReponse}\n🔄 Réessaie : !jeux quiz`,
        event.threadID,
        event.messageID
      );
    }

    // 🎨 COULEUR — RÉPONSE
    if (jeu === "couleur") {
      const { bonneCouleur } = Reply;
      const estJuste = reponse.includes(bonneCouleur);
      return api.sendMessage(
        estJuste
          ? `🎉 BRAVO ${userName} ! C'est bien ${bonneCouleur} ! 🎨🎊\n🔄 Rejoue : !jeux couleur`
          : `😏 Non ${userName}... C'était ${bonneCouleur} 😊\n🔄 Réessaie : !jeux couleur`,
        event.threadID,
        event.messageID
      );
    }

    // 🎯 PENDU — RÉPONSE (simplifié)
    if (jeu === "pendu") {
      const { motSecret, lettresTrouvees } = Reply;
      const lettre = reponse[0].toLowerCase();
      const nouveauTrouvees = [...lettresTrouvees, lettre];
      
      let motAffiche = "";
      let trouve = true;
      for (const l of motSecret) {
        if (nouveauTrouvees.includes(l)) {
          motAffiche += l + " ";
        } else {
          motAffiche += "_ ";
          trouve = false;
        }
      }

      if (trouve) {
        return api.sendMessage(
          `🎉 BRAVO ${userName} ! Tu as trouvé : ${motSecret} ! 🎊\n🔄 Rejoue : !jeux pendu`,
          event.threadID,
          event.messageID
        );
      }

      api.sendMessage(`🎯 Le mot : ${motAffiche}\nContinue ${userName} ! 😊`, event.threadID, event.messageID);
      global.GoatBot.onReply.set(event.messageID, {
        commandName: "jeux",
        author: event.senderID,
        userName: userName,
        jeu: "pendu",
        motSecret: motSecret,
        lettresTrouvees: nouveauTrouvees
      });
    }
  }
};
