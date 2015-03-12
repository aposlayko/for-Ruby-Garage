var express = require('express');
var User = require('../schema/user').User;
var Item = require('../schema/item').Item;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('pages/index', { title: 'Express' });
});

router.post('/saveSession', function (req, res) {
    var minute = 60000;

    //console.log(req.body);

    if(req.body.id && req.body.email) {
        req.session.cookie.maxAge = minute * 30;
        req.session.user_id = req.body.id;
        req.session.email = req.body.email;

        res.json({success: true});
    } else {
        res.json({success: false, error: 'user_id was not send to server'});
    }
});

router.get('/checkSession', function (req, res) {
    if(req.session.user_id && req.session.email) {
        res.json({success: true, user_id: req.session.user_id, email: req.session.email});
    } else {
        res.json({success: false, error: 'There is no session'});
    }
});

router.get('/sessionDestroy', function (req, res) {
    if(req.session) {
        req.session.destroy(function(err) {});
    }
});

router.post('/checkUser', function(req, res) {
    var query = User.find({email: req.body.email});

    query.exec(function (err, docs) {
        if (!err) {
            if(docs.length === 0) {
                console.log('Wrong email');
                res.json({success: false, error: 'Wrong email'});
            } else if (!docs[0].checkPassword(req.body.password)){
                res.json({success: false, error: 'Wrong password'});
                console.log('Wrong password');
            } else {
                res.json({success: true, error: '', id: docs[0]._id, email: docs[0].email});
                //req.session.destroy(function(err) {});
            }
        } else {
            console.log(err);
        }

    });

});

router.post('/authUser', function(req, res) {
    var newUser = new User ({
        email: req.body.email,
        password: req.body.password
    });

    newUser.save(function (err, user) {
        if(!err) {
            User.find({email: newUser.email}, function (err, users) {
                if (!err) {
                    res.json({ success: true, user_id: users[0]._id });
                }
            });

        } else { //mogoose save errors
            if (err.code == 11000) {
                res.json({ success: false,
                    error: 'User with this email already exists'});
            } else {
                res.json({ success: false,
                    error: err});
            }
        }
    });
});

router.post('/edit-profile', function (req, res) {
    //console.log(req.body);
    User.findById(req.body.id, function (err, user) {
        if (!err) {
            //console.log(user);
            res.json({ success: true, user: user });
        } else {
            res.json(err);
        }
    });

});

router.post('/saveProfile', function (req, res) {
    //console.log(req.body);
    User.findByIdAndUpdate(req.body._id, req.body, null, function (err, doc) {
        if (!err) {
            res.json({ success: true });
        } else {
            res.json(err);
        }
    });
});

router.post('/deleteProfile', function (req, res) {
    //console.log(req.body);
    User.findByIdAndRemove(req.body.id, function (err) {
        if (!err) {
            if (req.session) {
                req.session.destroy(function(err) {});
            }

            res.json({ success: true });
        } else {
            res.json(err);
        }
    });
});

router.post('/changePass', function (req, res) {
    User.findById(req.body.id, function (err, user) {
        if (!err) {
            //console.log(req.body.pass);
            user.set('password', req.body.pass);
            user.save(function (err, user) {
                if(!err) {
                    res.json({ success: true });
                } else {
                    res.json(err);
                }
            });
        } else {
            res.json(err);
        }
    });
});

router.post('/createItem', function (req, res) {
    var newItem = new Item ({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    });

    newItem.save(function (err, item) {
        if(!err) {
            res.json({ success: true });
        } else { //mogoose save errors
            if (err.code == 11000) {
                res.json({ success: false,
                    error: 'Item with this name already exists'});
            } else {
                res.json({ success: false,
                    error: err});
            }
        }
    });
});

router.get('/getItems/:skip/:count', function (req, res) {

    var query = Item.find({}, {}, {skip: +req.param('skip'), limit: +req.param('count')}),
        i = +req.param('skip'),
        j = 0;

    query.exec(function (err, items) {
        var result = [];
        if(!err) {
            for (j; j < items.length; j++) {
                result.push({
                    id: items[j]._id,
                    number: ++i,
                    name: items[j].name,
                    price: items[j].price,
                    description: items[j].description
                });
            }

            res.json({ success: true, items: result });
        } else {
            res.json({ success: false,
                error: err});
        }
    });
});

router.get('/getItemsCount', function (req, res) {
    Item.count(function (err, count) {
        //console.log(count);
        if(!err) {
            res.json({ success: true, count: count });
        } else {
            res.json({ success: false,
                error: err});
        }
    });
});

router.get('/getItem/:itemId', function (req, res) {
    Item.findById(req.params.itemId, function (err, item) {
        if (!err) {
            res.json({ success: true, item: item });
        } else {
            res.json(err);
        }
    });
});

router.post('/saveItem', function (req, res) {
    var sendedItem = req.body,
        editeditem = {};

    Item.findByIdAndUpdate(sendedItem._id, sendedItem, null, function (err, item) {
        if (!err) {
            res.json({ success: true });
        } else {
            res.json(err);
        }
    });
});

router.post('/deleteItems', function (req, res) {
    var itemsId = req.body.items,
        i = 0;

    for (i; i < itemsId.length; i++) {
        Item.findByIdAndRemove(itemsId[i], function (err) {
            if (!err) console.log('Item '+ itemsId[i] +' deleted');
            else console.log('Error in deleting '+ itemsId[i] +' item');
        });
    }

    res.json({ success: true });
});

module.exports = router;