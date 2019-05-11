Page({
  data: {
    phone: '',
    idNum: '',
    password: '',
    canteen: '',
    port: '',
    image: '',
    imageID: '',
    imgWidth: '',
    imgHeight: '',
  },

  onLoad: function () {
    wx.cloud.init();
  },

  // 获取输入账号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入身份证号
  idNumInput: function (e) {
    this.setData({
      idNum: e.detail.value
    })
  },

  // 获取输入密码
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 获取输入档口
  portInput: function (e) {
    this.setData({
      port: e.detail.value
    })
  },

  // 登录
  login: function () {
    var that = this;
    if (that.data.phone.length == 0 || that.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        duration: 2000
      });
    } else if (that.data.idNum.length == 0) {
      wx.showToast({
        title: '身份证号不能为空',
        icon: 'none',
        duration: 2000
      });
    } else if (that.data.canteen.length == 0 || that.data.port.length == 0) {
      wx.showToast({
        title: '食堂或档口不能为空',
        icon: 'none',
        duration: 2000
      });
    } else {
      const db = wx.cloud.database();
      db.collection('user').where({ //查询账号
        account: that.data.phone,
        password: that.data.password
      }).get({
        success(res) {
          if (res.data.length == 1) { //登录成功
            //弹出提示框并跳转
            wx.showModal({
              title: '',
              content: '登录成功',
              showCancel: false,
              confirmText: '我知道了',
              success() {
                wx.navigateBack({
                  delta: 1
                })
              }
            });
          } else {  //登录失败
            wx.showToast({
              title: '登录失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
      });
    }
  },

  // 注册
  register: function () {
    var that = this;
    if (that.data.phone.length == 0 || that.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        duration: 2000
      });
    } else if (that.data.idNum.length == 0) {
      wx.showToast({
        title: '身份证号不能为空',
        icon: 'none',
        duration: 2000
      });
    } else if (that.data.canteen.length == 0 || that.data.port.length == 0) {
      wx.showToast({
        title: '食堂或档口不能为空',
        icon: 'none',
        duration: 2000
      });
    } else if (that.data.image == '') {
      wx.showToast({
        title: '请选择认证图片',
        icon: 'none',
        duration: 2000
      })
    } else {
      const db = wx.cloud.database();
      db.collection('user').where({ //查询账号
        account: that.data.phone
      }).get({
        success(res) {
          if (res.data.length == 0) { //账号未注册
            //上传认证图片
            wx.cloud.uploadFile({
              cloudPath: 'user/' + that.data.phone + '.jpg', // 上传至云端的路径
              filePath: that.data.image,
              success: res => {
                // 返回文件 ID
                that.setData({
                  imageID: res.fileID
                });
                db.collection('user').add({ //向数据库添加记录
                  data: {
                    account: that.data.phone,
                    idNum: that.data.idNum,
                    password: that.data.password,
                    canteen: that.data.canteen,
                    port: that.data.port,
                    imageID: that.data.imageID,
                    type: 'merchant'
                  },
                  success(res) {
                    //弹出提示框并跳转
                    wx.showModal({
                      title: '',
                      content: '注册成功',
                      showCancel: false,
                      confirmText: '我知道了',
                      success() {
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    });
                  }
                })
              },
            });
          } else {  //账号已注册
            wx.showToast({
              title: '用户已存在',
              icon: 'none',
              duration: 2000
            })
          }
        },
      });
    }
  },

  // 选择认证图片
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


  // 预览认证图
  previewImage: function (e) {
    var that = this;
    var imageList = [];
    imageList[0] = that.data.image;
    wx.previewImage({
      urls: imageList
    });
  },


  //跳转到学生认证
  toStuLogin: function () {
    wx.redirectTo({
      url: '../login/login'
    })
  }
})