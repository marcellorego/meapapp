'use strict'

module.exports = MultipleViews;

function MultipleViews(views) {
    var pViews = views;
    if (!(pViews instanceof Array)) {
        pViews = [];
    }
    this.views = pViews;
}

function enableMultipleViewFolders(express) {
    // proxy function to the default view lookup
    var lookupProxy = express.view.lookup;

    express.view.lookup = function (view, options) {
        if (options.root instanceof Array) {
            // clones the options object
            var opts = {};
            for (var key in options) opts[key] = options[key];

            // loops through the paths and tries to match the view
            var matchedView = null,
                roots = opts.root;
            for (var i=0; i<roots.length; i++) {
                opts.root = roots[i];
                matchedView = lookupProxy.call(this, view, opts);
                if (matchedView.exists) break;
            }
            return matchedView;
        }

        return lookupProxy.call(express.view, view, options)
    };
}