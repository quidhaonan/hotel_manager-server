// 导入数据库操作模块
const db=require('../db/index')

// 获取所有房间类型的路由的处理函数
exports.list=(request,response)=>{
    // 定义查询房间类型数据的 SQL 语句
    const sql='select * from roomtypes'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,(err,result)=>{
        if(err) return response.cc(err)

        response.send(result)
    })
}

// 添加房间类型的路由的处理函数
exports.add=(request,response)=>{
    // console.log(request.body)
    console.log('add')
    // 1. 定义查重的 SQL 语句
    const sql='select * from roomtypes where roomTypeName=?'
    // 2. 执行查重的 SQL 语句
    db.query(sql,request.body.roomTypeName,(err,result)=>{
        // 3. 判断是否执行 SQL 语句失败
        if(err) return response.cc(err)

        // 4 判断数据的 length
        if(result.length===1) return response.cc('房型名称重复，请换一个')

        // TODO：房型名称可用，添加执行的动作
        // 定义插入文章分类的 SQL 语句
        const sql='insert into roomtypes set ?'
        // 执行插入文章分类的 SQL 语句
        db.query(sql,request.body,(err,result)=>{
            if(err) return response.cc(err)
            if(result.affectedRows!==1) return response.cc('新增房型失败')
            response.cc('添加成功',true)
        })
    })
    // response.cc('假的成功',true)
}

// 修改房间类型的的路由的处理函数
exports.update=(request,response)=>{
    // console.log(request.body)
    // 1. 定义查重的 SQL 语句
    const sql='select * from roomtypes where roomTypeId<>? and roomTypeName=?'
    // 2. 执行查重的 SQL 语句
    db.query(sql,[request.body.roomTypeId,request.body.roomTypeName,],(err,result)=>{
        // 执行 SQL 语句失败
        if(err) return response.cc(err)

        // 判断房型名称是否被占用
        if(result.length===1) return response.cc('类型名称被占用')

        // TODO：名称和别名都可用，可以执行更新的操作
        // 定义更新文章分类的 SQL 语句
        const sql='update roomtypes set ? where roomTypeId=?'
        db.query(sql,[request.body,request.body.roomTypeId],(err,result)=>{
            if(err) console.log(err)
            if(result.affectedRows!==1) return response.cc('更新房型失败')
            response.cc('更新成功',true)
        })
    })
}

// 删除房间类型的的路由的处理函数
exports.delete=(request,response)=>{
    // console.log(request.body)
    // 老师示范是房型编号 1 到 9 的都不能删除
    if(request.body.roomTypeId<=9) return response.cc('删除失败，该类型已经存在房间信息')

    // 定义标记删除的 SQL 语句
    const sql='delete from roomtypes where roomTypeId=?'
    db.query(sql,request.body.roomTypeId,(err,result)=>{
        if(err) return response.cc(err)

        if(result.affectedRows!==1) return response.cc('删除失败')
        response.cc('删除成功',true)
    })
    // response.cc('假的成功',true)
}

// 统计房间类型的销售额的路由的处理函数
exports.totalTypePrice=(request,response)=>{
    const sql='select roomTypeName,totalMoney from roomtypes left join rooms on roomtypes.roomTypeId=rooms.roomTypeId left join guests on guests.roomId=rooms.roomId'
    db.query(sql,(err,result)=>{
        if(err) return response.cc(err)

        // 对查询到的数组进行去重并且把钱数加起来
        for(let i=0;i<result.length;i++){
            for(let j=i+1;j<result.length;j++){
                if(result[i].roomTypeName==result[j].roomTypeName){
                    result[i].totalMoney+=result[j].totalMoney
                    result.splice(j,1)
                    j--
                }
            }
            // console.log(result[i].roomTypeName)
        }
        // console.log(result[0].roomTypeName)
        response.send(result)
    })
}
