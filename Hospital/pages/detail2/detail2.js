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
          category: '新闻消息',
          channel : 1
        })
        this.showDetail("get_channel_article_news_detail", id111);
      }
      if (type111 == 1) {
        this.setData({
          category: '养生小贴士',
          channel: 2
        })
        this.showDetail("get_channel_article_goods_detail", id111);
      }
    }
    this.setData({
      postID: options.id
    })
    this.getCollectionStatus()
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
        //poi_id = "";//配置好后注释掉

        var content = res.data.data.content;
        WxParse.wxParse('content', 'html', content, that, 5);
        console.log(content);
        console.log(res.data.data.images)
        that.setData({
          //list: res.data.data,
          attractiondetail: {
            ChieneseName: res.data.data.title,
            Image: "http://dailytech5.com/" + res.data.data.img_url,
            sub_title: res.data.data.sub_title,
            images: res.data.data.images,
            address: res.data.data.source,
            latitude: res.data.data.latitude,
            longitude: res.data.data.longitude
          },
          
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