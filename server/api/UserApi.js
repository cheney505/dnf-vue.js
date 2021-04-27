const models = require('../db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../sqlMap')
const { transporter, verify, time } = require('../nodemailer');
var moment = require('moment');
var { format, format2 } = require('../moment')
var { setCrypto } = require('../base')
const e = require('express');
// 连接数据库
const conn = mysql.createConnection(models.mysql);
conn.connect(err => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("[数据库连接成功!]");
    }
})


// 获取验证码
router.post("/getCode", (req, res) => {
    var { email } = req.body;
    if (!email) {
        return res.send({ error: -1, msg: "邮箱不可为空！" })
    }
    var code = verify()
    req.session.email = email;
    req.session.code = code;
    req.session.time = time();
    //   邮件信息
    let info = {
        from: 'DNFVUE <2390751614@qq.com>', // 发送者邮箱地址
        to: email, // 接收人邮箱地址
        subject: "DNF团队数据管理系统-邮箱验证码", // 邮箱标题
        html: `您的验证码为：<b>${code}</b>(1分钟内有效)`, // 可用html格式的内容
    }
    //发送邮件
    transporter.sendMail(info, function (err, data) {
        if (err) {
            return res.send({ error: -2, msg: "验证码发送失败！", data: err })
        }
        else {
            res.send({ error: 0, msg: "验证码发送成功！" })
        }
    });

})

// 找回密码-获取验证码
router.post("/getFillCode", (req, res) => {
    if (!req.session.queryState || !req.session.fillemail || !req.session.fillname) {
        return res.send({ error: -1, msg: "获取验证码失败，session已过期！" })
    }
    else {
        var { email } = req.body;
        let username = req.session.fillname
        const sql = 'SELECT id FROM `user` WHERE email = ? AND username = ?'
        if (!email || !username) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql, [email, username], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    if (result.length > 0) {
                        var Fillcode = verify()
                        req.session.Fillcode = Fillcode;
                        req.session.Filltime = time();
                        //   邮件信息
                        let info = {
                            from: 'DNFVUE <2390751614@qq.com>', // 发送者邮箱地址
                            to: email, // 接收人邮箱地址
                            subject: "DNF团队数据管理系统-找回密码", // 邮箱标题
                            html: `您的验证码为：<b>${Fillcode}</b>(1分钟内有效)`, // 可用html格式的内容
                        }
                        //发送邮件
                        transporter.sendMail(info, function (err, data) {
                            if (err) {
                                return res.send({ error: -3, msg: "验证码发送失败！", data: err })
                            }
                            else {
                                res.send({ error: 0, msg: "验证码发送成功！" })
                            }
                        });
                    }
                    else {
                        return res.send({ error: -4, msg: "邮箱输入错误！" })
                    }
                }
            })
        }


    }
})


// 用户注册
router.post("/register", (req, res) => {
    // (1)获取数据
    let { username, password, nickname, riskname, server, area, email, code } = req.body;
    let nowtime = time()
    const sql1 = 'SELECT username FROM `user` WHERE username = ?'
    const sql2 = $sql.User.add
    if (!username || !password || !nickname || !riskname || !server || !email || !code || !area) {
        return res.send({ error: -1, msg: "输入的信息不可为空！" })
    }
    else if (email != req.session.email || code != req.session.code) {
        return res.send({ error: -2, msg: "验证码输入错误！" })
    }
    else if ((nowtime - req.session.time) / 1000 > 60) {
        return res.send({ error: -3, msg: "验证码已过期，请重新发送！" })
    }
    else {
        //验证用户名是否存在
        conn.query(sql1, [username], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (result.length <= 0) {
                    //添加
                    conn.query(sql2, [username, setCrypto(password), nickname, riskname, server, area, email], function (err2) {
                        if (err2) {
                            console.log(err2)
                        }
                        else {
                            res.send({ error: 0, msg: "添加成功！" })
                        }
                    })
                }
                else {
                    return res.send({ error: -4, msg: "用户名已存在！" })
                }
            }
        })

    }
})

// 用户登录
router.post("/login", (req, res) => {
    // (1)获取数据
    let { username, password } = req.body;
    const sql = $sql.User.login
    if (!username || !password) {
        return res.send({ error: -1, msg: "用户名或密码不可为空！" })
    }
    else {
        //验证用户名是否存在
        conn.query(sql, [username, setCrypto(password)], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (result.length > 0) {
                    req.session.login = true;
                    req.session.userid = result[0].id;
                    req.session.username = result[0].username;
                    req.session.icon = result[0].icon;
                    req.session.nickname = result[0].nickname;
                    req.session.riskname = result[0].riskname;
                    req.session.server = result[0].server;
                    req.session.area = result[0].area;
                    req.session.res_data = result[0].res_data;
                    res.send({ error: 0, msg: "登录成功！", username: req.session.username, nickname: req.session.nickname })

                }
                else {
                    return res.send({ error: -2, msg: "用户名或密码错误！" })
                }
            }
        })

    }
})

