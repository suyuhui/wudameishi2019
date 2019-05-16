// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: '',
    actionSheetHidden: true,
    authorized: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var authorized = wx.getStorageSync('authorized')

    // var that = this;
    //     if (authorized == 0) 
    //     {
    //       that.setData({ 
    //         userType: '请您点击头像认证',
    //         authorized:0
    //         })
    //     } 
    //     else if (authorized == 1) 
    //     {
    //       that.setData({ userType: '您暂时未通过认证',
    //         authorized: 1 })
    //     }
    //     else if (authorized == 2) {
    //       var type = wx.getStorageSync('userType')
    //       that.setData({ userType: '您是认证' + type + '用户',
    //         authorized: 2 })
    //     }

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
    const db = wx.cloud.database()
    db.collection('user').where({
      _openid: wx.getStorageSync('openid')
    }).get({
      success(res) {
        if (res.data.length != 0) {
          if (res.data[0].authorized == true) {
            wx.setStorageSync('authorized', 2);
            wx.setStorageSync('userType', res.data[0].type);
          }
          else {
            wx.setStorageSync('authorized', 1);
          }
        } else {
          wx.setStorageSync('authorized', 0);
        }
      }
    })
    var authorized = wx.getStorageSync('authorized')

    var that = this;
    if (authorized == 0) {
      that.setData({
        userType: '请您点击头像认证',
        authorized: 0
      })
    }
    else if (authorized == 1) {
      that.setData({
        userType: '请等待认证通过',
        authorized: 1
      })
    }
    else if (authorized == 2) {
      var type = wx.getStorageSync('userType')
      that.setData({
        userType: '您是认证' + type + '用户',
        authorized: 2
      })
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

  actionSheetTap: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  actionSheetChange: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  login: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    wx.navigateTo({
      url: '../login/login'//实际路径要写全
    })
  },


  syncHeader: function () {
  },

  upload: function () {
    wx.navigateTo({
      url: '../uploadFood/uploadFood'
    })
  },

  cloudFunc: function(){
    wx.cloud.init();
    wx.cloud.callFunction({
      name:'getFoodProfile',
      data:{
        food_id:["1","2"]
      }
    }).then(res=>{
      console.log(res.result)
    })
  }
})