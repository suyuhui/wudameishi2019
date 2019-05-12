// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    characteristicList:[{
      text: "近期热门"
    },{
      text: "口碑之选"
    },{
      text: "新选择"
    },{
      text: "品牌商家"
    },{
      text: "跨天预定"
    }],
    sortList:[{
      sort: "综合排序",
      image:"",
    }, {
      sort: "速度最快",
      image: "",
    }, {
      sort: "评分最高",
      image: "",
    }, {
      sort: "起送价最低",
      image: "",
    }, {
      sort: "配送费最低",
      image: "",
    }],
    discountList:[{
      icon: "减",
      iconColor: "#FF635B", 
      text: "满减优惠"
    },{
      icon: "领",
      iconColor: "#FF7298", 
      text: "进店领券"
    },{
      icon: "返",
      iconColor: "#FB4343", 
      text: "满返代金券"
    },{
      icon: "折",
      iconColor: "#C183E2", 
      text: "折扣商品"
    },{
      icon: "订",
      iconColor: "#6FDF64", 
      text: "提前下单优惠"
    },{
      icon: "赠",
      iconColor: "#FDC41E", 
      text: "满赠活动"
    },{
      icon: "免",
      iconColor: "#43B697", 
      text: "满免配送"
    }],
    categoryList:{
      pageone:[{
        name: "美食",
        src: "/pages/images/1.png"
      }, {
        name: "甜点饮品",
        src: "/pages/images/2.png"
      }, {
        name: "美团超市",
        src: "/pages/images/3.png"
      }, {
        name: "正餐精选",
        src: "/pages/images/4.png"
      }, {
        name: "生鲜果蔬",
        src: "/pages/images/5.png"
      }, {
        name: "全部商家",
        src: "/pages/images/6.png"
      }, {
        name: "免配送费",
        src: "/pages/images/7.png"
      }, {
        name: "新商家",
        src: "/pages/images/8.png"
      }],
      pagetwo: [{
        name: "美食",
        src: "/pages/images/1.png"
      }, {
        name: "甜点饮品",
        src: "/pages/images/2.png"
      }, {
        name: "美团超市",
        src: "/pages/images/3.png"
      }, {
        name: "正餐精选",
        src: "/pages/images/4.png"
      }, {
        name: "生鲜果蔬",
        src: "/pages/images/5.png"
      }, {
        name: "全部商家",
        src: "/pages/images/6.png"
      }, {
        name: "免配送费",
        src: "/pages/images/7.png"
      }, {
        name: "新商家",
        src: "/pages/images/8.png"
      }]
    },
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
    wishList: wx.getStorageSync("wishList")
  },
  finish: function () {
    var that = this;
    wx.navigateTo({
      url: '../review/review',
    })
  },
  sortSelected: function (e) {
    var that = this;
    wx.request({
      url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/overAll",
      method: "GET",
      success: function (res) {
        that.setData({
          restaurant: res.data.data.restaurant,
          sortSelected: that.data.sortList[e.currentTarget.dataset.index].sort
        })
      }
    });
  },
  clearSelectedNumb: function () {
    this.setData({
      characteristicSelected: [false],
      discountSelected: null,
      selectedNumb: 0
    })
  },
  characteristicSelected: function (e) {
    var info = this.data.characteristicSelected;
    info[e.currentTarget.dataset.index] = !info[e.currentTarget.dataset.index];
    this.setData({
      characteristicSelected: info,
      selectedNumb: this.data.selectedNumb + (info[e.currentTarget.dataset.index]?1:-1)
    })
    console.log(e.currentTarget.dataset.index);
  },
  discountSelected: function (e) {
    if (this.data.discountSelected != e.currentTarget.dataset.index){
      this.setData({
        discountSelected: e.currentTarget.dataset.index,
        selectedNumb: this.data.selectedNumb+(this.data.discountSelected==null?1:0)
      })
    }else{
      this.setData({
        discountSelected: null,
        selectedNumb: this.data.selectedNumb - 1
      })
    }
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
    });
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
      });
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

  removeItemInsideTrolley: function (e) {
    var index = e.currentTarget.dataset.index;
    var id_food = this.data.wishList[index].id_food;
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
      url: "https://www.easy-mock.com/mock/596257bc9adc231f357c4664/restaurant/info",
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
    if (wishList[i].id_food == id) {
      wishList.splice(i, 1);
      break;
    }
  }
  wx.setStorageSync("wishList", wishList);
};

function addItemToWishList(item) {
  var flag = 1;
  var wishList = wx.getStorageSync("wishList");
  for (var i in wishList) {
    if (wishList[i].id_food == item.id_food) {
      flag = 0;
      break;
    }
  }
  if (flag) {
    wishList.push(item);
    wx.setStorageSync("wishList", wishList);
  }
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