// 导入数据库操作模块
const db=require('../db/index')

// 获取所有房间状态的路由的处理函数
exports.list=(request,response)=>{
    // 定义查询分类列表数据的 SQL 语句
    const sql='select * from roomstates'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,(err,result)=>{
        if(err) return response.cc(err)

        response.send(result)
    })
}

// 获取所有房间状态的路由（没有入住信息）的处理函数
exports.listToUpdate=(request,response)=>{
    // 定义查询分类列表数据的 SQL 语句
    const sql='select * from roomstates where roomStateId<>2'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,(err,result)=>{
        if(err) return response.cc(err)

        response.send(result)
    })
}