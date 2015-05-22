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
var newIcon = 'images/userIcon.png';


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
          //$log.info('Modal dismissed at: ' + new Date());
          
      });
      };

                                                                                                                         
                                           
    /* user data */
    $scope.userName = currentUser.get("name");
    $scope.icon = currentUser.get("userIcon");
    $scope.joinDate = currentUser.createdAt;
    $scope.email = currentUser.get("username");
    $scope.eventArray = currentUser.get("personalSchedule");
    $scope.friendList = currentUser.get("friendList");
  								 
    //set users email in service
    userService.setEmail(currentUser.get("username")); 
    userService.setName($scope.userName);

    $scope.dayRepeat = {
      monday : false,
      tuesday : false,
      wednesday : false,
      thursday : false,
      friday : false,
      saturday : false,
      sunday : false
    };
  								 
    // source for calendar events
    //$scope.eventSources = [$scope.eventArray];
     $scope.eventSources = [{
       events: $scope.eventArray,

         color: 'green',
         eventBackgroundColor: 'blue',  // an option!
         textColor: 'white', // an option!
         overlap: false

         //     rendering: 'inverse-background'
     }];

     console.log($scope.eventSources);


    // Profile Calendar Settings
  // -----------------------
    $scope.uiConfig = {
      calendar:{
          height: 795,
          viewRender: function(view, element) {
              //$log.debug("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
          },
  		editable: true,
  		defaultView: 'agendaWeek',
      slotDuration: '00:30:00',
      minTime: '06:00:00',
      maxTime: '22:00:00',
      dayClick: function(date, jsEvent, view) {
        console.log("Clicked on " + date.format());
      },
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      }
      }
    };

    /* asks the service to please pull the group list of desire email,
   * then it gets the groupList from the service when its done pulling */
  userService.queryGroupList($scope.email).then(function(){
    $scope.myGroupList = userService.getGroupList();
  });

  $scope.addGroup = function(){	
    groupService.setGroupId($scope.currentGroupId);
    groupService.setGroupColor($scope.currentGroupColor);
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
    if ($scope.newGroupName == undefined){
      var Group = Parse.Object.extend("Group");
      var query = new Parse.Query(Group);
      query.get($scope.newGroupCode);
      query.find().then(function(pulledGroup) {
        pulledGroup[0]._serverData.memberList.push({name: $scope.userName, email: $scope.email});
        pulledGroup[0].save();

        userService.queryGroupList($scope.email).then(function(){
        var queryGroupList = userService.getGroupListQuery();
        $scope.myGroupList.push({id: pulledGroup[0].id, name: pulledGroup[0]._serverData.name, color: "#B5FBA3"});
        queryGroupList[0].set("userGroups", $scope.myGroupList);
        queryGroupList[0].save();
        console.log(queryGroupList[0]);
        })
      });
    }
    else{userService.createGroup($scope.userName, $scope.email, $scope.myGroupList, $scope.newGroupName, $scope.groupColor).then(function(){
      /* this is to ensure scope gets applied even if query takes a bit too long*/
      $timeout(function(){$scope.$apply()}, 150);
    });
    /* clear text box */
    $scope.newGroupName = '';

     $('#calendar').fullCalendar('render');
  }

  }

  /************************************************************************
   * Name:    createEvent()

   * Purpose:   Allows the user to add an event to their calendar.

   * Called In:   index.html

   * Description: Removs all groups found in their GroupList userGroups array.
   ************************************************************************/
  $scope.createEvent = function(){

    
    //Generates All Variables to Moments. Easier to follow through code.
    var myStartDate = moment($scope.eventStartDate.toISOString()).dateOnly(); //moments
    var myStartHour = moment($scope.eventStartTime.toISOString()).hour();
    var myStartMin = moment($scope.eventStartTime.toISOString()).minute();
    var myEndHour = moment($scope.eventEndTime.toISOString()).hour(); 
    var myEndMin = moment($scope.eventEndTime.toISOString()).minute();
    var myEndDate = moment($scope.eventEndDate.toISOString()).dateOnly();
    var myName = $scope.newEventName;
    var repeatTheseDays = [];

    if($scope.repeatingEvent){
      
      var myRecurRules = (moment(myStartDate)).recur(myEndDate);
      console.log(myRecurRules);

      if ($scope.dayRepeat.monday === true){
        repeatTheseDays.push(1);
      }
      if ($scope.dayRepeat.tuesday === true){
        repeatTheseDays.push(2);
      }
      if ($scope.dayRepeat.wednesday === true){
        repeatTheseDays.push(3);
      }
      if ($scope.dayRepeat.thursday === true){
        repeatTheseDays.push(4);
      }
      if ($scope.dayRepeat.friday === true){
        repeatTheseDays.push(5);
      }
      if ($scope.dayRepeat.saturday === true){
        repeatTheseDays.push(6);
      }
      if ($scope.dayRepeat.sunday === true){
        repeatTheseDays.push(0); 
      }
    

       myRecurRules = (myRecurRules.every(repeatTheseDays)).daysOfWeek();
       allDates = myRecurRules.all();

        for (index = 0; index < allDates.length; index++){
         $scope.eventSources[0].events.push({
            title : myName,
            start : ((allDates[index].set('hour', myStartHour)).set('minute', myStartMin)).toISOString(),
            end   : ((allDates[index].set('hour', myEndHour)).set('miute', myEndMin)).toISOString()
         });
        }
    }    
     //If not repeating, treat as single event.
    else{
       $scope.eventSources[0].events.push({
         title : myName,
         start : ((myStartDate.set('hour', myStartHour)).set('minute', myStartMin)).toISOString(),
         end   : ((myEndDate.set('hour', myEndHour)).set('minute', myEndMin)).toISOString()
       });
    }


    console.log($scope.eventSources[0].events);
     currentUser.set("personalSchedule", $scope.eventSources[0].events);
     currentUser.save();

     $scope.eventName = '';


     //$('#calendar').fullCalendar('render');
     //$scope.eventSources.$dirty;
  }

  $scope.removeAllEvents = function(){
    //$scope.eventSources[0].events.length = 0;
    //currentUser.set("personalSchedule", $scope.eventSources.events);
    //currentUser.save();

    console.log($scope.eventSources[0].events);
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
    };
    currentUser.set("userIcon", newIcon)
    currentUser.save();
    $scope.newUserName = "";
    userService.setName($scope.newUserName);
    $scope.newEmail = "";
    $scope.newPassword = "";
  }
}]);

 /************************************************************************
   * Name:        ModalInstanceCtrl

   * Purpose:     Controller for Modal

   * Called In:   ProfileController and GroupController

   * Description: Modal control
   ************************************************************************/
