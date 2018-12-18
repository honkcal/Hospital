var app = getApp()
let lastSelectPostion = 0;
let mapContext;
const actions = ['get_channel_article_news_queenstown', 'get_channel_article_food_queenstown', 'get_channel_article_goods_queenstown'];
Page(
  {
    data: {},
    onLoad: function (options) {
      // console.log(options.schedule_id);
      var that = this;
      mapContext = wx.createMapContext('map4select', this);
      wx.showToast({
        icon: "loading",
        title: "正在加载...",
        duration: 2000000,
      });
      wx.request({
        method: 'POST',
        url: getApp().globalData.apiUrl,
        data: {
          action: 'get_channel_article_news_queenstown'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          if (res.data.result == 1) {
            wx.hideToast()
          }

          let newMarkers = [];
          for (let index in res.data.data) {
            if (res.data.data[index].latitude && res.data.data[index].longitude) {
              let obj = {};
              obj.id = res.data.data[index].id;
              obj.iconPath = "/images/scenic_spot_blur.png";
              let lat = parseFloat(res.data.data[index].latitude);
              let long = parseFloat(res.data.data[index].longitude);
              if (Math.abs(lat) <= 90) {
                obj.latitude = lat;
              }
              if (Math.abs(long) <= 180) {
                obj.longitude = long;
              }
              obj.width = 50;
              obj.height = 50;
              newMarkers.push(obj);
            }
          }
          lastSelectPostion = 0;
          res.data.data[0].checked = true;
        
          //将地图移动到这些坐标范围里
          mapContext.includePoints({
            points: newMarkers,
            padding: [50, 50, 50, 50]
          })
          that.setData({
            list: res.data.data,
            markers: newMarkers,
            currentTab: 0
          });
          newMarkers[0].iconPath = "/images/scenic_spot_focus.png"
          newMarkers[0].width = 62;
          newMarkers[0].height = 62;
          that.setData({
            markers: newMarkers
          });
        }
      });
    },

    markertap(e) {
      this.setData({
        hideBottom: false,
        toView: "_" + e.markerId
      });
    },
    locationTap(e) {
      mapContext.moveToLocation();
    },
    onScroll(event) {
      var that = this;
      let selectPosition = 0;
      let width = event.detail.scrollWidth / that.data.list.length
      if (event.detail.scrollLeft / width - Math.floor(event.detail.scrollLeft / width) > 0.15) {
        selectPosition = Math.floor(event.detail.scrollLeft / width) + 1
      } else {
        selectPosition = Math.floor(event.detail.scrollLeft / width)
      }
      if (lastSelectPostion != selectPosition) {
        let lastPositionID = that.data.list[lastSelectPostion].id;
        that.data.list[lastSelectPostion].checked = false;
        let selectPositionID = that.data.list[selectPosition].id;
        that.data.list[selectPosition].checked = true;
        lastSelectPostion = selectPosition;
        for (let index in that.data.markers) {
          if (that.data.markers[index].id == selectPositionID) {
            let focusImagePath = "/images/location_select.png";
            if (that.data.currentTab == 0) {
              focusImagePath = "/images/scenic_spot_focus.png";
            } else if (that.data.currentTab == 1) {
              focusImagePath = "/images/food_focus.png";
            } else if (that.data.currentTab == 2) {
              focusImagePath = "/images/shopping_focus.png";
            }
            that.data.markers[index].iconPath = focusImagePath;
            that.data.markers[index].width = 62;
            that.data.markers[index].height = 62;
          } if (that.data.markers[index].id == lastPositionID) {
            let blurImagePath = "/images/location_select.png";
            if (that.data.currentTab == 0) {
              blurImagePath = "/images/scenic_spot_blur.png";
            } else if (that.data.currentTab == 1) {
              blurImagePath = "/images/food_blur.png";
            } else if (that.data.currentTab == 2) {
              blurImagePath = "/images/shopping_blur.png";
            }
            that.data.markers[index].iconPath = blurImagePath;
            that.data.markers[index].width = 50;
            that.data.markers[index].height = 50;
          }
        }
        that.setData({
          list: that.data.list,
          markers: that.data.markers
        })
      }
    },
    hideBottomInfo() {
      this.setData({
        hideBottom: !this.data.hideBottom
      });
    },

    showDetail: function (e) {
      wx.navigateTo({
        url: '/pages/detail2/detail2?type=' + this.data.currentTab + '&id=' + e.currentTarget.dataset.id,
      })
    },

    // 切换导航栏
    swichNav: function (e) {
      var that = this;
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        wx.showToast({
          icon: "loading",
          title: "正在加载...",
          duration: 2000000,
        })
        wx.request({
          method: 'POST',
          url: getApp().globalData.apiUrl,
          data: {
            action: actions[e.target.dataset.current]
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success: function (res) {
            if (res.data.result == 1) {
              wx.hideToast()
            }

            let newMarkers = [];
            let blurImagePath = "/images/location_select.png";
            if (e.target.dataset.current == 0) {
              blurImagePath = "/images/scenic_spot_blur.png";
            } else if (e.target.dataset.current == 1) {
              blurImagePath = "/images/food_blur.png";
            } else if (e.target.dataset.current == 2) {
              blurImagePath = "/images/shopping_blur.png";
            }
            for (let index in res.data.data) {
              if (res.data.data[index].latitude && res.data.data[index].longitude) {
                let obj = {};
                obj.id = res.data.data[index].id;
                obj.iconPath = blurImagePath;
                let lat = parseFloat(res.data.data[index].latitude);
                let long = parseFloat(res.data.data[index].longitude);
                if (Math.abs(lat) <= 90) {
                  obj.latitude = lat;
                }
                if (Math.abs(long) <= 180) {
                  obj.longitude = long;
                }
                obj.width = 50;
                obj.height = 50;
                newMarkers.push(obj);
              }
            }
            lastSelectPostion = 0;
            res.data.data[0].checked = true;

            //将地图移动到这些坐标范围里
            mapContext.includePoints({
              points: newMarkers,
              padding: [50, 50, 50, 50]
            })
            that.setData({
              list: res.data.data,
              markers: newMarkers,
              toView: "_" + res.data.data[0].id,
              currentTab: e.target.dataset.current
            });

            let focusImagePath = "/images/location_select.png";
            if (e.target.dataset.current == 0) {
              focusImagePath = "/images/scenic_spot_focus.png";
            } else if (e.target.dataset.current == 1) {
              focusImagePath = "/images/food_focus.png";
            } else if (e.target.dataset.current == 2) {
              focusImagePath = "/images/shopping_focus.png";
            }
            newMarkers[0].iconPath = focusImagePath;
            newMarkers[0].width = 62;
            newMarkers[0].height = 62;
            that.setData({
              markers: newMarkers,
            });
          }
        });
      }
    },
    /**
  * 用户点击右上角分享
  */
    onShareAppMessage: function () {

    },
  })