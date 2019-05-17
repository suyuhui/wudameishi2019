// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList:[],
    userImg:{},
    foodImg:{},
    portImg:{}

    //   commentList: [{
    //   userName: "孙俪",
    //   profile: "http://i4.piimg.com/601998/9ce47f2f19d7717d.jpg",
    //   date: "2019-06-14",
    //   time: "12:29:12",
    //   howToDistribute: "商家"
    // }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    

  
    
    

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
    var that = this;
    var userImg = {};
    var portImg = {};
    var foodImg = {};
    var user_files = [];
    var port_files = [];
    var food_files = [];
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'getPlazaComments'
    }).then(res => {
      that.setData({
        commentList: res.result.data
      })
      for (var comment in that.data.commentList) {
        userImg[that.data.commentList[comment].user_id] = that.data.commentList[comment].user_profile;
        portImg[that.data.commentList[comment].port_id] = that.data.commentList[comment].port_profile;
        var foods = that.data.commentList[comment].foods;
        for (var food in foods) {
          foodImg[foods[food].food_id] = foods[food].food_profile;
        }
      }
      for (var user in userImg) {
        user_files.push(userImg[user]);
      }
      for (var food in foodImg) {
        food_files.push(foodImg[food]);
      }
      for (var port in portImg) {
        port_files.push(portImg[port]);
      }
    })
      .then(() => {
        wx.cloud.callFunction({
          name: "getPictureUrl",
          data: {
            'files': user_files
          }
        }).then(res => {
          var idx = 0;
          for (var item in userImg) {
            userImg[item] = res.result[idx].tempFileURL;
            idx++;
          }
          that.setData({
            userImg: userImg
          })
        })
      })
      .then(() => {
        wx.cloud.callFunction({
          name: "getPictureUrl",
          data: {
            'files': food_files
          }
        }).then(res => {
          var idx = 0;
          for (var item in foodImg) {
            foodImg[item] = res.result[idx].tempFileURL;
            idx++;
          }
          that.setData({
            foodImg: foodImg
          })
        })
      })
      .then(() => {
        wx.cloud.callFunction({
          name: "getPictureUrl",
          data: {
            'files': port_files
          }
        }).then(res => {
          var idx = 0;
          for (var item in userImg) {
            portImg[item] = res.result[idx].tempFileURL;
            idx++;
          }
          that.setData({
            portImg: portImg
          })
        })
      })
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
  
  }
})