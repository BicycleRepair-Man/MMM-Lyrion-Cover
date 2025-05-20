const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
  start() {
    this.config = {};
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "SET_CONFIG") {
      this.config = payload;
    }

    if (notification === "GET_LYRION_DATA") {
      this.getLyrionData();
    }
  },

  async getLyrionData() {
    const lmsUrl = this.config.lmsServer;
    try {
      // 1. Alle Player abfragen
      const playerRes = await axios.post(`${lmsUrl}/jsonrpc.js`, {
        id: 1,
        method: "slim.request",
        params: ["", ["players", "0", "100"]]
      });

      const players = playerRes.data.result.players_loop || [];

      // 2. Aktiven Player finden
      let activePlayer = null;
      let currentTrack = null;

      for (const player of players) {
        const playerId = player.playerid;

        const statusRes = await axios.post(`${lmsUrl}/jsonrpc.js`, {
          id: 1,
          method: "slim.request",
          params: [playerId, ["status", "-", 1, "tags:adlcu"]]
        });

        const status = statusRes.data.result;

        if (status.mode === "play") {
          activePlayer = {
            name: player.name,
            playerid: playerId
          };

          const coverId = status.coverid;
          const coverUrl = coverId ? `${lmsUrl}/music/${coverId}/cover.jpg` : null;

          currentTrack = {
            title: status.title || "Unbekannter Titel",
            artist: status.artist || "Unbekannter Künstler",
            album: status.album || "Unbekanntes Album",
            artwork_url: coverUrl
          };

          break; // nur den ersten aktiven Player anzeigen
        }
      }

      this.sendSocketNotification("LYRION_DATA", {
        players,
        activePlayer,
        currentTrack
      });

    } catch (error) {
      console.error("Fehler beim Abrufen der Lyrion-Daten:", error.message);
    }
  }
});
