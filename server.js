const express = require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const passport=require('passport');
//服务器创建
const app=express();

// 引入users.js,必须在passport初始化之前引入
const users = require('./router/api/users');
//引入articles.js
const arts=require('./router/api/articles');


//引入DB config
const db=require("./config/keys").mongoURI;
const db_config=require("./config/keys").config;

//使用body-parse中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//连接MongDB
mongoose.connect(db,db_config)
        .then(()=>console.log("MongoDB Connect!")
        )
        .catch((err)=>console.log(err)
        );
        mongoose.set('useFindAndModify', false);
//使用passport验证token,这里初始化 
app.use(passport.initialize());
require('./config/passport')(passport);

//引入模块
const admin = require('./router/admin');
app.use("/admin",admin);
app.use('/api/users', users);//app.use尽量往后放避免一些问题
app.use('/api/arts',arts);

//拦截admin模块
// app.get("/",(req,res)=>{
//     res.send("Index");
// })
//跨域
app.all('*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
        res.setHeader('Content-Type', 'application/json;charset=utf-8')
        res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
        res.header('X-Powered-By', ' 3.2.1')
        if (req.method == 'OPTIONS') res.send(200)
        /*让options请求快速返回*/
        else next()
      })
//监听端口
app.listen(80,()=>console.log("localhost:80"));