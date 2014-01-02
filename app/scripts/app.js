/**
 * Speech Ember application
 *
 * @type {void|*}
 */
Speech = window.Speech = Ember.Application.create({
    // log when Ember generates a controller or a route from a generic class
    //LOG_ACTIVE_GENERATION: true,
    // log when Ember looks up a template or a view
    //LOG_VIEW_LOOKUPS: true,
    //LOG_TRANSITIONS: true
});


/* Order and include as you please. */
require('scripts/store');
require('scripts/models/*');
require('scripts/objects/*');
require('scripts/controllers/*');
require('scripts/views/*');
require('scripts/routes/*');
require('scripts/router');