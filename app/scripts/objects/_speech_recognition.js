Speech.SpeechRecognition = Ember.Object.create({

    events: Ember.A(),

    /**
     * Language for speech recognition, should be changeable by user in a further step
     */
    lang: 'de',

    /**
     * Minimal confidence for a successful interaction
     */
    minConfidence: 0.3,

    /**
     * Get called on object initialisation
     */
    init: function(){
        // Start listening with web speech api
        this.listen();
    },

    /**
     * Process the last result
     * @param result
     */
    processLastResult: function(result) {
        var _this = this;
        // only if it's a valid result and the confidence is high enough
        if(result.length > 0 && result[0].confidence && result[0].confidence > this.get('minConfidence')){
            var lastResult = result[0];
            // process with the last result in the SpeechCommander
            var handle = Speech.SpeechCommander.process(lastResult.transcript);
        }

    },

    /**
     * Starts the web-speech api and binds event handlers
     */
    listen: function(){

        // save current context
        var _this = this;

        /**
         * Initializes the Recognition
         *
         * @type {webkitSpeechRecognition}
         */
        var recognition = new webkitSpeechRecognition();

        /**
         * Set some speechApi attributes. Documentation can be found at
         * https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-attributes
         */

        /**
         * Enable continuous recognizing which allows the user to make long pauses
         *
         * https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-attributes
         * @type {boolean}
         */
        recognition.continuous = true;

        /**
         * Enables interim results
         *
         * https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-attributes
         * @type {boolean}
         */
        recognition.interimResults = true;

        /**
         * Sets the language which is expected
         * @type {string}
         */
        recognition.lang = this.get('lang');

        // start recording
        recognition.start();


        /**
         * Bind all Web Speech Api events with custom functionality
         */
        recognition.onaudiostart = function (event) {
            _this.handleEvent('audiostart', null, _this);
        };
        recognition.onspeechstart = function (event) {
            _this.handleEvent('speechstart', null, _this);
        };
        recognition.onspeechend = function (event) {
            _this.handleEvent('speechend', null, _this);
        };
        recognition.onsoundend = function (event) {
            _this.handleEvent('soundend', null, _this);
        };
        recognition.onaudioend = function (event) {
            _this.handleEvent('audioend', null, _this);
        };
        recognition.onnomatch = function (event) {
            _this.handleEvent('nomatch', null, _this);
        };
        recognition.onerror = function (event) {
            _this.handleEvent('error', event, _this);
        };
        recognition.onstart = function (event) {
            _this.handleEvent('start', null, _this);
        };
        recognition.onend = function (event) {
            _this.handleEvent('end', null, _this);
            setTimeout(function() {
                _this.listen();
            },1000);
        };

        // event handler
        recognition.onresult = function (event) {
            _this.handleEvent('result', null, _this);
            /**
             * Transform given object to array, this makes everything easier ;)
             * @type {*}
             */
            var results = event.results;
            var resultsArray = Ember.A();
            for(var i = 0; i < results.length; i++) {
                var result = results[i];
                var resultArray = Ember.A();
                for(var j = 0; j < result.length; j++) {
                    resultArray.push(result[j]);
                }
                resultsArray.push(resultArray);
            }
            // set the results
            _this.set('content', resultsArray);

            // build the current result
            var currentResult = results[event.resultIndex];
            var currentResultArray = Ember.A();
            for(var i = 0; i < currentResult.length; i++) {
                currentResultArray.push(currentResult[i]);
            }
            // set current result
            _this.set('current', currentResultArray);
            // do something with the current result
            _this.processLastResult(currentResultArray);
        };
    },

    /**
     * Pushes given event to object property's array
     *
     * @param eventName
     * @param event
     * @param context
     */
    handleEvent: function(eventName, event, context) {
        context.propertyWillChange('events');
        var pastEvents = context.get('events');
        var rebuildPastEvents = Ember.A();
        var pastEventIndex = false;
        for(var i = 0; i < pastEvents.length; i++) {
            if(pastEvents[i].name === eventName){
                pastEventIndex = i;

            }
            rebuildPastEvents.push(pastEvents[i]);
        }
        if(pastEventIndex === false){
            rebuildPastEvents.push({name: eventName, count: 1});
        }else{
            Ember.set(rebuildPastEvents[pastEventIndex], 'count', parseInt(rebuildPastEvents[pastEventIndex].count) + 1);
        }
        context.set('events', rebuildPastEvents);
        context.propertyDidChange('events');

        var dump = 'SpeechRecognition Event: ' + eventName;
        if(event && event.type === 'error'){
            dump += ' Message: ' + event.error;
        }
        Ember.debug(dump);
    }
});