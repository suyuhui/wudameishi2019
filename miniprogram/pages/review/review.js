Page({

  /**
   * 页面的初始数据
   */
  data: {
    wishList:[],
    servicesStar:[],
    cleanStar: [],
    tasteStar: [],
    like:[],
    portComment:[],
    foodComment: [],
    currentItem:0,
    all: wx.getStorageSync('added_foods_amount'),
    offset:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    console.log("hello");
    var that = this;
    var wishList = JSON.parse(options.wishList);
    that.setData({
      wishList:wishList
    })
    */
    var that = this;
    var wishList = wx.getStorageSync("wishList");
    var servicesStar = this.data.servicesStar;
    var cleanStar = this.data.cleanStar;
    var tasteStar = this.data.tasteStar;
    var like = this.data.like;
    var foodComment = this.data.foodComment;
    var portComment = this.data.portComment;
    var offset = this.data.offset;
    for (var i in wishList) {
      servicesStar.push(4);
      cleanStar.push(4);
      tasteStar.push(4);
      portComment.push("");
      
      var array = new Array();
      like.push(array)
      var food_comment_array = new Array();
      foodComment.push(food_comment_array)
      for(var j in wishList[i].foods)
      {
        array.push(2);
        food_comment_array.push("")
      }
      if(i==0)
        offset.push(0);
      else if(i>=1){
        offset.push(offset[i - 1] + wishList[i - 1].foods.length);
      }
    }

    that.setData({
      servicesStar:servicesStar,
      cleanStar:cleanStar,
      tasteStar:tasteStar,
      wishList:wishList,
      like:like,
      portComment: portComment,
      foodComment: foodComment,
      all: wishList.length + wx.getStorageSync('added_foods_amount'),
      offset: offset
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

  },
  starServiceChange(event) {
    var that = this;
    const { stars, nameId } = event.detail
    this.data.servicesStar[nameId] = stars;
  },
  starTasteChange(event) {
    var that = this;
    const { stars, nameId } = event.detail
    this.data.tasteStar[nameId] = stars;
  },
  starCleanChange(event){
    var that = this;
    const { stars, nameId } = event.detail
    this.data.cleanStar[nameId] = stars;
  },
  likeChange(event){
    var that = this;
    const { like, nameId, firstId } = event.detail
    this.data.like[firstId][nameId] = like;
  },
  commentChange(event){
    var that = this;
    const { is_port, value, nameId, firstId } = event.detail
    if (is_port)
      this.data.portComment[nameId] = value;
    else
      this.data.foodComment[firstId][nameId]=value;
  },
  add(event) {
    this.data.currentItem = this.data.currentItem+1;
    this.setData({
      currentItem: this.data.currentItem 
    })
  },
  minus(event) {
    if (this.data.currentItem>0)
      this.data.currentItem = this.data.currentItem - 1;
    this.setData({
      currentItem: this.data.currentItem
    })
  },
  submit(){
    var wishList = this.data.wishList;
    var status = 0;
    const db = wx.cloud.database();
    if (wx.getStorageSync('authorized') == 2)
      for (var i in wishList) {
        var object = new Object();
        object["port_clean_rate"] = this.data.cleanStar[i];
        object["port_service_rate"] = this.data.servicesStar[i];
        object["port_taste_rate"] = this.data.tasteStar[i];
        object["port_id"] = wishList[i].id_port;
        object["port_comment"] = this.data.portComment[i];
        object["port_profile"] = wishList[i].port_profile;
        object["user_id"] = wx.getStorageSync('openid');
        object["user_name"] = wx.getStorageSync('user').account;
        object["user_profile"] = wx.getStorageSync('user').image_id;
        object["time"] = new Date();
        object["foods"] = new Array();
        for (var j in wishList[i].foods) {
          var food_obj = new Object();
          food_obj["food_comment"] = this.data.foodComment[i][j];
          food_obj["food_like"] = (this.data.like[i][j] == 2) ? true : false;
          food_obj["food_name"] = wishList[i].foods[j].food_name;
          food_obj["food_profile"] = wishList[i].foods[j].food_profile;
          food_obj["food_id"] = wishList[i].foods[j].id_food;
          object["foods"].push(food_obj);
        }
        db.collection('comment').add({
          // data 字段表示需新增的 JSON 数据
          data: object,
          success(res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res)
            object.time = ""
            wx.cloud.callFunction({
              name: "refreshScore",
              data: {
                'object_comment': object
              }
            }).then(res => {
              var id = res._id
              db.collection('port').where({
                _id: object.port_id
              }).get({
                success(res) {
                  var comments = res.data[0].comments;
                  comments.unshift(id);
                  db.collection('port').doc(object.port_id).update({
                    // data 传入需要局部更新的数据
                    data: {
                      // 表示将 done 字段置为 true
                      comments: comments
                    },
                    success(res) {
                      status++;
                      if (status == wishList.length) {
                        wx.showModal({
                          title: '',
                          content: '评论成功',
                          showCancel: false,
                          confirmText: '我知道了',
                        });
                        wx.setStorageSync('wishList', [])
                        var map = new Map();
                        map.set('-1', '-1')
                        wx.setStorageSync('wishListMap', JSON.stringify(strMapToObj(map)))
                        wx.setStorageSync('added_foods_amount', 0)
                        wx.navigateBack({
                          delta: 1
                        })
                      }
                    },
                    fail() {
                      wx.showModal({
                        title: '',
                        content: '评论失败，可重试',
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
                fail() {
                  wx.showModal({
                    title: '',
                    content: '评论失败，可重试',
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
            })



          },
          fail() {
            wx.showModal({
              title: '',
              content: '评论失败，可重试',
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
      }
  }
})


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