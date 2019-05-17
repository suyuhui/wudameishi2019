// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const wxContext = cloud.getWXContext()
  const object_comment = event.object_comment;
  var data_ = await db.collection("port")
    .where({
      "_id": object_comment.port_id
    })
    .get()
  var data = data_.data[0];
  
  var map = new Map()
  for (var i in object_comment.foods) {
    if (object_comment.foods[i].food_like==true)
      map.set(object_comment.foods[i].food_id, 1);
    else
      map.set(object_comment.foods[i].food_id, 0);
  }
  var port_people = data.total_people
  data.clean_rate = (data.clean_rate * port_people + object_comment.port_clean_rate)/(port_people+1)
  console.log(data.clean_rate)
  console.log(object_comment.clean_rate)
  console.log(port_people)
  data.service_rate = (data.service_rate * port_people + object_comment.port_service_rate) / (port_people + 1)
  console.log(data)
  data.taste_rate = (data.taste_rate * port_people + object_comment.port_taste_rate) / (port_people + 1)
  for (var i in data.foods)
  {
    if(map.get(data.foods[i].id_food)==1)
    {
      data.foods[i].like = data.foods[i].like+1;
      data.foods[i].total_people = data.foods[i].total_people + 1;
    } else if (map.get(data.foods[i].id_food) == 0)
    {
      data.foods[i].total_people = data.foods[i].total_people + 1;
    }
  }
  await db.collection('port').doc(object_comment.port_id).update({
    data: {
    // data 传入需要局部更新的数据
    clean_rate: data.clean_rate,
    service_rate: data.service_rate,
    taste_rate: data.taste_rate,
    port_people: data.port_people+1,
    foods:data.foods
    }
  })
}