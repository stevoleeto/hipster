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
 *             myGroupList - The array containing the list of groups the currentUser is part of.
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
 *             createGroup() - create a new group
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


  $scope.myGroupList = []; // local groupList
  $scope.numberOfGroups = $scope.myGroupList.length;
  
  //This Query's the database for the CURRENT users GroupList Object.
  //Once it finds the GroupList object, it pulls down the array and fills it locally.
  var GroupList = Parse.Object.extend("GroupList");
  var query = new Parse.Query(GroupList);
  query.equalTo("userEmail", $scope.email);
  query.find({
  success: function(object) {
    $scope.myGroupList = object[0]._serverData.userGroups;
    $scope.numberOfGroups = $scope.myGroupList.length;
    },
    error: function(object, error) {
    }
  });


  $scope.groupView = false;
  $scope.profileView = true;
  $scope.singleGroupView = false;
  $scope.homeView = true;

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
   * Name:    toggleHomeView()

   * Purpose:   Allows the user to see the Profile view.

   * Called In:   index.html

   * Description: Shows and Hides specific elements in index.html to control what is shown.
   ************************************************************************/
  $scope.toggleHomeView = function(){
    $scope.homeView = true;
    $scope.singleGroupView = false;
  }

  /************************************************************************
   * Name:    togglesingleGroupView()

   * Purpose:   Allows the user to see the Profile view.

   * Called In:   index.html

   * Description: Shows and Hides specific elements in index.html to control what is shown.
   ************************************************************************/
  $scope.toggleSingleGroupView = function(){
    $scope.homeView = false;
    $scope.singleGroupView = true;
    console.log("Single Group View!");
  }
  
  /************************************************************************
   * Name:    removeAllGroups()

   * Purpose:   Allows the user to remove themselves from all groups they are in.

   * Called In:   index.html

   * Description: Removs all groups found in their GroupList userGroups array.
   ************************************************************************/
  $scope.removeAllGroups = function(){
    $scope.myGroupList = []; //would really be the ID;
    $scope.numberOfGroups = 0;

    var query = new Parse.Query(GroupList);
    query.equalTo("userEmail", $scope.email)
    query.find({
      success: function(object) {
      object[0].set("userGroups", $scope.myGroupList);
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

    Parse.User.logOut();
    location.href='login/login.html';

  }

  /************************************************************************
   * Name:    createGroup()

   * Purpose:   Allows the user to create a group and include an email to invite to the group.

   * Called In:   index.html

   * Description: Creates a new group, and adds the new group to the GroupList userGroups array for both the current user the and user they have selected.
   ************************************************************************/

   $scope.createGroup = function(){

     
    /* CODE TO CREATE THE GROUP */
    var Group = Parse.Object.extend("Group");
    var newGroup = new Group();
    newGroup.set("gSchedule", new Schedule() );
    newGroup.set("name", $scope.newGroupName);
    newGroup.set("memberList", [$scope.userName]);
    newGroup.save(null, {
      success: function(Group) {
        $scope.myGroupList[$scope.numberOfGroups] = Group.id;
        console.log(Group);
        //would really be the ID; sets next myGroupList index to new group id
        
      }
    });

    /* END CODE TO CREATE THE GROUP */



    //This sets the current User's GroupList userGroups array to be updated with the new group
    var query = new Parse.Query(GroupList);
    query.equalTo("userEmail", $scope.email)
    query.find({
      success: function(cloudGroupList) {
      console.log("good refresh");
      cloudGroupList[0].set("userGroups", $scope.myGroupList);
      cloudGroupList[0].save();
      },
      error: function(cloudGroupList, error) {
      }
    });
    
       
   
  }
    
}]);