app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

/************************************************************************
 * Name:        CollapseInstanceCtrl

 * Purpose:     Collapsibleontroller for Collapsible

 * Called In:   ProfileController

 * Description: This controller holds all the fields and functions
                associated wth the collapsible. This has fields and
                functions specifically designed for displaying the user 
                icons in the account settings modal.
 ************************************************************************/
app.controller('CollapseInstanceCtrl', function ($scope) {
  //Set the collapsible to be hidden initially
  $scope.isCollapsed = true;

  //Create an array to hold the icon objects. Think of this as an array of structs (c/c++).
  var icons = $scope.icons = [];

  //Add icons to the list by initializing fields and pushing onto the array
  icons.push({
    id: 1,
    image: 'images/userIcon.png',
    name: 'Super Hero',
    selected: 1
  });
  
  //Note: this pushes the icons into the array in the following pattern: 
  //Hipster Male 1, Hipster Female 1, Hipster Male 2, Hipster Female 2, Hipster Male 3, ... , Hipster Female 8
  for (var i = 1; i <= 8; ++i) {
    icons.push({
      id: (i + 1),    /* Gives id's 2 - 9 */
      image: 'images/hipsterMale' + i + '.png',
      name: 'Hipster Male ' + i,
      selected: 0
    });
    icons.push({
      id: (i + 9),    /* Gives id's 10 - 17 */
      image: 'images/hipsterFemale' + i + '.png',
      name: 'Hipster Female ' + i,
      selected: 0
    });
  }

  //Sets the selected field of all icons except for the one clicked on to 0. Sets selected field of clicked on icon to 1.
  //Allows ng-class to assign the selected class css to only the icon clicked on.
  $scope.clearSel = function(event) {
    //Loops through each element of the array
    angular.forEach(icons, function(icon) {
      //Check if the clicked on icon's src attribute is NOT the same as the current iteration of the array's image field
      if ($(event.target).attr('src') != icon.image) {
        //Sets selected field to false because this icon in the array is not the one clicked on
        icon.selected = 0;
      } else {
        //Sets selected field to true becuase this icon in the array is the one clicked on.
        icon.selected = 1;
        newIcon = icon.image;
      }
    });
  }
});
