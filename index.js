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
var flag = 0;
var cities =['dilli','delhi','bangalore','bglr'];
var weather = ['temperature','feel','weather'];
var to = "";
var from = "";
var when ="";
var number_tickets;
var text_numbers = ["one","two","three","four","five","six","seven","eight","nine","ten"];


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

        	if(cities.indexOf(event.message.text.toLowerCase()) > -1)
        	{
        		console.log("In cities")
        		if(flag==0)
        		{
        			from =event.message.text;
        			sendMessage(event.sender.id,{text: "Please enter your destination"});
        			flag = 1;
        		}
        		else
        		{
        			to = event.message.text;
        			sendMessage(event.sender.id,{text: "When are you leaving"});
        			flag=0;
        		}
        		/*var cities = event.message.text.toString().split(" ");
        		from = cities[0];
        		to = cities[1];

        		sendMessage(event.sender.id,{text: "When do you plan to leave"});*/

        		//sendMessage(event.sender.id,{text:from+" "+to});

        		//cites.push(event.message.text);
        	}

        	if(!isNaN(new Date(event.message.text).getDate()))
        	{
        		console.log("Valid date");
        		when = event.message.text;

        		sendMessage(event.sender.id,{text: "No of tickets:"})
        	}
        	if(!isNaN(event.message.text) || text_numbers.indexOf(event.message.text) > -1)
        	{
        		
        		console.log("Valid number");
        		number_tickets = event.message.text;
        	message = {
        			"attachment": {
            					"type": "template",
            					"payload": {
                				"template_type": "generic",
                				"elements": [{
                    				"title": "First Flight",
                    				"subtitle": "Element #1 of an hscroll",
                    				"image_url": "https://s30.postimg.org/s20y5am5p/20_55_1.jpg",
                    				"buttons": [{
                        				"type": "postback",
                        				"title": "book",
                        				"payload": "Payload for first element in a generic bubble",
                    					}],
                				}, 
                				{
                    "title": "Second Flight",
                    "subtitle": "Second Flight",
                    "image_url": "https://s30.postimg.org/i5zv5ngdp/20_55_2.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "book",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
        	sendMessage(event.sender.id,message);
        	//sendMessage(event.sender.id,{text:"You have booked "+number_tickets+" From: "+from+" To:"+to});
        	}

            //sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }

     if(event.postback) {
        //text = JSON.stringify(event.postback)
        sendMessage(event.sender.id,{text:"You have booked "+number_tickets+" from "+from+" to "+to});
      }

      if(event.message.text == 'how is the weather at delhi')
      	//|| event.message.text.toLowerCase().indexOf('temperature') || event.message.text.toLowerCase().indexOf('feel') )
      {
      	console.log('in weather');
      	var city = "";

      	/*cities.forEach(function(value){
  		console.log(value);
  		if(event.message.text.toLowerCase().indexOf(value) > -1)
  		{
  			city = event.message.text.substring(event.message.text.toLowerCase().indexOf(value));
  			sendMessage(event.sender.id,{text: 'Weather at'+city+'27 degrees'});
  		}
		});*/

      }

      else
      {
      	sendMessage(event.sender.id,{text: 'Sorry I did not understand'});
      }
    res.sendStatus(200);
});

function handleFindFlights(recipientid,message)
{
	sendMessage(recipientid,{text:"Please provide source"});
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

