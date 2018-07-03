

### What is Duber? ###

Duber is a bot which helps people get REAL TIME immedaite help from REAL PEOPLE around the world. 

This Dev-Uber (get it?) lets a needy-user submit questions.
A helper-dev is then alerted, and can accept the request to help. One the connection is made, the helper-dev can see the 
needy-dev's screen.

### Architecture and how to get started ###
Duber uses facebook messenger and firebase. 
The flow can be found here : https://www.lucidchart.com/documents/edit/b8eccf7a-daf5-47f3-9d7d-349f05745f99/0
When a user searches for the duber bot and finds it via facebook messenger, they can start messaging it.
Duber Facebook page: https://www.facebook.com/duberbot/
When a message is sent to the bot, Facebook's graphAPI send the message to a webhook, hosted on firebase.
The firebase project can be found at : https://console.firebase.google.com/u/0/project/gorilla-app-41193/overview

To test the firebase project, 
-clone the project and run `firebase use -add` then select the gorilla app
-Make changes (most likfely to `index.js`) then save and run `firebase serve` to deploy the project functions locally
-To deploy to a public url provided by firebase hosting, run `firebase deploy`
-To test the live app, go to the facebook page and send a message to the bot. Note: You changed must have been deployed
to the cloud with `firebase deploy` in order to test the live app.
-To see logs from the firebase function which recives and sends messages to and from Facebook, see firebase logs at
https://console.firebase.google.com/u/0/project/gorilla-app-41193/functions/logs?search=&severity=DEBUG


### How does it work now? ###

Duber 's responses have only gone as far as asking the needy-dev for what the question is. All conversational logic has been hadcoded in a node-js webhook hosted on firebase.
When a user sends Duber a message, the message is sent from the Facebook messaging API to the webhook, which then responds back to hte Facebook messaging API.

### What are the next steps? ###

We need to:
-Set up screen and audio sharing

### Contribution guidelines ###
Check guidlines here: https://docs.google.com/document/d/10LyidM2TZWy4n9bPDQHUwPN8xvtivFtUlVWNTUba3bk/edit

### Who do I talk to? ###
powermukisa@gmail.com

Happy coding!