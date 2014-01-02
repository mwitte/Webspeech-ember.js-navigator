/**
 * Blog Ember application
 *
 * @type {void|*}
 */
Blog = window.Blog = Ember.Application.create({
    // log when Ember generates a controller or a route from a generic class
    //LOG_ACTIVE_GENERATION: true,
    // log when Ember looks up a template or a view
    //LOG_VIEW_LOOKUPS: true,
    LOG_TRANSITIONS: true
});


/**
 * Helper for truncate strings within templates
 *
 * @usage {{substr content 0 16}}
 * @return the modified string
 */
Ember.Handlebars.registerBoundHelper('substr', function (value, options) {
    var out = '';
    // this prevents errors if the value or options is not set
    if(value && options) {
        // init vars
        var opts = options.hash, start = opts.start || 0, len = opts.max;
        out = value.substr(start, len);
        // check length exeeded
        if (value.length > len) {
            out += '...';
        }
    }
    // return modified string
    return new Handlebars.SafeString(out);
});


/* Order and include as you please. */
require('scripts/store');
require('scripts/models/*');
require('scripts/objects/*');
require('scripts/controllers/*');
require('scripts/views/*');
require('scripts/routes/*');
require('scripts/router');

//Blog.SpeechRecognition.listen();