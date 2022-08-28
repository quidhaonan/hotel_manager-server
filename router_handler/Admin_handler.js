// 导入数据库操作模块
const db=require('../db/index')
// 导入生成 Token 的包
const jwt=require('jsonwebtoken')
// 对图片的名字加一个后缀，使其能直接打开，并且读取图片，将他放入数据库中
const fs=require('fs')
const path=require('path')


// 登录的处理函数
exports.login=(request,response)=>{
    // 获取客户端提交到服务器的用户信息
    const userinfo=request.query
    // 对表单中的数据，进行合法性的校验
    if(!userinfo.loginId || !userinfo.loginPwd){
        return response.send({status:1,message:'用户名或密码不合法！'})
        // return response.cc(err)
    }

    // 定义 SQL 语句
    const sql='select * from users where loginId=?'
    db.query(sql,userinfo.loginId,(err,result)=>{
        if(err) return response.cc(err)
        // 执行 SQL 语句成功，但是获取到的数据条数不等于 1
        if(result.length!==1) return response.cc('登录失败！')

        // TODO：判断密码是否正确
        // 自己直接判断，没有用到加密什么的
        if(userinfo.loginPwd!==result[0].loginPwd) return response.cc('登录失败！')

        // TODO：在服务器端生成 Token 的字符串
        const user={...result[0]}
        // 对用户的信息进行加密，生成 Token 字符串
        const tokenStr=jwt.sign(user,'这是一个加密秘钥')

        response.send({
            message:'登录成功',
            success:true,
            token:'Bearer '+tokenStr
        })
    })
}

