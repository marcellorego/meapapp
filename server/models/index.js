function Model() {
    this.modelMap = {};
}

Model.prototype.addModel = function(key, pathToModel) {
    if (!this.modelMap) this.modelMap = {};
    this.modelMap[key] = require(pathToModel);
}

Model.prototype.deleteModel = function(key) {
    if (this.modelMap) {
        delete this.modelMap[key];
    }
}

Model.prototype.getModel = function(key) {
    return this.modelMap[key];
}

//{
//	movie: require('./Movies.js')	
//};

module.exports = Model;