// 获取用户登录状态
router.post("/getUser", (req, res) => {
    if (req.session.login) {
        res.send({ error: 0, msg: "用户已登录！", username: req.session.username, nickname: req.session.nickname })
    }
    else {
        return res.send({ error: -1, msg: "用户未登录！" })
    }
})

// 获取用户信息
router.post("/getUserMsg", (req, res) => {

    if (req.session.login) {
        let id = req.session.userid;
        let res_data = moment(req.session.res_data).format('YYYY-MM-DD HH:mm:ss')
        const sql = $sql.User.getMsg
        conn.query(sql, [id], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                req.session.icon = result[0].icon;
                req.session.nickname = result[0].nickname;
                req.session.riskname = result[0].riskname;
                req.session.server = result[0].server;
                req.session.area = result[0].area;
                res.send({ error: 0, msg: "获取用户信息成功！", data: { username: req.session.username, icon: req.session.icon, nickname: req.session.nickname, riskname: req.session.riskname, server: req.session.server, area: req.session.area, res_data: res_data } })
            }
        })
    }
    else {
        return res.send({ error: -1, msg: "用户未登录！" })
    }
})

// 退出登录
router.post("/quitLogin", (req, res) => {
    req.session.destroy();
    res.send({ error: 0, msg: "退出登录成功！" })
})

// 修改用户信息（不包括头像）
router.post("/changeMsg1", (req, res) => {
    if (req.session.login) {
        let { nickname, riskname, server, area } = req.body;
        let id = req.session.userid;
        const sql = $sql.User.changemsg
        if (!nickname || !riskname || !server || !area) {
            return res.send({ error: -1, msg: "修改的信息不可为空！" })
        }
        else {
            conn.query(sql, [nickname, riskname, server, area, id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "修改成功！" })
                }
            })

        }
    }
    else {
        return res.send({ error: -1, msg: "请先登录！" })
    }
})

// 修改用户信息（包括头像）
router.post("/changeMsg2", (req, res) => {
    if (req.session.login) {
        let { nickname, riskname, server, area, icon } = req.body;
        let id = req.session.userid;
        const sql = $sql.User.changemsg2
        if (!nickname || !riskname || !server || !area || !icon) {
            return res.send({ error: -1, msg: "修改的信息不可为空！" })
        }
        else {
            conn.query(sql, [nickname, riskname, server, area, icon, id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "修改成功！" })
                }
            })

        }
    }
    else {
        return res.send({ error: -1, msg: "请先登录！" })
    }
})

// 修改用户密码
router.post("/changepw", (req, res) => {
    if (req.session.login) {
        let { nowpw, newpw } = req.body;
        let id = req.session.userid;
        const sql1 = $sql.User.checkpw
        const sql2 = $sql.User.changepw
        if (!newpw || !nowpw) {
            return res.send({ error: -1, msg: "修改的密码不可为空！" })
        }
        else {
            conn.query(sql1, [id, password = setCrypto(nowpw)], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    if (result.length > 0) {
                        conn.query(sql2, [password = setCrypto(newpw), id], function (err2) {
                            if (err2) {
                                console.log(err2)
                            }
                            else {
                                res.send({ error: 0, msg: "修改成功！" })
                            }
                        })
                    }
                    else {
                        return res.send({ error: -2, msg: "旧密码输入错误！" })
                    }

                }
            })

        }
    }
    else {
        return res.send({ error: -1, msg: "请先登录！" })
    }
})

// 找回密码：获取用户邮箱
router.post("/getUserEmail", (req, res) => {
    let { username } = req.body;
    const sql = $sql.User.getEmail
    if (!username) {
        return res.send({ error: -1, msg: "用户名不可为空！" })
    }
    else {
        conn.query(sql, [username], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (result.length > 0) {
                    req.session.fillemail = result[0].email;
                    req.session.fillname = username;
                    req.session.queryState = true;
                    res.send({ error: 0, msg: "获取邮箱成功！" })
                }
                else {
                    return res.send({ error: -2, msg: "用户名不存在！" })
                }

            }
        })
    }
})


