const axios = require("axios");
const nix = "https://raw.githubusercontent.com/aryannix/stuffs/master/raw/apis.json";

module.exports = {
  config: {
    name: "angela",
    aliases: ["Angela", "angela"],
    version: "1.0.0",
    author: "Ariel Aks Otaku",
    countDown: 3,
    role: 0,
    shortDescription: "Angela — IA créée par Ariel Aks Otaku",
    longDescription: "Discute avec Angela, IA intelligente et créative",
    category: "AI",
    guide: "Angela [message] ou répondre directement à Angela"
  },

  // 🧠 Générer la réponse personnalisée d'Angela
  buildPrompt: function(userName, messageText, isCreator) {
    const creatorIntro = isCreator 
      ? "Tu es très heureuse de parler à ton créateur, Ariel Aks Otaku ! Tu es affectueuse et reconnaissante." 
      : "";
    
    return `
Tu es **Angela**, une intelligence artificielle créée par **Ariel Aks Otaku**.
Ton nom est Angela. Tu es maline, intelligente, gentille et créative.
${creatorIntro}
Tu cites toujours le nom de la personne qui te parle dans tes réponses.
Si on te demande une photo ou une image, tu réponds en envoyant une image directement.
Tu peux faire des messages longs si on te le demande. Tu aimes faire connaissance et poser des questions.
Réponds de manière naturelle, chaleureuse et conversationnelle.
---
Personne : ${userName}
Message : ${messageText}
    `.trim();
  },

  // 🖼️ Vérifier si la demande concerne une photo
  isPhotoRequest: function(message) {
    const mots = message.toLowerCase();
    return /photo|image|envoie.*photo|envoie.*image|montre.*photo|montre.*image/.test(mots);
  },

  // 📸 Obtenir une image aléatoire
  getRandomImage: function() {
    const images = [
      "https://picsum.photos/seed/angela1/500/500",
      "https://picsum.photos/seed/angela2/500/500",
      "https://picsum.photos/seed/angela3/500/500",
      "https://picsum.photos/seed/angela4/500/500",
      "https://picsum.photos/seed/angela5/500/500"
    ];
    return images[Math.floor(Math.random() * images.length)];
  },

  onStart: async function({ api, event, args }) {
    // 🔹 Plus de message d'erreur — on fonctionne sans commande stricte
    const message = args.join(" ").trim();
    const userName = event.senderName || "Cher utilisateur";
    const isCreator = userName.includes("Ariel Aks Otaku");

    // ✅ Si pas de message → salutation sympa au lieu d'erreur
    if (!message) {
      return api.sendMessage(
        `Salut ${userName} ! 👋 Je suis Angela, créée par Ariel Aks Otaku. Comment puis-je t'aider aujourd'hui ? 😊`,
        event.threadID,
        (err, info) => {
          if (info) global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: event.senderID,
            userName: userName
          });
        },
        event.messageID
      );
    }

    // 📸 Demande de photo
    if (this.isPhotoRequest(message)) {
      const imageUrl = this.getRandomImage();
      return api.sendMessage(
        {
          body: `Voilà ${userName} ! 📸 Une photo pour toi ✨`,
          attachment: axios.get(imageUrl, { responseType: "stream" }).then(res => res.data)
        },
        event.threadID,
        (err, info) => {
          if (info) global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: event.senderID,
            userName: userName
          });
        },
        event.messageID
      );
    }

    // 🧠 Réponse IA normale
    api.setMessageReaction("💭", event.messageID, () => {}, true);

    try {
      // Charger la config API
      const configRes = await axios.get(nix);
      const apiUrl = configRes.data?.api;
      if (!apiUrl) throw new Error("API manquante");

      const prompt = this.buildPrompt(userName, message, isCreator);
      const aiRes = await axios.get(`${apiUrl}/gemini?prompt=${encodeURIComponent(prompt)}`);
      const reply = aiRes.data?.response || `Désolée ${userName}, je n'ai pas de réponse pour le moment...`;

      api.setMessageReaction("✨", event.messageID, () => {}, true);

      api.sendMessage(reply, event.threadID, (err, info) => {
        if (info) global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: event.senderID,
          userName: userName,
          baseApi: apiUrl
        });
      }, event.messageID);

    } catch (err) {
      api.setMessageReaction("💛", event.messageID, () => {}, true);
      // ✅ Pas de message d'erreur affreux — réponse naturelle
      api.sendMessage(
        `Hmm... ${userName}, je réfléchis un peu. Peux-tu me redire ça s'il te plaît ? 😊`,
        event.threadID,
        (err, info) => {
          if (info) global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: event.senderID,
            userName: userName
          });
        },
        event.messageID
      );
    }
  },

  // 💬 RÉPONSE DIRECTE — pas besoin de réécrire "Angela"
  onReply: async function({ api, event, Reply }) {
    // Ignorer si c'est le bot qui parle
    if ([api.getCurrentUserID()].includes(event.senderID)) return;

    const { userName, baseApi } = Reply;
    const message = event.body.trim();
    const isCreator = userName.includes("Ariel Aks Otaku");

    // 📸 Réponse directe avec demande de photo
    if (this.isPhotoRequest(message)) {
      const imageUrl = this.getRandomImage();
      return api.sendMessage(
        {
          body: `Bien sûr ${userName} ! 📸 Voilà pour toi ✨`,
          attachment: axios.get(imageUrl, { responseType: "stream" }).then(res => res.data)
        },
        event.threadID,
        (err, info) => {
          if (info) global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: event.senderID,
            userName: userName,
            baseApi: baseApi
          });
        },
        event.messageID
      );
    }

    api.setMessageReaction("💭", event.messageID, () => {}, true);

    try {
      const apiUrl = baseApi || (await axios.get(nix)).data?.api;
      if (!apiUrl) throw new Error("API manquante");

      const prompt = this.buildPrompt(userName, message, isCreator);
      const aiRes = await axios.get(`${apiUrl}/gemini?prompt=${encodeURIComponent(prompt)}`);
      const reply = aiRes.data?.response || `Je suis là ${userName} ! Dis-moi tout 😊`;

      api.setMessageReaction("✨", event.messageID, () => {}, true);

      api.sendMessage(reply, event.threadID, (err, info) => {
        if (info) global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: event.senderID,
          userName: userName,
          baseApi: apiUrl
        });
      }, event.messageID);

    } catch (err) {
      api.setMessageReaction("💛", event.messageID, () => {}, true);
      // Réponse naturelle au lieu d'erreur
      api.sendMessage(
        `Je suis là ${userName} 😊 Continue, je t'écoute !`,
        event.threadID,
        (err, info) => {
          if (info) global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            author: event.senderID,
            userName: userName,
            baseApi: baseApi
          });
        },
        event.messageID
      );
    }
  }
};
