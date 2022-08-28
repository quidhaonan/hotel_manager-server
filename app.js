// 导入 express
const express=require('express')
// 创建服务器的实例对象
const app=express()

// 导入并配置 cors 中间件
const cors=require('cors')
app.use(cors())

// 托管浏览器发过来的图片资源
app.use('/upload/admin',express.static('./public/image'))
app.use('/upload/room',express.static('./public/roomImg'))

// 用来接收浏览器发过来的表格信息的中间件
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 一定要在路由之前，封装 res.cc 函数
app.use((request,response,next)=>{
    // status 默认值为 1，表示失败的情况
    // err 的值，可能是一个错误对象，也可能是一个错误的描述字符串
    response.cc=function(err,success=false){
        response.send({
            message:err instanceof Error ? err.message:err,
            success,
        })
    }
    next()
})

// 导入并使用用户路由模块
const AdminRouter=require('./router/Admin.js')
app.use('/Admin',AdminRouter)
// 导入并使用操作角色的路由模块
const RoleRouter=require('./router/Role')
app.use('/Role',RoleRouter)
// 导入并使用操作房间类型的路由模块
const RoomTypeRouter=require('./router/RoomType')
app.use('/RoomType',RoomTypeRouter)
// 导入并使用操作房间的路由模块
const RoomRouter=require('./router/Room')
app.use('/Room',RoomRouter)
// 导入并使用操作房间状态的路由模块
const RoomStateRouter=require('./router/RoomState')
app.use('/RoomState',RoomStateRouter)
// 导入并使用操作房间图片的路由模块
const RoomImgRouter=require('./router/RoomImg')
app.use('/RoomImg',RoomImgRouter)
// 导入并使用操作顾客信息的路由模块
const GuestRouter=require('./router/Guest')
app.use('/GuestRecord',GuestRouter)
// 导入并使用操作结账状态信息的路由模块
const ResideStateRouter=require('./router/ResideState')
app.use('/ResideState',ResideStateRouter)

app.listen(8081,()=>{
    console.log('api server running at http://127.0.0.1:8081')
})