// 找回密码：提取找回邮箱信息
router.post("/extractEmail", (req, res) => {
    if (!req.session.queryState || !req.session.fillemail || !req.session.fillname) {
        return res.send({ error: -1, msg: "获取信息失败！" })
    }
    else {
        let userEmail = req.session.fillemail.split("@");
        let changeStr = "****"
        let showEmail = userEmail[0].substr(0, 2) + changeStr + userEmail[0].substr(2 + changeStr.length)
        let Email = showEmail + "@" + userEmail[1]
        res.send({ error: 0, msg: "获取成功！", useremail: Email })
    }
})

// 找回密码：重置密码
router.post("/resetPw", (req, res) => {
    if (!req.session.queryState || !req.session.fillemail || !req.session.fillname) {
        return res.send({ error: -1, msg: "session已过期！" })
    }
    else {
        // (1)获取数据
        let { password, code } = req.body;
        let username = req.session.fillname;
        let nowtime = time()
        const sql = $sql.User.resetPw
        if (!password || !code) {
            return res.send({ error: -2, msg: "输入的信息不可为空！" })
        }
        else if (username != req.session.fillname || code != req.session.Fillcode) {
            return res.send({ error: -3, msg: "验证码输入错误！" })
        }
        else if ((nowtime - req.session.Filltime) / 1000 > 60) {
            return res.send({ error: -4, msg: "验证码已过期，请重新发送！" })
        }
        else {

            conn.query(sql, [setCrypto(password), username], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "重置密码成功！" })
                }
            })


        }
    }
})

// 查询用户角色列表(分页)
router.post("/getUserRole", (req, res) => {
    if (!req.session.username) {
        return res.send({ error: -1, msg: "获取用户角色信息失败,请先登录！" })
    }
    else {
        let user_id = req.session.userid;
        let page = req.body.page || 1;//默认值为1
        let pageSize = req.body.pageSize || 8//默认值为8;   
        let count = 0;//记录总条数
        let allPage = 0;//记录一共有几页
        const sql1 = "SELECT id,role.role_name,user_name,time_20,time_25,res_power,res_atk,sun_power,role_icon,role_bg,role_res,role_depart FROM `user_role` INNER JOIN role ON user_role.role_name = role.role_name WHERE user_id=?"
        const sql2 = "SELECT id,role.role_name,user_name,time_20,time_25,res_power,res_atk,sun_power,role_icon,role_bg,role_res,role_depart FROM `user_role` INNER JOIN role ON user_role.role_name = role.role_name WHERE user_id=? limit ?,?"
        conn.query(sql1, [user_id], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (result.length > 0) {
                    count = result.length;
                    allPage = Math.ceil(count / pageSize)
                    conn.query(sql2, [user_id, (parseInt(page) - 1) * parseInt(pageSize), parseInt(pageSize)], function (err2, result2) {
                        if (err2) {
                            console.log(err2)
                        }
                        else {
                            res.send({ error: 0, msg: "获取用户信息成功！", data: result2, count: count, allPage: allPage })
                        }
                    })
                }
                else {
                    return res.send({ error: -2, msg: "暂无角色！" })
                }
            }
        })
    }
})

// 查询用户角色列表（不分页）
router.post("/getUserRole2", (req, res) => {
    if (!req.session.username) {
        return res.send({ error: -1, msg: "获取用户角色信息失败,请先登录！" })
    }
    else {
        let user_id = req.session.userid;
        const sql1 = "SELECT id,role.role_name,user_name,time_20,time_25,res_power,res_atk,sun_power,role_icon,role_bg,role_res,role_depart FROM `user_role` INNER JOIN role ON user_role.role_name = role.role_name WHERE user_id=?"
        conn.query(sql1, [user_id], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {

                res.send({ error: 0, msg: "获取用户信息成功！", data: result })

            }
        })
    }

})

// 添加角色
router.post("/addUserRole", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let { role_name, user_name, time_20, time_25, res_power, res_atk, sun_power } = req.body;
        let sql = 'insert into `user_role`(id,role_name,user_name,time_20,time_25,res_power,res_atk,sun_power,user_id) values (0,?,?,?,?,?,?,?,"' + user_id + '")'
        if (!role_name || !user_name) {
            return res.send({ error: -2, msg: "输入的信息不可为空！" })
        }
        else {
            conn.query(sql, [role_name, user_name, time_20, time_25, res_power, res_atk, sun_power], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "添加角色成功！" })
                }
            })
        }
    }

    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 修改角色
