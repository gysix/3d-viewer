'use strict';
// This file is for familiarizing with Node.js + MongoJS
// Code written here is not guaranteed to be correct

var express = require('express');
// var router = express.Router();

var databaseUrl = 'UserModels'; // for localhost, we will use a string. once in production, this value must be the domain name of the database as a string
var collections = ['users', 'models'];
// var collections = db.collection('collections'); //temporary filler for collections
var db = require('mongojs').connect(databaseUrl, collections);


module.exports = {

    testFind : function () {
        db.users.find({compId: "1234"}, function (err, users) {
            if (err || !users.length) {
                console.log("No user with compId 1234 found.", err);
            } else {
                users.forEach( function (matchedUser) {
                    console.log(matchedUser);
                });
            }
        });
    },

    testSave : function () {
        db.users.save({email: "testguy@test.com", password: "testpassword", compId: "1234"}, function (err, saved) {
            if ( err || !saved ) {
                console.log("User could not be saved", err);
            } else {
                console.log("User was saved");
            }
        });
    },

    testUpdate : function () {
        db.users.update({ email: "testguy@test.com"}, {$set: {password: "newtestpassword"}}, function (err, updated) {
            if ( err || !updated ) {
                console.log("User could not be updated", err);
            } else {
                console.log("User was updated");
            }
        });
    },

    testRemove : function () {
        db.users.remove();
        console.log('All users removed.');
    },

    testFindAll : function () {
        db.users.find( function (err, users) {
            if (err || !users.length) {
                console.log("No users could be found.", err);
            } else {
                users.forEach( function (matchedUser) {
                    console.log(matchedUser);
                });
            }
        });
    }

    // router: router

}