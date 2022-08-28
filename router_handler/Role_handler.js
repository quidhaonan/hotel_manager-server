// 导入数据库操作模块
const db=require('../db/index')

// 获取所有的角色信息
exports.list=(request,response)=>{
    // 定义查询分类列表数据的 SQL 语句
    const sql='select * from roles'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,(err,result)=>{
        if(err) return response.cc(err)
        response.send(result)
    })
}

// 添加角色的处理函数
exports.add=(request,response)=>{
    // 1. 定义查重的 SQL 语句
    const sql='select * from roles where roleName=?'
    // 2. 执行查重的 SQL 语句
    db.query(sql,request.body.roleName,(err,result)=>{
        // 3. 判断是否执行 SQL 语句失败
        if(err) return response.cc(err)

        // 4 判断数据的 length
        if(result.length===1) return response.cc('角色名称重复')

        // TODO：角色名称可用，添加执行的动作
        // 定义添加角色的 SQL 语句
        const sql='insert into roles(roleName) values(?)'
        // 执行添加角色的 SQL 语句
        db.query(sql,request.body.roleName,(err,result)=>{
            if(err) return response.cc(err)
            if(result.affectedRows!==1) return response.cc('添加角色失败')
            response.cc('添加成功',true)
        })
    })
}

// 修改角色的处理函数
exports.update=(request,response)=>{
    // 定义查重的 SQL 语句
    const sql='select * from roles where roleName=?'
    // 调用 db.query() 执行查重的 SQL 语句
    db.query(sql,request.body.roleName,(err,result)=>{
        // 执行 SQL 语句失败
        if(err) return response.cc(err)

        // 判断一种名称是否被占用
        if(result.length===1) return response.cc('名称被占用')

        // TODO：名称可用，可以执行更新的操作
        // 定义更新名称的 SQL 语句
        const sql='update roles set roleName=? where roleId=?'
        // 执行更新文章分类的 SQL 语句
        db.query(sql,[request.body.roleName,request.body.roleId],(err,result)=>{
            if(err) return response.cc(err)
            if(result.affectedRows!==1) return response.cc('修改失败')
            response.cc('修改成功',true)
        })
    })
}

// 删除角色的处理函数
exports.delete=(request,response)=>{
    // 定义标记删除的 SQL 语句
    const sql='delete from roles where roleId=?'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,request.body.roleId,(err,result)=>{
        if(err) return response.cc(err)
        if(result.affectedRows!==1) return response.cc('删除失败')
        response.cc('删除成功',true)
    })
}