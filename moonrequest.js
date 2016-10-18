var AlexaSkill = require('./AlexaSkill')

module.exports.optionsBuilder = function (Fname, Lname) {

    return {
        host: 'moonlight.cs.sonoma.edu',
        path: '/api/v1/directory/person/?search=' + Fname + '+' + Lname
    }
}; 



module.exports.callbackBuilder = function(alexa_response) {
    return function(moonlight_response) {
        var str = '';
        var result = {};
        var cardTitle = "SSU teacher room number";
            

        moonlight_response.on('data', function (chunk) {
            str += chunk;
        });
        

        moonlight_response.on('end', function() {
            var result = JSON.parse(str);
            if(result[0] == null){
                var wrongName = {
                    speech: "I'm sorry SSU moonlight does not recognise this name.",
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                };
            alexa_response.tellWithCard(speechOutput, cardTitle, speechOutput.speech);
            }
            else {
            var speechOutput = {
                    speech: result[0].name + ' room number is ' + result[0].office,
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                };
            alexa_response.tellWithCard(speechOutput, cardTitle, speechOutput.speech);
        }
        });
    };
};
