// pages/my2/my2.js
let minHeight = 500

Page({

  /**
   * 页面的初始数据
   */
  data: {
    duration: 1000,
    bcolor: "#ee903c",
    currentTab: 0,
    userInfo: {},
    couponListHeight: minHeight,
    collectionListHeight: minHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.getStorageSync('nickName')) {
      this.setData({
        nickName: wx.getStorageSync('nickName'),
        avatarUrl: wx.getStorageSync('avatarUrl')
      })
    }
    this.requestCardInfo();
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
    let that = this;
    if (this.data.currentTab === 0) {
      if (this.data.coupons && this.data.coupons.length > 0 && this.data.couponListHeight == 100) {
        wx.createSelectorQuery().select('.coupon-list').boundingClientRect().exec(rect => {
          console.log("couponListHeight===>" + rect[0].height)
          that.setData({
            couponListHeight: rect[0].height
          })
        })
      }
    } else if (this.data.currentTab === 1) {
      if (this.data.collections && this.data.collections.length > 0 && this.data.collectionListHeight == 100) {
        wx.createSelectorQuery().select('.collection-list').boundingClientRect().exec(rect => {
          console.log("collectionListHeight===>" + rect[0].height)
          that.setData({
            collectionListHeight: rect[0].height > minHeight ? rect[0].height : minHeight
          })
        })
      }
    }
    let shouldRequestCardInfo = wx.getStorageSync('shouldUpdateCardInfo');
    let shouldRequestCollection = wx.getStorageSync('shouldUpdateCollectionInfo');
    if (shouldRequestCardInfo) {
      this.requestCardInfo();
    }
    if (shouldRequestCollection) {
      this.requestCollection()
    }

  },
  requestCardInfo() {
    let that = this;
    wx.showToast({
      icon: "loading",
      title: "正在加载...",
      duration: 2000000,
    })
    wx.request({
      method: 'POST',
      url: getApp().globalData.apiUrl,
      data: {
        action: 'coupon_query_user',
        unionid: wx.getStorageSync('unionId')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.hideToast();
        console.log(res.data);
        wx.setStorageSync('shouldUpdateCardInfo', false);
        if (res.data.code != "0") {
          console.log(res.data.errmsg);
        } else {
          that.setData({
            coupons: res.data.couponList
          })
          setTimeout(function () {
            wx.createSelectorQuery().select('.coupon-list').boundingClientRect().exec(rect => {
              console.log("couponListHeight===>" + rect[0].height)
              that.setData({
                couponListHeight: rect[0].height > minHeight ? rect[0].height : minHeight
              })
            })
          }, 50);
        }
      }
    })
  },
  requestCollection() {
    let that = this;
    wx.request({
      method: 'POST',
      url: getApp().globalData.apiUrl,
      data: {
        action: 'get_user_follow_queenstown',
        user_id: wx.getStorageSync('unionId')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        wx.setStorageSync('shouldUpdateCollectionInfo', false);
        that.setData({
          collections: res.data.data,
        })
        setTimeout(function () {
          wx.createSelectorQuery().select('.collection-list').boundingClientRect().exec(rect => {
            console.log("collectionListHeight===>" + rect[0].height)
            that.setData({
              collectionListHeight: rect[0].height > minHeight ? rect[0].height : minHeight
            })
          })
        }, 50);
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showDetail: function (e) {
    wx.navigateTo({
      url: '/pages/detail2/detail2?type=' + e.currentTarget.dataset.channel + '&id=' + e.currentTarget.dataset.id,
    })
  },
  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
  },
  scroolToNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.detail.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.detail.current
      })
      if (e.detail.current == 0) {
        if (this.data.coupons && this.data.coupons.length != 0) {
          if (this.data.couponListHeight == 0) {
            setTimeout(function () {
              wx.createSelectorQuery().select('.coupon-list').boundingClientRect().exec(rect => {
                that.setData({
                  couponListHeight: rect[0].height > minHeight ? rect[0].height : minHeight
                })
              })
            }, 50);
          }
          return;
        }
        this.requestCardInfo();
      } else if (e.detail.current == 1) {
        if (this.data.collections && this.data.collections.length != 0) {
          if (this.data.collectionListHeight == 0) {
            setTimeout(function () {
              wx.createSelectorQuery().select('.collection-list').boundingClientRect().exec(rect => {
                that.setData({
                  collectionListHeight: rect[0].height > minHeight ? rect[0].height : minHeight
                })
              })
            }, 50);
          }
          return;
        }
        this.requestCollection();
      }
    }
  },
  swichNav: function (e) {
    if (e.target.dataset.current == this.data.currentTab) {
      return;
    }
    this.setData({
      currentTab: e.target.dataset.current
    })
  },
  onOpenCard: function (res) {
    console.log(res.currentTarget.dataset.id);
    wx.openCard({
      cardList: [
        {
          cardId: res.currentTarget.dataset.id,
          code: res.currentTarget.dataset.code
        }
      ],
      success: function (res) {
      }
    })
  },

  onQueryCard: function () {

  },
})