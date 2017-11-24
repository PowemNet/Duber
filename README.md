

### What is Duber? ###

Duber is a bot which helps devs get real time help when they have a problem. 

This Dev-Uber (get it?) lets a user choose to either receive question requests, or submit questions.
If a dev has an issue, duber let's them post it with minimal interaction. The steps involve
-Do you want to post a question?
-What is the question?
-What is the topic?

Wait until we find you a dev.

When a dev who is online accepts the request, Duber generates a link which enables the two devs to screeshare(because how else wil you debug?)
-When the link is clicked, the chrome desktop (or whichever other open source desktop sharing tool?) is launched.
-The dev who's helping the other dev also opens their link and can immdiately have a look at the dev-in-need (let's call him the "needy-dev")'s laptop.
-The dev whos's helping (let's call her the "helper-dev") can them edit the code or debug or whatever.

After this process, the two parties can rate each other and Duber will use that for future reference: to Tell if any of these devs is just a fraud messing
with us.

### How does it work now? ###

Duber 's responses have only gone as far as asking the needy-dev for what the question is. All conversational logic has been hadcoded in a node-js webhook hosted on firebase.
When a user sends Duber a message, the message is sent from the Facebook messaging API to the webhook, which then responds back to hte Facebook messaging API.

### What are the next steps? ###

We need to:
-Stop reinventing the wheel and use tools like API.ai
-Make the thing work to completion.

### Contribution guidelines ###
-You may need to install this Trello card numbers chrom add on:
https://chrome.google.com/webstore/detail/trello-card-numbers/kadpkdielickimifpinkknemjdipghaf/related?hl=en
-Find tasks in Trello
-Branch off the develop branch and name the branch accroding to the Trello Task #
-When done with the task/story, submit a pull request to develop.
-If we have a feature, we'll merge from develop to master branch

### Who do I talk to? ###

our general slack channel is here:
https://powem.slack.com/messages/C3L4CTQQ3/