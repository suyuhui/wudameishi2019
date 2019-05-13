// pages/menu/menu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [{
      userName: "古丽",
      restaurantName: "传世排骨汤饭",
      state: "订单取消",
      price: "12",
      date: "2017-07-14",
      time: "12:29:12",
      howToDistribute: "商家"
    }],
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
    port_src:'',
    added_foods_amount: wx.getStorageSync('added_foods_amount'),
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


  turnPage: function (e) {
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
    this.setData({
      wishListHidden: false
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
    wx.request({
      url: "https://www.easy-mock.com/mock/5cc6f68fc6a06e115537a642/getFoods",
      method: "GET",
      success: function (res) {
        res.data.forEach(loadAllMenu);
        that.setData({
          menu: res.data,
          wishList: wx.getStorageSync('wishList'),
          port_name: options.port_name,
          id_port: options.id_port,
          port_src: options.port_src
        })
      }
    });
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
    added_foods_amount: this.data.added_foods_amount - 1,
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


