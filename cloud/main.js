
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

Parse.Cloud.define("mailGroupAlert", function(request, response){
	var Mailgun = require('mailgun');
	Mailgun.initialize('sandboxba98e37f8db04e8fa51e87a9352aec44.mailgun.org', 'key-f72d9fd43656a1032df21d7caa7865e0');

	Mailgun.sendEmail({
	  to: request.params.email,
	  from: "BusyBlocks@hipster.com",
	  subject: "You've been added to a Group!",
	  text: "You've been added to a new Group in Busy Blocks!:\n" + request.params.group + "\n\nhipster.parseapp.com"},
	  {
	  success: function(httpResponse) {
	    console.log(httpResponse);
	    response.success("Email sent!");
	  },
	  error: function(httpResponse) {
	    console.error(httpResponse);
	    response.error("Uh oh, something went wrong");
	  }
	});
});

Parse.Cloud.define("mailContactUs", function(request, response){
	var Mailgun = require('mailgun');
	Mailgun.initialize('sandboxba98e37f8db04e8fa51e87a9352aec44.mailgun.org', 'key-f72d9fd43656a1032df21d7caa7865e0');

	Mailgun.sendEmail({
	  to: "Saveen <saveenchad@gmail.com>, Mikey <mikeykentarocho@gmail.com>, Stephen <stevoabc123@gmail.com>, Joe <jmdeon@gmail.com>",
	  from: "BusyBlocks@hipster.com",
	  subject: "Feedback!",
	  text: "Name: " + request.params.name + "\r\n\r\nEmail: " + request.params.email + "\r\n\r\nMessage: \r\n\r\n" + request.params.message},
	  {
	  success: function(httpResponse) {
	    console.log(httpResponse);
	    response.success("Email sent!");
	  },
	  error: function(httpResponse) {
	    console.error(httpResponse);
	    response.error("Uh oh, something went wrong");
	  }
	});
});

Parse.Cloud.define("mailNewGroupEvent", function(request, response){
	var Mailgun = require('mailgun');
	Mailgun.initialize('sandboxba98e37f8db04e8fa51e87a9352aec44.mailgun.org', 'key-f72d9fd43656a1032df21d7caa7865e0');

	Mailgun.sendEmail({
	  to: request.params.members,
	  from: "BusyBlocks@hipster.com",
	  subject: "New Event Created!",
	  html: "<p>" + request.params.user + " created a new event called '" + request.params.eventName + "' in the group '" 
	  		+ request.params.group + "'.</p><b><u>Details</u></b><br>" + request.params.details +  "<br><br><p>Check it out at <a href='hipster.parseapp.com'>hipster.parseapp.com</a></p>"},
	  {
	  success: function(httpResponse) {
	    console.log(httpResponse);
	    response.success("Email sent!");
	  },
	  error: function(httpResponse) {
	    console.error(httpResponse);
	    response.error("Uh oh, something went wrong");
	  }
	});
});