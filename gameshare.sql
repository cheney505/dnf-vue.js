/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : gameshare2

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2021-03-29 17:02:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for recruit
-- ----------------------------
DROP TABLE IF EXISTS `recruit`;
CREATE TABLE `recruit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `add_date` datetime NOT NULL,
  `add_title` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `add_content` text COLLATE utf8_unicode_ci,
  `area` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `recruit_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of recruit
-- ----------------------------
INSERT INTO `recruit` VALUES ('2', '3', '2021-02-04 00:39:29', '一条测试公告', '测试段落1<br/>测试段落2<br/>测试段落33333333<br/>测试段落444444', '跨一');
INSERT INTO `recruit` VALUES ('3', '3', '2021-02-03 01:46:19', '测试公告2', '测试~<br/>测试~', '跨一');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  `role_icon` varchar(255) NOT NULL,
  `role_bg` varchar(255) NOT NULL DEFAULT 'http://localhost:2333/img/roleBg/魔皇.png',
  `role_res` varchar(255) NOT NULL,
  `role_depart` varchar(255) NOT NULL,
  PRIMARY KEY (`role_id`),
  KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', '不知火', '/img/face/暗夜使者/不知火.png', '/img/roleBg/毕方之炎.png', '纯C', '暗夜使者');
INSERT INTO `role` VALUES ('2', '亡魂主宰', '/img/face/暗夜使者/亡魂主宰.png', '/img/roleBg/灵魂收割者.png', '纯C', '暗夜使者');
INSERT INTO `role` VALUES ('3', '幽冥', '/img/face/暗夜使者/幽冥.png', '/img/roleBg/梦魇.png', '辅C', '暗夜使者');
INSERT INTO `role` VALUES ('4', '月影星劫', '/img/face/暗夜使者/月影星劫.png', '/img/roleBg/银月.png', '纯C', '暗夜使者');
INSERT INTO `role` VALUES ('5', '暗街之王', '/img/face/格斗家-男/暗街之王.png', '/img/roleBg/千手罗汉.png', '辅C', '格斗家(男)');
INSERT INTO `role` VALUES ('6', '极武皇', '/img/face/格斗家-男/极武皇.png', '/img/roleBg/武极.png', '纯C', '格斗家(男)');
INSERT INTO `role` VALUES ('7', '念皇', '/img/face/格斗家-男/念皇.png', '/img/roleBg/狂虎帝.png', '纯C', '格斗家(男)');
INSERT INTO `role` VALUES ('8', '宗师', '/img/face/格斗家-男/宗师.png', '/img/roleBg/风林火山.png', '辅C', '格斗家(男)');
INSERT INTO `role` VALUES ('9', '暴风女皇', '/img/face/格斗家-女/暴风女皇.png', '/img/roleBg/暴风眼.png', '辅C', '格斗家(女)');
INSERT INTO `role` VALUES ('10', '毒神绝', '/img/face/格斗家-女/毒神绝.png', '/img/roleBg/毒王.png', '辅C', '格斗家(女)');
INSERT INTO `role` VALUES ('11', '极武圣', '/img/face/格斗家-女/极武圣.png', '/img/roleBg/武神', '纯C', '格斗家(女)');
INSERT INTO `role` VALUES ('12', '念帝', '/img/face/格斗家-女/念帝.png', '/img/roleBg/百花缭乱.png', '辅C', '格斗家(女)');
INSERT INTO `role` VALUES ('13', '帝血弑天', '/img/face/鬼剑士-男/帝血弑天.png', '/img/roleBg/狱血魔神.png', '纯C', '鬼剑士(男)');
INSERT INTO `role` VALUES ('14', '黑暗君主', '/img/face/鬼剑士-男/黑暗君主.png', '/img/roleBg/弑魂.png', '辅C', '鬼剑士(男)');
INSERT INTO `role` VALUES ('15', '剑神', '/img/face/鬼剑士-男/剑神.png', '/img/roleBg/剑圣.png', '纯C', '鬼剑士(男)');
INSERT INTO `role` VALUES ('16', '天帝', '/img/face/鬼剑士-男/天帝.png', '/img/roleBg/大暗黑天.png', '辅C', '鬼剑士(男)');
INSERT INTO `role` VALUES ('17', '夜见罗刹', '/img/face/鬼剑士-男/夜见罗刹.png', '/img/roleBg/夜刀神.png', '纯C', '鬼剑士(男)');
INSERT INTO `role` VALUES ('18', '暗帝', '/img/face/鬼剑士-女/暗帝.png', '/img/roleBg/暗帝.png', '辅C', '鬼剑士(女)');
INSERT INTO `role` VALUES ('19', '剑帝', '/img/face/鬼剑士-女/剑帝.png', '/img/roleBg/剑豪.png', '纯C', '鬼剑士(女)');
INSERT INTO `role` VALUES ('20', '剑魔', '/img/face/鬼剑士-女/剑魔.png', '/img/roleBg/剑魔.png', '纯C', '鬼剑士(女)');
INSERT INTO `role` VALUES ('21', '剑宗', '/img/face/鬼剑士-女/剑宗.png', '/img/roleBg/剑宗.png', '纯C', '鬼剑士(女)');
INSERT INTO `role` VALUES ('22', '刹那永恒', '/img/face/魔法师-男/刹那永恒.png', '/img/roleBg/冰冻之心.png', '纯C', '魔法师(男)');
INSERT INTO `role` VALUES ('23', '风神', '/img/face/魔法师-男/风神.png', '/img/roleBg/御风者.png', '辅C', '魔法师(男)');
INSERT INTO `role` VALUES ('24', '混沌行者', '/img/face/魔法师-男/混沌行者.png', '/img/roleBg/虚空行者.png', '纯C', '魔法师(男)');
INSERT INTO `role` VALUES ('25', '血狱君主', '/img/face/魔法师-男/血狱君主.png', '/img/roleBg/血狱伯爵.png', '辅C', '魔法师(男)');
INSERT INTO `role` VALUES ('26', '湮灭之瞳', '/img/face/魔法师-男/湮灭之瞳.png', '/img/roleBg/魔皇.png', '纯C', '魔法师(男)');
INSERT INTO `role` VALUES ('27', '古灵精怪', '/img/face/魔法师-女/古灵精怪.png', '/img/roleBg/魔术师.png', '辅C', '魔法师(女)');
INSERT INTO `role` VALUES ('28', '冥月女神', '/img/face/魔法师-女/冥月女神.png', '/img/roleBg/暗黑少女.png', '奶', '魔法师(女)');
INSERT INTO `role` VALUES ('29', '伊斯塔战灵', '/img/face/魔法师-女/伊斯塔战灵.png', '/img/roleBg/贝亚娜斗神.png', '纯C', '魔法师(女)');
INSERT INTO `role` VALUES ('30', '元素圣灵', '/img/face/魔法师-女/元素圣灵.png', '/img/roleBg/大魔导师.png', '纯C', '魔法师(女)');
INSERT INTO `role` VALUES ('31', '月蚀', '/img/face/魔法师-女/月蚀.png', '/img/roleBg/月之女皇.png', '辅C', '魔法师(女)');
INSERT INTO `role` VALUES ('32', '不灭战神', '/img/face/魔枪士/不灭战神.png', '/img/roleBg/战魂.png', '纯C', '魔枪士');
INSERT INTO `role` VALUES ('33', '圣武枪魂', '/img/face/魔枪士/圣武枪魂.png', '/img/roleBg/无双之魂.png', '纯C', '魔枪士');
INSERT INTO `role` VALUES ('34', '屠戮之魂', '/img/face/魔枪士/屠戮之魂.png', '/img/roleBg/征服之魂.png', '纯C', '魔枪士');
INSERT INTO `role` VALUES ('35', '幽影夜神', '/img/face/魔枪士/幽影夜神.png', '/img/roleBg/狂怒恶鬼.png', '辅C', '魔枪士');
INSERT INTO `role` VALUES ('36', '巅峰狂徒', '/img/face/枪剑士/巅峰狂徒.png', '/img/roleBg/战场王牌.png', '辅C', '枪剑士');
INSERT INTO `role` VALUES ('37', '弑心镇魂者', '/img/face/枪剑士/弑心镇魂者.png', '/img/roleBg/绝命谍影.png', '纯C', '枪剑士');
INSERT INTO `role` VALUES ('38', '铁血教父', '/img/face/枪剑士/铁血教父.png', '/img/roleBg/统御者.png', '辅C', '枪剑士');
INSERT INTO `role` VALUES ('39', '未来开拓者', '/img/face/枪剑士/未来开拓者.png', '/img/roleBg/源力掌控者.png', '辅C', '枪剑士');
INSERT INTO `role` VALUES ('40', '毁灭者', '/img/face/神枪手-男/毁灭者.png', '/img/roleBg/狂暴者.png', '纯C', '神枪手(男)');
INSERT INTO `role` VALUES ('41', '机械元首', '/img/face/神枪手-男/机械元首.png', '/img/roleBg/机械战神.png', '纯C', '神枪手(男)');
INSERT INTO `role` VALUES ('42', '掠天之翼', '/img/face/神枪手-男/掠天之翼.png', '/img/roleBg/枪神.png', '纯C', '神枪手(男)');
INSERT INTO `role` VALUES ('43', '战场统治者', '/img/face/神枪手-男/战场统治者.png', '/img/roleBg/大将军.png', '纯C', '神枪手(男)');
INSERT INTO `role` VALUES ('44', '绯红玫瑰', '/img/face/神枪手-女/绯红玫瑰.png', '/img/roleBg/沾血蔷薇.png', '纯C', '神枪手(女)');
INSERT INTO `role` VALUES ('45', '风暴骑兵', '/img/face/神枪手-女/风暴骑兵.png', '/img/roleBg/重炮掌握者.png', '纯C', '神枪手(女)');
INSERT INTO `role` VALUES ('46', '芙蕾雅', '/img/face/神枪手-女/芙蕾雅.png', '/img/roleBg/战争女神.png', '纯C', '神枪手(女)');
INSERT INTO `role` VALUES ('47', '机械之灵', '/img/face/神枪手-女/机械之灵.png', '/img/roleBg/机械之心.png', '纯C', '神枪手(女)');
INSERT INTO `role` VALUES ('48', '神思者', '/img/face/圣职者-男/神思者.png', '/img/roleBg/天启者.png', '奶', '圣职者(男)');
INSERT INTO `role` VALUES ('49', '永生者', '/img/face/圣职者-男/永生者.png', '/img/roleBg/末日审判者.png', '纯C', '圣职者(男)');
INSERT INTO `role` VALUES ('50', '真龙星君', '/img/face/圣职者-男/真龙星君.png', '/img/roleBg/龙斗士.png', '辅C', '圣职者(男)');
INSERT INTO `role` VALUES ('51', '正义仲裁者', '/img/face/圣职者-男/正义仲裁者.png', '/img/roleBg/神之手.png', '纯C', '圣职者(男)');
INSERT INTO `role` VALUES ('52', '炽天使', '/img/face/圣职者-女/炽天使.png', '/img/roleBg/福音传道者.png', '奶', '圣职者(女)');
INSERT INTO `role` VALUES ('53', '救世主', '/img/face/圣职者-女/救世主.png', '/img/roleBg/断罪者.png', '纯C', '圣职者(女)');
INSERT INTO `role` VALUES ('54', '神龙天女', '/img/face/圣职者-女/神龙天女.png', '/img/roleBg/神女.png', '辅C', '圣职者(女)');
INSERT INTO `role` VALUES ('55', '炎狱裁决者', '/img/face/圣职者-女/炎狱裁决者.png', '/img/roleBg/神焰处刑官.png', '辅C', '圣职者(女)');
INSERT INTO `role` VALUES ('56', '大地女神', '/img/face/守护者/大地女神.png', '/img/roleBg/星辰之光.png', '纯C', '守护者');
INSERT INTO `role` VALUES ('57', '黑曜神', '/img/face/守护者/黑曜神.png', '/img/roleBg/黑魔后.png', '纯C', '守护者');
INSERT INTO `role` VALUES ('58', '龙神', '/img/face/守护者/龙神.png', '/img/roleBg/龙皇.png', '纯C', '守护者');
INSERT INTO `role` VALUES ('59', '破晓女神', '/img/face/守护者/破晓女神.png', '/img/roleBg/曙光.png', '辅C', '守护者');
INSERT INTO `role` VALUES ('60', '缔造者', '/img/face/外传职业/缔造者.png', '/img/roleBg/缔造者.png', '辅C', '外传职业');
INSERT INTO `role` VALUES ('61', '黑暗武士', '/img/face/外传职业/黑暗武士.png', '/img/roleBg/黑暗武士.png', '纯C', '外传职业');

