// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const port_id = event.port_id
  var data = await db.collection("comment")
    .where({
      port_id: port_id
    })
    .orderBy("time", 'desc')
    .get()
  return data
}