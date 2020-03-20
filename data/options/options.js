var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === 'background-to-options') {
          if (request.method === id) tmp[id](request.data);
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'options-to-background', "method": id, "data": data})}
  }
})();

background.receive("storage", function (e) {
  var whitelist = document.getElementById("whitelist");
  whitelist.value = e.whitelist.join(', ');
});

var load = function () {
  var whitelist = document.getElementById("whitelist");
  whitelist.addEventListener("change", function (e) {
    var tmp = e.target.value;
    var domains = tmp.split(',').map(e => e.trim());
    background.send("whitelist", domains);
  });
  /*  */
  background.send("load");
  window.removeEventListener("load", load, false);
};

window.addEventListener("load", load, false);
