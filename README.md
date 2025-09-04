# MMM-Lyrion-Cover

This module allows you to display the cover of the media currently playing on your Lyrion Media Server (formerly Logitech Media Server or LMS)

## Configuration

To enable the module, add it to the config.js file in your MagicMirror setup:

```bash
{
    module: "MMM-Lyrion-Cover",
    disabled: false,
    position: "bottom_right",                     // Adjust as needed
    config: {
        lmsServer: "http://10.30.10.11:9000"      // IPofyourserver:9000
        showCover: true
    }
}
```
