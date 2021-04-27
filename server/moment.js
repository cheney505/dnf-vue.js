const moment = require('moment')

function format(articles){
    for(let article of articles){
        article.pub_date = moment(article.pub_date).format('YYYY-MM-DD HH:mm:ss')
    }
    return articles
}
function format2(articles){
    for(let article of articles){
        article.add_date = moment(article.add_date).format('YYYY-MM-DD HH:mm:ss')
    }
    return articles
}

module.exports = {format,format2}