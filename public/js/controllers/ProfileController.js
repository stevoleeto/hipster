/*
 * FileName: ProfileController.js
 * Authors: Joe d'Eon, Stephen Gilardi (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the main profile view
 *              of a user. It will have all the attributes and behaviors of
 *              a single user defined, and will be able to access the database
 *              to get said attributes.
 *
 * Attributes: userName  - The name of the user.
 *             email     - The user's unique email
 *             joinDate  - The date the user signed up.   
 *             userParticipatedGroups - The array containing the list of groups the currentUser is part of.
 *             numberOfGroups - The number of groups the current user is part of.            
 *             groupList - A list of the groups a user is in.
 *             groupView - Determines if the group element in the HTML is shown.
 *             profileView - Determines if the profile element in the HTML is shown.
 *             newFriendEmail - The email of the friend being added to a group.
 *
 *
 * Behaviors:  
 *             toggleGroupView() - Selects only the Group view to be shown
 *             toggleProfileView() - Selects only the Profile view to be shown
 *             removeAllGroups() - Removes the current user from all groups.
 *
 *             logout() - log out
 *             addGroup() - create a new group
 *
 *             createEvent() - create an event that is either singular or
 *                             recurring in nature TODO
 *             deleteEvent() - delete an event TODO
 *             editEvent()   - edit an existing event TODO
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
  $scope.email = currentUser.get("email");


  $scope.userParticipatedGroups = [];
  $scope.numberOfGroups = $scope.userParticipatedGroups.length;
  
  //This Query's the database for the CURRENT users GroupList Object.
  //Once it finds the GroupList object, it pulls down the array and fills it locally.
  var GroupList = Parse.Object.extend("GroupList");
  var query = new Parse.Query(GroupList);
  query.equalTo("userEmail", $scope.email);
  query.find({
  success: function(object) {
    $scope.userParticipatedGroups = object[0]._serverData.userGroups;
    $scope.numberOfGroups = $scope.userParticipatedGroups.length;
    },
    error: function(object, error) {
    }
  });


  $scope.groupView = false;
  $scope.profileView = true;

  $scope.newFriendEmail = "";

  /************************************************************************
   * Name:    toggleGroupView()

   * Purpose:   Allows the user to see the Group view.

   * Called In:   index.html

   * Description: Shows and Hides specific elements in index.html to control what is shown.
   ************************************************************************/
  $scope.toggleGroupView = function(){
    $scope.groupView = true;
    $scope.profileView = false;
  }

  /************************************************************************
   * Name:    toggleProfileView()

   * Purpose:   Allows the user to see the Profile view.

   * Called In:   index.html

   * Description: Shows and Hides specific elements in index.html to control what is shown.
   ************************************************************************/
  $scope.toggleProfileView = function(){
    $scope.groupView = false;
    $scope.profileView = true;
  }
  
  /************************************************************************
   * Name:    removeAllGroups()

   * Purpose:   Allows the user to remove themselves from all groups they are in.

   * Called In:   index.html

   * Description: Removs all groups found in their GroupList userGroups array.
   ************************************************************************/
  $scope.removeAllGroups = function(){
    $scope.userParticipatedGroups = []; //would really be the ID;
    $scope.numberOfGroups = 0;

    var query = new Parse.Query(GroupList);
    query.equalTo("userEmail", $scope.email)
    query.find({
      success: function(object) {
      object[0].set("userGroups", $scope.userParticipatedGroups);
      object[0].save();
      },
      error: function(object, error) {
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
    $scope.sched.test;

    Parse.User.logOut();
    location.href='login/login.html';

  }

  /************************************************************************
   * Name:    addGroup()

   * Purpose:   Allows the user to create a group and include an email to invite to the group.

   * Called In:   index.html

   * Description: Creates a new group, and adds the new group to the GroupList userGroups array for both the current user the and user they have selected.
   ************************************************************************/
   $scope.addGroup = function(){
    $scope.userParticipatedGroups[$scope.numberOfGroups] = $scope.newGroupName //would really be the ID;
    $scope.numberOfGroups++;

    //This sets the current User's GroupList userGroups array to be updated with the new group
    var query = new Parse.Query(GroupList);
    query.equalTo("userEmail", $scope.email)
    query.find({
      success: function(object) {
      console.log("good refresh");
      object[0].set("userGroups", $scope.userParticipatedGroups);
      object[0].save();
      },
      error: function(object, error) {
      }
    });
    
    //This sets the friend User's GroupList userGroups array to be updated with the new group
    var query = new Parse.Query(GroupList);
    query.equalTo("userEmail", $scope.newFriendEmail);
    query.find({
      success: function(object) {
        console.log("good refresh for friend");
        var tempList = object[0]._serverData.userGroups;
        tempList[tempList.length] = $scope.newGroupName;
        object[0].set("userGroups", tempList);
        object[0].save();
      },
      error: function(object, error) {
        console.log(error);
      }
    });    
   
  }
    
}]);
