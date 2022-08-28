// 导入数据库操作模块
const db=require('../db/index')

// 获取所有的顾客信息
exports.list=(request,response)=>{
    // console.log(request.query)
    if(request.query.guestName==''){
        // 定义查询分类列表数据的 SQL 语句
        const sql='select * from guests left join rooms on guests.roomId=rooms.roomId left join roomtypes on rooms.roomTypeId=roomtypes.roomTypeId left join residestates on guests.resideStateId=residestates.resideStateId'
        // 调用 db.query() 执行 SQL 语句
        db.query(sql,(err,result)=>{
            if(err) return response.cc(err)
            
            if(request.query.resideStateId!=0){
                // 进行筛选
                result=result.filter(item=>{
                    return item.resideStateId==request.query.resideStateId
                })
            }

            // 分页
            const result1=fenye(request,result)
            // console.log(result)

            const res={ guestId,guestName,identityId,phone,roomId,roomTypeName,resideDate,leaveDate,deposit,totalMoney,resideStateId,resideStateName }=result1
            response.send({
                data:res,
                count:result.length
            })
        })
    }else{
        // 定义查询分类列表数据的 SQL 语句
        const sql=`select * from guests left join rooms on guests.roomId=rooms.roomId left join roomtypes on rooms.roomTypeId=roomtypes.roomTypeId left join residestates on guests.resideStateId=residestates.resideStateId where guestName like '%${ request.query.guestName }%'`
        // 调用 db.query() 执行 SQL 语句
        // console.log(request.query.guestName)
        db.query(sql,(err,result)=>{
            if(err) return response.cc(err)

            if(request.query.resideStateId!=0){
                // 进行筛选
                result=result.filter(item=>{
                    return item.resideStateId==request.query.resideStateId
                })
            }

            // 分页
            const result1=fenye(request,result)

            const res={ guestId,guestName,identityId,phone,roomId,roomTypeName,resideDate,leaveDate,deposit,totalMoney,resideStateId,resideStateName }=result1
            response.send({
                data:res,
                count:result.length
            })
        })
    }
}

// 添加顾客的路由的处理函数
exports.add=(request,response)=>{
    // console.log(request.body)
    // 1. 定义查重的 SQL 语句   (此时的 roomId 并不需要查重，因为是浏览器自己提供的选择，并不是自己写的)
    const sql='select * from guests where identityId=?'
    // 2. 执行查重的 SQL 语句
    db.query(sql,request.body.identityId,(err,result)=>{
        // 3. 判断是否执行 SQL 语句失败
        if(err) return response.cc(err)

        // 4 判断数据的 length
        if(result.length===1) return response.cc('身份证号被占用')

        // TODO：身份证号可用，添加执行的动作
        // 定义插入的 SQL 语句
        const sql='insert into guests set ?'
        // 执行插入的 SQL 语句
        delete request.body.roomTypeId
        db.query(sql,request.body,(err,result)=>{
            if(err) return response.cc(err)
            if(result.affectedRows!==1) return response.cc('添加失败')
            // 进行联动效果
            liandong(request,2)
            response.cc('添加成功',true)
        })
    })
    // response.cc('假的成功',true)
}

// 没一点用
//#region 
// // 自己封装的查询不同表的方法，用来判断 identityId 是否在 guests 表重复， roomId 是否在 rooms 表重复
// const checkRepeat=(tableName,fileName,newId,oldId)=>{
//     let length
//     // 修改的时候
//     if(oldId){
//         const sql=`select * from ${ tableName } where ${ fileName }<>${ oldId } and ${ fileName }=${ newId }`
//         console.log(sql)
//         db.query(sql,(err,result)=>{
//             // if(err) throw error('查询失败');

//             return result.length
//         })
//     }else{  //添加的时候
//         const sql=`select * from ${ tableName } where ${ fileName }='${ newId }'`
//         console.log(sql)
//         db.query(sql,(err,result)=>{
//             length=result.length

//             if(err) throw error('查询失败')
//             console.log('Jin')
//             console.log(length)
//         })
//         console.log(length)
//     }
//     console.log(length)
//     return length
// }
//#endregion

