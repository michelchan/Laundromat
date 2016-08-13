/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    guide = require('./cleaningguide');
    tips = require('./tips');
    stains = require('./stainsguide');

var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * MinecraftHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var LaundryHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
LaundryHelper.prototype = Object.create(AlexaSkill.prototype);
LaundryHelper.prototype.constructor = LaundryHelper;

LaundryHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to the Laundromat. You can ask a question like, how do you wash jeans? ... Now, what can I help you with.";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

LaundryHelper.prototype.intentHandlers = {
    "HowToIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = "How to wash " + itemName,
            howto = guide[itemName],
            speechOutput,
            repromptOutput;
        if (howto) {
            speechOutput = {
                speech: howto,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, howto);
        } else {
            var speech;
            if (itemName) {
                speech = "I'm sorry, I currently do not know how to wash " + itemName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know what that is. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "StainIntent": function (intent, session, response) {
        var stainSlot = intent.slots.Stain,
            stainName;
        if (stainSlot && stainSlot.value) {
            stainName = stainSlot.value.toLowerCase();
        }

        var cardTitle = "How to remove " + stainName,
            howto = stainsguide[stainName],
            speechOutput,
            repromptOutput;
        if (howto) {
            speechOutput = {
                speech: howto,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, howto);
        } else {
            var speech;
            if (stainName) {
                speech = "I'm sorry, I currently do not know how to remove " + stainName + ". What else can I help with?";
            } else {
                speech = "I'm sorry, I currently do not know what that is. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AleaxSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "TipIntent": function (intent, session, response) {
        var TipIndex = Math.floor(Math.random() * tips.length);
        var cardTitle = "Cleaning Tip",
        tip = tips[TipIndex],
        speechOutput,
        repromptOutput;

        if (tip) {
            speechOutput = {
                speech: tip,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, tip);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask questions about how to do your laundry such as, how do you wash jeans, or, you can say exit... Now, what can I help you with?";
        var repromptText = "You can say things like, how do you wash jeans, or you can say exit... Now, what can I help you with?";
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
    var laundryHelper = new LaundryHelper();
    laundryHelper.execute(event, context);
};
