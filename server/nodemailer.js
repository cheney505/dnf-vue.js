const nm = require("nodemailer");

// 创建发送邮件对象
let transporter = nm.createTransport({
    // node-modules/lib/well-known/Services.json查看
    host: "smtp.qq.com", 
    port: 465,
    secure: true, 
    auth: {
      user: "2390751614@qq.com", // 邮箱号码
      pass: "jidcnpcezqoadjba", // 邮箱smtp验证码
    },
  });

//生成验证码
function verify(){
  return Math.random().toString().substring(2,7)
}
//生成验证码产生时间
function time(){
  return Date.now()
}

module.exports = {transporter,verify,time};