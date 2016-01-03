'use strict'

module.exports = watchHDMA;

var path = require("path"),
    fs = require("fs"),
    chokidar = require('chokidar');

function watchHDMA (apiPath, apiConfig) {
    
    var watcher = chokidar
    .watch(apiPath, {
        ignored: /^\./,
        persistent: true
    });

    watcher
    .on('addDir', function(dir) {
        fs.stat(path.join(dir, '/package.json'), function(err, stat) {
            if (!err) {
                var key = path.basename(dir);
                apiConfig[key] = dir;
            }
        });
    })
    .on('unlinkDir', function(dir) {
        var key = path.basename(dir);
        if (apiConfig.hasOwnProperty(key)) {
            delete apiConfig[key];            
        } 
    })
    .on('error', function(error) {
        console.error('Error watching api configuration', error);
    });
};