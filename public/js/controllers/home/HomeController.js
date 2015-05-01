/*
 * HomeController.js
 * Controls user on Homepage. Controls whether the GroupView or ProfileView is being shown.
 *
 * 
 */

//Global Variables
/****************/
//Link to Parse database - accepts application_ID, JavaScript_Key
Parse.initialize( "t5hvXf3wJOYnL3MMIffsemMdhLM7f4brACcf0eBa", "UhqQaEDIEQr6cxhO8XS4Fl8BcGU4ir9jL9To7PVO" );
var currentUser = Parse.User.current();

app.controller('HomeController', ['$scope', function($scope) { 

  // Get the user's data and make a user object in the model
  $scope.user = {
    name : currentUser.get("name"),
    joinDate: currentUser.createdAt
  }

  $scope.groupView = false;
  $scope.profileView = true;

  $scope.toggleGroupView = function(){
    $scope.groupView = true;
    $scope.profileView = false;
  }

  $scope.toggleProfileView = function(){
    $scope.groupView = false;
    $scope.profileView = true;
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


}]);
