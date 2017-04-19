var db = require('../config');

var User = db.mongoose.model('User', db.UserSchema);

module.exports = User;
