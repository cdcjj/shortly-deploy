// This is a comment
// This is another comment
// third comment
// testing deploy --00
var app = require('./server-config.js');

var port = process.env.PORT || 4568;

app.listen(port);

console.log('Server now listening on port ' + port);
