const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

function t(t) { 
  n.login().then(function (a) { 
    t(a) 
  }, 
  function (a) { 
    t(a) 
  }) 
} 

function a() { 
  wx.showToast({ 
    title: "接口返回错误", 
    icon: "success", 
    duration: 2e4 
  }) 
} 

var n = require("auth.js"), 
e = { ajax: { rootHttp: "https://helsinki.wiiqq.com/" } },
o = function (t) { 
  return (t = t.toString())[1] ? t : "0" + t 
}; 

module.exports = { 
  formatTime: function (t) { 
    var a = t.getFullYear(), 
    n = t.getMonth() + 1, 
    e = t.getDate(), 
    i = t.getHours(), 
    s = t.getMinutes(), 
    c = t.getSeconds(); 
    return [a, n, e].map(o).join("/") + " " + [i, s, c].map(o).join(":") 
  }, 
  ajax: function (n) { 
    n && void 0 === n.config && (n.config = e.ajax), 
    t(function (t) { 
      var e = n.config.rootHttp + n.url, o = n.data; 
      o = Object.assign(o, t); 
      var i = n.success, s = n.fail, c = n.method, r = n.complete; 
      wx.request({ 
        url: e, 
        data: o, 
        method: c, 
        header: { 
          "content-type": "application/json" 
        }, 
        success: function (t) { 
          if ("string" == typeof t) return a(), !1; 
          i && i(t.data) }, 
          fail: function (t) { 
            s && s(t) 
          }, 
          complete: function (t) { 
            if (t && t.data && t.data.data && t.data.data._application && t.data.data._application.user && t.data.data._application.user.session_key && wx.setStorageSync("sessionId", t.data.data._application.user.session_key), "string" == typeof t.data) return a(), !1; r && r(t) } }) }) } }