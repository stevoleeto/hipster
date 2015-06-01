/*
 * LoginController.js
 * Controls user entry to the site.
 *
 * 
 */

//Global Variables
/****************/
//Link to Parse database - accepts application_ID, JavaScript_Key
Parse.initialize(appID,jsKey);
var tips = document.getElementById( 'sTips' );
var currentUser = Parse.User.current();

app.controller('LoginController', ['$scope', function($scope) { 

  $scope.name = '';
  $scope.email = '';
  $scope.password = '';
  $scope.repassword = '';

  $scope.validEmail = true;
  $scope.validName = true;



  /************************************************************************
   * Name:		signUp()

   * Purpose:		Allows the user to sign up and get added to the database

   * Description:	This function validates the input of the
   text boxes in the signup form. If they are good,
   it calls Parse's signUp function. If the user's
   input is not valid, it updates the tips field
   in the form with the correct error message to
   help the user sign up properly.

   * Called In:   main()
   ************************************************************************/
  $scope.signUp = function(){
    //if the name or email is invalid, update tip box and return
    if(!$scope.name || !$scope.email || !$scope.password || ($scope.password != $scope.repassword)){
      updateTips( 'sTips', 'Please enter valid input.');
      return;
    }
    //Create a reference variable to a new parse user
    var user = new Parse.User(); 

    //Set the user's inputs as database fields
    user.set( 'name', $scope.name );
    user.set( 'username', $scope.email );
    user.set( 'email', $scope.email );
    user.set( 'password', $scope.password );
    user.set( 'personalSchedule',  []);
    user.set( 'friendList' , []);

    // Simple syntax to create a new subclass of Parse.Object.
    var GroupList = Parse.Object.extend("GroupList");

    // Create a new instance of that class.
    var newGroupList = new GroupList();

    newGroupList.set("userEmail", $scope.email);
    newGroupList.set( 'userGroups', [] );
    newGroupList.set( 'userName', $scope.name);
    newGroupList.save(null, {
      success: function(GroupList) {}
    });
    //Call Parse's signUp function
    user.signUp(null, {
      //If Parse is able to successfully add the user to the database
      success: function( user ) {

        //Call sweet alert to notify user of success
        ///
        /*swal({
          title: 'Awesome!',
          text: 'You have successfully signed up!',
          type: 'success',
          confirmButtonColor: '#5858FA',
          confirmButtonText: 'Go to my page!'
        });
        */
        //Reset the tips field back to original
        location.href="../../index.html";
      },
      //If Parse isn't able to successfully add the user to the database
      error: function( user ) {
        //Update the tips field to let the user know
        updateTips( 'sTips', 'Email already in use.');
      }
    });

  }

  /************************************************************************
   * Name:		login()

   * Purpose:		Allows the user to login to their profile page.

   * Called In:   main()

   * Description:	Calls Parse's logIn function. If the user's
   input is not valid, it updates the tips field
   in the form with the correct error message to
   help the user login properly.
   ************************************************************************/
  $scope.login = function(){
    //if the email is invalid, update tip box and return
    if(!$scope.email || !$scope.password ){
      updateTips( 'lTips', 'Please enter valid input.');
      return;
    }
    Parse.User.logIn( $scope.email, $scope.password, {
      //If the logIn is successful, notify user via sweet alert
      success: function( user ) {
        location.href="../../index.html";
      },
    //If the logIn is not successful, notify the user via sweet alert
    error: function( user ) {
      updateTips( 'lTips', 'Email or password not recognized.');
      /*
      swal({
        title: 'Oops...',
      text: 'Email or password not recognized.',
      type: 'error',
      confirmButtonColor: '#5858FA',
      confirmButtonText: 'Okay'
      });
      */
    }
    });


  }
  /************************************************************************
   * Name:		logout()

   * Purpose:		Allows the user to logout.

   * Called In:   main()

   * Description:	Calls Parse's logout function. 
   ************************************************************************/
  $scope.logout = function(){

    Parse.User.logOut();
    location.href='login/login.html';

  }

  $scope.forgotPassword = function(){
    Parse.User.requestPasswordReset( $scope.email , {
      success: function() {
      alert("An email has been sent with information on changing password.");
      },
      error: function(error) {
      // Show the error message somewhere
      alert("Error: Forgot Password Error. The error message is: " + error.message);
      }
    });
  }


}]);
  
  /************************************************************************
   * Name:		logout()

   * Purpose:		Allows the user to logout.

   * Called In:   main()

   * Description:	Calls Parse's logout function. 
   ************************************************************************/

app.controller('CarouselInstanceCtrl', function ($scope) {
  $scope.interval = 3000;
  var slides = $scope.slides = [];

  $scope.addSlide = function() {
    slides.push({
      image: '../../images/ProfileView.png',
      caption: 'Customize your weekly schedule'
    });
    slides.push({
      image: '../../images/Groups.png',
      caption: 'Add a group to organize events'
    });
    slides.push({
      image: '../../images/GroupsView.png',
      caption: 'Find free time for your events among your group'
    });
  }

  $scope.addSlide();
});

/////////////////////
//Helper JS functions
/////////////////////

/************************************************************************
 * Name:		updateTips()

 * Purpose:		Updates the value and css of the tip bar at the top of 
 the form if there is an error

 * Description:	Sets the value, background color, and border color of the
 tips bar

 * Called in:   login(), signup(), checkAlreadyUser()

 * Input:		var id - The ID of the tips field to update.
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
 * Name:		dispTab()

 * Purpose:		Changes the UI to display the form requested by the user.

 * Description:	This function changes the background color of the tab
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
