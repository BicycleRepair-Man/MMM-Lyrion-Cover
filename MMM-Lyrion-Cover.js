Module.register("MMM-Lyrion-Cover", {
    defaults: {
        updateInterval: 60000,
        lmsServer: "http://192.168.1.100:9000",
    },

    start: function () {
        this.players = [];
        this.getPlayers();
        setInterval(() => {
            this.getPlayers();
        }, this.config.updateInterval);
    },

    getPlayers: function () {
        this.sendSocketNotification("GET_PLAYERS_AND_TRACKS", this.config.lmsServer);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "PLAYERS_TRACKS_RESULT") {
            this.players = payload;
            this.updateDom();
        }
    },

    getStyles: function () {
        return ["MMM-Lyrion-Cover.css", "font-awesome.css"];
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        wrapper.className = "Lyrion";

        var playingPlayers = this.players.filter(player => player.isPlaying && player.track);

        if (playingPlayers.length === 0) {
            wrapper.innerHTML = this.translate("noplayer") + "  <i class='fa fa-music'></i>";
            return wrapper;
        }

        playingPlayers.forEach(player => {
            var playerDiv = document.createElement("div");
            playerDiv.className = "player-container";

            // Cover links
            if (player.track && player.track.cover) {
                var coverImg = document.createElement("img");
                coverImg.src = player.track.cover;
                coverImg.alt = "Cover";
                coverImg.className = "cover-image";
                coverImg.onerror = function () {
                    this.style.display = "none";
                };
                playerDiv.appendChild(coverImg);
            }

            // Playerinfo rechts neben Cover
            var infoDiv = document.createElement("div");
            infoDiv.className = "player-info";

            var header = document.createElement("div");
            header.className = "player-header";
            header.innerHTML = `<b>${player.name}</b>  <i class="fa fa-play"></i>`;

            var trackInfo = document.createElement("div");
            trackInfo.className = "player-track-info";
            if (player.track) {
                trackInfo.innerHTML = `${player.track.artist} – ${player.track.title}`;
            } else {
                trackInfo.innerHTML = "";
            }

            infoDiv.appendChild(header);
            infoDiv.appendChild(trackInfo);

            playerDiv.appendChild(infoDiv);
            wrapper.appendChild(playerDiv);
        });

        return wrapper;
    }
});
