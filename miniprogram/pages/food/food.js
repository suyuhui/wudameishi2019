Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [{

    }],
    un_loaded : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var cafe_name ="";

    var userImg = {};
    var portImg = {};
    var foodImg = {};
    var user_files = [];
    var port_files = [];
    var food_files = [];

    wx.getStorage({
      key:'id_cafe',
      success(res){
        that.setData({
          cafe_name:res.data
        })
      }
    })
    var food_img = options.food_src;
    var food_id = options.id_food;
    var port_id = options.id_port;
    var port_name = options.port_name;
    that.setData({
      food_img:food_img,
      food_id:food_id,
      port_id:port_id,
      port_name:port_name
    })
    const db = wx.cloud.database();
    db.collection("port").where({
      _id : port_id
    })
    .field({
      'foods':true
    })
    .get()
    .then(res=>{
      var food_info = {};
      var foods = res.data[0].foods;
      for (var food in foods) {
        if (foods[food].id_food == food_id) {
          food_info = foods[food];
          break;
        }
      }
      that.setData({
        food_info:food_info
      })
    })
    .then(()=>{
      wx.cloud.callFunction({
        name: "getFoodComments",
        data:{
          'food_id': food_id
        }
      }).then(res=>{
        that.setData({
          'commentList':res.result.data
        })
        var commentList = that.data.commentList
        for(var comment in commentList){
          userImg[commentList[comment].user_id] = commentList[comment].user_profile;
          portImg[commentList[comment].port_id] = commentList[comment].port_profile;
          var foods = commentList[comment].foods;
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
            portImg: portImg,
            un_loaded:false,
          })
        })
      })
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