// 这是房间状态的路由模块

const express=require('express')
const router=express.Router()

// 导入操作房间状态处理函数对应的模块
const RoomState_handler=require('../router_handler/RoomState_handler')

// 获取所有房间类型的路由
router.get('/List',RoomState_handler.list)
// 获取所有房间状态的路由（没有入住信息）
router.get('/ListToUpdate',RoomState_handler.listToUpdate)

module.exports=router