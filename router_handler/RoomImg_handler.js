// 导入数据库操作模块
const db=require('../db/index')
// 对图片的名字加一个后缀，使其能直接打开，并且读取图片，将他放入数据库中
const fs=require('fs')

// 房间图片上传处理的函数
exports.uploadImg=(request,response)=>{
    // console.log(request.files[0])
    const file=request.files[0]
    // 对图片的名字加一个后缀，使其能直接打开
    let path=Date.now().toString() + "_" + file.originalname
    let path1 = "public/roomImg/" + path
    // console.log(path)
    fs.renameSync("./public/roomImg/" + file.filename, path1);
    response.send({
        filename:path,
        message:'上传成功',
        success:true
    })
}

// 添加房间图片的路由的处理函数
exports.add=(request,response)=>{
    // console.log(request.body)
    // 因为要插入的数据没有唯一性的要求，因此不需要查重
    // 定义插入文章分类的 SQL 语句
    const sql='insert into roomimgs set ?'
    // 执行插入文章分类的 SQL 语句
    db.query(sql,request.body,(err,result)=>{
        if(err) return response.cc(err)

        if(result.affectedRows!==1) return response.cc('添加失败')
        response.cc('添加成功',true)
    })
}

// 查询指定房间对应的房间图片的路由的处理函数
exports.list=(request,response)=>{
    // 定义查询分类列表数据的 SQL 语句
    // console.log(request.query[0])
    const sql='select * from roomimgs where roomId=?'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,request.query[0],(err,result)=>{
        if(err) return response.cc(err)

        response.send(result)
    })
}

// 删除房间图片的路由的处理函数
exports.delete=(request,response)=>{
    // 按道理来讲，只需要传过来一个 roomImgId 就可以，或者 roomId与filename 就可以，
    // 因为数据库中没有 filename 字段，因此用 roomImgId 进行删除

    // console.log(request.body)
    // 定义标记删除的 SQL 语句
    const sql='delete from roomimgs where roomImgId=?'
    db.query(sql,request.body.roomImgId,(err,result)=>{
        if(err) return response.cc(err)

        if(result.affectedRows!==1) return response.cc('删除失败')
        response.cc('删除成功',true)
    })
    // response.cc('假的成功',true)
}