Speech.AbstractRoute = Ember.Route.extend({
    setupController: function(controller, model){
        Ember.run.next(this, function(){
            Speech.SpeechCommander.updateLabels();
        });
    }
});