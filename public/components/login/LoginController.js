/*
 * FileName: LoginController.js
 * Authors: Joe d'Eon, Stephen Gilardi
 * Last Updated: 6/6/2105
 * 
 * Description: This controller is used to control the flow of logic between the
 *               login.html view and Parse Signup API.
 * 
 * Attributes: $scope.name       - The name of the user signing up.
 *             $scope.email      - The email used to sign in or sign up.
 *             $scope.password   - The password used to sign in or sign up.
 *             $scope.repassword - The confirmation password used when signing up.              
 * 
 * Functions:
 *             signUp()         - Adds the a new user object to Parse with the user's information.
 *             login()          - Logins a previous user.
 *             forgotPassword() - Requests Parse to send a password reset to a user's email.
 *             updateTips()     - Updates the tip bar with relevant information.
 *             disTab()         - Displays the appropiate tab to display.
 * 
 */

//Global Variables
/****************/
Parse.initialize(appID,jsKey);
var tips = document.getElementById( 'sTips' );
var currentUser = Parse.User.current();

app.controller('LoginController', ['$scope', function($scope) { 

  $scope.name = '';
  $scope.email = '';
  $scope.password = '';
  $scope.repassword = '';

  /************************************************************************
   * Name:		signUp

   * Purpose:		Allows the user to sign up and get added to the database

   * Description:	This function validates the input of the
   text boxes in the signup form. If they are good,
   it calls Parse's signUp function. If the user's
   input is not valid, it updates the tips field
   in the form with the correct error message to
   help the user sign up properly.

   * Called In:   login.html
   ************************************************************************/
  $scope.signUp = function(){
    //if the name or email is invalid, update tip box and return
    if(!$scope.name || !$scope.email || !$scope.password || ($scope.password != $scope.repassword)){
      updateTips( 'sTips', 'Please enter valid input.');
      return;
    }

    // Creates a new Parse User object and adds defualt fields to it.
    var user = new Parse.User(); 
    user.set( 'name', $scope.name );
    user.set( 'username', $scope.email );
    user.set( 'email', $scope.email );
    user.set( 'password', $scope.password );
    user.set( 'personalSchedule',  []);
    user.set( 'friendList' , []);

    user.signUp(null, {
      success: function( user ) {
        // Creates a new Parse Group List object and adds default fields to it
        // Only does this if user signup was successful.
        var GroupList = Parse.Object.extend("GroupList");
        var newGroupList = new GroupList();
        newGroupList.set("userEmail", $scope.email);
        newGroupList.set( 'userGroups', [] );
        newGroupList.set( 'userName', $scope.name);
        newGroupList.save(null, {
          success: function(GroupList) {}
        });
        //redirects the user to the website.
        location.href="../../index.html";
      },
      error: function( user ) {
        updateTips( 'sTips', 'Email already in use.');
      }
    });
  }

  /************************************************************************
   * Name:		login

   * Purpose:		Allows the user to login to their profile page.

   * Called In:   login.html

   * Description:	Calls Parse's logIn function. If the user's
   input is not valid, it updates the tips field
   in the form with the correct error message to
   help the user login properly.
   ************************************************************************/
    $scope.login = function(){
      //Confirms that the user used a valid email and password to sign in.
      if(!$scope.email || !$scope.password ){
        updateTips( 'lTips', 'Please enter valid input.');
        return;
      }

      //Calls a Parse API to sign the user in.
      Parse.User.logIn( $scope.email, $scope.password, {
        success: function( user ) {
          //redirects the user to the website.
          location.href="../../index.html";
        },
        error: function( user ) {
          updateTips( 'lTips', 'Email or password not recognized.');
        }
      });
    }

    /************************************************************************
    * Name:        forgotPassword
    *
    * Purpose:     Sends a password reset link to the user's email. Alerts the user
    *               with the status of the password reset.
    *
    * Called In:   login.html
    ************************************************************************/
    $scope.forgotPassword = function(){
      //makes a Parse API call for password resets using the user's email.
      Parse.User.requestPasswordReset( $scope.email , {
        success: function() {
          alert("An email has been sent with information on changing password.");
        },
        error: function(error) {
          alert("Error: Forgot Password Error. The error message is: " + error.message);
        }
      });
    }
  }]);

/////////////////////
//Helper JS functions
/////////////////////

/************************************************************************
 * Name:    updateTips()
 * Purpose:   Updates the value and css of the tip bar at the top of 
 the form if there is an error
 * Description: Sets the value, background color, and border color of the
 tips bar
 * Called in:   login(), signup(), checkAlreadyUser()
 * Input:   var id - The ID of the tips field to update.
 var newTip - The string to be displayed in the tip bar.
 ************************************************************************/
function updateTips( id, newTip ) {
  var tips = document.getElementById(id);
  //Change the text displayed to the argument
  tips.innerHTML = newTip;
  //Change the background-color and border color of the tips bar.
  tips.style.background  = '#F44336';
  tips.style.border = '2px solid #D50000';
  tips.style.color = 'white';
}

/************************************************************************
 * Name:    dispTab()
 * Purpose:   Changes the UI to display the form requested by the user.
 * Description: This function changes the background color of the tab
 requested by the user to be white. It also changes the
 background color of the other tab to be grey. Finally,
 it displays the correct form and hides the other tab's 
 form.
 * Called In:   main()
 ************************************************************************/
function dispTab( tabId ) {
  //Declare any necessary variables
  var login = document.getElementById( 'login' ), signup = document.getElementById('signup'),
      sForm = document.getElementById( 'sForm' ), lForm = document.getElementById('lForm');

  //If the user clicked on "Log In" tab
  if ( tabId == 'login' ) {
    //Change the background of "Sign Up" tab gray
    signup.style.background = '#D8D8D8';
    signup.style.color = "grey";
    //Change the background of "Log In" tab white
    login.style.background = 'white';
    login.style.color = "#2B98F0"
    //Hide the text boxes and buttons for the sign up form
    sForm.style.display = 'none';
    //Display the text boxes and the buttons for the log in form
    lForm.style.display = 'block';
  } else {
    //Change the background of "Log In" tab gray
    login.style.background = '#D8D8D8';
    login.style.color = "grey"
    //Change the background of "Sign Up" tab white
    signup.style.background = 'white';
    signup.style.color = "#2B98F0";
    //Hide the text boxes and buttons for the log in form
    lForm.style.display = 'none';
    //Display the text boxes and buttons for the sign up form
    sForm.style.display = 'block';
  }

}

  