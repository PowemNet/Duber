const functions = require('firebase-functions');

'use strict';
// const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN; //todo: save this as an environment variable
const PAGE_ACCESS_TOKEN = 'EAAcoX6Jo0z8BALZCJvcRAGzKZCbTxWgong2iBOOg7DR5U9heEmzAM3ThHRLpuYda3BZAv4m3DHUg17LNjTHTROTXPcq1AdLcB2sBXfA43vabKPq3wGojaF08mRZCDoHLEh2m0blt4ZC5ac10PIrNltjJ7PxybIb2qSjBxvbfZCbzehoXrgGK4M';
const 
  request = require('request'),
  express = require('express'),
  engines = require('consolidate'),
  body_parser = require('body-parser')

var app = express();
app.set('port', process.env.PORT || 5000);
app.use(body_parser.json());
app.engine('hbs', engines.handlebars);
app.set('views', './public');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

const SERVER_URL = "https://gorilla-app-41193.firebaseapp.com";

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.get('/', (request, response) => {
  response.render('index');
 });

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);
      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');
  }
  else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = 'DUBERBOT_POWER_TOKEN';
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

app.get('/profile', (req, res, next) => {
  // let referer = req.get('Referer');
  // if (referer) {
  //     if (referer.indexOf('www.messenger.com') >= 0) {
  //         res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
  //     } else if (referer.indexOf('www.facebook.com') >= 0) {
  //         res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.facebook.com/');
  //     }
  //     console.log ("Duber log: sending profile page");
  //     res.render('profile');
  // }
  res.render('profile');
});

app.get('/profilepostback', (req, res) => {
  //TODO make call to firebase to update user profile with data received from messenger
  console.log("Duber logs: Sending reponse after user taps Submit Button in Set profile page");
  let body = req.query;
  let response = {
      // "text": `Great, I will book you a ${body.bed} bed, with ${body.pillows} pillows and a ${body.view} view.`
      "text": `Great!, I have updated your profile. If your availability is on, 
      you will receive Duber requests about the topics selected.` //TODO use above live for reference
  };

  res.status(200).send('Please close this window to return to the conversation thread.');
  callSendAPI(body.psid, response);
});

function handleMessage(sender_psid, received_message) {
  let response;
  
  // Checks if the message contains text
  if (received_message.text) {   
    if(received_message.text==='Hi'){
      response = {
        "text": `Good to see you {{user_first_name}}! Checkout the options below:`
      }
    }
   else if(received_message.text==='Hello'){
      response = {
        "text": `Good to see you {{user_first_name}}! Checkout the options below:`
      }
    }
  }  
  callSendAPI(sender_psid, response);    
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  let payload = received_postback.payload;

if (payload === 'GET_STARTED_PAYLOAD') {
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title":"Hi {{user_first_name}}!",
            "subtitle": "I'm Duber. I can help you find people with answers to your questions.",
            "buttons": [
              {
                "type": "postback",
                "title": "Complete my Profile",
                "payload": "PAYLOAD_COMPLETE_MY_PROFILE",
              }
            ],
          }]
        }
      }
    }

  }
  
  else if (payload === 'PAYLOAD_COMPLETE_MY_PROFILE') {
    response = setUserProfile(sender_psid)
  }

  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  console.log('Sending Message: ' + response.body);
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

function setUserProfile(sender_psid) {
  console.log("Duber log: In function: Set User Profile");
  let response = {
      "attachment": {
          "type": "template",
          "payload": {
              "template_type": "button",
              "text": "OK, let's set your Profile",
              "buttons": [{
                  "type": "web_url",
                  "url": SERVER_URL + "/profile",
                  "title": "Set Profile",
                  "webview_height_ratio": "compact",
                  "messenger_extensions": true
              }]
          }
      }
  };

  return response;
}

exports.app = functions.https.onRequest(app);
