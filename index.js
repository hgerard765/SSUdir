'use strict';

var AlexaSkill = require('./AlexaSkill'),
    recipes = require('./recipes'),
    http = require('http');


var APP_ID = 'amzn1.ask.skill.63621c63-b779-40cf-b258-e73b00fabaa6'; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var HowTo = function() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HowTo.prototype = Object.create(AlexaSkill.prototype);
HowTo.prototype.constructor = HowTo;

HowTo.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
    var speechText = " Hello Welcome to Sonoma State Directory please give me a teacher to search for.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};
// 

HowTo.prototype.intentHandlers = {
    "RecipeIntent": function(intent, session, response) {
        var itemSlotLname = intent.slots.Lname,
            Lname,
            itemSlotFname = intent.slots.Fname,
            Fname;

        if (itemSlotLname && itemSlotLname.value && itemSlotFname && itemSlotFname.value) {
            Lname = itemSlotLname.value.toLowerCase();
            Fname = itemSlotFname.value.toLowerCase();
        };



        var options = recipes.optionsBuilder(Fname, Lname);

        if (Fname && Lname) {
            http.request(options, recipes.callbackBuilder(response, session)).end();
        } else {
            var speech;
            if (Fname) {
                speech = "I'm sorry SSU moonlight does not have a " + Fname + " in it's directory";
            } else {
                speech = "What you have said makes no sense to my limited programming please say help or try asking again";
            }
            var speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            var repromptOutput = {
                speech: "Is there anything else I can help you with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "emailIntent": function(intent, session, response) {

        var result = session.attributes[recipes.TEACHER_STUFF_KEY]

        if (result) {
            var cardTitle = result[0].name + '<speak> <say-="phoe">email address is </speak>' + result[0].email
            var emailSpeech = {
                speech: result[0].name + ' email address is ' + result[0].email,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            }
            response.tellWithCard(emailSpeech, cardTitle, emailSpeech.speech)
        }
    },

    "phoneIntent": function(intent, session, response) {

        var result = session.attributes[recipes.TEACHER_STUFF_KEY]

        if (result) {
            var cardTitle = result[0].name + 'phone number is ' + result[0].phone
            var phoneSpeech = {
                speech: result[0].name + 'phone number is ' + result[0].phone, 
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            }
            response.tellWithCard(phoneSpeech, cardTitle, phoneSpeech.speech)
        }
    },

     "officeIntent": function(intent, session, response) {

        var result = session.attributes[recipes.TEACHER_STUFF_KEY]

        if (result) {
            var cardTitle = result[0].name + 'office is located in building' + result[0].building_name + ' room ' + result[0].office
            var officeSpeech = {
                speech:  result[0].name + 'office is located in building ' + result[0].building_name + ' room ' + result[0].office,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            }
            response.tellWithCard(officeSpeech, cardTitle, officeSpeech.speech)
        }
    },

    "AMAZON.StopIntent": function(intent, session, response) {
        var speechOutput = "Goodbye, and thanks for using the Darwin Hall Directory!";
        response.tell(speechOutput);
    },

    "AMAZON.PreviousIntent": function(intent, session, response) {
        var speechOutput = "What can I assist you with?";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function(intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },
//need work here 
    "AMAZON.HelpIntent": function(intent, session, response) {
        var speechText = "Give me a teachers name and I will find them for you, after the teacher is found I can give you further information about them.";
        var repromptText = "You can ask me to find a teacher or you can say go back.";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);

    }
};

exports.handler = function(event, context) {
    var howTo = new HowTo();
    howTo.execute(event, context);
};
