//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    let self = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync('shouldUpdateCardInfo', true)
    wx.setStorageSync('shouldUpdateCollectionInfo', true)
    //
    wx.getSystemInfo({
      success: function(res) {
        let model = res.model.substring(0, res.model.indexOf("X")) + "X";
        if (model == 'iPhone X') {
          self.globalData.isIpx = true //判断是否为iPhone X 默认为值false，iPhone X 值为true
        }
      }
    })
  },
  globalData: {
    baseUrl: 'https://dailytech5.com/',
    apiUrl: 'https://dailytech5.com/tools/hospital_api.ashx',
    isIpx: false,
  }
})