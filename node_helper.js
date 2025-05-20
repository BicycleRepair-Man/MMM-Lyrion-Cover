const NodeHelper = require("node_helper");
const fetch = require("node-fetch");

module.exports = NodeHelper.create({
  start() {
    this.config = {};
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "CONFIG") {
      this.config = payload;
    }

    if (notification === "GET_LYRION_DATA") {
      this.getLyrionData();
    }
  },

  async getLyrionData() {
    try {
      const res = await fetch(`${this.config.lmsServer}/jsonrpc.js`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 1,
          method: "slim.request",
          params: ["", ["status", "-", 1, "tags:albct"]]
        })
      });

      const data = await res.json();
      const song = data.result && data.result.playlist_loop && data.result.playlist_loop[0];

      if (song) {
        const coverUrl = `${this.config.lmsServer}/music/${song.coverid}/cover.jpg`;

        this.sendSocketNotification("LYRION_DATA", {
          title: song.title || "",
          artist: song.artist || "",
          album: song.album || "",
          artwork_url: song.coverid ? coverUrl : null
        });
      }
    } catch (e) {
      console.error("Fehler beim Abrufen von Lyrion-Daten:", e);
    }
  }
});
