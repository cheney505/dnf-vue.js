const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser());
//配置session
app.use(session({
    secret: '@%%20201230',
    name:'sessionId',
    cookie: {
        //一小时之后过期
        maxAge: 60*1000*60
    },
    resave: false,
    saveUninitialized: false
}))

//使用cors解决跨域问题
app.use(cors());

//对其使用第三方插件-表单传参
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//添加img静态目录
app.use(express.static(path.join(__dirname)));

//引入数据库文件
const db = require("./db")

//引入用户路由
const userRouter = require("./api/UserApi");
app.use("/user", userRouter);

// //引入书目路由
// const bookRouter = require("./api/BookApi");
// app.use("/book", bookRouter);

//引入文件路由
const fileRouter = require("./api/FileApi");
app.use("/file", fileRouter);

//开启一个服务器
app.listen(2333, function () {
    console.log("[服务器启动成功!]");
});
