//app.js
var app = getApp();
App({
  
  onLaunch: function () {
    wx.cloud.init();
    // wx.getLocation({
    //   type: 'gcj02',
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     wx.request({
    //       url: 'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&coordtype=gcj02ll&location=' + latitude + ',' + longitude + '&output=json&pois=0',
    //       method: "get",
    //       success: function (res) {
    //         console.log(res.data.result.formatted_address)
    //         wx.setStorageSync('location', res.data.result.formatted_address.substr(res.data.result.formatted_address.indexOf('市') + 1, 10))
    //       }
    //     })
    //   }
    // })

    try {
      var value = wx.getStorageSync('wishList')
      
      if (value) {
        // Do something with return value
        var map = new Map();
        function addItemToMap(item, index, arr) {
          map.set(item.id_food, 1);
        }
        function addPortToMap(item, index, arr) {
          item.foods.forEach(addItemToMap);
        }
        value.forEach(addPortToMap);
        wx.setStorage({
          key: 'wishListMap',
          data: JSON.stringify(strMapToObj(map))
        })
        
      }else
      {
      //   wx.request({
      //     url: "https://www.easy-mock.com/mock/5cc6f68fc6a06e115537a642/getWishlist",
      //     method: "GET",
      //     success: function (res) {
      //       wx.setStorage({
      //         key: 'wishList',
      //         data: res.data
      //       })
      //     }
      //   });
      //   value = res.data;
      // }
        wx.setStorage({
          key: 'wishList',
          data: []
        })
        var map = new Map();
        map.set('-1','-1')
        wx.setStorage({
          key: 'wishListMap',
          data: JSON.stringify(strMapToObj(map))
        })
        wx.setStorage('added_foods_amount', 0)
      }

      

    } catch (e) {

    }

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        wx.setStorageSync('openid', res.result.openid);
      }
    })

    var that = this;
    const db = wx.cloud.database()
    db.collection('user').where({
      _openid: wx.getStorageSync('openid')
    }).get({
      success(res) {
        if (res.data.length != 0) {
          if(res.data[0].authorized==true){
            wx.setStorageSync('authorized', 2);
            wx.setStorageSync('userType', res.data[0].type);
          }
          else{
            wx.setStorageSync('authorized', 1);
          }
        } else {
          wx.setStorageSync('authorized', 0);
        }
      }
    })

    // if (!wx.getStorageSync('userInfo')) {
    // wx.getUserInfo({
    //   withCredentials: false,
    //   success: function (res) {
    //     wx.setStorageSync('userInfo', res.userInfo)
    //   }
    // })
    // }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo);
          wx.setStorageSync('userInfo', res.userInfo)
        }
      });

      
    }
  },

  globalData: {
    userInfo: null,
    location: ""
  }
})


//Map 转为对象
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

//对象转为 Map
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
};