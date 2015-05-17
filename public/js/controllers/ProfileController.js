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



app.controller('ProfileController', ['$scope', 'groupService','$timeout','userService','uiCalendarConfig', '$modal', '$log', 
                                     function($scope, groupService, $timeout, userService, uiCalendarConfig, $modal,$log) {
    
  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
      
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
                                         
$scope.friendsModal = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'friendList.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
     
    modalInstance.result.then(function (selectedItem) {
    $scope.selected = selectedItem;
    }, function () {
        $log.info('Modal dismissed at: ' + new Date());
    });
  };

$scope.settingsModal = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'settings.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
     
    modalInstance.result.then(function (selectedItem) {
    $scope.selected = selectedItem;
    }, function () {
        $log.info('Modal dismissed at: ' + new Date());
    });
  };



$scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
};
    
                                         
$scope.addGroupModal = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'addGroup.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
    $scope.selected = selectedItem;
    }, function () {
        $scope.myGroupList = userService.getGroupList();
        $log.info('Modal dismissed at: ' + new Date());
        
    });
    };

                                                                                                                       
                                         
  /* user data */
  $scope.userName = currentUser.get("name");
  $scope.joinDate = currentUser.createdAt;
  $scope.email = currentUser.get("username");
  $scope.eventArray = currentUser.get("personalSchedule");
  $scope.friendList = currentUser.get("friendList");
								 
  //set users email in service
  userService.setEmail(currentUser.get("username")); 
  userService.setName($scope.userName);
								 
  // source for calendar events
  $scope.eventSources = [$scope.eventArray];
  //configuration for calendar
  $scope.uiConfig = {
    calendar:{
        height: "100%",
        viewRender: function(view, element) {
            $log.debug("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
        },
		editable: true,
		defaultView: 'agendaWeek'
    }
};



  /* asks the service to please pull the group list of desire email,
   * then it gets the groupList from the service when its done pulling */
  userService.queryGroupList($scope.email).then(function(){
    $scope.myGroupList = userService.getGroupList();
  });

  $scope.addGroup = function(){	
    groupService.addGroupId($scope.currentGroupId);
    groupService.addGroupColor($scope.currentGroupColor);
  }

  
  /* Function: Date
   * Desciption: Called to get a new date object, offset will offset the hour. Minutes and seconds and milliseconds
   * 			 set to 0.
   *
   */
  $scope.Date = function(hourOffset){
     var date =  new Date();
        date.setMinutes(0);
        date.setMilliseconds(0);
        date.setSeconds(0);
        if(hourOffset){
            date.setHours(date.getHours() + hourOffset);
        }
        
	  return date;
  };

  

  /************************************************************************
   * Name:    removeAllGroups()

   * Purpose:   Allows the user to remove themselves from all groups they are in.

   * Called In:   index.html

   * Description: Removs all groups found in their GroupList userGroups array.
   ************************************************************************/
  $scope.removeAllGroups = function(){
    $scope.myGroupList = []; 
    userService.queryGroupList($scope.email).then(function(){
      var queryGroupList = userService.getGroupListQuery();
      queryGroupList[0].set("userGroups", $scope.myGroupList);
      queryGroupList[0].save();
    });
  }

   /************************************************************************
   * Name:    removeGroup()

   * Purpose:   Remove a single group.

   * Called In:   index.html

   * Description: Removs all groups found in their GroupList userGroups array.
   ************************************************************************/
  $scope.removeGroup = function(){
    userService.removeGroup($scope.removedGroup);
    for (i = 0; i < $scope.myGroupList.length; i++){
      if($scope.myGroupList[i]['id'] === $scope.removedGroup){
        $scope.myGroupList.splice(i, 1);
        $scope.removedGroup = '';
        break;
      }
    }
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
    userService.createGroup($scope.userName, $scope.email, $scope.myGroupList, $scope.newGroupName, $scope.groupColor).then(function(){
      /* this is to ensure scope gets applied even if query takes a bit too long*/
      $timeout(function(){$scope.$apply()}, 150);
    });
    /* clear text box */
    $scope.newGroupName = '';

  }
 /************************************************************************
   * Name:    addEvent()

   * Purpose:   Allows the user to add an event to their calendar.

   * Called In:   index.html

   * Description: Removs all groups found in their GroupList userGroups array.
   ************************************************************************/
  $scope.addEvent = function(){
    var newEventStart = "";
    var newEventEnd = "";
    console.log($scope.newSingleEventStartDate);
    console.log($scope.newSingleEventStartTime);
    newEventStart = $scope.newSingleEventStartDate;
    newEventEnd = $scope.newSingleEventEndDate;
    
    $scope.eventArray.push({
      title  : $scope.newEventName,
      start  : newEventStart,
      end    : newEventEnd
    });

    console.log($scope.eventArray);

    currentUser.set("personalSchedule", $scope.eventArray);
    currentUser.save(null, {
      success: function(object) {
      }
    });

  }
  //ADDED BY SARA
  $scope.addFriend = function() {
	var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
	query.equalTo("username", $scope.newFriend);
	query.find().then(function(pulledFriend) {
		$scope.friendList.push({email: $scope.newFriend, name:pulledFriend[0].attributes.name});
		console.log($scope.friendList);
		currentUser.set("friendList", $scope.friendList);
		currentUser.save();
	});
    
    
  }

  $scope.settingsSave = function(){
    if ($scope.newUserName){
      currentUser.set("name", $scope.newUserName);
      $scope.userName = $scope.newUserName;
    }
    if ($scope.newEmail){ 
      currentUser.set("username", $scope.newEmail);
      currentUser.set("email", $scope.newEmail);
    }
    if ($scope.newPassword){
      currentUser.set("password", $scope.newPassword);
    }
  currentUser.save();
  $scope.newUserName = "";
  userService.setName($scope.newUserName);
  $scope.newEmail = "";
  $scope.newPassword = "";
}

}]);

 /************************************************************************
   * Name:    ModalInstanceCtrl

   * Purpose: Controller for Modal

   * Called In:   ProfileController and GroupController

   * Description: Modal control
   ************************************************************************/
app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
