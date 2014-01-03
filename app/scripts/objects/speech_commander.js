Speech.SpeechCommander = Ember.Object.create({

    /**
     * Keyword which needs to be the suffix for a handle
     */
    keyWord: 'navigation',

    /**
     * ClassName for all speechLabels
     */
    labelClass: 'speechLabel',

    /**
     * Global state
     */
    processing: false,

    /**
     * Threshold
     */
    threshold: 1000,

    /**
     * Contains the last executed command
     */
    lastCommand: '',

    /**
     * Process the given token
     * @param token
     * @returns {boolean}
     */
    process: function(token){
        var _this = this;
        if(!this.determineValidToken(token)){
            return false;
        }
        var handle = this.findHandleNumber(token);
        if(typeof handle === 'number'){
            if(this.get('processing') === false){
                this.set('processing', true);
                Ember.debug('Command was: ' + this.get('keyWord') +' '+ handle);
                this.set('lastCommand', this.get('keyWord') +' '+ handle);

                Ember.$('#' + this.get('labelClass') + '-' + handle).click();

                setTimeout(function() {
                    _this.set('processing', false);
                },this.get('threshold'));
            }
        }
    },

    /**
     * Finds a possible handle number in given token
     *
     * @param token
     * @returns {*}
     */
    findHandleNumber: function(token){
        // split to array
        var elements = token.split(" ");
        // revert array
        elements = elements.reverse();
        var elementBeforeWasNumber = null;
        // iterate all elements
        for(var i=0; i < elements.length; i++){
            var element = elements[i];
            if( element.toLowerCase() === this.get('keyWord').toLowerCase()){
                if(elementBeforeWasNumber !== null){
                    return elementBeforeWasNumber;
                }
            }

            if(isNaN(parseInt(element))){
                elementBeforeWasNumber = null;
            }else{
                elementBeforeWasNumber = parseInt(element);
            }
        }
        return false;
    },

    /**
     * Determines if it's a valid token
     * @param token
     * @returns {boolean}
     */
    determineValidToken: function(token){
        if( typeof token !== 'string'){
            Ember.debug('No string was given: ' + token);
            return false;
        }
        // trim
        token = token.replace(/^\s+|\s+$/g, '');
        if( token.length <= this.get('keyWord').length){
            Ember.debug('To short: ' + token);
            return false;
        }
        var elements = token.split(" ");
        if(elements.length < 2){
            Ember.debug('Less elements: ' + token);
            return false;
        }
        return true;
    },

    /**
     * Updates the interactive element labels
     */
    updateLabels: function() {
        // remove all speechLabels
        Ember.$('.speechLabel').remove();
        // get all interactive elements
        var anchorElements = Ember.$('a');
        // iterate the elements
        for(var i = 0; i < anchorElements.length; i++){
            var element = anchorElements[i];
            var labelNumber = parseInt(i) + 1;
            // build a speechLabel
            var label = ' <span id="'+ this.get('labelClass') + '-' + labelNumber +'" class="'+this.get('labelClass')+' label label-danger">'+ labelNumber +'</span>';
            // add the speechLabel to the given element
            Ember.$(element).append(label);
        }
    }
});