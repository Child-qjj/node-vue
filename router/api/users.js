//@login & register
const express =require('express');
const router = express.Router();
const bcrypt=require('bcrypt');
const gravatar = require('gravatar');
const jwt=require('jsonwebtoken');//第三方token生成包
const keys=require('../../config/keys');
const passport=require('passport');

const User=require('../../model/User');
//$router Get/api passport.authenticate("jwt", { session: false })
router.get('/',(req,res)=>{
   User.find()
        .then(users=>{
                if(!users){
                    return res.status(404).json("查询失败");
                }
              res.json(users);
            })
        .catch(err=>console.log(err)
        )
});
router.post('/register',(req,res)=>{
//  console.log(req.bpdy);
//  res.send('register');
 //查询是否存在邮箱
User.findOne({email:req.body.email})
    .then((user)=>{
        if (user) {
        res.status(400).json("邮箱已被注册");
        }
        else{
            var avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
            const newUser=new User({
                name:req.body.name,
                email:req.body.email,
                avatar,
                password:req.body.password,
                identity:req.body.identity
            })
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password,salt,function(err, hash){
                    if (!newUser.password&&salt) {
                        console.log("这俩值为空");
                    }
                    if(err) throw err;//抛出异常通常是因为newUser.password为空,在postman中信息写在body栏
                    newUser.password=hash;
                    newUser.save()
                           .then(user=>res.json(user))
                           .catch(err=>console.log(err));
                });
            });
         }
    });
})
//登陆验证
router.post("/login",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    //查询数据库
    User.findOne({email})
        .then(user=> {
                if (!user)
                 return res.status(404).json("账号不存在")   
                 //密码匹配
                 bcrypt.compare(password, user.password)
                       .then(isMatch=>{
                        if (isMatch) {
                            const rule={
                                id:user.id,
                                name:user.name,
                                avatar:user.avatar,
                                email:user.email,
                                identity:user.identity
                            };
                            // jwt.sign("规则","加密名字","过期时间秒","callback函数")
                            jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                                if (err) {
                                    throw err;
                                }
                                res.json(
                                    {
                                    success:true,
                                    token:'Bearer '+token
                                });
                            });
                            // res.json({msg:"success" })
                        }
                         else return res.status(400).json({password:"密码错误!"});
                       }
                       
                       )
            }   
        )
}  )

//token 验证 /api/current,token验证出问题就看passport.js模块
router.get('/current',passport.authenticate("jwt", { session: false }),
    function(req, res) {
        res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        avatar:req.user.avatar,
        identity:req.user.identity
        });
    }
);
//修改用户表
router.post(
    "/edit/:id",
    passport.authenticate("jwt",{session:false}),
    (req,res)=>{
        const essayFields = {};
     bcrypt.genSalt(10,(err, salt)=>{
            bcrypt.hash(req.body.password,salt,function(err, hash){
                if (!req.body.password&&salt) {
                    console.log("这俩值为空");
                }
                if(err) throw err;//抛出异常通常是因为newUser.password为空,在postman中信息写在body栏
                req.body.password=hash;
                if (req.body.name) essayFields.name=req.body.name;
                if (req.body.email) essayFields.email=req.body.email;
                if (req.body.identity) essayFields.identity=req.body.identity;
                if (req.body.password) essayFields.password=req.body.password;
             User.findOneAndUpdate(//因为findOneAndUpdate的依赖有一部分即将删除所以会警告
                {_id:req.params.id},
                {$set:essayFields},
                {new:true}
                ).then(user=>{
                res.json(user);
            })
            });
        });
       
});
//删除用户
router.delete(
    '/delete/:id',
    passport.authenticate("jwt",{session:false}),
    (req,res)=>{
       User.findOneAndRemove({_id:req.params.id})
        .then(user=>{
          user.save().then(user => res.json(user))
                     .catch(err=>res.status(404).json(user));
        })
        .catch(err=>res.status(404).json("删除失败"));
    }
        
);
module.exports=router;