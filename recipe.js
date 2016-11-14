var AlexaSkill = require('./AlexaSkill')
var TEACHER_STUFF_KEY = 'TEACHER_STUFF_KEY'
module.exports.TEACHER_STUFF_KEY = TEACHER_STUFF_KEY

module.exports.optionsBuilder = function(Fname, Lname) {

    return {
        host: 'moonlight.cs.sonoma.edu',
        path: '/api/v1/directory/person/?search=' + Fname + '+' + Lname
    }
};



module.exports.callbackBuilder = function(alexa_response, session) {
    return function(moonlight_response) {
        var str = '';
        var result = {};
        var cardTitle = "SSU teacher room number";


            moonlight_response.on('data', function(chunk) {
            str += chunk;
        });


        moonlight_response.on('end', function() {
            var result = JSON.parse(str)
            if (result.length === 0) {
                var wrongName = {
                    speech: '<speak>I am sorry, the directory does not have anyone by that name.</speak>',
                    type: AlexaSkill.speechOutputType.SSML
                }
                alexa_response.ask(wrongName, cardTitle, wrongName.speech);
            } else {
                var repromptOutput = {
                    speech: '<speak>I\'m sorry, I did not understand you. I have info about</speak>',
                    type: AlexaSkill.speechOutputType.SSML
                }

                var speechOutput = {
                    speech: '<speak>I have located, ' + result[0].name + ' . Say office, phone, or email to hear the answer.</speak>',

                    type: AlexaSkill.speechOutputType.SSML
                };
                session.attributes.TEACHER_STUFF_KEY = result                    // ask needs reprompt
                alexa_response.ask(speechOutput, repromptOutput)
            }
        });
    };
};
