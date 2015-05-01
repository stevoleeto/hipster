###Busy Blocks
#Team HIPSTER



To access website, use the link below.

hipster.parseapp.com

Currently Supported Functionality:

- Ability to sign up using Email, Password, and Username.
- Ability to login using Email and Password, and be directed to Homepage.
- Ability to switch between Profile and Group View
- Ability to logout of homepage

The rest of this docuemnt serves as the GO-TO for information regarding the organization of our Directories.

The parse folder contains three primary folders, cloud, config, and public. The public folder is what is acceisble by the viewer on hipster.parseapp.com, and thus all of our code will be found in there.

There are three tables showing file heiarchy, one for the public directory, one for the js directory, and one for the controllers directory.

/public

/public/js

/public/js/controllers

	
| public Directory  | What's in it |
| ------------- | ------------- |
| /public/css  | All CSS files. |
| /public/home  | All addtional files for the Homepage  |
| /public/images | All images |
| /public/index.html | Primary Homepage html file. Our SPA runs off this single document. |
| /public/js | All JavaScript files and directories. |
| /public/lib | Library of additional files |
| /public/login | HTML and additional login files |
| /public/contact | Files and HTML for Contact Page |

| js Directory | What's in it |
| ------------- | ------------- |
| /js/app.js | Defines the module for Application |
| /js/controllers | All Controllers |
| /js/home | JavaScript files for Homepage |
| /js/shared | JavaScript files shared |

| controllers Directory | What's in it |
| ------------- | ------------- |
| /controllers/groups | Controllers for Groups |
| /controllers/home | Controller for Homepage |
| /controllers/login | Controller for Login page |
| /controllers/profile | Controllers for Profile |