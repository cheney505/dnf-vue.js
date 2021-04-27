const models = require('../db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../sqlMap');
const e = require('express');
// 连接数据库
const conn = mysql.createConnection(models.mysql);

module.exports = router;