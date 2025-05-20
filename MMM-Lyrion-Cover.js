Module.register("MMM-Lyrion-Cover", {
  defaults: {
    updateInterval: 60000,
    lmsServer: "",
    showCover: true
  },

  start() {
    this.currentTrack = null;
    this.sendSocketNotification("SET_CONFIG", this.config);
    this.getData();
    setInterval(() => this.getData(), this.config.updateInterval);
  },

  getData() {
    this.sendSocketNotification("GET_LYRION_DATA");
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "lyrion-wrapper";

    if (!this.currentTrack) {
      wrapper.innerHTML = "Warte auf Musikdaten...";
      return wrapper;
    }

    if (this.config.showCover && this.currentTrack.artwork_url) {
      const img = document.createElement("img");
      img.src = this.currentTrack.artwork_url;
      img.className = "lyrion-cover";
      wrapper.appendChild(img);
    }

    const text = document.createElement("div");
    text.className = "lyrion-text";
    text.innerHTML = `
      <strong>${this.currentTrack.title}</strong><br/>
      ${this.currentTrack.artist} – ${this.currentTrack.album}
    `;
    wrapper.appendChild(text);

    return wrapper;
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "LYRION_DATA") {
      this.currentTrack = payload;
      this.updateDom();
    }
  }
});
