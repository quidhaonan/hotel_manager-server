// 这是操作结账状态的模块

const express=require('express')
const router=express.Router()

// 导入操作路由处理函数对应的模块
const ResideState_handler=require('../router_handler/ResideState_handler')

// 查询结账状态信息的路由
router.get('/List',ResideState_handler.list)

module.exports=router