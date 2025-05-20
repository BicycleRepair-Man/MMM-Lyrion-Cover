Module.register("MMM-Lyrion-Cover", {
  defaults: {
    updateInterval: 60000,
    lmsServer: "",
    showCover: true
  },

  start() {
    this.playersNowPlaying = [];
    this.sendSocketNotification("SET_CONFIG", this.config);
    this.getData();
    setInterval(() => this.getData(), this.config.updateInterval);
  },

  getData() {
    this.sendSocketNotification("GET_LYRION_DATA");
  },

  getStyles: function() {
        return ["MMM-Lyrion-Cover.css", "font-awesome.css"];
    },
  
  getDom() {
    const wrapper = document.createElement("div");

    if (this.playersNowPlaying.length === 0) {
      wrapper.innerHTML = "Kein aktiver Player gefunden.";
      return wrapper;
    }

    this.playersNowPlaying.forEach(player => {
      const playerWrapper = document.createElement("div");
      playerWrapper.className = "lyrion-wrapper";

      if (this.config.showCover && player.artwork_url) {
        const img = document.createElement("img");
        img.src = player.artwork_url;
        img.className = "lyrion-cover";
        playerWrapper.appendChild(img);
      }

      const text = document.createElement("div");
      text.className = "lyrion-text";
      text.innerHTML = `
        <small>${player.name}</small>
        <strong>${player.title}</strong><br/>
        ${player.track.artist} – ${player.track.album}<br/>
        
      `;
      playerWrapper.appendChild(text);

      wrapper.appendChild(playerWrapper);
    });

    return wrapper;
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "LYRION_DATA") {
      this.playersNowPlaying = payload;
      this.updateDom();
    }
  }
});
