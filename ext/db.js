var db = require('mongoose');

db.connect('mongodb://localhost/taskManager');
module.exports = db;