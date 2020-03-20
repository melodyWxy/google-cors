// v44
var core = {
  "update": {
    "options": function () {
      app.options.send("storage", {
        "whitelist": config.addon.whitelist
      });
    },
    "state": function () {
      config.addon.state = config.addon.state === "ON" ? "OFF" : "ON";
      /*  */
      core.update.popup();
      app.webrequest.listener();
      app.button.badge(config.addon.state);
      app.button.title("Access-Control-Allow-Origin: " + config.addon.state);
    },
    "popup": function () {
      app.tab.active.query(function (tab) {
        app.popup.send("storage", {
          "tab": tab,
          "state": config.addon.state,
          "whitelist": config.addon.whitelist
        });
      });
    }
  },
  "listener": {
    "before": {
      "send": {
        "headers": function (info) {
          let setCookie='';
          const urlObj = new URL(info.url);
          urlObj.searchParams.forEach((value,key)=>{
            if(key==='setCookie'){
              setCookie = value;
            }
          })
          if(setCookie){
            info.requestHeaders.filter(item=>item.name==='Cookie');
            info.requestHeaders.push({
              name:'Cookie',
              value: setCookie
            })
            urlObj.searchParams.delete('setCookie');
            info.url = urlObj.toString();
          }
          let requestHeaders = info.requestHeaders.find(e => e.name.toLowerCase() === "access-control-request-headers");
          if (requestHeaders) config.addon.MAP.set(info.requestId, requestHeaders.value);
        }
      }
    },
    "headers": {
      "received": function (info) {
        var top = info.initiator || info.documentUrl || info.originUrl || info.url;
        /*  */
        var hostname = top ? app.hostname(top) : '';
        if (config.addon.whitelist.indexOf(hostname) !== -1) return;
        /*  */
        let responseHeaders = info.responseHeaders.filter(e => e.name.toLowerCase() !== 'access-control-allow-origin' && e.name.toLowerCase() !== 'access-control-allow-methods');
      	responseHeaders.push({'name': 'Access-Control-Allow-Origin','value': 'http://localhost:10240'});
      	responseHeaders.push({'name': 'Access-Control-Allow-Methods', 'value': 'GET, PUT, POST, DELETE, HEAD, OPTIONS'});
        /*  */
        if (config.addon.MAP.has(info.requestId)) {
          responseHeaders.push({'name':'Access-Control-Allow-Headers', 'value': config.addon.MAP.get(info.requestId)});
          config.addon.MAP.delete(info.requestId);
        }
        /*  */
      	return {"responseHeaders": responseHeaders};
      }
    }
  }
};

app.popup.receive("whitelist", function () {
  app.tab.active.query(function (tab) {
    if (tab && tab.url) {
      if (tab.url.indexOf("http") === 0) {
        var tmp = new URL(tab.url);
        var whitelist = config.addon.whitelist;
        var hostname = tmp.hostname.replace("www.", '');
        /*  */
        var index = whitelist.indexOf(hostname);
        if (index !== -1) whitelist.splice(index, 1);
        else {
          whitelist.push(hostname);
          whitelist = whitelist.filter(function (a, b) {return whitelist.indexOf(a) === b});
        }
        /*  */
        config.addon.whitelist = whitelist;
      }
    }
    /*  */
    core.update.popup();
  });
});
app.popup.receive("load", core.update.popup);
app.popup.receive("toggle", core.update.state);
app.options.receive("load", core.update.options);
app.popup.receive("reload", app.tab.active.reload);
app.popup.receive("options", app.tab.options.page);
app.popup.receive("support", function () {app.tab.open(app.homepage())});
app.options.receive("whitelist", function (e) {config.addon.whitelist = e});
app.popup.receive("test", function () {app.tab.open(config.addon.test.page)});
app.popup.receive("donation", function () {app.tab.open(app.homepage() + "?reason=support")});

window.setTimeout(function () {
  app.button.badge(config.addon.state);
  app.button.title("Access-Control-Allow-Origin: " + config.addon.state);
}, 0);

app.webrequest.listener();
app.Hotkey(function (e) {if (e === "_mode") core.update.state()});
