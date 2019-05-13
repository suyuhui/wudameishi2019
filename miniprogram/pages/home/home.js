// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    food_selected: 4,
    port_selected: 1,
    wishListHidden: true,
    wishListTriggerButtonHidden: false,
    foodHidden: true,
    portHidden: false,
    pageMode:"食堂所有档口",
    animationData: "",
    location: "信息学部一食堂",
    characteristicSelected: [false,false,false,false,false,false,false],
    discountSelected:null,
    selectedNumb: 0,
    sortSelected: "综合排序",
    wishList: wx.getStorageSync("wishList"),
    added_foods_amount: wx.getStorageSync('added_foods_amount'),
  },
  finish: function () {
    var that = this;
    wx.navigateTo({
      url: '../review/review',
    })
  },
  onTapTagFood: function (e) {
    this.setData({
      food_selected: e.currentTarget.dataset.index
    });
  },
  onTapTagPort: function (e) {
    this.setData({ 
      port_selected: e.currentTarget.dataset.index
    });
  },
  mask1Cancel: function () {
    this.setData({
      mask1Hidden: true,
      wishListHidden: false
    })
  },
  mask2Cancel: function () {
    this.setData({
      mask2Hidden: true,
      wishListHidden: false
    })
  },
  hideWishList: function () {
    this.setData({
      wishListHidden: true,
      wishListTriggerButtonHidden:false
    })
  },
  showWishList: function () {
      this.setData({
        wishListHidden: false,
        wishListTriggerButtonHidden: true
      })
  },
  onFilter: function () {
    this.setData({
      mask2Hidden: false,
      wishListHidden: true
    })
  },
  onSwitch: function () {
    if (this.data.foodHidden==false)
      this.setData({
        foodHidden: true,
        pageMode:"食堂所有档口"
      })
    else
      this.setData({
        foodHidden: false,
        pageMode: "食堂所有食品"
      })
    if (this.data.portHidden == false)
      this.setData({
        portHidden: true,
        pageMode: "食堂所有食品"
      })
    else
      this.setData({
        portHidden: false,
        pageMode: "食堂所有档口"
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wishListMap = objToStrMap(JSON.parse(wx.getStorageSync("wishListMap")));
    wx.request({
      url: "https://www.easy-mock.com/mock/5cc6f68fc6a06e115537a642/getAllFoodFromAPort",
      method: "GET",
      success: function (res) {
        res.data.menuContent.forEach(loadAllMenu);
        that.setData({
          menu: res.data,
          foodHidden: true,
          portHidden: false,
        })
      }
    });
    wishListMap = objToStrMap(JSON.parse(wx.getStorageSync("wishListMap")));
    var wish = wx.getStorageSync("wishList");
    that.setData({
      wishList: wish
    });
  },


  addToTrolley: function (e) {
    var info = this.data.menu;
    info.menuContent[e.currentTarget.dataset.index].numb = 1;
    this.setData({
      cost: this.data.cost + this.data.menu.menuContent[e.currentTarget.dataset.index].price,
      menu: info,
      added_foods_amount: parseInt(this.data.added_foods_amount + 1)
    });
    wx.setStorageSync('added_foods_amount', this.data.added_foods_amount)
    wishListMap = wishListMap.set(info.menuContent[e.currentTarget.dataset.index].id_food, 1);
    wx.setStorageSync('wishListMap', JSON.stringify(strMapToObj(wishListMap)));
    addItemToWishList(info.menuContent[e.currentTarget.dataset.index]);
    this.setData({
      wishList: wx.getStorageSync("wishList"),
    })
  },


  removeFromTrolley: function (e) {
    var info = this.data.menu;
    if (info.menuContent[e.currentTarget.dataset.index].numb != 0) {
      info.menuContent[e.currentTarget.dataset.index].numb = 0;
      this.setData({
        cost: this.data.cost - this.data.menu.menuContent[e.currentTarget.dataset.index].price,
        menu: info,
        added_foods_amount: parseInt(this.data.added_foods_amount - 1)
      });
      wx.setStorageSync('added_foods_amount', this.data.added_foods_amount)
      var id_food = info.menuContent[e.currentTarget.dataset.index].id_food;
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

  removeItemInsideTrolley: function (e,k) {
    var indexOfPort = e.currentTarget.dataset.index[0];
    var indexOfFood = e.currentTarget.dataset.index[1];
    var id_food = this.data.wishList[indexOfPort].foods[indexOfFood].id_food;
    this.setData({
      added_foods_amount: parseInt(this.data.added_foods_amount - 1)
    });
    wx.setStorageSync('added_foods_amount', this.data.added_foods_amount)
    removeItemFromWishList(id_food);
    for (var i in this.data.menu.menuContent)
    {
      if (this.data.menu.menuContent[i].id_food == id_food)
      {
        this.data.menu.menuContent[i].numb = 0;
        break;
      }
    }

    this.setData({
      wishList: wx.getStorageSync("wishList"),
      menu: this.data.menu
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
    var that = this;
    wx.request({
      url: "https://www.easy-mock.com/mock/5cc6f68fc6a06e115537a642/allRestaurant",
      method: "GET",
      success: function (res) {
        that.setData({
          restaurant: res.data.data.restaurant,
          // location: wx.getStorageSync('location')
        })
      }
    });
    that.setData({
      wishList: wx.getStorageSync("wishList")
    });
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


var wishListMap;

function loadAllMenu(item, index, arr) {
  if (wishListMap.has(item.id_food)) {
    item.numb = 1;
  } else {
    item.numb = 0;
  }
}

function removeItemFromWishList(id) {
  var wishList = wx.getStorageSync("wishList");

  for (var i in wishList) {
    for(var j in wishList[i].foods)
      if (wishList[i].foods[j].id_food == id) {
        wishList[i].foods.splice(j, 1);
        if (wishList[i].foods.length==0)
        {
          wishList.splice(i, 1);
        }
        break;
      }
    }
  wx.setStorageSync("wishList", wishList);
};

function addItemToWishList(item) {
  var flag = 1; //判断wishlist内部有没有item，防止重复添加
  var wishList = wx.getStorageSync("wishList");
  for (var i in wishList) {
    if (wishList[i].id_port == item.id_port) {
      wishList[i].foods.push(item);
      flag = 0;
      break;
    }
  }
  if (flag) {
    var newPort = {
      "id_port": item.id_port,
      "name": item.port_name,
      "src": "http://i4.piimg.com/601998/a014d6160fd7b504.jpg",
      foods:[
        item,
      ]
    };
    wishList.push(newPort);
    
  }
  wx.setStorageSync("wishList", wishList);
};

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