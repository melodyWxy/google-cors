// v44
var isHeaderHasCookie = true;
function cookieStrCode(queryCookie){
  let resStr = '';
  const arr= queryCookie.split(';');
  arr.forEach((item)=>{
     const itemArr = item.split('=');
     if(resStr){
        resStr += ';'
      }
     resStr= resStr +itemArr[0] + '=' +  encodeURIComponent(itemArr[1]);
  })
  return resStr;
}
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
          // let setCookie='';
          let headers = null;
          const urlObj = new URL(info.url);
          urlObj.searchParams.forEach((value,key)=>{
            if(key==='setHeaders'){
              try {
                headers = JSON.parse(value);
              } catch (error) {
                
              }
            }
          })
          isHeaderHasCookie = false;
          if(headers) {
            for(let i in headers){
              let value = headers[i];
              // if(i === 'withCookie'){
              //    isHeaderHasCookie = true;
              // }
              if(i === 'Cookie'){
                isHeaderHasCookie = true;
                value = cookieStrCode(headers[i]);
              }
              info.requestHeaders.filter(item=>item.name===i);
              info.requestHeaders.push({
                name:i,
                value: value
              })
            }
            urlObj.searchParams.delete('setHeaders');
            info.url = urlObj.toString();
          }
          let requestHeaders = info.requestHeaders.find(e => e.name.toLowerCase() === "access-control-request-headers");
          if (requestHeaders) config.addon.MAP.set(info.requestId, requestHeaders.value);
          const frequestHeaders = info.requestHeaders;
          console.log(frequestHeaders,99);
          return {"requestHeaders":frequestHeaders};
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
      	responseHeaders.push({'name': 'Access-Control-Allow-Origin','value': isHeaderHasCookie?'*':top});
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

"wpt_front_debug1=false; wptTouristUri=M20032015543acdt; wpt_env_num=env_04; userinfo_cookie=PgqfEm44IyzXyP5BCi5KYFvEPpM26HxvFB%2BYwxUewC0nt%2Bc2CD5xnoVKDpiNlzGQje9IGM4bfq%2Bx6ToxmDUtbGJX%2F4qvSx5ncPhfTwUf%2FhEh9lSJ2Xfr44PCjHkB5msRAKPp1%2BaNvqEOGVpl1cjqE4Y3CnIMwX4FRnBsUy6HtG7%2Bs6Pycr5BrvI36w9T8ndu3qlB4SlRy5uU4gDgpNu14rZPEJjv063uL%2FMryTgnftDg6R%2FeDoL1mqzd7kmNnZvvIFRX2wWUuk3eMHXYp%2B0Y4U7X4CXaWuQweE7sn850xG8%3D; identity=fb2231ade8e91bcd2aa79ff3e0683d51; h5V=20200401-120853; wptSessionId=20200401131254_k06q5qwlls"