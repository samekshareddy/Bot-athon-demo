/*var express = require('express');
var app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');

//app.use(express.static(__dirname + '/public'));

console.log("please work")

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'Bot-athon-westerosairways') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});

app.post('/webhook', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
*/

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

var greetings = ['hi', 'hello', 'good morning', 'good afternoon'];

var PAGE_ACCESS_TOKEN = 'EAAIPsW7F6tMBAElxTAq2i6ypobzJF1AQIweS1zZBCZCmzc80GSSQiM8n0fyuWKZB4H1Ci90cBSrZBzamp0qcHGXMAr2Xy4JRf6FDeghf1TFGZCrWZBXffZAwi1mrmm0Q1Y6uaeNEPUcCMUmOl67DkwZAO8ThBwrNmRs563n9vHsMoAZDZD'

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'Bot-athon-westerosairways') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});

app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    var reply = "Sorry I did not understand";
    var cities =[];
    var to = "";
    var from = "";
    var when ="";
    var number_tickets;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
        	if(greetings.indexOf(event.message.text.toLowerCase()) > -1)
        	{
        		console.log("greetings");
        		handleGreeting(event.sender.id,event.message.text);
        		//reply = event.message.text + "We are here to help you find the cheapest flights across the world"
        	}

        	if(event.message.text == 'Find Flights')
        	{
        		console.log("Find Flights");
        		handleFindFlights(event.sender.id,event.message.text);

        	}

        	if(event.message.text == 'Add complaints/Give Feedback')
        	{
        		console.log('Add complaints/ Give Feedback');
        		handleComplaints(event.sender.id,message);
        	}

        	if(event.message.text == 'Schedule Reminders')
        	{
        		console.log('Schedule Reminders');
        		handleScheduleReminders(event.sender.id,message);
        	}

        	if(event.message.text.toLowerCase().indexOf('delhi') > -1 || event.message.text.toLowerCase().indexOf('Bangalore') > -1)
        	{
        		var cities = event.message.text.toString().split(" ");
        		from = cities[0];
        		to = cities[1];

        		sendMessage(recipientid,{text: "When do you plan to leave"});

        		//sendMessage(event.sender.id,{text:from+" "+to});

        		//cites.push(event.message.text);
        	}

        	if(!isNaN(new Date(event.message.text).getDate()))
        	{
        		console.log("Valid date");
        		when = event.message.text;

        		sendMessage(recipientid,{text: "No of tickets:"})
        	}

            //sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

function handleFindFlights(recipientid,message)
{
	sendMessage(recipientid,{text:"Please provide source,destination"});
}

function handleComplaints(recipientid,message)
{

}

function handleScheduleReminders(recipientid,message)
{

}

function handleGreeting(recipientid,message)
{
	var reply = {text:message + "! We are here to help you find the cheapest flights across the world"};
	//sendMessage(recipientid,{text: reply});

	request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: {id: recipientid},
            message: reply
        }
    }, function(error, response, body) {
        
    	request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: {id: recipientid},
            message: {
    			"text":"Pick an option",
    			"quick_replies":[
      			{
        			"content_type":"text",
        			"title":"Find Flights",
        			"payload":"Find Flights"
      			},
      			{
        			"content_type":"text",
        			"title":"Add complaints/Give Feedback",
        			"payload":"Add complaints/Give Feedback",
        			
      			},
      			{
        			"content_type":"text",
        			"title":"Schedule Reminders",
        			"payload":"Schedule Reminders",
        			
      			}
    		]
  		}
      }
    }, function(error, response, body) {
        if (error) {
            console.log('Error in quick reply: ', error);
        } else if (response.body.error) {
            console.log('Error Quick reply: ', response.body.error);
        }
    });
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
	
}
//process.env.PAGE_ACCESS_TOKEN
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

