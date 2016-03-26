// Database API (MongoDB Client)

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

//Local database variable
var db_petme;

// Database Connection
var url = 'mongodb://localhost:5400/petme_db';

MongoClient.connect(url, function(err, db) {
    db_petme = db;
    console.log("Loaded database to local variable.");

    assert.equal(null, err);
    console.log("Connected correctly to server.");
});

exports.getDatabase = function() {
    return db_petme;
};


var getAdoptionPosts_impl1 = function(db, callback) {
    db.collection('adoptionPosts').find().toArray(function(err, documents) {
        callback(documents);
    });
}

var getAdoptionPosts_impl2 = function(db, query, callback) {
    db.collection('adoptionPosts').find(query).toArray(function(err, documents) {
        callback(documents);
    });
}

exports.getAdoptionPosts = function(db, callback, query) {
    if(arguments.length == 2) {
        return getAdoptionPosts_impl1(db, callback);
    } else {
        return getAdoptionPosts_impl2(db, query, callback);
    }
}

var getEvents_impl1 = function(db, callback) {
    db.collection('events').find().toArray(function(err, documents) {
        callback(documents);
    });
}

var getEvents_impl2 = function(db, query, callback) {
    db.collection('events').find(query).toArray(function(err, documents) {
        callback(documents);
    });
}

exports.getEvents = function(db, query, callback) {
    if(arguments.length == 2) {
        return getEvents_impl1(db, callback);
    } else {
        return getEvents_impl2(db, query, callback);
    }
}

exports.getPosts = function(db, callback) {
    db.collection('posts').find().toArray(function(err, documents) {
        callback(documents);
    });
}

exports.getPostByID = function(db, id, callback) {
    db.collection('posts').find({ _id: id }).toArray(function(err, documents) {
        var element = documents[0];
        callback(element);
    });
}

exports.getUserByID = function(db, id, callback) {
    db.collection('users').find({ _id: id }).toArray(function(err, documents) {
        var element = documents[0];
        callback(element);
    });
}

exports.getCommentByID = function(db, id, callback) {
    db.collection('comments').find({ _id: id }).toArray(function(err, documents) {
        var element = documents[0];
        callback(element);
    });
}