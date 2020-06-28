const express=require('express');
const router=express.Router();
const passport=require('passport');
const Article=require('../../model/Article');
const Category = require('../../model/Category');





//获取分类表的分类/api/arts/
router.get('/',passport.authenticate("jwt",{session:false}),(req,res)=>{
    Category.find()
            .then(category=>{
                if (!category) {
                    return res.status(404).json("暂时没有分类");
                }
                res.json(category);
            })
            .catch(err=>res.status(404).json(err));
});
//
router.post('/new',passport.authenticate("jwt",{session:false}),(req,res)=>{
    const essayFields = {};
    if (req.body.name) essayFields.name=req.body.name;
    new Category(essayFields).save().then(category=>{
        res.json(category);
    })
});
//blog 创建/api/arts/add
router.post("/add",passport.authenticate("jwt",{session:false}),(req,res)=>{
    const essayFields = {};
    if (req.body.title) essayFields.title=req.body.title;
    if (req.body.description) essayFields.description=req.body.description;
    if (req.body.body) essayFields.body=req.body.body;
    if (req.body.author) essayFields.AuthorId=req.body.author;
    if (req.body.categories) essayFields.categories=req.body.categories;
    //console.log(req.body.categories);
    
    if (req.body.date) essayFields.date=req.body.date;
    new Article(essayFields).save().then(article=>{
        res.json(article);
    })
});

//blog 信息获取/api/arts/publish
router.get("/publish",passport.authenticate("jwt",{session:false}),(req,res)=>{
    Article.find()
           .then(article=>{
               if(!article){
                   return res.status(404).json("没有该文章");
               }
             res.json(article);
           })
           .catch(err=>res.status(404).json(err));

});

//查询接口 api/arts/(这里是id)
router.get(
    '/:id',passport.authenticate("jwt",{session:false}),(req,res)=>{
        Article.findOne({AuthorId:req.params.id})
               .then(article=>{
                   if(!article){
                       return res.status(404).json("没有该文章");
                   }
                   res.json(article);
               })
               .catch(err=>res.status(404).json(err));
    
    }  
);

//编辑
router.post(
    "/edit/:id",
    passport.authenticate("jwt",{session:false}),(req,res)=>{
    const essayFields = {};
    if (req.body.title) essayFields.title=req.body.title;
    if (req.body.description) essayFields.description=req.body.description;
    if (req.body.body) essayFields.body=req.body.body;
    if (req.body.categries) essayFields.categries=req.body.categries;
    if (req.body.date) essayFields.date=req.body.date;
     Article.findOneAndUpdate(//因为findOneAndUpdate的依赖有一部分即将删除所以会警告
        {_id:req.params.id},
        {$set:essayFields},
        {new:true}
        ).then(article=>{
        res.json(article);
    })
});

//删除
router.delete(
    '/delete/:id',
    passport.authenticate("jwt",{session:false}),
    (req,res)=>{
       Article.findOneAndRemove({_id:req.params.id})
        .then(article=>{
          article.save().then(article => res.json(article))
                        .catch(err=>res.status(404).json(article));
        })
        .catch(err=>res.status(404).json("删除失败"));
    }
        
);
module.exports=router;