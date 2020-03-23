# 谷歌插件 - 用来解决客户端跨域问题，以及对应不同的服务端cors策略，做不同类型的处理

### 跨域

当打开开关(点亮开关图标即可)，即可跨域； 


### 自定义请求头
自定义请求头，请在url参数里打入参数，
如：
```js 
let url = "www.baidu.com";
const headers = JSON.stringfy({
    "X-s":"我是一条自定义的请求头"
});
url = url + "?setHeaders="+headers

fetch(url);
```
注意，以上的url在发送时，本插件会自动处理query里的setHeaders参数，将其逐条打入headers中，然后过滤掉url里的setHeaders； 

### 携带cookie跨域
为了安全，携带cookie的跨域请求，本插件默认是制止的，如果你想携带cookie请求，请在setHeaders的参数里加入 
```js
 "withCookie":true 
```
例如: 
```js 
    let url = "www.baidu.com";
    const headers = JSON.stringfy({
        "withCookie": true
    });
    url = url + "?setHeaders="+headers;
    fetch(url,{
        credentials:"include"
    })
    .then(res=>{
        //成功携带跨域并拿到了res
        // toDo
    })
```


