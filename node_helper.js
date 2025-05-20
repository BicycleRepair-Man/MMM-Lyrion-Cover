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
    try {
      const res = await axios.get(`${this.config.lmsServer}/jsonrpc.js`, {
        params: {
          player: "",
          method: "slim.request",
          params: ["", ["status", "-", 1, "tags:adcl"]]
        }
      });

      const data = res.data;
      const result = data.result;

      const coverId = result.coverid;
      const coverUrl = coverId ? `${this.config.lmsServer}/music/${coverId}/cover.jpg` : null;

      this.sendSocketNotification("LYRION_DATA", {
        title: result.title || "",
        artist: result.artist || "",
        album: result.album || "",
        artwork_url: coverUrl
      });
    } catch (error) {
      console.error("[MMM-Lyrion] Fehler beim Abrufen der Daten:", error);
    }
  }
});
