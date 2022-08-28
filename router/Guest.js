// 这是操作顾客的模块

const express=require('express')
const router=express.Router()

// 导入操作路由处理函数对应的模块
const Guest_handler=require('../router_handler/Guest_handler')

// 查询顾客的路由
router.get('/List',Guest_handler.list)
// 添加顾客的路由
router.post('/Add',Guest_handler.add)
// 修改顾客的路由
router.post('/Update',Guest_handler.update)
// 结账方法的路由
router.post('/Checkout',Guest_handler.checkout)
// 删除顾客的路由
router.post('/Delete',Guest_handler.delete)

module.exports=router
