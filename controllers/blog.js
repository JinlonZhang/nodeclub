var multiline = require('multiline');
// blog
exports.blog = function (req, res, next) {
    res.render('blog/index', {
        pageTitle: '博客'
    });
};