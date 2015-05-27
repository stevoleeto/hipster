/*
 * FileName: GroupController.js
 * Authors: Joe d'Eon (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the view of a single
 *              group. It will have all attributes and behaviors of a single
 *              group. It will be able to access the database to get said
 *              attributes of a group.
 *
 * Attributes: name     - The name of the group.
 *             currentGroupID     - unique ID of the group
 *             membersList - a list of members with the group leader in 
 *                           position zero. Each element will be a user email.
 *             groupColor - the color of this group, gotten from service
 *
 *             
 *
 * Behaviors: createMeeting() - anyone will be able to create a meeting
 *            freeTime()      - this will be our main algorithm to get the 
 *                              available free time for our group. This will be
 *                              delegated to a function outside of controller.
 *            deleteGroup()   - delete this group
 *            addMembers()    - add members to the group (only group leader)
 *          
 * 
 */

var currentUser = Parse.User.current();

app.controller('GroupController', ['$scope','groupService', 'eventService', '$timeout', 'uiCalendarConfig','$log', '$modal', '$window', 
    function($scope, groupService, eventService, $timeout, uiCalendarConfig, $log, $modal, $window) { 


    /* DEFAULT COLORS */
      var freeTimeColor = 'green';
      var busyTimeColor = '#D2D2CD';
    /* Event Id's */
      var freeId = 999;
      var busyId = 1000;
      
      /* Initialize event sources to be an array */
    $scope.eventSources = [];

  $scope.animationsEnabled = true;    
  /************************************************************************
   * Name:        addMemberModal

   * Purpose:     To create a modal for the user to add a new member to a group.

   * Called In:   index.html

   * Description: Creates a modal for the user to enter new member information
   *              into, so as to add a new member to the group. This function
   *              is in charge of updating the view with the new members
   *              schedule and the new members name.
   ************************************************************************/
  $scope.addMemberModal = function (size) {
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'addMember.html',
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
        /* update view after modal is dismissed by addMember() */
        $scope.memberList = groupService.getMemberList();
        var newMember = groupService.getNewMember();
        if(newMember){
        var tempSched = newMember.personalSchedule;
        for(index = 0; index < tempSched.length; index++){
          tempSched[index].rendering = "background";
          tempSched[index]._id = busyId;
          tempSched[index].__id = busyId;
          tempSched[index].color = busyTimeColor;
        }
        $scope.eventSources.push(tempSched);
        }
        else{
          console.log("New Member not found");
        }
    });
  };

  /* Group Calendar Settings */
  /* ----------------------- */
  $scope.uiConfig = {
      calendar:{
          height: 'auto',
          viewRender: function(view, element) {
              //$log.debug("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
          },
  		defaultView: 'agendaWeek',
      slotDuration: '01:00:00',
      minTime: '06:00:00',
      maxTime: '22:00:00',
      dayClick: function(date, jsEvent, view) {
        console.log("Clicked on " + date.format());
      },
          allDaySlot:false
      }
  };

  /* END Group Calendar Settings */
  /* --------------------------- */

  /* Watch to see if single group view is set to true, if it is, pull down group id*/
  $scope.$watch('singleGroupView', function(){
    if($scope.singleGroupView === false){
      /* clear current group data */
      $scope.groupName = '';
      $scope.eventSources.length = 0;
      groupService.clearMemberArray();
    }
    /* if we have switched to single group view */
    if($scope.singleGroupView === true){
      $scope.currentGroupId = groupService.getGroupId();
      $scope.groupColor = groupService.getGroupColor();

      /* initialize group data and get an array of the member's events 
       * through a callback */
      groupService.initGroup().then(function(returnedEvents){
        console.log("RETURNED EVENTS");
        console.log(returnedEvents);
        $scope.groupName = groupService.getGroupName();
        $scope.memberList = groupService.getMemberList();
        console.log("MEMBER LIST");
        console.log($scope.memberList);
        /* iterate through the returned events array and push all events 
         * into our source */
        for(index = 0; index < returnedEvents.length; index++){
            if(returnedEvents[index].length !== 0){
                $scope.eventSources.push(returnedEvents[index]);
            }
        }
      })
    }
  });


  /************************************************************************
   * Name:    addMember()

   * Purpose: Add members to group.

   * Called In:   index.html

   * Description: This function queries the database to get the group's memberlist
   *				then updates it with the new member. Once that is done, it 
   *				queries the database to get the groupList associated with the
   *				new member and adds the new group to their list.
   ************************************************************************/
  $scope.addMember = function(){
    groupService.addMember($scope.currentGroupId, $scope.newMemberEmail).then(function(){
      $scope.cancel(); // close the modal, which is in charge of updating view
    })
  };



  /************************************************************************
   * Name:        createEvent()

   * Purpose:     Allows the user to add an event to the group calendar.

   * Called In:   index.html

   * Description: Creates an event on the group calendar. TODO
   ************************************************************************/
  $scope.createEvent = function(){
    var repeatTheseDays = [];
    var repeat = false;
    
    if (!$scope.newEventName){
      alert("Enter a event name!");
      return;
    }

    if ($scope.eventColor.mine == '#fff') {
      alert("Choose a color for your event!");
      return;
    }

    if ($scope.dayRepeat.monday || 
      $scope.dayRepeat.tuesday || 
      $scope.dayRepeat.wednesday ||
       $scope.dayRepeat.thursday ||
        $scope.dayRepeat.friday ||
         $scope.dayRepeat.saturday ||
          $scope.dayRepeat.sunday){
      repeat = true;
    }
    
    if(repeat){

      if ($scope.dayRepeat.monday){
        repeatTheseDays.push(1);
      }
      if ($scope.dayRepeat.tuesday){
        repeatTheseDays.push(2);
      }
      if ($scope.dayRepeat.wednesday){
        repeatTheseDays.push(3);
      }
      if ($scope.dayRepeat.thursday){
        repeatTheseDays.push(4);
      }
      if ($scope.dayRepeat.friday){
        repeatTheseDays.push(5);
      }
      if ($scope.dayRepeat.saturday){
        repeatTheseDays.push(6);
      }
      if ($scope.dayRepeat.sunday){
        repeatTheseDays.push(0); 
      }
    }    
     
     eventService.createEvent($scope.newEventName, //event name
        $scope.eventColor, //event color
        (moment($scope.eventStartDate.toISOString()).dateOnly()), //start date
        (moment($scope.eventStartTime.toISOString()).hour()), //start hour
        (moment($scope.eventStartTime.toISOString()).minute()), //start min
        (moment($scope.eventEndDate.toISOString()).dateOnly()), //end date
        (moment($scope.eventEndTime.toISOString()).hour()), //end hour
        (moment($scope.eventEndTime.toISOString()).minute()), //end min
        repeat, //does this event repeat?
        repeatTheseDays); //what does does this event repeat on

     newEvents = eventService.getEvents();
     
     for (index = 0; index < newEvents.length; index++){
        $scope.eventSources.push(newEvents[index]); 
     }
     
     //currentUser.set("personalSchedule", $scope.eventSources[0].events);
     //currentUser.save();

     $scope.newEventName = "";

     eventService.clearEvents();
  }

  /*
   * Time Picker
   *
   *
   *
   *
   */

   
  $scope.eventStartTime = new Date();
  $scope.eventEndTime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 1;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.eventStartTime = d;
    $scope.eventEndTime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };

  $scope.getMemberIcon = function(email) {
    var members = $scope.memberList;
    var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    query.equalTo("email", email);
    query.find().then(function(pulledMember) {
      if (pulledMember[0]._serverData.userIcon == ""){
        pulledMember[0]._serverData.userIcon == "images/userIcon.png";
      }
      
      for (var index = 0; index < members.length; ++index) {
        if (members[index].email == email) {
          members[index]["icon"] = pulledMember[0]._serverData.userIcon;
        }
      }
    });
  }
}]);
