var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path == 'background-to-popup') {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'popup-to-background', "method": id, "data": data})}
  }
})();

var load = function () {
  var test = document.querySelector(".test");
  var reload = document.querySelector(".reload");
  var toggle = document.querySelector(".toggle");
  var support = document.querySelector(".support");
  var options = document.querySelector(".options");
  var donation = document.querySelector(".donation");
  var whitelist = document.querySelector(".whitelist");
  /*  */
  test.addEventListener("click", function () {background.send("test")});
  reload.addEventListener("click", function () {background.send("reload")});
  toggle.addEventListener("click", function () {background.send("toggle")});
  support.addEventListener("click", function () {background.send("support")});
  options.addEventListener("click", function () {background.send("options")});
  donation.addEventListener("click", function () {background.send("donation")});
  whitelist.addEventListener("click", function () {background.send("whitelist")});
  /*  */
  background.send("load");
  window.removeEventListener("load", load, false);
};

background.receive("storage", function (e) {
  var toggle = document.querySelector(".toggle");
  var whitelist = document.querySelector(".whitelist");
  /*  */
  whitelist.removeAttribute("added");
  toggle.setAttribute("state", e.state);
  /*  */
  if (e.whitelist) {
    if (e.tab && e.tab.url) {
      if (e.tab.url.indexOf("http") === 0) {
        var tmp = new URL(e.tab.url);
        var hostname = tmp.hostname.replace("www.", '');
        if (e.whitelist.indexOf(hostname) !== -1) {
          whitelist.setAttribute("added", true);
        }
        /*  */
        return;
      }
    }
  }
  /*  */
  whitelist.setAttribute("error", true);
  window.setTimeout(function () {
    whitelist.removeAttribute("error");
  }, 150);
});

window.addEventListener("load", load, false);
