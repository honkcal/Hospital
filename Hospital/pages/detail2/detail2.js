var WxParse = require("../../wxParse/wxParse.js");

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: getApp().globalData.isIpx,
    shortchinese: true,
    shortenglish: true,
    currentTab: 0,
    phonecall: '123456789123',
    collection: false
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //接口B生成圆形二维码 https://api.weixin.qq.com/wxa/getwxacode?access_token=ACCESS_TOKEN
    //BODY {"scene":"0&27","page":"pages/detail2/detail2","width":430}
    var scene = decodeURIComponent(options.scene)
    if (scene != "undefined") {
      var params = scene.split('&');
      var channel = 0
      console.log("scene:" + params) //0&27
      var type111 = params[0] // 0
      var id111 = params[1] // 27
      if (type111 == 0) {
        this.setData({
          category: '景点',
          channel : 11
        })
        this.showDetail("get_channel_article_news_detail", id111);
      }
      if (type111 == 1) {
        this.setData({
          category: '美食',
          channel: 9
        })
        this.showDetail("get_channel_article_news_detail", id111);
      }
    } else {
      if (options.type == 0) {
        this.setData({
          category: '景点',
          channel: 11
        })
        this.showDetail("get_channel_article_news_detail", options.id);
      }
      if (options.type == 1) {
        this.setData({
          category: '美食',
          channel: 9
        })
        this.showDetail("get_channel_article_news_detail", options.id);
      }
   
    }
    this.setData({
      channelID: this.data.channel,
      postID: options.id
    })
    this.getCollectionStatus()
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  onLaunch: function(options) {
    console.log("[onLaunch] 场景值:", options)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(aaa) {
    console.log("[onShow] 场景值:", aaa)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  collectionAction() {
    let that = this;


    if (this.data.collection) {
      wx.request({
        method: 'POST',
        url: getApp().globalData.apiUrl,
        data: {
          action: 'delete_user_follow',
          follow_id: that.data.followID
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
          that.setData({
            collection: false,
            followID: ""
          })
          wx.setStorageSync('shouldUpdateCollectionInfo', true);
        }
      })
    } else {
      wx.request({
        method: 'POST',
        url: getApp().globalData.apiUrl,
        data: {
          action: 'add_user_follow',
          user_id: wx.getStorageSync('unionId'),
          article_id: that.data.postID,
          channel_id: that.data.channelID
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
          that.setData({
            collection: true,
            followID: res.data.user.id
          })
          wx.setStorageSync('shouldUpdateCollectionInfo', true);
        }
      })
    }



  },
  phonecallevent: function(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phonecall
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  showmore: function(t) {
    "english" == t.currentTarget.dataset.language ? this.setData({
      shortenglish: false
    }) : this.setData({
      shortchinese: false
    });
  },
  showless: function(t) {
    "english" == t.currentTarget.dataset.language ? this.setData({
      shortenglish: true
    }) : this.setData({
      shortchinese: true
    });
  },

  showMap: function(e) {
    let that = this;
    wx.openLocation({
      latitude: parseFloat(that.data.attractiondetail.latitude), // 纬度，范围为-90~90，负数表示南纬
      longitude: parseFloat(that.data.attractiondetail.longitude), // 经度，范围为-180~180，负数表示西经
      name: that.data.attractiondetail.ChieneseName,
      address: that.data.attractiondetail.address    
    })
  },
  callPhone(e) {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phonecall //仅为示例，并非真实的电话号码
    })
  },
  getCollectionStatus() {
    let that = this;
    wx.request({
      method: 'POST',
      url: getApp().globalData.apiUrl,
      data: {
        action: 'get_article_follow_status',
        user_id: wx.getStorageSync('unionId'),
        article_id: that.data.postID,
        channel_id: that.data.channelID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        //todo 更新收藏状态
        if (res.data && res.data.data && res.data.data.length > 0) {
          if (res.data.data[0].article_id == that.data.postID) {
            that.setData({
              collection: true,
              followID: res.data.data[0].id
            })
          }
        }
      }
    })
  },
  showDetail: function(api, id) {
    var that = this;
    wx.showToast({
      icon: "loading",
      title: "正在加载...",
      duration: 2000000,
    })
    wx.request({
      method: 'POST',
      url: getApp().globalData.apiUrl,
      data: {
        action: api,
        id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        if (res.data.result == 1) {
          wx.hideToast()
        }
        var poi_id = res.data.data.youhuiquan;
        console.log('coupon_query_coupon:poi_id = ' + poi_id)
        //poi_id = "";//配置好后注释掉
        wx.request({
          method: 'POST',
          url: getApp().globalData.apiUrl,
          data: {
            action: 'coupon_query_coupon',
            poi_id: poi_id
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function(res) {
            wx.hideToast();
            that.setData({
              list: res.data.couponList
            })
          }
        })
        var content = res.data.data.content;
        WxParse.wxParse('content', 'html', content, that, 5);
        console.log(content);
        console.log(res.data.data.images)
        that.setData({
          //list: res.data.data,
          attractiondetail: {
            ChieneseName: res.data.data.title,
            Image: "http://dailytech5.com/" + res.data.data.img_url,
            haoshi: res.data.data.haoshi,
            fuwu: res.data.data.fuwu,
            calendar: res.data.data.calendar,
            sub_title: res.data.data.sub_title,
            images: res.data.data.images,
            address: res.data.data.source,
            latitude: res.data.data.latitude,
            longitude: res.data.data.longitude
          },
          phonecall: res.data.data.phone_number
        })
      }
    });

  },



  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  swichNav: function(e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      if (e.target.dataset.current == 0) {

      }
      if (e.target.dataset.current == 1) {

      }
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },



  onAddCard: function(res) {

    wx.showToast({
      icon: "loading",
      title: "正在加载...",
      duration: 2000000,
    })

    wx.request({
      method: 'POST',
      url: getApp().globalData.apiUrl, //仅为示例，并非真实的接口地址
      data: {
        action: 'getAppCard',
        card_id: res.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        wx.hideToast();
        wx.addCard({
          cardList: [{
            cardId: res.data.card_id,
            cardExt: '{"timestamp":"' + res.data.timestamp + '","signature":"' + res.data.signature + '"}'
          }],
          success: res => {
            console.log(res) // 卡券添加结果
            wx.showToast({
              title: '领取成功',
            })
            wx.setStorageSync('shouldUpdateCardInfo', true)
          },
          fail: res => {
            console.log(res) // 卡券添加结果
          }
        })
      },
    })
  }
})