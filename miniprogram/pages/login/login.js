Page({
  data: {
    phone: '',
    stuNum: '',
    password: '',
    image: '',
    imageID: '',
    imgWidth: '',
    imgHeight: '',
  },

  onLoad: function () {
    // wx.cloud.init();
  },

  // 获取输入账号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入学号
  stuNumInput: function (e) {
    this.setData({
      stuNum: e.detail.value
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
    var that = this;
    if (that.data.phone.length == 0 || that.data.password.length == 0) {
      wx.showToast({
        title: '学号/密码不能为空',
        icon: 'none',
        duration: 2000
      });
    } 
    // else if (that.data.stuNum.length == 0) {
    //   wx.showToast({
    //     title: '学号不能为空',
    //     icon: 'none',
    //     duration: 2000
    //   });
    // } 
    else {
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
  register: function (e) {
    var that = this;
    if (that.data.stuNum.length == 0 || that.data.password.length == 0) {
      wx.showToast({
        title: '学号/密码不能为空',
        icon: 'none',
        duration: 2000
      });
    } 
    // else if (that.data.stuNum.length == 0) {
    //   wx.showToast({
    //     title: '学号不能为空',
    //     icon: 'none',
    //     duration: 2000
    //   });
    // } 
    else if (that.data.image == '') {
      wx.showToast({
        title: '请选择认证图片',
        icon: 'none',
        duration: 2000
      })
    } else {
      const db = wx.cloud.database();
      db.collection('user').where({ //查询账号
        studentNumber: that.data.stuNum
      }).get({
        success(res) {
          if (res.data.length == 0) { //账号未注册
            //上传认证图片
            wx.downloadFile({
              url: e.detail.userInfo.avatarUrl, // 仅为示例，并非真实的资源
              success(res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                  wx.cloud.uploadFile({
                    cloudPath: 'user/' + that.data.stuNum + '.jpg', // 上传至云端的路径
                    filePath: res.tempFilePath,
                    success: res => {
                      wx.cloud.uploadFile({
                        cloudPath: 'user/' + that.data.stuNum + '_authorize.jpg', // 上传至云端的路径
                        filePath: that.data.image,
                        success: res => {
                          // 返回文件 ID
                          that.setData({
                            imageID: res.fileID
                          });
                          db.collection('user').add({ //向数据库添加记录
                            data: {
                              account: e.detail.userInfo.nickName,
                              studentNumber: that.data.stuNum,
                              password: that.data.password,
                              imageID: that.data.imageID,
                              type: '学生',
                              authorized: false,
                            },
                            success(res) {
                              //弹出提示框并跳转
                              wx.showModal({
                                title: '',
                                content: '注册成功',
                                showCancel: false,
                                confirmText: '我知道了',
                                success() {
                                  wx.setStorageSync('authorized', 1);
                                  wx.navigateBack({
                                    delta: 1
                                  })
                                }
                              });
                            }
                          })
                        },
                      });
                    },
                    fail: function () {
                      wx.showModal({
                        title: '',
                        content: '图片上传失败,请重试',
                        showCancel: false,
                        confirmText: '我知道了',
                      });
                    },
                  })
                }
              },
              fail: function () {
                wx.showModal({
                  title: '',
                  content: '图片上传失败,请重试',
                  showCancel: false,
                  confirmText: '我知道了',
                });
              },

            })


            
           
            
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


  //跳转到商家认证
  toMerchantLogin: function () {
    wx.redirectTo({
      url: '../merchantLogin/merchantLogin'
    })
  }
})