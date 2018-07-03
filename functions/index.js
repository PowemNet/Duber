const functions = require('firebase-functions');
// const express = require ('express');

// const app = express();
// app.get('/webhook',(request,response)=>{
// 	response.send('Hi Power!');
// });


'use strict';
// const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN; //TODO POWER: save this as an environment variable
const PAGE_ACCESS_TOKEN = 'EAAcoX6Jo0z8BALZCJvcRAGzKZCbTxWgong2iBOOg7DR5U9heEmzAM3ThHRLpuYda3BZAv4m3DHUg17LNjTHTROTXPcq1AdLcB2sBXfA43vabKPq3wGojaF08mRZCDoHLEh2m0blt4ZC5ac10PIrNltjJ7PxybIb2qSjBxvbfZCbzehoXrgGK4M';
// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

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

  } else {
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

    // else if(received_message.text==='DONE'){
    //   response = {
    //     "attachment": {
    //       "type": "template",
    //       "payload": {
    //         "template_type": "generic",
    //         "elements": [{
    //           "text": `Should I post the question ${received_message.text} on Duber? You can see all your posted questions when you type "menu"`,
    //           "buttons": [
    //             {
    //               "type": "postback",
    //               "title": "Yes please Duber!",
    //               "payload": "yesDuberPostQuestion",
    //             },
    //             {
    //               "type": "postback",
    //               "title": "Nope",
    //               "payload": "noDuberDontPostQuestion",
    //             }
    //           ],
    //         }]
    //       }
    //     }
    //   }
    // }
// 
    // else {
    //   response = {
    //     // "text": `Now select which tags to add to your question. type DONE when you're done selecting.`,
    //     "quick_replies":[
    //       {
    //         "content_type":"text",
    //         "title":"android",
    //         "payload":"tag_android"
    //       },
    //       {
    //         "content_type":"text",
    //         "title":"iOS",
    //         "payload":"tag_iOS"
    //       }
    //     ]
    //   }
    // }

   
  } 
  // else if (received_message.attachments) {
  //   // Get the URL of the message attachment
  //   let attachment_url = received_message.attachments[0].payload.url;
  //   response = {
  //     "attachment": {
  //       "type": "template",
  //       "payload": {
  //         "template_type": "generic",
  //         "elements": [{
  //           "title": "Is this the right picture?",
  //           "subtitle": "Tap a button to answer.",
  //           "image_url": attachment_url,
  //           "buttons": [
  //             {
  //               "type": "postback",
  //               "title": "Yes!",
  //               "payload": "yes",
  //             },
  //             {
  //               "type": "postback",
  //               "title": "No!",
  //               "payload": "no",
  //             }
  //           ],
  //         }]
  //       }
  //     }
  //   }
  // } 

  // else if(received_message.text==='Thanks'){
  //   response = {
  //     "text": `You flatter me :)`
  //   }
  // }
  
  // Send the response message
  callSendAPI(sender_psid, response);    
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  } else if (payload === 'GET_STARTED_PAYLOAD') {

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
    //todo: show profile page here
    response = { "text": "Hold up I'm designing a page you can use to complete your profile :) Give me two days jeez!" }
  }

  else if (payload === 'tag_android'){
    //todo: add tag to question
  }

  else if (payload === 'tag_iOS'){
    //todo: add tag to question
  }


  else if (payload === 'noDuberDontPostQuestion') {
    response = { "text": `Okay, type "menu" to see more options.` }
  }else if (payload === 'yesDuberPostQuestion') {
    response = { "text": `Great! I'll keep you updated` } //todo: call function for posting message(send users inboxes for now, with the question and its tags). In callback, let the fucntion update that it has posted the question
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

  // Send the HTTP request to the Messenger Platform
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

exports.app = functions.https.onRequest(app);
