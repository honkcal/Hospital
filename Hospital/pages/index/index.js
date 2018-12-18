Page({
  toindex2: function() {
    wx.switchTab({
      url: '/pages/index4/index4',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "皇后镇最in攻略、最hot推荐、最全指南，尽在“发现皇后镇",
            path: "/pages/index/index",
            success: function (t) { },
            fail: function (t) { }
        }
    },
  bindGetUserInfo: function(e) {
    let self = this;
    if (wx.getStorageSync('unionId') == null || wx.getStorageSync('unionId') == '') {
      wx.showToast({
        icon: "loading",
        title: "正在加载...",
        duration: 2000000,
      })
      wx.login({
        success: res => {
          if (res.code) {
            wx.request({
              method: 'POST',
              url: getApp().globalData.apiUrl,
              data: {
                action: 'getOpenId',
                source: 'queenstown',
                code: res.code
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              success: res2 => {
                console.log("log002")
                console.log(res2)
                if (res2.data.unionid) {
                  wx.setStorageSync('unionId', res2.data.unionid)
                  wx.setStorageSync('openId', res2.data.openid)
                  wx.getUserInfo({
                    success: res3 => {
                      console.log("log010")
                      console.log(res3.userInfo)
                      if (res3.userInfo) {
                        wx.setStorageSync('nickName', res3.userInfo.nickName)
                        wx.setStorageSync('avatarUrl', res3.userInfo.avatarUrl)
                        wx.setStorageSync('sex', res3.userInfo.gender)
                      }
                      self.toindex2();
                    }
                  })
                  //wx.setStorageSync('openId', res2.data.openid);//存储openid
                } else {
                  console.log("log004, unionid is null")
                  wx.getUserInfo({
                    success: res3 => {
                      console.log("log005")
                      console.log(res3)
                      console.log(res2.data.obj.session_key)
                      wx.request({
                        method: 'POST',
                        url: getApp().globalData.apiUrl,
                        data: {
                          action: 'getUnionId',
                          source: 'queenstown',
                          session_key: res2.data.obj.session_key,
                          iv: res3.iv,
                          encryptedData: res3.encryptedData
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 默认值
                        },
                        success: res4 => {
                          console.log("log006")
                          console.log(res4)
                          if (res4.data.data.userinfo.unionId) {
                            wx.setStorageSync('unionId', res4.data.data.userinfo.unionId)
                            wx.setStorageSync('openId', res4.data.data.userinfo.openId)
                            wx.setStorageSync('nickName', res4.data.data.userinfo.nickName)
                            wx.setStorageSync('avatarUrl', res4.data.data.userinfo.avatarUrl)
                            wx.setStorageSync('sex', res4.data.data.userinfo.gender)
                          }
                          self.toindex2();
                        }
                      })
                    }
                  })
                }
              }
            })
          }
        },
        complete() {
          wx.hideToast();
        }
      })
    } else {
      self.toindex2();
    }
  }
})