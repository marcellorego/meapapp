'use strict'

module.exports = connectDB;

/*var readConfig = function(fileDir, fileName) {
    
    var fs = require('fs');
    var path = require('path');
    
    var filePath = path.join(fileDir, fileName);
    
    fs.readFile(filePath, {
        encoding: 'utf-8'
    }, function(err, data) {
        if (!err) {
            console.log('received data: ' + data);
                     
        } else {
            console.log(err);
        }
    });
};*/

function connectDB(onOpen, onError) {
    
    var pjson = require('../package.json');
    console.log(pjson.version);
    console.log(pjson.database);
    
    var options = {
        db: { native_parser: true },
        server: { poolSize: 5 }
    };

    var mongoose = require('mongoose');
    mongoose.connect('mongodb://' + pjson.database, options);

    var db = mongoose.connection;

    if (onError)
        db.on('error', onError);
    if (onOpen)
        db.once('open', onOpen);
    
    return db;
};

