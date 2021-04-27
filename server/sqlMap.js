// sqlMap.js  sql语句
const sqlMap = {
  User: {
    add: 'insert into `user`(id,username,password,nickname,riskname,server,area,res_data,email) values (0,?,?,?,?,?,?,SYSDATE(),?)',
    login:'SELECT * FROM `user` WHERE username=? AND `password`=?',
    changemsg:'UPDATE `user` SET nickname=?,riskname=?,server=?,area=? WHERE id = ?',
    changemsg2:'UPDATE `user` SET nickname=?,riskname=?,server=?,area=?,icon=? WHERE id = ?',
    getMsg:'SELECT username,icon,nickname,riskname,server,area,res_data FROM `user` WHERE id=?',
    changepw:'UPDATE `user` SET password=? WHERE id = ?',
    checkpw:'SELECT username FROM `user` where id = ? AND password = ?',
    getEmail:'SELECT email from `user` where username = ?',
    resetPw:'UPDATE `user` SET password=? WHERE username = ?',
    searchTeam:'select id,team_name,team_brief,team_founder,team_data from team where id=? or team_name like ? AND team_join=1',
  }
}
 
module.exports = sqlMap