var touchDot = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = "";// 记录/清理时间记录
let minHeight = 500
// pages/index4/index4.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '../../images/aa3.png',
      '../../images/aa2.png'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    // tab切换  
    currentTab: 0,
    scenicListHeight: minHeight,
    foodListHeight: minHeight,
    shoppingListHeight: minHeight,
    guidanceListHeight: minHeight
  },

  updateUser: function () {
    wx.showToast({
      icon: "loading",
      title: "正在加载...",
      duration: 2000000,
    })
    wx.request({
      method: 'POST',
      url: getApp().globalData.apiUrl,
      data: {
        action: 'add_or_update_user',
        openid: wx.getStorageSync('openId'),
        unionid: wx.getStorageSync('unionId'),
        photo: wx.getStorageSync('avatarUrl'),
        sex: wx.getStorageSync('sex') == 1 ? "男" : "女",
        nickname: wx.getStorageSync('nickName'),
        age: -1,
        phone: "",
        interest: "",
        latitude: wx.getStorageSync('latitude'),
        longitude: wx.getStorageSync('longitude'),
        accuracy: wx.getStorageSync('accuracy'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log("log011")
        wx.hideToast()
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.getStorageSync('unionId') == null || wx.getStorageSync('unionId') == '') { //没有unionId就登录
      that.updateUser();
    }

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        wx.setStorageSync('latitude', res.latitude);//纬度
        wx.setStorageSync('longitude', res.longitude);//精度
        wx.setStorageSync('accuracy', res.accuracy);//位置的精确度
        that.updateUser();
      }
    })

    that.updateUser();
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
        action: 'get_channel_article_news'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.result == 1) {
          wx.hideToast()
        }
        that.setData({
          scenicList: res.data.data,
        })
        setTimeout(function () {
          wx.createSelectorQuery().select('.scenic-list').boundingClientRect().exec(rect => {
            console.log(rect[0].height + "==scenicListHeight==");
            that.setData({
              scenicListHeight: rect[0].height > minHeight ? rect[0].height : minHeight
            })
          })
        }, 50);

      }
    });

    wx.request({
      method: 'POST',
      url: getApp().globalData.apiUrl,
      data: {
        action: 'get_channel_article_content'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.result == 1) {
          wx.hideToast()
        }
        that.setData({
          list_content: res.data.data,
        })
      }
    });
  },

  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

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
        if (this.data.scenicList && this.data.scenicList.length != 0) {
          return;
        }
        wx.showToast({
          icon: "loading",
          title: "正在加载...",
          duration: 2000000,
        })
        wx.request({
          method: 'POST',
          url: getApp().globalData.apiUrl,
          data: {
            action: 'get_channel_article_news'
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            if (res.data.result == 1) {
              wx.hideToast()
            }
            that.setData({
              scenicList: res.data.data,
            })
            setTimeout(function () {
              wx.createSelectorQuery().select('.scenic-list').boundingClientRect().exec(rect => {
                console.log(rect[0].height + "==scenicListHeight==");
                that.setData({
                  scenicListHeight: rect[0].height > minHeight ? rect[0].height : minHeight
                })
              })
            }, 50);
          }
        });
      } else if (e.detail.current == 1) {
        if (this.data.foodList && this.data.foodList.length != 0) {
          return;
        }
        wx.showToast({
          icon: "loading",
          title: "正在加载...",
          duration: 2000000,
        })
        wx.request({
          method: 'POST',
          url: getApp().globalData.apiUrl,
          data: {
            action: 'get_channel_article_goods'
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            if (res.data.result == 1) {
              wx.hideToast()
            }
            that.setData({
              foodList: res.data.data,
            })
            setTimeout(function () {
              wx.createSelectorQuery().select('.food-list').boundingClientRect().exec(rect => {
                that.setData({
                  foodListHeight: rect[0].height > minHeight ? rect[0].height : minHeight
                })
              })
            }, 50);
          }
        });
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
      if (this.data.scenicList && this.data.scenicList.length > 0 && this.data.scenicListHeight == minHeight) {
        setTimeout(function () {
          wx.createSelectorQuery().select(".scenic-list").boundingClientRect().exec(rect => {
            that.setData({
              scenicListHeight: rect[0].height > minHeight ? rect[0].height : minHeight
            })
          })
        }, 50);
      }
    } else if (this.data.currentTab === 1) {
      if (this.data.foodList && this.data.foodList.length > 0 && this.data.foodListHeight == minHeight) {
        setTimeout(function () {
          wx.createSelectorQuery().select(".food-list").boundingClientRect().exec(rect => {
            that.setData({
              foodListHeight: rect[0].height > minHeight ? rect[0].height : minHeight
            })
          })
        }, 50);
      }

    }
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

  showDetail: function (e) {
    console.log('/pages/detail2/detail2?type=' + this.data.currentTab + '&id=' + e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/detail2/detail2?type=' + this.data.currentTab + '&id=' + e.currentTarget.dataset.id,
    })
  },

  showDetail_content: function (e) {
    wx.navigateTo({
      url: '/pages/detail_content/detail_content?type=12&id=' + e.currentTarget.dataset.id,
    })
  },
})