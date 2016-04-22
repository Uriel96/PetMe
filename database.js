// Database API (MongoDB Client)

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');

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

//Function to generate a new hash for a password
var generateHash = function (plainPassword) {
    var hashedPassword = bcrypt.hashSync(plainPassword, bcrypt.genSaltSync(9));
    return hashedPassword;
};
//Function to check if a hashed password matches a plain password
var validPassword = function (plainPassword, hashedPassword) {
    console.log(plainPassword);
    console.log(hashedPassword);
    return (plainPassword == hashedPassword);
    //return bcrypt.compareSync(plainPassword, hashedPassword);
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
    db.collection('events').find(query).toArray(function (err, documents) {
        callback(documents);
    });
}

exports.getEvents = function(db, callback, query) {
    if(arguments.length == 2) {
        return getEvents_impl1(db, callback);
    } else {
        return getEvents_impl2(db, query, callback);
    }
}

exports.getEvent = function (db, id, callback) {
    db.collection('events').findOne({ _id: new ObjectId(id) }, function (err, document) {
        callback(document);
    });
}

exports.getPosts = function(db, callback) {
    db.collection('posts').find().toArray(function(err, documents) {
        callback(documents);
    });
}

exports.getPostByID = function(db, id, callback) {
    db.collection('posts').findOne({ _id: id }, function(err, document) {
        callback(document);
    });
}

exports.getUserByID = function(db, id, callback) {
    db.collection('users').findOne( { _id : new ObjectId(id) }, { _id : 0, password : 0 } , function(err, document) {
        callback(document);
    });
}

exports.getUser = function (db, username, callback) {
    db.collection('users').findOne({ username: username }, { _id: 0, password: 0 }, function (err, document) {
        callback(document);
    });
}

exports.getUsersByArray = function (db, array, callback) {
    db.collection('users').find({ _id: { $in: array } }, { password: 0 }).toArray(function (err, document) {
        callback(document);
    });
}

exports.getUsers = function (db, query, callback) {
    db.collection('users').find(query, { _id: 0, password: 0 }).toArray(function (err, document) {
        callback(document);
    });
}

exports.attendEvent = function (db, eventID, userID, callback) {
    db.collection('events').update({ _id: new ObjectId(eventID) }, { $addToSet: { attendUsers: new ObjectId(userID) } }, function (err, document) {
        callback(document);
    });
}

exports.unattendEvent = function (db, eventID, userID, callback) {
    db.collection('events').update({ _id: new ObjectId(eventID) }, { $pull: { attendUsers: new ObjectId(userID) } }, function (err, document) {
        callback(document);
    });
}

exports.checkAttendEvent = function (db, eventID, userID, callback) {
    db.collection('events').findOne({ _id: new ObjectId(eventID), attendUsers: { $elemMatch: { $eq: ObjectId(userID) } } }, { _id: 0, password: 0 }, function (err, document) {
        callback(document);
    });
}

exports.sendInvitations = function (db, eventID, userID, invitations, callback) {
    for (var i = 0; i < invitations.length; i++) {
        var invitation = { from: userID, event: eventID };
        console.log(invitations[i]);
        console.log(invitation);
        db.collection('users').update({ _id: new ObjectId(invitations[i]) }, { $push: { invitations: invitation } }, function (err, document) {
            callback(document);
        });
    };
}

exports.validateUser = function(db, username, password, callback) {
    db.collection('users').findOne({ username: username }, function (err, user) {
        console.log(user);
        console.log(validPassword(password, user.password));
        if (user && validPassword(password, user.password)){
            callback(user);
        }
    });
}

exports.createEvent = function (db, event, callback) {
    var newEvent = {
        organization: event.organization,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        pictures: event.pictures,
        ticketLink: event.ticketLink,
        participants: []
    };
    try {
        db.collection('events').insertOne(newEvent);
        callback(newEvent);
    } catch (e) {
        console.log(e);
    }
}

