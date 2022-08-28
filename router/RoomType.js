// 这是房间类型的路由模块

const express=require('express')
const router=express.Router()

// 导入操作房间类型处理函数对应的模块
const RoomType_handler=require('../router_handler/RoomType_handler')

// 获取所有房间类型的路由
router.get('/List',RoomType_handler.list)
// 添加房间类型的路由
router.post('/Add',RoomType_handler.add)
// 修改房间类型的路由
router.post('/Update',RoomType_handler.update)
// 删除房间类型的路由
router.post('/Delete',RoomType_handler.delete)
// 统计房间类型的销售额的路由
router.get('/TotalTypePrice',RoomType_handler.totalTypePrice)

module.exports=router