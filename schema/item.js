var db = require('../ext/db'),
    schemaItem = new db.Schema({
        name: {
            type: String,
            require: true,
            unique: true
        },
        price: {
            type: Number,
            require: true
        },
        description: {
            type: String,
            require: true
        }
    });

module.exports.Item = db.model('Item', schemaItem);