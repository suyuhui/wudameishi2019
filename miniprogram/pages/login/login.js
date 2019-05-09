Page({
  data: {
    phone: '',
    password: '',
    image: '',
    imageList: [],
  },

  // 获取输入账号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 登录
  login: function () {
    if (this.data.phone.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      // 这里修改成跳转的页面
      wx.showModal({
        title: '',
        content: '登录成功了',
        showCancel:false,
        confirmText:'我知道了',
        success(){
          wx.navigateBack({
            delta: 1
          })
        }
      });
     
    }
  },

  //选择认证图片
  hooseImage: function (e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: function (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          image: res.tempFilePaths
        })
      }
    })
  },

  //预览认证图
  andleImagePreview: function () {
    const idx = e.target.dataset.idx
    const image = this.data.image
    wx.previewImage({
      current: image,  //当前预览的图片
    })
  },



  chooseImage: function (event) {
    var that = this;
    wx.chooseImage({
      count: 1, // 一次最多可以选择2张图片一起上传
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imgeList = that.data.imageList.concat(res.tempFilePaths);
        that.setData({
          imageList: imgeList
        });
      }
    })
  },
  previewImage: function (e) {
    var that = this;
    var dataid = e.currentTarget.dataset.id;
    var imageList = that.data.imageList;
    wx.previewImage({
      current: imageList[dataid],
      urls: this.data.imageList
    });
  }
})