router.post("/changeUserRole", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let { role_name, user_name, time_20, time_25, res_power, res_atk, sun_power, id } = req.body;
        let sql = 'UPDATE `user_role` SET role_name=?,user_name=?,time_20=?,time_25=?,res_power=?,res_atk=?,sun_power=? WHERE id = ? AND user_id=?'
        if (!role_name || !user_name) {
            return res.send({ error: -2, msg: "输入的信息不可为空！" })
        }
        else {
            conn.query(sql, [role_name, user_name, time_20, time_25, res_power, res_atk, sun_power, id, user_id], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "修改角色信息成功！" })
                }
            })
        }
    }

    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})
// 通过id获取单个角色信息
router.post("/getRoleMsg", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let { id } = req.body;
        const sql = "SELECT id,role.role_name,user_name,time_20,time_25,res_power,res_atk,sun_power,role_icon,role_bg,role_res,role_depart FROM `user_role` INNER JOIN role ON user_role.role_name = role.role_name WHERE id=? AND user_id=?"
        if (!id) {
            return res.send({ error: -2, msg: "输入的信息不可为空！" })
        }
        else {
            conn.query(sql, [id, user_id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "获取角色信息成功！", data: result })
                }
            })
        }
    }

    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})
// 删除角色
router.post("/deleteRole", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let { id } = req.body;
        let sql = `DELETE FROM user_role WHERE id =? AND user_id=?`
        if (!id) {
            return res.send({ error: -2, msg: "删除的ID不可为空！" })
        }
        else {
            conn.query(sql, [id, user_id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "删除角色成功！" })
                }
            })
        }
    }

    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 获取角色加入的团队列表
router.post("/getUserTeam", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let page = req.body.page || 1;//默认值为1
        let pageSize = req.body.pageSize || 5//默认值为5;   
        let count = 0;//记录总条数
        let allPage = 0;//记录一共有几页
        let sql = "SELECT team_id,team_name,team_brief,team_founder,team_data FROM((SELECT * FROM user_team WHERE user_id=?)AS c LEFT JOIN team a ON c.team_id=a.id)"
        let sql2 = `SELECT team_id,team_name,team_brief,team_founder,team_data FROM((SELECT * FROM user_team WHERE user_id=?)AS c LEFT JOIN team a ON c.team_id=a.id) limit ?,?`
        conn.query(sql, [user_id], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (result.length > 0) {
                    count = result.length;
                    allPage = Math.ceil(count / pageSize)
                    conn.query(sql2, [user_id, (parseInt(page) - 1) * parseInt(pageSize), parseInt(pageSize)], function (err2, result2) {
                        if (err2) {
                            console.log(err2)
                        }
                        else {
                            res.send({ error: 0, msg: "获取用户团队列表成功！", data: result2, count: count, allPage: allPage })
                        }
                    })
                }
                else {
                    return res.send({ error: -2, msg: "暂无团队！" })
                }
            }
        })
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})


