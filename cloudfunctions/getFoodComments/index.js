// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  var food_id = event.food_id
  var data = await db.collection("comment")
  .where({
    "foods.food_id":food_id
  })
  .get()
  return data
}