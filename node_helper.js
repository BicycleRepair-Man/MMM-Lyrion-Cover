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
    const playersData = [];

    try {
      const playerList = await axios.post(`${lmsUrl}/jsonrpc.js`, {
        id: 1,
        method: "slim.request",
        params: ["", ["players", "0", "100"]]
      });

      const players = playerList.data.result.players_loop || [];

      for (const player of players) {
        const playerId = player.playerid;
        const playerName = player.name;

        const statusRes = await axios.post(`${lmsUrl}/jsonrpc.js`, {
          id: 1,
          method: "slim.request",
          params: [playerId, ["status", "-", 1, "tags:adlcu"]]
        });

        const status = statusRes.data.result;

        if (status.mode === "play") {
          const coverId = status.coverid;
          const coverUrl = coverId ? `${lmsUrl}/music/${coverId}/cover.jpg` : null;

          playersData.push({
            name: playerName,
            title: status.title || "Unbekannter Titel",
            artist: status.artist || "Unbekannter Künstler",
            album: status.album || "Unbekanntes Album",
            artwork_url: coverUrl
          });
        }
      }

      this.sendSocketNotification("LYRION_DATA", playersData);

    } catch (error) {
      console.error("Fehler beim Abrufen der Lyrion-Daten:", error.message);
    }
  }
});
