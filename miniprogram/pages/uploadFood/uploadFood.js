// miniprogram/pages/uploadFood/uploadFoold.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    foodName:"",
    foodPrice:"",
    image:""
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

  /**
   * 处理输入的菜名
   */
  handleFoodName: function(e){
    this.setData({
      foodName:e.detail.value
    })
  },

  handleFoodPrice: function(e){
    this.setData({
      foodPrice: e.detail.value
    })
  },

  chooseImage: function (event) {
    var that = this;
    wx.chooseImage({
      count: 1, // 一次最多可以选择1张图片一起上传
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          image: res.tempFilePaths[0]
        });
      }
    })
  },

  submit: function(e){
    var that = this;
    if(this.data.foodName == ""){
      wx.showToast({
        title: '食品名不能为空',
        icon: 'none',
        duration: 2000
      });
    }else if(this.data.foodPrice == ""){
      wx.showToast({
        title: '价格不能为空',
        icon: 'none',
        duration: 2000
      });
    }else if(isNaN(Number(that.data.foodPrice))){
      wx.showToast({
        title: '价格格式不符',
        icon: 'none',
        duration: 1000
      });
    }else{

    }
  }
})