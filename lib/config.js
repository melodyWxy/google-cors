var config = {};

config.welcome = {
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

console.log(1111);
config.addon = {
  "MAP": new Map(),
  "URLS": {"urls": ["http://*/*", "https://*/*"]},
  "test": {"page": "https://webbrowsertools.com/test-cors/"},
  "OPTIONS": {
    "request": navigator.userAgent.indexOf("Firefox") !== -1 ? ["blocking", "requestHeaders"] : ["blocking", "requestHeaders", "extraHeaders"],
    "response": navigator.userAgent.indexOf("Firefox") !== -1 ? ["blocking", "responseHeaders"] : ["blocking", "responseHeaders", "extraHeaders"]
  },
  /*  */
  set state (val) {app.storage.write("state", val)},
  set whitelist (val) {app.storage.write("whitelist", val)},
  get state () {return app.storage.read("state") !== undefined  ? app.storage.read("state") : "OFF"},
  get whitelist () {return app.storage.read("whitelist") !== undefined ? app.storage.read("whitelist") : []}
};

alert(111);