// 用户创建团队
router.post("/userCreateTeam", (req, res) => {
    if (req.session.login) {
        let { team_name, team_brief, team_pw, team_join } = req.body;
        let username = req.session.username;
        let user_id = req.session.userid;
        const sql1 = 'insert into `team`(id,team_name,team_brief,team_founder,team_data,team_pw,team_join,admin_id) values (0,?,?,"' + username + '",SYSDATE(),?,?,?)';
        const sql2 = 'select LAST_INSERT_ID() AS lastTd'
        const sql3 = 'insert into `user_team`(team_id,user_id) value (?,?)'
        // let sql2 = 'insert into `team`(user_name) values (' + username + ')'
        if (!team_name || !team_brief || !team_pw || !team_join) {
            return res.send({ error: -2, msg: "输入的信息不可为空！" })
        }
        else {
            conn.query(sql1, [team_name, team_brief, team_pw, team_join, user_id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    //获取创建的团队ID
                    conn.query(sql2, function (err2, result2) {
                        if (err2) {
                            console.log(err2)
                        }
                        else {
                            let teamId = result2[0].lastTd
                            //加入user_team表
                            conn.query(sql3, [team_id = teamId, user_id], function (err3) {
                                if (err3) {
                                    console.log(err3)
                                }
                                else {
                                    res.send({ error: 0, msg: "团队创建成功！" })
                                }
                            })
                        }
                    })
                }
            })
        }

    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 获取团队信息
router.post("/getTeamMsg", (req, res) => {
    if (req.session.login) {
        let { id } = req.body;
        let sql1 = `SELECT a.team_id,team_name,team_data,team_brief,team_founder,username,team_join from(user c LEFT JOIN user_team a ON c.id=a.user_id ) LEFT JOIN team b ON b.id=a.team_id WHERE team_id = ?`
        if (!id) {
            return res.send({ error: -2, msg: "团队ID不可为空！" })
        }
        else {
            conn.query(sql1, [team_id = id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    if (result.length > 0) {
                        let teamData = moment(result[0].team_data).format('YYYY-MM-DD HH:mm:ss')
                        res.send({ error: 0, data: result, member: result.length, create: teamData })
                    }
                    else {
                        return res.send({ error: -3, msg: "查找不到该团队信息！" })
                    }
                }
            })

        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})


// 获取团队成员角色信息
router.post("/getTeamUserRole", (req, res) => {
    if (req.session.login) {
        let { id } = req.body;
        let sql1 = "SELECT * from((SELECT id,user_id,role.role_name,user_name,time_20,time_25,res_power,res_atk,sun_power,role_res,role_depart,role_icon FROM `user_role` INNER JOIN role ON user_role.role_name = role.role_name)AS c LEFT JOIN user_team a ON c.user_id=a.user_id )LEFT JOIN (SELECT id,nickname,riskname,area FROM `user` )AS b ON b.id=c.user_id WHERE team_id = ?"
        // let sql1 = "SELECT * from((SELECT id,nickname,riskname,area FROM `user` )AS b INNER JOIN user_team ON b.id=user_team.user_id )LEFT JOIN (SELECT id,user_id,role.role_name,user_name,time_20,time_25,res_power,res_atk,sun_power,role_res,role_depart,role_icon FROM `user_role` INNER JOIN role ON user_role.role_name = role.role_name)AS c ON c.user_id=user_team.user_id WHERE team_id = ?"
        if (!id) {
            return res.send({ error: -2, msg: "团队ID不可为空！" })
        }
        else {
            conn.query(sql1, [team_id = id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "查询成功！", data: result })
                }
            })

        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 获取团队成员个人信息
router.post("/getTeamUserMsg", (req, res) => {
    if (req.session.login) {
        let { id } = req.body;
        let sql1 = "SELECT * from((SELECT id,nickname,riskname,area FROM `user` )AS b INNER JOIN user_team ON b.id=user_team.user_id )LEFT JOIN (SELECT user_id FROM `user_role` )AS c ON c.user_id=user_team.user_id WHERE team_id = ?"
        if (!id) {
            return res.send({ error: -2, msg: "团队ID不可为空！" })
        }
        else {
            conn.query(sql1, [team_id = id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "查询成功！", data: result })
                }
            })

        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 管理员获取团队成员角色信息
router.post("/adminGetTeamUser", (req, res) => {
    if (req.session.login) {
        let { id } = req.body;
        let username = req.session.username;
        let sql1 = "SELECT username,nickname,riskname,c.id FROM (user c LEFT JOIN user_team a ON c.id=a.user_id )LEFT JOIN team b ON b.id=a.team_id WHERE a.team_id=? AND username != ?"
        if (!id) {
            return res.send({ error: -2, msg: "团队ID不可为空！" })
        }
        else {
            conn.query(sql1, [id, username], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "查询成功！", data: result })
                }
            })

        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 团队移出成员
router.post("/deleteTeamMember", (req, res) => {
    if (req.session.login) {
        let { team_id, user_id } = req.body;
        let sql = "DELETE FROM user_team WHERE team_id=? AND user_id=?"
        if (!team_id || !user_id) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql, [team_id, user_id], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "移出成员成功！" })
                }
            })

        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 队长修改团体资料
router.post("/changeTeamMsg", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let { team_name, team_brief, team_join, team_id } = req.body;
        let sql = 'UPDATE team SET team_name=?,team_brief=?,team_join=? WHERE id = ? AND admin_id=?'
        if (!team_name || !team_brief || !team_join || !team_id) {
            return res.send({ error: -2, msg: "输入的信息不可为空！" })
        }
        else {
            conn.query(sql, [team_name, team_brief, team_join, id = team_id, admin_id = user_id], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "修改团队信息成功！" })
                }
            })
        }
    }

    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 队长修改团体密码
