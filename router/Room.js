// 这是房间的路由模块

const express=require('express')
const router=express.Router()

// 导入操作房间处理函数对应的模块
const Room_handler=require('../router_handler/Room_handler')

// 获取所有房间类型的路由
router.get('/List',Room_handler.list)
// 添加房间信息的路由
router.post('/Add',Room_handler.add)
// 修改房间信息的路由
router.post('/Update',Room_handler.update)
// 删除房间信息的路由
router.post('/Delete',Room_handler.delete)

module.exports=router