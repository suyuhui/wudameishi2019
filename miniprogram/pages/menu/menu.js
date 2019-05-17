// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
    userImg: {},
    foodImg: {},
    portImg: {},
    swiperTitle: [{
      text: "点菜",
      id: 1
    }, {
      text: "评价",
      id: 2
    }, {
      text: "商家",
      id: 3
    }],
    menu: [],
    currentPage: 0,
    selected: 0,
    howMuch: 12,
    cost: 0,
    pullBar: false,
    wishList: [],
    wishListHidden:true,
    port_name:'',
    id_port: '',
    port_src: '',
    added_foods_amount: wx.getStorageSync('added_foods_amount'),
    current_port: wx.getStorageSync('current_port'),
    total_people:0,
    taste_star:"",
    clean_star:"",
    service_star:"",
    synthesis_score:0,
    taste_score:0,
    clean_score:0,
    service_score:0,
  },

  pullBar: function () {
    this.setData({
      pullBar: !this.data.pullBar
    })
  },

  addToTrolley: function (e) {
    var info = this.data.menu;
    info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb = 1;
    this.setData({
      cost: this.data.cost + this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
      menu: info,
      added_foods_amount: parseInt(this.data.added_foods_amount + 1)
    });
    wx.setStorageSync('added_foods_amount', this.data.added_foods_amount)
    wishListMap = wishListMap.set(info[this.data.selected].menuContent[e.currentTarget.dataset.index].id_food,1);
    wx.setStorageSync('wishListMap', JSON.stringify(strMapToObj(wishListMap)));


    var item = info[this.data.selected].menuContent[e.currentTarget.dataset.index];
    var flag = 1; //判断wishlist内部有没有item，防止重复添加

    var wishList = wx.getStorageSync("wishList");
    for (var i in wishList) {
      if (wishList[i].id_port == this.data.id_port) {
        wishList[i].foods.push(item);
        flag = 0;
        break;
      }
    }
    if (flag) {
      var newPort = {
        "id_port": this.data.id_port,
        "name": this.data.port_name,
        'port_profile':this.data.port_profile,
        "src": this.data.port_src,
        foods: [
          item,
        ]
      };
      wishList.push(newPort);
      
    }
    wx.setStorageSync("wishList", wishList);
    this.setData({
      wishList: wx.getStorageSync("wishList"),
    })
  },


  removeFromTrolley: function (e) {
    var info = this.data.menu;
    if (info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb != 0) {
      info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb = 0;
      this.setData({
        cost: this.data.cost - this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
        menu: info,
        added_foods_amount: parseInt(this.data.added_foods_amount - 1)
      });
      wx.setStorageSync('added_foods_amount', this.data.added_foods_amount)
      var id_food = info[this.data.selected].menuContent[e.currentTarget.dataset.index].id_food;
      wishListMap.delete(id_food);
      removeItemFromWishList(id_food);
      // wx.setStorageSync('wishListMap', );
      wx.setStorage({
        key: 'wishListMap',
        data: JSON.stringify(strMapToObj(wishListMap)),
      })
      this.setData({
        wishList: wx.getStorageSync("wishList"),
      })
    }
  },

  turnPage: function (e) {//这个方法是用来切换food分类的，考虑扩展性，暂时保留
    this.setData({
      currentPage: e.currentTarget.dataset.index
    })
  },

  turnTitle: function (e) {
    if (e.detail.source == "touch") {
      this.setData({
        currentPage: e.detail.current
      })
    }
  },

  goToWishList: function () {
    var temp = wx.getStorageSync('wishList')
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getWishListPic',
      // 传给云函数的参数 这个参数随便写
      data: {
        'wishList': temp
      },
      complete: res => {
        this.setData({
          wishList: res.result.wishList,
          wishListHidden: false
        })
      }
    }) 
  },

  hideWishList: function () {
    this.setData({
      wishListHidden: true
    })
  },

  turnMenu: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    })
    console.log(e.currentTarget.dataset.index);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const db = wx.cloud.database();
    var current_port = wx.getStorageSync('current_port')
    db.collection('port').where({
      _id: current_port._id
    }).get({
      success(res) {
        var object = new Object();
        object["typeName"] = "所有分类";
        object["menuContent"] = res.data[0].foods;
        var foods = res.data[0].foods;
        var photos = new Array();
        for(var i in foods){
          photos.push(foods[i].food_profile)
        }
        wx.cloud.callFunction({//获取档口food的图像
          name: 'getPictureUrl',
          data: {
            'files': photos
          },
          complete: res => {
            for (var i in foods) {
              foods[i].food_src = res.result[i].tempFileURL//设置档口food的图像
            }
            var array = new Array();
            array.push(object);
            array.forEach(loadAllMenu);
            var t = [object]
            that.setData({
              menu: [object]
            })
            that.setData({//设置档口基本信息的显示
              wishList: wx.getStorageSync('wishList'),
              clean_score: current_port.clean_rate.toFixed(1),
              taste_score: current_port.taste_rate.toFixed(1),
              service_score: current_port.service_rate.toFixed(1),
              clean_star: getStar(current_port.clean_rate, false),
              taste_star: getStar(current_port.taste_rate, false),
              service_star: getStar(current_port.service_rate, false),
              synthesis_score: getSynthesisScore(current_port).toFixed(1),
              synthesis_star: getStar(current_port, true),
              total_people: current_port.total_people,
              added_foods_amount: wx.getStorageSync('added_foods_amount')
            })
            // if (res.data[0].comments.length != 0)
            db.collection('comment').where({
              _id: db.command.in(res.data[0].comments)
            }).get({//等待往其中加图片
              success(res) {
                that.setData({
                  commentList: res.data
                })
              },
              fail() {
                that.setData({
                  commentList: []
                })
              }
            })
          }
        })
      }
    });
    // wx.request({
    //   url: "https://www.easy-mock.com/mock/5cc6f68fc6a06e115537a642/getFoods",
    //   method: "GET",
    //   success: function (res) {
    //     res.data.forEach(loadAllMenu);
    //     that.setData({
    //       menu: res.data,
    //       wishList: wx.getStorageSync('wishList'),
    //       port_name: options.port_name,
    //       id_port: options.id_port,
    //       port_src: options.port_src
    //     })
    //   }
    // });

    var that = this;
    var userImg = {};
    var portImg = {};
    var foodImg = {};
    var user_files = [];
    var port_files = [];
    var food_files = [];
    wx.cloud.callFunction({
      name: 'getPortComments',
      data: {
        'port_id': current_port._id
      }
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



    wishListMap = objToStrMap(JSON.parse(wx.getStorageSync("wishListMap")));
    this.setData({
      wishList: wx.getStorageSync("wishList"),
    })
    that = this;
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


  removeItemInsideTrolley: function(e, k) {
    var indexOfPort = e.currentTarget.dataset.index[0];
    var indexOfFood = e.currentTarget.dataset.index[1];
    var id_food = this.data.wishList[indexOfPort].foods[indexOfFood].id_food;
    removeItemFromWishList(id_food);
    this.setData({
      added_foods_amount: parseInt(this.data.added_foods_amount - 1)
    })
    wx.setStorageSync('added_foods_amount', this.data.added_foods_amount)
    for(var i in this.data.menu) {
      for (var j in this.data.menu[i].menuContent) {
      var temp = 0;
      if (this.data.menu[i].menuContent[j].id_food == id_food) {
        this.data.menu[i].menuContent[j].numb = 0;
        temp = 1;
        break;
      }
      if(temp) break;
    }
}
  this.setData({
    wishList: wx.getStorageSync("wishList"),
    menu: this.data.menu
  })
}

})

