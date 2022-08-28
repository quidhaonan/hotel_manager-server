// 导入数据库操作模块
const db=require('../db/index')


// 获取所有房间的路由的处理函数
exports.list=(request,response)=>{
    // console.log(request.query)
    // 定义查询分类列表数据的 SQL 语句
    const sql='select * from rooms left join roomtypes on rooms.roomTypeId=roomtypes.roomTypeId left join roomstates on rooms.roomStateId=roomstates.roomStateId'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,(err,result)=>{
        if(err) return response.cc(err)
        const length=result.length
        // console.log(result)
        // console.log(request.query)

        // 此处的判断是 Guest.vue 中，需要实现添加的时候不能显示非空闲状态的房间，而修改的时候需要显示
        if(request.query.guestId && request.query.guestId==0){
            // 实现查询功能
            // console.log(result)
            // console.log(request.query)
            console.log(request.query.roomStateId)
            if(request.query.roomStateId && request.query.roomStateId!=0){
                // result=result.filter((item)=>{
                //     return item.roomStateId==request.query.roomStateId
                // })
                result=result.filter((item)=>{
                    return item.roomTypeId==request.query.roomTypeId && item.roomStateId==request.query.roomStateId
                })
            }
        }else{
            // 实现查询功能
            // console.log(result)
            // console.log(request.query)
            // console.log('进来else')
            if(request.query.guestId){
                result=result.filter((item)=>{
                    return item.roomTypeId==request.query.roomTypeId 
                })
            }else{
                if(request.query.roomStateId && request.query.roomStateId!=0){
                    result=result.filter((item)=>{
                        return item.roomStateId==request.query.roomStateId
                    })
                }
                if(request.query.roomTypeId && request.query.roomTypeId!=0){
                    result=result.filter((item)=>{
                        return item.roomTypeId==request.query.roomTypeId
                    })
                }
            }
        }
        
        if(request.query.pageIndex && request.query.pageSize){
            result=fenye(request,result)
        }
        
        response.send({
            data:result,
            count:length,
        })
    })
}

// 添加房间信息的路由的处理函数
exports.add=(request,response)=>{
    console.log(request.body)
    // 1. 定义查重的 SQL 语句
    const sql='select * from rooms where roomId=?'
    // 2. 执行查重的 SQL 语句
    db.query(sql,request.body.roomId,(err,result)=>{
        // 3. 判断是否执行 SQL 语句失败
        if(err) return response.cc(err)
        // 4 判断数据的 length
        if(result.length===1) return response.cc('添加失败，房间号不能重复')

        // TODO：房间号可用，添加执行的动作
        // 定义插入文章分类的 SQL 语句
        const sql='insert into rooms set ?'
        // 执行插入文章分类的 SQL 语句
        db.query(sql,request.body,(err,result)=>{
            if(err) return response.cc(err)

            if(result.affectedRows!==1) return response.cc('添加失败')
            response.cc('添加成功',true)
        })
    })
    // response.cc('假的成功',true)
}

// 修改房间信息的路由的处理函数
exports.update=(request,response)=>{
    console.log(request.body)
    // 定义查重的 SQL 语句
    const sql='select * from rooms where roomId<>? and roomId=?'
    // 调用 db.query() 执行查重的 SQL 语句
    db.query(sql,[request.body.id,request.body.roomId],(err,result)=>{
        // 执行 SQL 语句失败
        if(err) return response.cc(err)

        // 判断房间号被占用的情况
        if(result.length===1) return response.cc('修改失败，房间号不能重复')

        // TODO：名称和别名都可用，可以执行更新的操作
        // 定义更新文章分类的 SQL 语句
        const sql='update rooms set ? where roomId=?'
        // 对传过来的数据进行解析
        const { roomId,roomStateId,roomTypeId,description }=request.body
        const par={ roomId,roomStateId,roomTypeId,description }
        // 执行更新文章分类的 SQL 语句
        db.query(sql,[par,request.body.id],(err,result)=>{
            if(err) return response.cc(err)

            if(result.affectedRows!==1) return response.cc('修改房间信息失败')
            response.cc('修改成功',true)
        })
    })
    // response.cc('假的成功',true)
}

// 删除房间信息的路由的处理函数
exports.delete=(request,response)=>{
    console.log(request.body)
    // 定义标记删除的 SQL 语句
    const sql='delete from rooms where roomId=?'
    db.query(sql,request.body.roomId,(err,result)=>{
        if(err) return response.cc(err)
        
        if(result.affectedRows!==1) return response.cc('删除失败')
        response.cc('删除成功',true)
    })
    // response.cc('假的成功',true)
}


// 自己封装的对后台转发的数据进行分页
function fenye(request,result){
    let res=[]
    let pageIndex=request.query.pageIndex
    let pageSize=request.query.pageSize
    // console.log(pageIndex)
    // console.log(pageSize)
    // console.log(result.length)

    if(result.length<pageSize){
        res=result
    }else{
        if(pageIndex*pageSize<result.length){
            for(let i=(pageIndex-1)*pageSize;i<pageSize*pageIndex;i++){
                res.push(result[i])
            }
        }else{
            for(let i=(pageIndex-1)*pageSize;i<result.length;i++){
                res.push(result[i])
            }
        }
    }
    // console.log(res)
    return res
}