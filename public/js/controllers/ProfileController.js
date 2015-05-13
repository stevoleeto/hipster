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



app.controller('ProfileController', ['$scope','groupService','$timeout','userService','uiCalendarConfig', function($scope, groupService, $timeout, userService, uiCalendarConfig) {

  /* user data */
  $scope.sched = new Schedule(); // will be changed to pull schedule down
  $scope.userName = currentUser.get("name");
  $scope.joinDate = currentUser.createdAt;
  $scope.email = currentUser.get("email");

  userService.setEmail(currentUser.get("email")); //set users email in service



  $scope.eventSources = [{
            events: [ // put the array in the `events` property
                {
                    title  : 'CalendarTestEvent',
                    start  : '2015-05-11'

                },]}];

  /* Used in getRandomColor() below */
  //var colors = ['#B9F5FF', '#B5FBA3', '#FFA6B1'];

  /* Change to weeksly view after 50 milliseconds
   */
  $timeout(function(){ uiCalendarConfig.calendars['userCalendar'].
    fullCalendar('changeView','agendaWeek')}, 50);

  /*
  $scope.initCalendar = function(){
    uiCalendarConfig.calendars['MyCalendar'].fullCalendar('changeView','agendaWeek');
    console.log("calendars");
    console.log( uiCalendarConfig.calendars);
  }
  */



  /* asks the service to please pull the group list of desire email,
   * then it gets the groupList from the service when its done pulling */
  userService.queryGroupList($scope.email).then(function(){
    $scope.myGroupList = userService.getGroupList();
  });


  $scope.addGroup = function(){
    groupService.addGroupId($scope.currentGroupId);
    groupService.addGroupColor($scope.currentGroupColor);
  }

  

  /************************************************************************
   * Name:    removeAllGroups()

   * Purpose:   Allows the user to remove themselves from all groups they are in.

   * Called In:   index.html

   * Description: Removs all groups found in their GroupList userGroups array.
   ************************************************************************/
  $scope.removeAllGroups = function(){
    $scope.myGroupList = []; //would really be the ID;

    userService.queryGroupList($scope.email).then(function(){
      var queryGroupList = userService.getGroupListQuery();
      queryGroupList[0].set("userGroups", $scope.myGroupList);
      queryGroupList[0].save();
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
        $scope.myGroupList[$scope.myGroupList.length] = {id: Group.id, name: $scope.newGroupName, color: $scope.groupColor };
        /* clear text box */
        $scope.newGroupName = '';
      }
    });

    /* END CODE TO CREATE THE GROUP */



    //This sets the current User's GroupList userGroups array to be updated with the new group
    var GroupList = Parse.Object.extend("GroupList");
    var query = new Parse.Query(GroupList);
    query.equalTo("userEmail", $scope.email);
    query.find({
      success: function(cloudGroupList) {
        console.log("Setting Grouplist");
        console.log($scope.myGroupList);
        
        cloudGroupList[0].set("userGroups", $scope.myGroupList);
        console.log(cloudGroupList);
        cloudGroupList[0].save();
      },
      error: function(cloudGroupList, error) {
        console.log("error with cloudGroupList");
      }
    });
    $timeout(function(){$scope.$apply()}, 1000);
    $timeout(function(){$scope.$apply()}, 2000);
    $timeout(function(){$scope.$apply()}, 5000);

  }


  /*
   * Function name: getRandomColor
   *
   */
  $scope.getRandomColor = function() {
    var num = Math.floor(Math.random() * 4);
    switch(num){
      case 0:
        return '#B9F5FF';
        break;
      case 1:
        return '#B5FBA3';
        break;
      case 2:
        return '#FFA6B1';
        break;
      default:
        //default
        return '#FEC12F';
    }
  }
}]);