// 修改顾客的路由的处理函数
exports.update=(request,response)=>{
    // console.log(request.body)
    // 解构出想要的
    const { guestName,identityId,backupIdentityId,phone,roomId,resideDate,deposit,guestNum }=request.body
    const body={ guestName,identityId,backupIdentityId,phone,roomId,resideDate,deposit,guestNum }
    console.log(body)
    // 定义查重的 SQL 语句
    const sql='select * from guests where identityId<>? and identityId=?'
    // 调用 db.query() 执行查重的 SQL 语句
    db.query(sql,[body.backupIdentityId,body.identityId],(err,result)=>{
        // 执行 SQL 语句失败
        if(err) return response.cc(err)

        // 判断身份证号是否被占用
        if(result.length===1) return response.cc('身份证号被占用')

        // TODO：身份证号可用，可以执行更新的操作
        // 定义更新顾客信息的 SQL 语句
        const sql='update guests set ? where identityId=?'
        delete body.backupIdentityId
        // console.log(body)
        // 执行更新顾客信息的 SQL 语句
        db.query(sql,[body,body.identityId],(err,result)=>{
            if(err) return response.cc(err)
            if(result.affectedRows!==1) return response.cc('修改失败')
            response.cc('修改成功',true)
        })
    })
    // response.cc('假的成功',true)
}

// 结账方法的路由的处理函数
exports.checkout=(request,response)=>{
    // console.log(request.body)
    // const str1 = "2021//11//11 8:00:00";
    // const str2 = "2022-08-23T01:16:33.000Z";
    // const t1 = new Date(str1).getTime();
    // const t2 = new Date(str2).getTime();
    // console.log(t1)
    // console.log(t2)
    // if((t2-t1)>7*24*3600*1000) console.log('interval is greater than a week');


    // 定义查询消费金额的 sql 语句
    const sql='select resideDate,roomTypePrice from guests left join rooms on guests.roomId=rooms.roomId left join roomtypes on rooms.roomTypeId=roomtypes.roomTypeId where guestId=?'
    // 执行查询消费金额的 sql 语句
    db.query(sql,request.body.guestId,(err,result)=>{
        if(err) return response.cc(err)
        const str1=result[0].resideDate
        const t1 = new Date(str1).getTime();
        // console.log(t1)
        const t2=Date.now()
        let leaveDate=new Date(t2)
        leaveDate=leaveDate.getFullYear()+'/'+leaveDate.getMonth()+'/'+leaveDate.getDate()+' '+leaveDate.getHours()+':'+leaveDate.getMinutes()+':'+leaveDate.getSeconds()
        // console.log(leaveDate)
        // console.log(t2)
        // console.log(t2-t1)
        // console.log(Math.floor((t2-t1)/(1000*60*60*24)))
        let price=Math.floor((t2-t1)/(1000*60*60*24))*result[0].roomTypePrice
        // console.log(price)

        // console.log(result[0])

        // 定义更新离开时间和消费金额的 sql 语句
        const body={ leaveDate:leaveDate,totalMoney:price,resideStateId:2 }
        const sql='update guests set ? where guestId=?'
        // 执行更新离开时间和消费金额的 sql 语句
        db.query(sql,[body,request.body.guestId],(err,result)=>{
            // console.log(price)
            if(err) return response.cc(err)
            if(result.affectedRows!==1) return response.send({ totalMoney:0 })
            liandong(request,1)
            response.send({
                totalMoney:price
            })
        })
    })
    // response.send({
    //     totalMoney:3000
    // })
}

// 删除顾客的路由的处理函数
exports.delete=(request,response)=>{
    console.log(request.body)
    // 定义删除的 SQL 语句
    const sql='delete from guests where guestId=?'
    db.query(sql,request.body.guestId,(err,result)=>{
        if(err) return response.cc(err)
        if(result.affectedRows!==1) return response.cc('删除失败')
        response.cc('删除成功',true)
    })
    // response.cc('假的成功',true)
}

// 自己封装的对客房和顾客进行联动效果(将 空闲状态 转为 入住状态 或 将 入住状态 转为 空闲状态)
function liandong(request,type){
    // console.log(request.body)
    const { roomId }=request.body
    const sql="update rooms set roomStateId=? where roomId=?"
    db.query(sql,[type,roomId],(err,result)=>{
        if(err) throw new Error('联动效果失败')
        if(result.affectedRows!==1) throw new Error('联动效果失败')
    })
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