var wishListMap;

function loadAllMenu(item, index, arr) {
  item.menuContent.forEach(loadWishListItem);
}

function loadWishListItem(item, index, arr) {
  if (wishListMap.has(item.id_food)) {
    item.numb = 1;
  } else {
    item.numb = 0;
  }
}

var id_port;

function removeItemFromWishList(id) {
  var wishList = wx.getStorageSync("wishList");
  for (var i in wishList) {
    for (var j in wishList[i].foods)
      if (wishList[i].foods[j].id_food == id) {
        wishList[i].foods.splice(j, 1);
        if (wishList[i].foods.length == 0) {
          wishList.splice(i, 1);
        }
        break;
      }
  }
  wx.setStorageSync("wishList", wishList);
}


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


function getSynthesisScore(e) {
  return (e.service_rate + e.taste_rate + e.clean_rate) * 1.0 / 3
}

function getStar(e,isSynthesis) {
  var score;
  if(isSynthesis)
    score = Math.round(getSynthesisScore(e))
  else
    score = Math.round(e)
  switch (score) {
    case 1:
      {
        return "★        ";
      }
    case 2:
      {
        return "★ ★      ";
      }
    case 3:
      {
        return "★ ★ ★    ";
      }
    case 4:
      {
        return "★ ★ ★ ★  ";
      }
    case 5:
      {
        return "★ ★ ★ ★ ★";
      }
  }
}