router.post("/changeTeamPw", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let { o_pw, n_pw, team_id } = req.body;
        let sql1 = 'SELECT id FROM team where id = ? AND team_pw = ?'
        let sql2 = 'UPDATE team SET team_pw=? WHERE id = ? AND admin_id=?'
        if (!o_pw || !n_pw || !team_id) {
            return res.send({ error: -2, msg: "输入的信息不可为空！" })
        }
        else {
            conn.query(sql1, [id = team_id, team_pw = o_pw], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    if (result.length > 0) {
                        conn.query(sql2, [team_pw = n_pw, id = team_id, admin_id = user_id], function (err) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                res.send({ error: 0, msg: "修改团队密码成功！" })
                            }
                        })
                    }
                    else {
                        return res.send({ error: -3, msg: "团队旧密码输入错误！" })
                    }

                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 查询成员是否为该团队管理员
router.post("/vefifyTeamAdmin", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let { team_id } = req.body;
        let sql = 'SELECT id,admin_id FROM team WHERE id=? AND admin_id=?'
        if (!team_id) {
            return res.send({ error: -2, msg: "输入的信息不可为空！" })
        }
        else {
            conn.query(sql, [id = team_id, admin_id = user_id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    if (result.length > 0) {
                        res.send({ error: 0, msg: "团队管理员" })
                    }
                    else {
                        return res.send({ error: -3, msg: "用户非团队管理员" })
                    }

                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 查询用户是否为该团队成员
router.post("/vefifyTeamMember", (req, res) => {
    if (req.session.login) {
        let userId = req.session.userid;
        let { teamId } = req.body;
        let sql = 'SELECT * FROM `user_team` WHERE team_id=? AND user_id = ?'
        if (!teamId) {
            return res.send({ error: -2, msg: "输入的信息不可为空！" })
        }
        else {
            conn.query(sql, [team_id = teamId, user_id = userId], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    if (result.length <= 0) {
                        return res.send({ error: -3, msg: "用户非团队成员" })
                    }
                    else {
                        res.send({ error: 0, msg: "团队成员" })
                    }

                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 成员退出团队
router.post("/memberExitTeam", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let { team_id } = req.body;
        let sql = "DELETE FROM user_team WHERE team_id=? AND user_id=?"
        if (!team_id || !user_id) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql, [team_id, user_id], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "退出团队成功！" })
                }
            })

        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 获取用户个人-角色信息分布
router.post("/getUserRoleMsg", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let sql = "SELECT id,user_id,role.role_name,user_name,role_depart,role_res FROM `user_role` INNER JOIN role ON user_role.role_name = role.role_name WHERE user_id = ?"
        conn.query(sql, [user_id], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                res.send({ error: 0, msg: "查询个人角色信息成功！", data: result })
            }
        })
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 团队搜索
router.post("/searchByKey", (req, res) => {
    if (req.session.login) {
        let { search_key } = req.body;
        let sql = $sql.User.searchTeam
        if (!search_key) {
            return res.send({ error: -2, msg: "关键字不可为空！" })
        }
        else {
            let idkey = `${search_key}%`
            let namekey = `%${search_key}%`
            conn.query(sql, [idkey, namekey], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    if (result.length > 0) {
                        res.send({ error: 0, msg: "搜索成功！", data: result })
                    }
                    else {
                        return res.send({ error: -3, msg: "没有符合要求的结果！" })
                    }

                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 成员加入团队
router.post("/memberJoinTeam", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let { team_id, team_pw } = req.body;
        let sql1 = "SELECT id FROM team WHERE id=? AND team_pw = ?"
        let sql2 = 'SELECT team_join FROM team WHERE id =?'
        let sql3 = "INSERT INTO user_team (team_id,user_id) VALUES (?,?)"
        if (!team_id || !team_pw) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql1, [id = team_id, team_pw], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    if (result.length > 0) {
                        conn.query(sql2, [team_id], function (err2, result2) {
                            if (err2) {
                                console.log(err2)
                            }
                            else {
                                if (result2[0].team_join === 1) {
                                    conn.query(sql3, [team_id, user_id], function (err3) {
                                        if (err3) {
                                            console.log(err)
                                        }
                                        else {
                                            res.send({ error: 0, msg: "加入团队成功！" })
                                        }
                                    })
                                }
                                else {
                                    return res.send({ error: -4, msg: "团队暂不接受新团员申请加入！" })
                                }

                            }
                        })
                    }
                    else {
                        return res.send({ error: -3, msg: "申请密码错误！" })
                    }
                }
            })

        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 获取团队公告
router.post("/getTeamNotice", (req, res) => {
    if (req.session.login) {
        let { team_id } = req.body;
        let sql1 = `SELECT * FROM team_notice WHERE team_id = ? AND is_top=1`
        let sql2 = `SELECT * FROM team_notice WHERE team_id = ? ORDER BY pub_date DESC`
        if (!team_id) {
            return res.send({ error: -2, msg: "获取团队ID失败！" })
        }
        else {
            conn.query(sql1, [team_id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    conn.query(sql2, [team_id], function (err2, result2) {
                        if (err2) {
                            console.log(err)
                        }
                        else {
                            if (result2.length > 0) {
                                let articles = JSON.parse(JSON.stringify(result2))
                                articles = format(articles)
                                res.send({ error: 0, msg: "获取公告成功！", data: articles, top: result })
                            }
                            else {
                                return res.send({ error: -3, msg: "暂无公告！" })
                            }

                        }
                    })

                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 团队管理员发布新公告
router.post("/AdminPublish", (req, res) => {
    if (req.session.login) {
        let { team_id, content, title } = req.body;
        let sql = "insert into team_notice(id,team_id,content,pub_date,title) values (0,?,?,SYSDATE(),?)"
        conn.query(sql, [team_id, content, title], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                res.send({ error: 0, msg: "发布公告成功！" })
            }
        })
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 团队管理员删除公告
router.post("/AdminDelPublish", (req, res) => {
    if (req.session.login) {
        let { id } = req.body;
        let sql = "DELETE FROM team_notice WHERE id =?"
        conn.query(sql, [id], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                res.send({ error: 0, msg: "删除成功！" })
            }
        })
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 团队管理员置顶公告
router.post("/AdminTopPublish", (req, res) => {
    if (req.session.login) {
        let { team_id, id } = req.body;
        let sql1 = "UPDATE team_notice SET is_top=0 WHERE team_id=?"
        let sql2 = "UPDATE team_notice SET is_top=1 WHERE team_id=? AND id=?"
        conn.query(sql1, [team_id], function (err) {
            if (err) {
                console.log(err)
            }
            else {
                conn.query(sql2, [team_id, id], function (err2) {
                    if (err2) {
                        console.log(err2)
                    }
                    else {
                        res.send({ error: 0, msg: "置顶公告成功！" })
                    }
                })
            }
        })
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 用户发布招募公告
router.post("/publishRecruit", (req, res) => {
    if (req.session.login) {
        let { add_title, add_content, area } = req.body;
        let user_id = req.session.userid;
        let sql1 = 'insert into `recruit`(id,user_id,add_date,add_title,add_content,area) values (0,?,SYSDATE(),?,?,?)'
        if (!add_title || !add_content || !area) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql1, [user_id, add_title, add_content, area], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "发布招募公告成功！" })
                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})


// 查询招募公告
router.post("/showRecruit", (req, res) => {
    if (req.session.login) {
        let page = req.body.page || 1;//默认值为1
        let pageSize = req.body.pageSize || 5//默认值为5;   
        let count = 0;//记录总条数
        let allPage = 0;//记录一共有几页
        let sql1 = 'SELECT recruit.id,user_id,add_date,add_title,add_content,recruit.area,nickname,icon FROM recruit INNER JOIN `user`ON recruit.user_id = `user`.id'
        let sql2 = 'SELECT recruit.id,user_id,add_date,add_title,add_content,recruit.area,nickname,icon FROM recruit INNER JOIN `user`ON recruit.user_id = `user`.id ORDER BY add_date DESC limit ?,? '
        conn.query(sql1, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (result.length > 0) {
                    count = result.length;
                    allPage = Math.ceil(count / pageSize)
                    conn.query(sql2, [(parseInt(page) - 1) * parseInt(pageSize), parseInt(pageSize)], function (err2, result2) {
                        if (err2) {
                            console.log(err2)
                        }
                        else {
                            let articles = JSON.parse(JSON.stringify(result2))
                            articles = format2(articles)
                            res.send({ error: 0, msg: "获取招募公告成功！", data: articles, count: count, allPage: allPage })
                        }
                    })
                }
                else {
                    return res.send({ error: -2, msg: "暂无招募信息！" })
                }
            }
        })



    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 查询我的招募公告
router.post("/showMyRecruit", (req, res) => {
    if (req.session.login) {
        let user_id = req.session.userid;
        let page = req.body.page || 1;//默认值为1
        let pageSize = req.body.pageSize || 5//默认值为5;   
        let count = 0;//记录总条数
        let allPage = 0;//记录一共有几页
        let sql1 = 'SELECT recruit.id,user_id,add_date,add_title,add_content,recruit.area,nickname,icon FROM recruit INNER JOIN `user`ON recruit.user_id = `user`.id WHERE recruit.user_id=?'
        let sql2 = 'SELECT recruit.id,user_id,add_date,add_title,add_content,recruit.area,nickname,icon FROM recruit INNER JOIN `user`ON recruit.user_id = `user`.id WHERE recruit.user_id=? ORDER BY add_date DESC limit ?,? '
        conn.query(sql1, [user_id], function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                count = result.length;
                allPage = Math.ceil(count / pageSize)
                conn.query(sql2, [user_id, (parseInt(page) - 1) * parseInt(pageSize), parseInt(pageSize)], function (err2, result2) {
                    if (err2) {
                        console.log(err2)
                    }
                    else {
                        let articles = JSON.parse(JSON.stringify(result2))
                        articles = format2(articles)
                        res.send({ error: 0, msg: "获取个人招募公告成功！", data: articles, count: count, allPage: allPage })
                    }
                })

            }
        })



    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 用户删除招募公告
router.post("/deleteRecruit", (req, res) => {
    if (req.session.login) {
        let { id } = req.body;
        let user_id = req.session.userid;
        let sql1 = 'DELETE FROM recruit WHERE id =? AND user_id=?'
        if (!id) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql1, [id, user_id], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "删除成功！" })
                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 用户修改招募公告
router.post("/changeRecruit", (req, res) => {
    if (req.session.login) {
        let { id, add_title, add_content, area } = req.body;
        let user_id = req.session.userid;
        let sql1 = 'UPDATE recruit SET add_date=SYSDATE(),add_title=?,add_content=?,area=? WHERE id = ? AND user_id=?'
        if (!id) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql1, [add_title, add_content, area, id, user_id], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "修改成功！" })
                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})
// 根据ID获取招募公告信息
router.post("/getRecruitById", (req, res) => {
    if (req.session.login) {
        let { id } = req.body;
        let user_id = req.session.userid;
        let sql1 = 'SELECT * FROM recruit WHERE id=? AND user_id=?'
        if (!id) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql1, [id, user_id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "获取成功！", data: result })
                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 用户解散团队
router.post("/deleteTeam", (req, res) => {
    if (req.session.login) {
        let { id } = req.body;
        let user_id = req.session.userid;
        let sql1 = 'DELETE FROM team WHERE id =? AND admin_id=?'
        if (!id) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql1, [id, user_id], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "删除成功！" })
                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})

// 用户发表团队留言
router.post("/memberAddNote", (req, res) => {
    if (req.session.login) {
        let { team_id, content } = req.body;
        let user_id = req.session.userid;
        let sql1 = 'insert into `team_note`(id,user_id,team_id,content,pub_date) values (0,?,?,?,SYSDATE())'
        if (!team_id || !content) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql1, [user_id, team_id, content], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "发表留言成功！" })
                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})


// 用户查看团队留言
router.post("/showNote", (req, res) => {
    if (req.session.login) {
        let { team_id } = req.body;
        let page = req.body.page || 1;//默认值为1
        let pageSize = req.body.pageSize || 10//默认值为5;   
        let count = 0;//记录总条数
        let allPage = 0;//记录一共有几页
        let sql1 = 'SELECT team_note.id,content,pub_date,icon,nickname FROM team_note INNER JOIN `user` ON team_note.user_id = `user`.id WHERE team_id=?'
        let sql2 = 'SELECT team_note.id,content,pub_date,icon,nickname FROM team_note INNER JOIN `user` ON team_note.user_id = `user`.id WHERE team_id=? ORDER BY pub_date DESC limit ?,? '
        if (!team_id) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql1, [team_id], function (err, result) {
                if (err) {
                    console.log(err)
                }
                else {
                    if (result.length > 0) {
                        count = result.length;
                        allPage = Math.ceil(count / pageSize)
                        conn.query(sql2, [team_id, (parseInt(page) - 1) * parseInt(pageSize), parseInt(pageSize)], function (err2, result2) {
                            if (err2) {
                                console.log(err2)
                            }
                            else {
                                let articles = JSON.parse(JSON.stringify(result2))
                                articles = format(articles)
                                res.send({ error: 0, msg: "获取团队留言成功！", data: articles, count: count, allPage: allPage })
                            }
                        })
                    }
                    else {
                        return res.send({ error: -3, msg: "暂无留言！" })
                    }
                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})


// 用户删除团队留言
router.post("/deleteNote", (req, res) => {
    if (req.session.login) {
        let { id } = req.body;
        let sql1 = 'DELETE FROM team_note WHERE id =?'
        if (!id) {
            return res.send({ error: -2, msg: "信息不可为空！" })
        }
        else {
            conn.query(sql1, [id], function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    res.send({ error: 0, msg: "删除成功！" })
                }
            })
        }
    }
    else {
        return res.send({ error: -1, msg: "session已过期，请重新登录！" })
    }
})
module.exports = router;