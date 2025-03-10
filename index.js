const { ipcRenderer } = require("electron");
const path = require("path");
class Plugin {
  #ctx;
  constructor(ctx) {
    this.#ctx = ctx;
  }

  init() {
    const focusButton = document.querySelector("#focus");
    if (focusButton) {
      const button = document.createElement("div");
      button.id = "radar";
      button.name = "雷達回波圖";
      button.className = "nav-bar-location";
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e8eaed"><path d="M480.28-96Q401-96 331-126t-122.5-82.5Q156-261 126-330.96t-30-149.5Q96-560 126-629.5q30-69.5 82.5-122T330.96-834q69.96-30 149.5-30t149.04 30q69.5 30 122 82.5T834-629.28q30 69.73 30 149Q864-401 834-331t-82.5 122.5Q699-156 629.28-126q-69.73 30-149 30Zm.06-72Q535-168 584-186t89-50l-51-52q-29.63 22.91-65.89 35.45Q519.84-240 480-240q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 40-12.5 76T672-338l52 51q32-40.13 50-89.06 18-48.94 18-103.6 0-130.79-91-221.57Q610-792 480-792t-221 91q-91 91-91 221t90.77 221q90.78 91 221.57 91ZM480-312q25 0 47.5-7t42.5-20l-72-72q-4.5 2-9 2.5t-9 .5q-29.7 0-50.85-21.21Q408-450.43 408-480q0-29.7 21.21-50.85 21.21-21.15 51-21.15T531-530.96q21 21.04 21 50.59 0 5.37-1 9.37-1 4-2 9l72 72q12.91-19.76 19.96-42.26Q648-454.76 648-480q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z"/></svg>`;
      focusButton.insertAdjacentElement("afterend", button);
    }
  }

  addClickEvent() {
    const { info } = this.#ctx;
    const button = document.querySelector("#radar");
    button.addEventListener("click", () => {
      ipcRenderer.send("open-plugin-window", {
          pluginId: "radar",
          htmlPath: `${info.pluginDir}/radar/web/radar.html`,
          options: {
            width          : 886,
            height         : 673,
            minWidth       : 886,
            minHeight      : 673,
            title: "Radar",
          },
      });
    });

  }

  onLoad() {
    this.init();
    this.addClickEvent();
  }
}

module.exports = Plugin;