-- ----------------------------
-- Table structure for team
-- ----------------------------
DROP TABLE IF EXISTS `team`;
CREATE TABLE `team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `team_name` varchar(255) NOT NULL,
  `team_brief` varchar(255) DEFAULT NULL,
  `team_founder` varchar(255) NOT NULL,
  `team_data` datetime NOT NULL,
  `team_pw` varchar(255) NOT NULL,
  `team_join` int(2) NOT NULL,
  `admin_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `team_founder` (`team_founder`),
  CONSTRAINT `team_ibfk_1` FOREIGN KEY (`team_founder`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of team
-- ----------------------------
INSERT INTO `team` VALUES ('1', '猪圈', '最近有人偷猪，我怕你们出事', 'cheney505', '2020-12-31 02:24:06', '123456', '1', '3');
INSERT INTO `team` VALUES ('2', '123', '123', '1234', '2021-03-14 13:27:45', '84497231', '0', '22');

-- ----------------------------
-- Table structure for team_note
-- ----------------------------
DROP TABLE IF EXISTS `team_note`;
CREATE TABLE `team_note` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `team_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pub_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `team_note_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `team_note_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of team_note
-- ----------------------------
INSERT INTO `team_note` VALUES ('3', '1', '3', '111', '2021-02-09 23:22:50');
INSERT INTO `team_note` VALUES ('4', '1', '3', '222', '2021-02-09 23:23:07');
INSERT INTO `team_note` VALUES ('5', '2', '22', '123', '2021-03-14 13:28:15');
INSERT INTO `team_note` VALUES ('6', '1', '22', '123', '2021-03-14 13:31:09');

-- ----------------------------
-- Table structure for team_notice
-- ----------------------------
DROP TABLE IF EXISTS `team_notice`;
CREATE TABLE `team_notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `team_id` int(11) NOT NULL,
  `content` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `pub_date` datetime DEFAULT NULL,
  `title` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `is_top` int(2) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `team_notice_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of team_notice
-- ----------------------------
INSERT INTO `team_notice` VALUES ('2', '1', '希望人出：天堂之翼、浪漫旋律华尔兹、大祭司的神启礼服、英明循环之生命', '2021-01-26 22:25:37', '注意', '1');
INSERT INTO `team_notice` VALUES ('4', '1', '一条测试发布信息！', '2021-01-27 00:25:17', '测试发布', '0');
INSERT INTO `team_notice` VALUES ('5', '2', '123', '2021-03-14 13:28:21', '123', '1');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT '/img/userImg/default.png',
  `nickname` varchar(30) NOT NULL,
  `riskname` varchar(30) NOT NULL,
  `res_data` datetime DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `server` varchar(255) NOT NULL,
  `area` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('3', 'cheney505', '4ba049adc4a6e9f25c4742f04c1591d4a50af106646635a0734d28e43fdfe3e8', '/img/userImg/1611079761533.jpeg', '蕴渣', '天天开心', '2020-12-31 02:24:06', '2390751614@qq.com', '跨一', '广东3区');
INSERT INTO `user` VALUES ('20', 'LZMC', '4ba049adc4a6e9f25c4742f04c1591d4a50af106646635a0734d28e43fdfe3e8', '/img/userImg/default.png', '11', '11', '2021-03-02 22:45:30', '2390751614@qq.com', '跨二', '湖北3区');
INSERT INTO `user` VALUES ('21', 'ceshi', '4ba049adc4a6e9f25c4742f04c1591d4a50af106646635a0734d28e43fdfe3e8', '/img/userImg/default.png', '33', '33', '2021-03-02 22:46:44', '2390751614@qq.com', '跨一', '广东3区');
INSERT INTO `user` VALUES ('22', '1234', '4ba049adc4a6e9f25c4742f04c1591d4a50af106646635a0734d28e43fdfe3e8', '/img/userImg/1615699151997.jpeg', '测试123', '测试冒险团', '2021-03-14 13:11:45', '2390751614@qq.com', '跨一', '广东5区');

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `time_20` int(10) DEFAULT NULL,
  `time_25` int(10) DEFAULT NULL,
  `res_power` int(10) DEFAULT NULL,
  `res_atk` int(10) DEFAULT NULL,
  `sun_power` int(10) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `role_name` (`role_name`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`role_name`) REFERENCES `role` (`role_name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES ('3', '风神', '踏风丶', '2222', '4562', '131231', '23352', '5342', '3');
INSERT INTO `user_role` VALUES ('4', '冥月女神', '下次咩你', '0', '0', '23222', '2302', '37918', '3');
INSERT INTO `user_role` VALUES ('5', '湮灭之瞳', '蛋卷寿司', '1111', '1111', '1111', '1111', '1111', '3');
INSERT INTO `user_role` VALUES ('6', '血狱君主', '人间纵我', '2222', '2222', '2222', '2222', '2222', '3');
INSERT INTO `user_role` VALUES ('7', '混沌行者', '梅坞寻茶', '3333', '3333', '0', '0', '0', '3');
INSERT INTO `user_role` VALUES ('8', '刹那永恒', '终不言', '1232', '2312', '0', '0', '0', '3');
INSERT INTO `user_role` VALUES ('9', '古灵精怪', '雁北向', '2333', '2333', '0', '0', '0', '3');
INSERT INTO `user_role` VALUES ('32', '炽天使', '汪叽', '0', '0', '24352', '2375', '35736', '3');
INSERT INTO `user_role` VALUES ('39', '不知火', '11', '0', '0', '0', '0', '0', '20');
INSERT INTO `user_role` VALUES ('40', '极武圣', '22', '2333', '0', '0', '0', '0', '20');
INSERT INTO `user_role` VALUES ('41', '神思者', '测试1号', '0', '0', '30000', '3000', '30000', '3');
INSERT INTO `user_role` VALUES ('42', '炽天使', 'ceshi22', '0', '0', '26000', '2500', '28000', '21');
INSERT INTO `user_role` VALUES ('43', '冥月女神', '测试', '0', '0', '27700', '3000', '27000', '21');
INSERT INTO `user_role` VALUES ('44', '冥月女神', '123', '0', '0', '1234', '1234', '12345', '22');

-- ----------------------------
-- Table structure for user_team
-- ----------------------------
DROP TABLE IF EXISTS `user_team`;
CREATE TABLE `user_team` (
  `team_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  KEY `team_id` (`team_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_team_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_team_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_team
-- ----------------------------
INSERT INTO `user_team` VALUES ('1', '3');
INSERT INTO `user_team` VALUES ('1', '20');
INSERT INTO `user_team` VALUES ('1', '21');
INSERT INTO `user_team` VALUES ('2', '22');
INSERT INTO `user_team` VALUES ('1', '22');
