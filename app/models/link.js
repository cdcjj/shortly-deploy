var db = require('../config');

var Link = db.mongoose.model('Link', db.UrlSchema);

module.exports = Link;
