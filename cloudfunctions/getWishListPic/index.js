// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var wishList = event.wishList
  var array = new Array();
  if(wishList.length!=0)
  for(var i in wishList)
  {
    array.push(wishList[i].port_profile)
    for(var j in wishList[i].foods)
    {
      array.push(wishList[i].foods[j].food_profile);
    }
  }
  // array = JSON.stringify(array);
  if(array.length!=0){
  await cloud.callFunction({
    // 云函数名称
    name: 'getPictureUrl',
    // 传给云函数的参数
    data: {
      'files':array
    },
    complete: res => {
      var index = 0;
      for (var i in wishList) {
        wishList[i].img_src = res.result[index].tempFileURL;
        index++;
        for (var j in wishList[i].foods) {
          wishList[i].foods[j].img_src = res.result[index].tempFileURL;
          index++;
        }
      }
    }
  });
  }
  // wishList = JSON.stringify(wishList);
  return {'wishList':wishList}
}