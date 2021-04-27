const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //null后面为存放的文件夹
    cb(null, path.join(__dirname, '../img/userImg'))
  },
  filename: function (req, file, cb) {
    let imgType = file.mimetype.split("/")[1];
    //null后面为保存的文件名，需要自行添加后缀
    cb(null, Date.now() + parseInt(Math.random() * 99999) + "." + imgType)
  }
})

//允许上传的后缀
function checkFileExt(ext,allow=true,rule='png|jpeg|jpg'){
  if(!ext) return false;
  if(allow) return rule.includes(ext);
  return !rule.includes(ext);
}

//控制哪些文件可以上传、哪些文件跳过
function fileFilter(req,file,cb){
  let ext = file.originalname.split('.');
  ext = ext[ext.length-1];
  // 检查文件后缀是否符合规则
  if(checkFileExt(ext,true)){
    cb(null,true);
  }else{
    // 不符合规则，拒绝文件并且直接抛出错误
    cb(null,false);
    cb(new Error('上传的文件格式错误！'));
  }
}
var upload = multer({ storage: storage ,fileFilter})

const toupload = upload.single('image')
//中间件，捕获错误
function uploadMiddleware(req,res,next){
  toupload(req,res,(err)=>{
    if(err){
      // 进行错误捕获
      res.json({err:-1,msg:"上传的文件格式错误！"});
    }else{
      next();
    }
  });
}
//编写上传文件接口-注意必须用post
//上传的key为“image”
router.post("/upload", uploadMiddleware, (req, res) => {
  let types = req.file.mimetype.split("/")
    // let server = "http://localhost:2333"
    let url = `/img/userImg/${req.file.filename}`
    res.send({ err: 0, msg: "上传成功！", img: url, imgName: req.file.filename })
})

// 导出路由
module.exports = router;