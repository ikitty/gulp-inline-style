var cheerio = require('cheerio')
    ,path = require('path')
    ,fs = require('fs')
    ,url = require('url')
    ,es = require('event-stream')
    ,iconv = require('iconv-lite')
    ;

module.exports = function(cssPath) {
    var go = function(file, callback) {
        //try to decode
        var html = iconv.decode(file.contents, 'utf-8');

        if(html.indexOf('�') > -1){
            html = iconv.decode(file.contents, 'gbk');
            htmlUtf8 = iconv.encode(html, 'utf-8');
        }else {
            htmlUtf8 = html ;
        }

        var dom = cheerio.load(htmlUtf8, { decodeEntities: false });
        injectStyles(dom);
        file.contents = iconv.encode(dom.html(), 'gbk');
        return callback(null, file);
    };
    return es.map(go);
  
    //maybe need replace str
    function injectStyles(dom) {
        dom('link').each(function(idx, el) {
            el = dom(el)
            var href = el.attr('href')
            if (el.attr('rel') === 'stylesheet' && isLocal(href)) {
                var dir = path.dirname(href)
                var file = path.join(cssPath, href)
                var style = fs.readFileSync(file).toString();
                var inlinedTag = "<style>\n" + style + '\n</style>'
                el.replaceWith(inlinedTag)
            }
        })
    }

    function isLocal(href) {
        return href && !url.parse(href).hostname;
    }
}
