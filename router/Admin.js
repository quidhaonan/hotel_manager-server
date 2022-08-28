// 这是用户登录的路由模块

const express=require('express')
const router=express.Router()
// 由于要处理传过来的图片，所以要导入 multer 中间件
const multer = require("multer");

// 导入登录路由处理函数对应的模块
const Admin_handler=require('../router_handler/Admin_handler')

// 登录
router.get('/Login',Admin_handler.login)
// 查询账户信息
router.get('/List',Admin_handler.list)
// 账户头像上传地址
router.post('/UploadImg',multer({dest:'public/image'}).array('file',1),Admin_handler.uploadImg)
// 增加账户信息
router.post('/Add',Admin_handler.add)
// 修改账户信息
router.post('/Update',Admin_handler.update)
// 删除账户信息
router.post('/Delete',Admin_handler.delete)
// 根据账号返回一个账户对象
router.get('/GetOne',Admin_handler.getOne)
// 修改账号密码
router.post('/ResetPwd',Admin_handler.resetPwd)

module.exports=router