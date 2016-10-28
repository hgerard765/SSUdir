'use strict';

var AlexaSkill = require('./AlexaSkill'),
    recipes = require('./recipes'),
    http = require('http');


var APP_ID = 'amzn1.ask.skill.63621c63-b779-40cf-b258-e73b00fabaa6'; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var HowTo = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HowTo.prototype = Object.create(AlexaSkill.prototype);
HowTo.prototype.constructor = HowTo;

HowTo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = " Hello welcome to quick deets please specify the SSU acadaemic proffesional who's; building, room, and phone number you would like me to recite.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};
// 

HowTo.prototype.intentHandlers = {
    "RecipeIntent": function (intent, session, response) {
        console.log('we are in recipe intent')
        var itemSlotLname = intent.slots.Lname,
            Lname,
            itemSlotFname = intent.slots.Fname,
            Fname;
        if (itemSlotLname && itemSlotLname.value && itemSlotFname && itemSlotFname.value){
            Lname = itemSlotLname.value.toLowerCase();
            Fname = itemSlotFname.value.toLowerCase();
            };



        var options = recipes.optionsBuilder(Fname,Lname);

        if (Fname && Lname) {
            http.request(options, recipes.callbackBuilder(response)).end();
        }  else {
            var speech;
            if (Fname) {
                speech = "I'm sorry SSU moonlight does not have a "+Fname+" in it's directory";
            } else {
                speech = "What you have said makes no sense to my limited programming please say help or try asking again";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "Is there anything else I can help you with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
                response.ask(speechOutput, repromptOutput);
          }          
    },

    "emailIntent": function (intent, session, response) {


                var itemEmail = intent.slots.email,
                    email
            
                if (itemEmail && itemEmail.value){
                    email = itemEmail.value.toLowerCase();
                 };

                if(email){
                    var cardTitle = response[0].name + 'email address is ' + response[0].email
                     emailSpeech = {
                        speech: response[0].name + ' email address is ' + response[0].email
                        type: AlexaSkill.speechOutputType.PLAIN_TEXT
                    }
                AlexaSkill.tellWithCard(emailSpeech, cardTitle, emailSpeech.speech) 
                };
    },

     "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye, and thanks for using the Darwin Hall Directory!";
        response.tell(speechOutput);
    },
    
    "AMAZON.PreviousIntent": function (intent, session, response) {
        var speechOutput = "What can I assist you with?";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions like, who is Tia Watts, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can ask me things like, what is Glenn Carter's email address, or you can say exit... Now, what can I help you out with?";
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

exports.handler = function (event, context) {
    var howTo = new HowTo();
    howTo.execute(event, context);
};


