SpeechRecognition = {

    /**
     * Does something with the recognized text
     *
     * @param string text
     * @returns {*}
     */
    processTransScript: function(text){
        /**
         * Hallo Josef, hier kannst du dich austoben. Diese Funktion wird mit dem Parameter aufgerufen.
         * Dieser Parameter ist ein string.
         * Dies wird ausgeführt wenn ein gesprochener text als text erkannt wurde und diverse
         * Bedingungen erfültl sind(siehe Funktion "handleCurrentResult" weiter unten)
         */

        // Ausgabe des textes
        console.log('Original text: ' + text);

        // text in einzelne wörter(trennzeichen ist leerzeichen) zerlegen und in ein array legen
        var elements = text.split(" ");
        // über alle array elemente laufen
        for(var i=0; i < elements.length; i++){
            var element = elements[i];
            console.log(element);
        }

        // text umkehren
        text = text.split("").reverse().join("");
        // Ausgabe des umgekehrten textes
        console.log('Reversed text: ' + text);
    },

    /**
     * Handles the current result
     * @param result
     */
    handleCurrentResult: function(result) {
        var _this = this;
        // only if there is a result given and the confidence is above a specified value
        // https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-alternative
        if(result.length > 0 && result[0].confidence && result[0].confidence > 0.5){
            var lastResult = result[0];
            // do something with the transcript
            this.processTransScript(lastResult.transcript);
        }

    },

    /**
     * This initializes the webspeech api and contains the event listeners
     */
    listen: function(){

        var _this = this;

        /**
         * Initializes the Recognition
         *
         * @type {webkitSpeechRecognition}
         */
        var recognition = new webkitSpeechRecognition();

        /**
         * Set the continuous recognizing that enable the user to make long pauses and dictate large texts.
         * By default this property is set to false (i.e. a speech pause will stop the recognition process)
         * @type {boolean}
         */
        recognition.continuous = true;

        /**
         * Enable interim results fetching. Thus you have access to interim recognition results and can display
         * them in the text box immediately after receiving them. The user will see a constantly refreshing
         * text, otherwise the recognized text will be available only after a pause.
         * The default value is false.
         *
         * @type {boolean}
         */
        recognition.interimResults = true;

        /**
         * Sets the recognition language, default is browser locale
         * @type {string}
         */
        recognition.lang = "de";
        // start recording
        recognition.start();


        /**
         * Events laut
         * https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html#speechreco-events
         */

        recognition.onaudiostart = function (event) {
            _this.displayEvent('audiostart');
        }
        recognition.onspeechstart = function (event) {
            _this.displayEvent('speechstart');
        }
        recognition.onspeechend = function (event) {
            _this.displayEvent('speechend');
        }
        recognition.onsoundend = function (event) {
            _this.displayEvent('soundend');
        }
        recognition.onaudioend = function (event) {
            _this.displayEvent('audioend');
        }
        recognition.onnomatch = function (event) {
            _this.displayEvent('nomatch');
        }
        recognition.onerror = function (event) {
            console.dir(event);
            _this.displayEvent('error', event);
        }
        recognition.onstart = function (event) {
            _this.displayEvent('start');
        }
        recognition.onend = function (event) {
            _this.displayEvent('end');
            // restart after end
            setTimeout(function() {
                _this.listen();
            },1000);
        }

        // event handler
        recognition.onresult = function (event) {
            _this.displayEvent('result');
            // build results as array, this is needed for ember for iteration
            var results = event.results;
            var resultsArray = [];
            for(var i = 0; i < results.length; i++) {
                var result = results[i];
                var resultArray = [];
                for(var j = 0; j < result.length; j++) {
                    resultArray.push(result[j]);
                }
                resultsArray.push(resultArray);
            }

            // build the current result
            var currentResult = results[event.resultIndex];
            var currentResultArray = [];
            for(var i = 0; i < currentResult.length; i++) {
                currentResultArray.push(currentResult[i]);
            }

            // display the data for debugging
            _this.displayResults(resultsArray, $('#debug .history'));
            _this.displayResult(currentResultArray, $('#debug .last'), true);

            _this.handleCurrentResult(currentResultArray);
        };
    },

    /**
     * Displays multiple results in frontend in given container as li elements
     * @param results
     * @param container
     */
    displayResults: function(results, container){
        for(var i = 0; i < results.length; i++) {
            var element = results[i];
            var elementContainer = $('<ul></ul>');
            this.displayResult(element, elementContainer);
            //var elementContainer = $('<li></li>').append(elementContainer);
            container.append($('<li></li>').append(elementContainer));
        }
    },

    /**
     * Displays one single result in given container
     * @param result
     * @param container
     * @param clearContainer
     */
    displayResult: function(result, container, clearContainer){
        //var container = $('#debug .last');
        if(clearContainer){
            container.empty();
        }
        for(var i = 0; i < result.length; i++) {
            var element = result[i];
            container.append('<li>'+ element.transcript +' <b>'+ element.confidence +'</b></li>')
        }

    },

    /**
     * Displays given event
     * @param eventName
     * @param event
     */
    displayEvent: function(eventName, event) {
        var dump = 'SpeechRecognition Event: ' + eventName;
        if(event && event.type === 'error'){
            dump += ' Message: ' + event.error;
        }
        var container = $('#debug .events');
        var possibleElement = container.find('.' + eventName);
        if(possibleElement.length <= 0){
            container.append('<li class="'+eventName+'">'+eventName+' <span>1</span></li>');
        }
        possibleElement.css('background-color', 'red');
        possibleElement.find('span').html(parseInt(possibleElement.find('span').html()) + 1);
        possibleElement.animate({"backgroundColor": ""}, 600);
    },

    init: function(){
        this.listen();
    }
};
// Initialize the recognition
SpeechRecognition.init();