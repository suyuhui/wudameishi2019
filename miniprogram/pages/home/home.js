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
    cafe: wx.getStorageSync('cafe'),
  },
  finish: function () {
    var that = this;
    wx.navigateTo({
      url: '../review/review',
    })
  },
  onTapTagFood: function (e) {
    var foods = asjustOrderOfFoods(this.data.foods, e.currentTarget.dataset.index)
    this.setData({
      food_selected: e.currentTarget.dataset.index,
      foods: foods
    });
  },
  onTapTagPort: function (e) {
    var restaurant = asjustOrderOfPorts(this.data.restaurant, e.currentTarget.dataset.index)
    this.setData({ 
      port_selected: e.currentTarget.dataset.index,
      restaurant:restaurant
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
    // wx.request({
    //   url: "https://www.easy-mock.com/mock/5cc6f68fc6a06e115537a642/getAllFoodFromAPort",
    //   method: "GET",
    //   success: function (res) {
    //     res.data.forEach(loadAllMenu);
        that.setData({
          // foods: res.data,
          foodHidden: true,
          portHidden: false,
          location: wx.getStorageSync('id_cafe')
        })

    wishListMap = objToStrMap(JSON.parse(wx.getStorageSync("wishListMap")));
    var wish = wx.getStorageSync("wishList");
    that.setData({
      wishList: wish
    });
    var that = this
    const db = wx.cloud.database();
    var id_location = wx.getStorageSync('cafe');
    var key;
    if (id_location) {
      key = "信息学部一食堂";
    } else {
      key = id_location.id_cafeteria;
    }
    db.collection('cafeteria').where({ //查询账号
      id_cafeteria: key
    }).get({
      success(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        wx.setStorageSync('cafe', res.data)
        that.setData({
          location: wx.getStorageSync('cafe')[0].id_cafeteria,
        })
        db.collection('port').where({
          _id: db.command.in(res.data[0].ports)
        }).get({
          success(res) {
            // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
            var temp = res;
            var photos = new Array();
            for (var i in res.data) {
              photos.push(res.data[i].port_profile)
              for(var j in res.data[i].foods)
              {
                photos.push(res.data[i].foods[j].food_profile)
              }
            }
            wx.cloud.callFunction({
              name: 'getPictureUrl',
              data: {
                'files': photos
              },
              complete: res => {
                var index = 0;
                var foods = new Array()
                for (var i in temp.data) {
                  temp.data[i].star = getSynthesisStar(temp.data[i])
                  temp.data[i].img_src = res.result[index].tempFileURL
                  index++;
                  for (var j in temp.data[i].foods) {
                    temp.data[i].foods[j].img_src = res.result[index].tempFileURL
                    index++;
                    var singleFood = new Object()
                    singleFood.port_name = temp.data[i].port_name;
                    singleFood.id_port = temp.data[i]._id;
                    singleFood.food_description = temp.data[i].foods[j].clean_rate;
                    singleFood.food_name = temp.data[i].foods[j].food_name;
                    singleFood.food_price = temp.data[i].foods[j].food_price;
                    singleFood.food_profile = temp.data[i].foods[j].food_profile;
                    singleFood.img_src = temp.data[i].foods[j].img_src;
                    singleFood.img_src_port = temp.data[i].img_src;
                    singleFood.id_food = temp.data[i].foods[j].id_food;
                    singleFood.like = temp.data[i].foods[j].like;
                    singleFood.total_people = temp.data[i].foods[j].total_people;
                    if (wishListMap.has(singleFood.id_food)) {
                      singleFood.numb = 1;
                    } else {
                      singleFood.numb = 0;
                    }
                    foods.push(singleFood)
                  }
                }
                foods = asjustOrderOfFoods(foods, that.data.food_selected)
                that.setData({
                  restaurant: temp.data,
                  wishList: wx.getStorageSync("wishList"),
                  foods:foods
                })
              },
            })
          }
        })
      }
    })  
  },

  addToTrolley: function (e) {
    var info = this.data.foods;
    info[e.currentTarget.dataset.index].numb = 1;
    this.setData({
      cost: this.data.cost + this.data.foods[e.currentTarget.dataset.index].price,
      foods: info,
      added_foods_amount: parseInt(this.data.added_foods_amount + 1)
    });
    wx.setStorageSync('added_foods_amount', this.data.added_foods_amount)
    wishListMap = wishListMap.set(info[e.currentTarget.dataset.index].id_food, 1);
    wx.setStorageSync('wishListMap', JSON.stringify(strMapToObj(wishListMap)));
    addItemToWishList(info[e.currentTarget.dataset.index]);
    this.setData({
      wishList: wx.getStorageSync("wishList"),
    })
  },


  removeFromTrolley: function (e) {
    var info = this.data.foods;
    if (info[e.currentTarget.dataset.index].numb != 0) {
      info[e.currentTarget.dataset.index].numb = 0;
      this.setData({
        cost: this.data.cost - this.data.foods[e.currentTarget.dataset.index].price,
        foods: info,
        added_foods_amount: parseInt(this.data.added_foods_amount - 1)
      });
      wx.setStorageSync('added_foods_amount', this.data.added_foods_amount)
      var id_food = info[e.currentTarget.dataset.index].id_food;
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
    for (var i in this.data.foods)
    {
      if (this.data.foods[i].id_food == id_food)
      {
        this.data.foods[i].numb = 0;
        break;
      }
    }

    this.setData({
      wishList: wx.getStorageSync("wishList"),
      foods: this.data.foods
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
      "port_name": item.port_name,
      "img_src": item.img_src_port,
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

function insertSort(arr) {
  var len = arr.length;
  for (var i = 1; i < len; i++) {
    var temp = arr[i];
    var j = i - 1;//默认已排序的元素
    while (j >= 0 && arr[j] > temp) {  //在已排序好的队列中从后向前扫描
      arr[j + 1] = arr[j]; //已排序的元素大于新元素，将该元素移到一下个位置
      j--;
    }
    arr[j + 1] = temp;
  }
  return arr
}

function asjustOrderOfFoods(foods,food_selected) {

    if (food_selected == 4) {
      // for (var temp in foods)
      //   if (singleFood.like > foods[temp].like) {
      //     foods.splice(temp, 0, singleFood)
      //     break;
      //   }
      var len = foods.length;
      for (var i = 1; i < len; i++) {
        var temp = foods[i];
        var j = i - 1;//默认已排序的元素
        while (j >= 0 && foods[j].like < temp.like) {  //在已排序好的队列中从后向前扫描
          foods[j + 1] = foods[j]; //已排序的元素大于新元素，将该元素移到一下个位置
          j--;
        }
        foods[j + 1] = temp;
      }
    } else if (food_selected == 5) {
      // for (var temp in foods)
      //   if (singleFood.total_people > foods[temp].total_people) {
      //     foods.splice(temp, 0, singleFood)
      //     break;
      //   }
      var len = foods.length;
      for (var i = 1; i < len; i++) {
        var temp = foods[i];
        var j = i - 1;//默认已排序的元素
        while (j >= 0 && foods[j].total_people < temp.total_people) {  //在已排序好的队列中从后向前扫描
          foods[j + 1] = foods[j]; //已排序的元素大于新元素，将该元素移到一下个位置
          j--;
        }
        foods[j + 1] = temp;
      }
    } else if (food_selected == 6) {
      // for (var temp in foods)
      //   if (singleFood.like * 1.0 / singleFood.total_people > foods[temp].total_people.like * 1.0 / foods[temp].total_people) {
      //     foods.splice(temp, 0, singleFood)
      //     break;
      //   }
      var len = foods.length;
      for (var i = 1; i < len; i++) {
        var temp = foods[i];
        var j = i - 1;//默认已排序的元素
        while (j >= 0 && (foods[j].like * 1.0 / foods[j].total_people) < (temp.like * 1.0 / temp.total_people)) 
        {  //在已排序好的队列中从后向前扫描
          foods[j + 1] = foods[j]; //已排序的元素大于新元素，将该元素移到一下个位置
          j--;
        }
        foods[j + 1] = temp;
      }
    }
  
  return foods;
}

function asjustOrderOfPorts(ports, port_selected) {
  if (port_selected == 1) {
    // for (var temp in foods)
    //   if (singleFood.like > foods[temp].like) {
    //     foods.splice(temp, 0, singleFood)
    //     break;
    //   }
    var len = ports.length;
    for (var i = 1; i < len; i++) {
      var temp = ports[i];
      var j = i - 1;//默认已排序的元素
      while (j >= 0 && getSynthesisScore(ports[j]) > getSynthesisScore(temp)) {  //在已排序好的队列中从后向前扫描
        ports[j + 1] = ports[j]; //已排序的元素大于新元素，将该元素移到一下个位置
        j--;
      }
      ports[j + 1] = temp;
    }
  } else if (port_selected == 2) {
    // for (var temp in foods)
    //   if (singleFood.total_people > foods[temp].total_people) {
    //     foods.splice(temp, 0, singleFood)
    //     break;
    //   }
    var len = ports.length;
    for (var i = 1; i < len; i++) {
      var temp = ports[i];
      var j = i - 1;//默认已排序的元素
      while (j >= 0 && ports[j].taste_rate > temp.taste_rate) {  //在已排序好的队列中从后向前扫描
        ports[j + 1] = ports[j]; //已排序的元素大于新元素，将该元素移到一下个位置
        j--;
      }
      ports[j + 1] = temp;
    }
  } else if (port_selected == 3) {
    // for (var temp in foods)
    //   if (singleFood.like * 1.0 / singleFood.total_people > foods[temp].total_people.like * 1.0 / foods[temp].total_people) {
    //     foods.splice(temp, 0, singleFood)
    //     break;
    //   }
    var len = ports.length;
    for (var i = 1; i < len; i++) {
      var temp = ports[i];
      var j = i - 1;//默认已排序的元素
      while (j >= 0 && ports[j].total_people > temp.total_people) {  //在已排序好的队列中从后向前扫描
        ports[j + 1] = ports[j]; //已排序的元素大于新元素，将该元素移到一下个位置
        j--;
      }
      ports[j + 1] = temp;
    }
  }
  return ports;
}

function getSynthesisScore(e)
{
  return (e.service_rate + e.taste_rate + e.clean_rate)*1.0/3
}

function getSynthesisStar(e) {
  var score = Math.round(getSynthesisScore(e))
  switch (score){
    case 1:
      {
        return "★";
      }
    case 2:
      {
        return "★ ★";
      }
    case 3:
      {
        return "★ ★ ★";
      }
    case 4:
      {
        return "★ ★ ★ ★";
      }
    case 5:
      {
        return "★ ★ ★ ★ ★";
      }
  }
}