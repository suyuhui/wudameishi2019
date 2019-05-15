// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const fileList = event.files
  const result = await cloud.getTempFileURL({
    fileList,
  })
  return result.fileList
}