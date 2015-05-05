/*
 * FileName: ProfileController.js
 * Authors: Joe d'Eon (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the main profile view
 *              of a user. It will have all the attributes and behaviors of
 *              a single user defined, and will be able to access the database
 *              to get said attributes.
 *
 * Attributes: name      - The name of the user.
 *             email     - The user's unique email
 *             groupList - A list of the groups a user is in.
 *
 * Behaviors:  logout() - log out
 *             createGroup() - create a new group
 *             createEvent() - create an event that is either singular or
 *                             recurring in nature
 *             deleteEvent() - delete an event
 *             editEvent()   - edit an existing event
 *
 *          
 * 
 */

//Link to Parse database - accepts application_ID, JavaScript_Key
Parse.initialize( "t5hvXf3wJOYnL3MMIffsemMdhLM7f4brACcf0eBa", "UhqQaEDIEQr6cxhO8XS4Fl8BcGU4ir9jL9To7PVO" );
var currentUser = Parse.User.current();


app.controller('ProfileController', ['$scope', function($scope) {
  $scope.sched = new Schedule(); // will be changed to pull schedule down
	$scope.userName = currentUser.get("name");
	$scope.joinDate = currentUser.createdAt;


  $scope.userParticipatedGroups = currentUser.get("Groups");
  $scope.numberOfGroups = $scope.userParticipatedGroups.length;

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
   $scope.addGroup = function(){
    $scope.userParticipatedGroups[$scope.numberOfGroups] = $scope.numberOfGroups;
    $scope.numberOfGroups++;
    currentUser.set("Groups", $scope.userParticipatedGroups);
    currentUser.save(null, {
  		success: function(user) {}
	});
}







  /************************************************************************
   * Name:		logout()

   * Purpose:		Allows the user to logout.

   * Called In:   main()

   * Description:	Calls Parse's logout function. 
   ************************************************************************/
  $scope.logout = function(){
    $scope.sched.test;

    Parse.User.logOut();
    location.href='login/login.html';

  }

    
}]);
