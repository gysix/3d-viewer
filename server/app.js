'use strict';

var express = require('express');
var multer = require('multer');
var router = express.Router();
var httpStatus = require('http-status');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var test = require('./test/test.js');

var app = express();

var mongo = require('mongodb');
var monk = require('monk');
// var db = monk('localhost:27017/nodetest1');

// For MongoJS

var databaseUrl = 'UserModels'; // for localhost, we will use a string. once in production, this value must be the domain name of the database as a string
var collections = ['users', 'models'];
// var collections = db.collection('collections'); //temporary filler for collections
var db = require('mongojs').connect(databaseUrl, collections);

// Make our database available to server
app.use(function (req, res, next) {
    req.db = db;
    next();
});

// ******* For testing ***********************

// these functions do not run in sequence
// test.testFind();

// test.testSave();
// test.testUpdate();
// test.testRemove();
// test.testFind();
// test.testFindAll
// test.router.get('/', function(req, res) {
//     res.json({ message: 'Router works' });
// });

// ********* Testing end *********************************

var getInstanceId = function (instance) {
    var instanceId;
    if (instance === 'testinstance') {
        instanceId = instance;
    } else {
        var parsedInstance = wix.parse(instance);
        console.log('parsedInstance: ', parsedInstance);
        if (!parsedInstance) {
            throw new Error('invalid instance');
        }
        instanceId = parsedInstance.instanceId;
    }

    return instanceId;
}

// For Users and Models collection

app.use('/models', function (req, res, next) {
    var instance = req.header('X-Wix-Instance');
    var instanceId = null;
    try {
        instanceId = getInstanceId(instance);
    } catch (e) {
        return next(error('Invalid instance', httpStatus.UNAUTHORIZED));
    }

    // req.widget
})

// User is identified by their instance ID.
// If the instance ID is already in the database, update or create compId

var findUser = function (identification, callback) {
    db.users.find({instance: identification.instance}, function (err, user) {
        if (err) { 
            console.log("Error finding user with instance: " + identification.instance, err);
            callback(err, null);
        } else if (!user) {
            // return not found
            console.log('No users with that instance ID.');
            callback(null, null)
        } else {
            // return the found user
            console.log("Found user with instance: ", identification.instance, users);
            callback(null, user)
        }
    });
}

var saveUser = function (identification, callback) {
    // If the user exists in the database, do nothing
    // findUser(identification, function (err, user) {
    db.users.find({instance: identification.instance}, function (err, user) {
        if (err) {
            // callback(err, null);
            // return;
            // res.send(err)
       } 
       if (!user) {
            // callback(null, null);
            // return;
       }

       db.users.insert( {instance: identification.instance} , function (err, user) {
            if (err) {
                console.log("Error saving user.", err);
                callback(err, null);
            } else {
                console.log("Success saving user.", users);
                callback(null, null);
            }
        });
    })
    // if (findUser(identification)) { //
    //     //
    //     console.log("This user already exists.", identification);
    // } else {
        // db.users.insert( {instance: identification.instance} , function (err, users) {
        //     if (err) {
        //         console.log("Error saving user.", err);
        //     } else {
        //         console.log("Success saving user.", users);
        //     }
        // });
    // }
}

// ************* Belowing is for testing the functions written so far **********

//takes a parameter "identification" which is an object with two key-value pairs. key 1 being instance, and key 2 being compId
var testSaveUser = function (identification) {
    db.users.save({instance: identification.instance, compId: identification.compId}, function (err, saved) {
        if ( err || !saved ) {
            console.log("User could not be saved", err);
        } else {
            console.log("User was saved", saved);
        }
    });
}

// testSaveUser({instance: "testinstance", compId: "testcompId"});

var id1 = {instance: "testinstance", compId: "testcompId"}; //test

// saveUser(id1);

// findUser(id1);

// saveUser(id1);

// findUser(id1);

// test.testRemove();



// ********** Testing over ***********************************

// var saveRelationToDatabase = function (identification, modelPath) {
//     if findUser(identification) {

//     }
// }


// For testing Nodejs basics. Can delete when successfully connected to frontend & database
var routes = require('./routes/index');
var users = require('./routes/users');

// These may not be necessary unless using res.render or res.send
// var engines = require('consolidate');
// app.set('views', __dirname + '../client/app/index.html');
// console.log('dirname', __dirname);
// app.engine('html', engines.mustache);
// app.set('view engine', 'html');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

// Lets multer know where uploaded files are located
// var MODEL_DIRECTORY = './uploads/';
var MODEL_DIRECTORY = '../models/';
app.use(multer({ dest: MODEL_DIRECTORY}));

app.post('/server/models', function (req, res) {
    console.log('body', req.body);
    console.log('files', req.files);
});


// For creating a new user (happens when a user first opens the widget)
app.post('/save', function (req, res) {

    var db = req.db;

    var instance = 'testinstance-newuser';
    var compId = 'testcompId-newuser';

    console.log('POST request info: ', req.body); // currently returns { compId: [UNKNOWN]} if not used in the Wix editor

    db.users.save({ instance: instance, compId: compId }, function (err, saved) {
        if (err || !saved) {
            res.json({'Error saving new user: ': err});
        } else {
            res.json(saved);
        }
    });

});


// For updating an existing user, if they previously did not have a model, it will set it (this functionality not written yet)
app.put('/save', function (req, res) {

    var db = req.db;

    var oldinstance = 'testinstance-newuser';
    var oldcompId = 'testcompId-newuser';

    var newinstance = 'testinstance-PUT';
    var newcompId = 'testcompId-PUT';

    var actualinstance = req.body.instance;
    var actualcompId = req.body.compId;

    console.log('PUT request info: ', req.body); // currently returns { compId: [UNKNOWN]} if not used in the Wix editor

    db.users.update({ instance: oldinstance, compId: oldcompId }, {$set: { instance: actualinstance, compId: actualcompId }}, function (err, saved) {
        if (err || !saved) {
            res.json({'Error saving new settings on old user: ': err});
        } else {
            res.json(saved);
        }
    });

});

test.testFindAll();

// Make our db accessible to our router
// app.use(function(req, res, next) {
//     req.db = db;
//     next();
// });

// app.use('/', routes); //delete
// app.use('/users', users); //delete

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// Development Settings
if (app.get('env') === 'development') {
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));

    // Development error handling
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json('error', {
            message: err.message,
            error: err
        });
    });
}

// Production Settings
if (app.get('env') === 'production') {
    // Serves from a minified/compiled directory for optimized speed
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Production error handling. No stack traces to users
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json('error', {
            message: err.message,
            error: {}
        });
    });
}


module.exports = app;

