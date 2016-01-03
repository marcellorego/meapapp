'use strict'

function Model() {
    this.resources = {};
}

Model.prototype.addModel = function(key, resource) {
    if (!this.resources) this.resources = {};
    this.resources[key] = resource;
}

Model.prototype.deleteModel = function(key) {
    if (!this.resources) this.resources = {};
    delete this.resources[key];
}

Model.prototype.getModel = function(key) {
    if (!this.resources) this.resources = {};
    return this.resources[key];
}

module.exports = Model;