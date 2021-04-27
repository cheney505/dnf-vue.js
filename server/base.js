const crypto = require('crypto');

const setCrypto = (info)=>{
    return crypto.createHmac('sha256','@!##w$@z#@y^@')
    .update(info)
    .digest('hex')//显示格式
}
module.exports = {setCrypto}