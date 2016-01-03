'use strict'

module.exports = resolverHDMA;

function resolverHDMA(apiConfig) {
    
    var observed = require('observed');
    
    var listener = observed(apiConfig);
    
    listener
    .on('add', function (change) {
        console.log(change.type, change.path, change.value);
    })            
    .on("delete", function(change) {
        console.log(change.type, change.path);
    });
}