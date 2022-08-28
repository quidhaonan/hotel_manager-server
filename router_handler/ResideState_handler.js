// 导入数据库操作模块
const db=require('../db/index')

// 查询结账状态信息的路由的处理函数
exports.list=(request,response)=>{
    // 定义查询的 SQL 语句
    const sql='select * from residestates'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,(err,result)=>{
        if(err) return response.cc(err)

        response.send(result)
    })
}