// 查询账户信息的方法
exports.list=(request,response)=>{
    // 为了对老师的那个进行筛选操作
    // console.log(request.query)

    // 定义查询分类列表数据的 SQL 语句
    const sql='select * from users left join roles on users.connectId=roles.roleId'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,(err,result)=>{
        if(err) return response.cc(err)

        // 对数据进行查询
        if(request.query.roleId!=0){
            result=result.filter((item)=>{
                return item.roleId==request.query.roleId
            })
        }
        // 对数据进行分页
        const res=fenye(request,result)
        response.send({
            count:result.length,
            data:res,
            pageIndex:request.query.pageIndex,
            pageSize:request.query.pageSize
        })
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

// 账户头像上传处理的函数
exports.uploadImg=(request,response)=>{
    // console.log(request.files[0])
    const file=request.files[0]
    // 对图片的名字加一个后缀，使其能直接打开
    let path=Date.now().toString() + "_" + file.originalname
    let path1 = "public/image/" + path
    // console.log(path)
    fs.renameSync("./public/image/" + file.filename, path1);
    // // 声明一个转发给服务器的路径
    // const path1=Date.now().toString() + "_" + file.originalname
    response.send({
        filename:path,
        message:'上传成功',
        success:true
    })
}

// 添加账户信息的函数
exports.add=(request,response)=>{
    // console.log(request.body)
    // 1. 定义查重的 SQL 语句
    const sql='select * from users where loginId=?'
    // 2. 执行查重的 SQL 语句
    db.query(sql,request.body.loginId,(err,result)=>{
        // 3. 判断是否执行 SQL 语句失败
        if(err) return response.cc(err)

        // 4 判断数据的 length
        if(result.length===1) return response.cc('账号被占用，换一个在试')

        // TODO：账号可用，添加执行的动作
        // 定义插入文章分类的 SQL 语句
        const sql='insert into users set ?'
        const res={
            loginId:request.body.loginId,
            loginPwd:request.body.loginPwd,
            name:request.body.name,
            phone:request.body.phone,
            connectId:request.body.roleId,
            photo:request.body.photo
        }
        // 执行插入文章分类的 SQL 语句
        db.query(sql,res,(err,result)=>{
            if(err) return response.cc(err)
            if(result.affectedRows!==1) return response.cc('新增账号失败')
            response.cc('新增账号成功',true)
        })
    })
}

// 此处没一点用
// // 自己添加的读取图片并添加到数据库中的函数
// const addPicture=async (request,response)=>{
//     fs.readFile(path.join(__dirname,'../public/image',request.body.photo),(err,data)=>{
//         if(err) return response.cc(err)
//         return data
//     })
// }

// 修改账户信息的函数
exports.update=(request,response)=>{
    // 自己添加的判断是否是初始管理员
    isAdmin(request,response)
    
    // console.log(request.body)
    // 此处一般为定义查重的 SQL 语句，由于要修改的属性在数据库中没有要唯一值的设定，因此省略

    // TODO：名称和别名都可用，可以执行更新的操作
    // 定义更新文章分类的 SQL 语句
    let {name,phone,photo,roleId,loginId}=request.body
    const sql='update users set name=?,phone=?,photo=?,connectId=? where loginId=?'
    // 执行更新文章分类的 SQL 语句
    db.query(sql,[name,phone,photo,roleId,loginId],(err,result)=>{
        if(err) return response.cc(err)
        if(result.affectedRows!==1) return response.cc('修改账户失败')
        response.cc('修改账户成功',true)
    })
}

// 删除账户信息的函数
exports.delete=(request,response)=>{
    // 自己添加的判断是否是初始管理员
    isAdmin(request,response)

    // console.log(request.body)
    // 定义标记删除的 SQL 语句
    const sql='delete from users where id=?'
    // 删除图片的位置应该要在删除元素之前，否则会读取不到发生错误
    deletePicture(request,response)
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,request.body.id,(err,result)=>{
        if(err) return response.cc(err)
        if(result.affectedRows!==1) return response.cc('删除账户失败')
        response.cc('成功',true)
    })
    // response.cc('假的成功',true)
}
// 自己封装的用于删除图片的函数，适用于 delete 函数
const deletePicture=async (request,response)=>{
    // 传过来一个参数 id ,将它解构出来
    const {id}=request.body
    // 定义查找的 sql 语句
    const sql='select * from users where id=?'
    // 调用 db.query() 执行 SQL 语句
    db.query(sql,id,(err,result)=>{
        // 遇到错误，直接返回，不用输出了
        if(err) return response.cc(err)
        if(result[0].photo!=null){
            fs.unlink(path.join(__dirname,'../public/image',result[0].photo),(err)=>{
                if(err) return response.cc(err)
            })
        }
    })
}

// 根据账号返回一个账户对象的函数
exports.getOne=(request,response)=>{
    // 定义根据 id 获取账号对象的 SQL 语句
    const sql='select id,loginId,loginPwd,name,phone,photo,roleId,roleName from users left join roles on users.connectId=roles.roleId where loginId=?'
    // 调用 db.query() 执行 SQL 语句
    // console.log(request.query.loginId)
    db.query(sql,request.query.loginId,(err,result)=>{
        if(err) return response.cc(err)
        // 为了和老师的返回形式一样
        result=result[0]
        // 文章项目那里的 根据 Id 获取文章分类的处理函数 用到了，这里用不到，用了会在执行返回
        // if(result.affectedRows!==1) return response.cc('获取账户信息失败')
        response.send({
            ...result
        })
    })
}

// 修改账户密码的方法
exports.resetPwd=(request,response)=>{
    // console.log(request.body)
    // 文章类那里有查重，因为这里数据库对密码这里没有 唯一值 的限制，因此可以跳过查重

    // 判断是否是初始管理员
    isAdmin(request,response)

    // 判断初始密码是否是真的
    const sqlPwd='select loginPwd from users where id=?'
    db.query(sqlPwd,request.body.id,(err,result)=>{
        if(request.body.oldLoginPwd!==result[0].loginPwd){
            return response.cc('修改失败，初始密码错误')
        }

        // 下面原本是和第一个查询语句平级的，但是会发生错误
        // 定义更新文章分类的 SQL 语句
        const sql='update users set loginPwd=? where id=?'
        // 执行更新文章分类的 SQL 语句
        db.query(sql,[request.body.newLoginPwd,request.body.id],(err,result)=>{
            if(err) return response.cc(err)
            if(result.affectedRows!==1) return response.cc('修改密码失败')
            response.cc('修改成功',true)
        })
    })
}

// 自己封装的判断是否是初始管理员
// 已经使用在以下函数中 update  delete  resetPwd
const isAdmin=(request,response)=>{
    if(request.body.id==1){
        // console.log('进来isAdmin')
        return response.cc('修改失败，初始管理员不可被修改或删除')
    }
}