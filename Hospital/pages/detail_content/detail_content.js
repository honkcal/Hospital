var WxParse = require("../../wxParse/wxParse.js");

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shortchinese: true,
    shortenglish: true,
    currentTab: 0,
    phonecall: '123456789123',
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showDetail("get_channel_article_content_detail", options.id);
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


  phonecallevent: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phonecall
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showmore: function (t) {
    "english" == t.currentTarget.dataset.language ? this.setData({
      shortenglish: false
    }) : this.setData({
      shortchinese: false
    });
  },
  showless: function (t) {
    "english" == t.currentTarget.dataset.language ? this.setData({
      shortenglish: true
    }) : this.setData({
      shortchinese: true
    });
  },

  showDetail: function (api, id) {
    console.log(api)
    console.log(id)
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
      success: function (res) {
        if (res.data.result == 1) {
          wx.hideToast()
        }
        console.log(res.data)
        var poi_id = res.data.data.youhuiquan;
        console.log(poi_id)
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
          success: function (res) {
            wx.hideToast();
            that.setData({
              list: res.data.couponList
            })
          }
        })
        var content = res.data.data.content;
        WxParse.wxParse('content', 'html', content, that, 5);
        console.log(res.data.data.images)
        that.setData({
          //list: res.data.data,
          attractiondetail: {
            ChieneseName: res.data.data.title,
            Image: "https://dailytech5.com/" + res.data.data.img_url,
            haoshi: res.data.data.haoshi,
            fuwu: res.data.data.fuwu,
            calendar: res.data.data.calendar,
            sub_title: res.data.data.sub_title,
            images: res.data.data.images,
            address: res.data.data.source,
            //phonecall: res.data.data.phone_number,
          },  
        })
        that.setData({
          phonecall:res.data.data.phone_number
        }
        )
      }
    });
    
  },



  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },

  swichNav: function (e) {

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



  onAddCard: function (res) {

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
      success: function (res) {
        wx.hideToast();
        wx.addCard({
          cardList: [
            {
              cardId: res.data.card_id,
              cardExt: '{"timestamp":"' + res.data.timestamp + '","signature":"' + res.data.signature + '"}'
            }
          ],
          success: res => {
            console.log(res) // 卡券添加结果
            wx.showToast({
              title: '领取成功',
            })
          },
          fail: res => {
            console.log(res) // 卡券添加结果
          }
        })
      },

    })
  }
})