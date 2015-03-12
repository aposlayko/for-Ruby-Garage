var db = require('../ext/db'),
    crypto = require('crypto'),
    schemaUser = new db.Schema({
        email: {
            type: String,
            require: true,
            unique: true
        },
        name: {
            type: String
        },
        last_name: {
            type: String
        },
        phone: {
            type: String
        },
        hash: {
            type: String,
            require: true
        },
        salt: {
            type: String,
            require: true
        },
        iteration: {
            type: Number,
            require: true
        },
        created: {
            type: Date,
            default: Date.now()
        }
    });

schemaUser.virtual('password')
    .set(function (data) {
        console.log(data);
        this.salt = String(Math.random());
        this.iteration = parseInt(Math.random()*10+1);
        this.hash = this.getHash(data);
    })
    .get(function () {
        return this.hash;
    });

schemaUser.methods.getHash = function (password) {
    var c = crypto.createHmac('sha1', this.salt);
    for (var i=0; i < this.iteration; i++) {
        c = c.update(password); //обновить пароль с заданной ранее солью
    }
    return c.digest('hex'); //digest - в каком виде представлять
};

schemaUser.methods.checkPassword = function (data) {
    return this.getHash(data) === this.hash;
};

module.exports.User = db.model('User', schemaUser);