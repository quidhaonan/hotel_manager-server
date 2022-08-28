// 这是操作角色的模块

const express=require('express')
const router=express.Router()

// 导入操作路由处理函数对应的模块
const Role_handler=require('../router_handler/Role_handler')

// 获取角色列表的路由
router.get('/List',Role_handler.list)
// 添加角色
router.post('/Add',Role_handler.add)
// 修改角色
router.post('/Update',Role_handler.update)
// 删除角色
router.post('/Delete',Role_handler.delete)

module.exports=router