/************************************************************************
 * Name:        mailGroupAlert

 * Purpose:     Emails the user that they have been added to a group
 *              when someone within the group adds the members.

 * Called In:   GroupController.js

 * Description: This function initializes Parse's mailgun service
 *              and sends an email to a user if they get added
 *              to a group by another member. This allows them to stay 
 *              notified about their account without being logged in
 ************************************************************************/
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

/************************************************************************
 * Name:        mailContactUs

 * Purpose:     Emails the dev team ( Joe, Steven, Mikey, Saveen ) if
 *              the user sends any comments, concerns, or feedback
 *              via the "Contact Us" modal.

 * Called In:   ProfileController.js

 * Description: This function initializes Parse's mailgun service
 *              and sends an email to the dev team if the user fills out
 *              the "Contact Us" modal and clicks the send button.
 *              This puts the responsibility of communicating with the
 *              user about anything with the dev team since they know
 *              the system.
 ************************************************************************/
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

/************************************************************************
 * Name:        mailNewGroupEvent

 * Purpose:     Emails all other members of a group that a new event
 *              has been created by a user.

 * Called In:   GroupController.js

 * Description: This function will email all other members of a group 
 *              the details of a new event to keep them notified of
 *              any changes in the group even when they are logged off.
 ************************************************************************/
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