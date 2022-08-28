// 这是房间图片的路由模块

const express=require('express')
const router=express.Router()
// 由于要处理传过来的图片，所以要导入 multer 中间件
const multer = require("multer");

// 导入操作房间图片处理函数对应的模块
const RoomImg_handler=require('../router_handler/RoomImg_handler')

// 房间图片上传地址
router.post('/UploadImg',multer({dest:'public/roomImg'}).array('file',1),RoomImg_handler.uploadImg)
// 添加房间图片的路由
router.post('/Add',RoomImg_handler.add)
// 查询指定房间对应的房间图片的路由
router.get('/List',RoomImg_handler.list)
// 删除房间图片的路由
router.post('/Delete',RoomImg_handler.delete)

module.exports=router