exports.createAdoption = function (db, adoption, callback) {
    var adoptionPost = {
        pet: adoption.pet,
        pictures: adoption.pictures,
        hashtags: adoption.hashtags
    };
    try {
        db.collection('adoptions').insertOne(newAdoption);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

exports.editEvent = function (db, eventID, event, callback) {
    var newEvent = {
        organization: event.organization,
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        pictures: event.pictures,
        ticketLink: event.ticketLink
    };
    db.collection('events').update({ _id: new ObjectId(eventID) }, { $set: newEvent }, function (err, document) {
        callback(document);
    });
}

exports.deleteEvent = function (db, eventID, callback) {
    db.collection('events').remove({ _id: new ObjectId(eventID) }, function (err, document) {
        callback(document);
    });
}

exports.getCommentByID = function(db, id, callback) {
    db.collection('comments').findOne({ _id: id }, function(err, document) {
        callback(document);
    });
}

exports.addParticipant = function (db, event_id, participant_id, callback) {
    exports.getEventByID(db, +event_id, function (event) {
        participants_array = event.participants;
        participants_array.push(+participant_id);
        db.collection('events').updateOne(
            { _id: +event_id },
            {
                $set: { "participants": participants_array }
            }, function (err, results) {
                callback(results);
            });
    });
}

exports.deleteParticipant = function (db, event_id, participant_id, callback) {
    exports.getEventByID(db, +event_id, function (event) {
        participants_array = event.participants;
        participants_array.splice(participants_array.indexOf(+participant_id), 1);
        db.collection('events').updateOne(
            { _id: +event_id },
            {
                $set: { "participants": participants_array }
            }, function (err, results) {
                callback(results);
            });
    });
}

exports.getParticipants = function (db, event_id, participant_ids, callback) {
    exports.getEventByID(db, +event_id, function (event) {
        // Checks if the user_ids array sent is in the current array of the friends of the user
        participant_array = user.participants;
        if (participant_ids.length == 0) {
            participant_ids = participant_array;
        } else {
            participant_ids_temp = participant_ids;
            for (id in participant_ids) {
                id = participant_ids[id];
                if (participant_array.indexOf(id) < 0) {
                    participant_ids_temp.splice(participant_ids_temp.indexOf(id), 1);
                }
            }
            participant_ids = participant_ids_temp;
        }
        exports.getUsers(db, { _id: { $in: participant_ids } }, function (users) {
            callback(users);
        });
    });
}

exports.addFriend = function (db, user_id, friend_id, callback) {
    exports.getUserByID(db, user_id, function (err, user) {
        friends_array = user ? user.friends : [];
        friends_array.push(friend_id);
        db.collection('users').updateOne(
            { _id: +user_id },
            {
                $set: { "friends": friends_array }
            }, function (err, results) {
                callback(results);
            });
    });
}

exports.deleteFriend = function (db, user_id, friend_id, callback) {
    exports.getUserByID(db, +user_id, function (user) {
        friends_array = user.friends;
        friends_array.splice(friends_array.indexOf(friend_id), 1);
        db.collection('users').updateOne(
            { _id: +user_id },
            {
                $set: { "friends": friends_array }
            }, function (err, results) {
                callback(results);
            });
    });
}

exports.getFriends = function (db, user_id, user_ids, callback) {
    exports.getUserByID(db, user_id, function (user) {
        // Checks if the user_ids array sent is in the current array of the friends of the user
        var friends_array = user.friends ? user.friends : [];
        if (user_ids.length == 0) {
            user_ids = friends_array;
        } else {
            user_ids_temp = user_ids;
            for (id in user_ids) {
                id = user_ids[id];
                if (friends_array.indexOf(id) < 0) {
                    user_ids_temp.splice(user_ids_temp.indexOf(id), 1);
                }
            }
            user_ids = user_ids_temp;
        }
        exports.getUsersByArray(db, user_ids, function (users) {
            callback(users);
        });
    });
}

exports.createUser = function (db, user, callback) {
    var hashedPassword = generateHash(user.password);
    var newUser = {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        last: user.last,
        age: user.age,
        marital: user.martial,
        municipality: user.municipality,
        house_phone: user.house_phone,
        cel_phone: user.cel_phone,
        confirmation: false,
        pets: [],
        friends: []
    }
    try {
        db.collection('users').insertOne(newUser);
        return true;
    }catch (e) {
        console.log(e);
        return false;
    }
}