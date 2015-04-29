/*
 * MainController.js
 * Controls user entry and path through the site.
 *
 * 
 */

//Global Variables
/****************/
//Link to Parse database - accepts application_ID, JavaScript_Key
Parse.initialize( "t5hvXf3wJOYnL3MMIffsemMdhLM7f4brACcf0eBa", "UhqQaEDIEQr6cxhO8XS4Fl8BcGU4ir9jL9To7PVO" );
var tips = document.getElementById( 'sTips' );
var currentUser = Parse.User.current();




app.controller('MainController', ['$scope', function($scope) { 

  $scope.companyName = 'HIPSTERinc';
  $scope.name = 'name';
  $scope.email = 'email';
  $scope.password = 'password';

  /************************************************************************
   * Name:		signUp()

   * Purpose:		Allows the user to sign up and get added to the database

   * Description:	This function validates the input of the of the
   text boxes in the signup form. If they are good,
   it calls Parse's signUp function. If the user's
   input is not valid, it updates the tips field
   in the form with the correct error message to
   help the user sign up properly.

   * Called In:   main()
   ************************************************************************/
  $scope.signUp = function(){
    //Create a reference variable to a new parse user
    var user = new Parse.User(); 

    //Set the user's inputs as database fields
    user.set( 'name', $scope.name );
    user.set( 'username', $scope.email );
    user.set( 'password', $scope.password );

    //Call Parse's signUp function
    user.signUp(null, {
      //If Parse is able to successfully add the user to the database
      success: function( user ) {

        //Call sweet alert to notify user of success
        swal({
          title: 'Awesome!',
          text: 'You have successfully signed up!',
          type: 'success',
          confirmButtonColor: '#5858FA',
          confirmButtonText: 'Go to my page!'
        });

        //Reset the tips field back to original
        tips.innerHTML = 'Please fill out the following fields';
        tips.style.background = '#4CAF50';
        tips.style.border = '2px solid #1B5E20';
        location.href="./home/index.html";
      },
      //If Parse isn't able to successfully add the user to the database
      error: function( user ) {
        //Update the tips field to let the user know
        updateTips( 'sTips', 'Something is wrong. Please check your inputs and try again!');
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
    Parse.User.logIn( $scope.email, $scope.password, {
      //If the logIn is successful, notify user via sweet alert
      success: function( user ) {
        location.href="./home/index.html";
      },
    //If the logIn is not successful, notify the user via sweet alert
    error: function( user ) {
      swal({
        title: 'Oops...',
      text: 'Something went wrong. Please try again.',
      type: 'error',
      confirmButtonColor: '#5858FA',
      confirmButtonText: 'Aw man, not again...'
      });
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
    location.href='http://hipster.parseapp.com';

  }


}]);

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
  var tips = document.getElementById( id );
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
  var login = document.getElementById( 'login' ), signup = document.getElementById( 'signup' ),
      sForm = document.getElementById( 'sForm' ), lForm = document.getElementById( 'lForm' );

  //If the user clicked on "Log In" tab
  if ( tabId == 'login' ) {
    //Change the background of "Sign Up" tab gray
    signup.style.background = '#D8D8D8';
    //Change the background of "Log In" tab white
    login.style.background = 'white';
    //Hide the text boxes and buttons for the sign up form
    sForm.style.display = 'none';
    //Display the text boxes and the buttons for the log in form
    lForm.style.display = 'block';
  } else {
    //Change the background of "Log In" tab gray
    login.style.background = '#D8D8D8';
    //Change the background of "Sign Up" tab white
    signup.style.background = 'white';
    //Hide the text boxes and buttons for the log in form
    lForm.style.display = 'none';
    //Display the text boxes and buttons for the sign up form
    sForm.style.display = 'block';
  }
}
