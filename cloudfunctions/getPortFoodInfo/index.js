// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  port_id : event.port_id
  var data = await db.collection("port")
    .field({
      foods:true
    })
    .where({
      _id : port_id
    })
    .get()
  return data
}