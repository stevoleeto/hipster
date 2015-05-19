
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

Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});
