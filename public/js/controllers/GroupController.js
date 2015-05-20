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

app.controller('GroupController', ['$scope','groupService', '$timeout', 'uiCalendarConfig','$log', '$modal', 
    function($scope, groupService, $timeout, uiCalendarConfig, $log, $modal) { 


 
  $scope.eventSources = [
    [
      {
        title: 'Event1',
        start: '2015-05-13'
      }
    ]
  ];

    
  $scope.animationsEnabled = true;    
    
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
        /* after enough time, update the memberlist view with new memberlist and the new personal schedule */
        $timeout(function(){$scope.memberList = groupService.getMemberList()}, 150);
        $timeout(function(){$scope.eventSources.push(groupService.getNewMember().personalSchedule)}, 500);
    });
  };
         
  /* Group Calendar Settings */
  /* ----------------------- */
  $scope.uiConfig = {
      calendar:{
          height: 795,
          viewRender: function(view, element) {
              //$log.debug("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
          },
  		defaultView: 'agendaWeek',
      slotDuration: '00:30:00',
      minTime: '06:00:00',
      maxTime: '22:00:00',
      dayClick: function(date, jsEvent, view) {
        console.log("Clicked on " + date.format());
      }
      }
  };

  /* Watch to see if single group view is set to true, if it is, pull down group id*/
  $scope.$watch('singleGroupView', function(){
    if($scope.singleGroupView === false){
      /* clear current group data */
      $scope.groupName = '';
      $scope.eventSources.length = 0;
    }
    if($scope.singleGroupView === true){
      /* get the groupId from service */
      $scope.currentGroupId = groupService.getGroupId();
      $scope.groupColor = groupService.getGroupColor();

      var Group = Parse.Object.extend("Group");
      var query = new Parse.Query(Group);
      query.equalTo("objectId", $scope.currentGroupId);
      query.find({
        success: function(group){
          $scope.groupName = group[0]._serverData.name;
          $scope.memberList = group[0]._serverData.memberList;
          $scope.$apply();


          /* set group calendar to weekly view! */
          var User = Parse.Object.extend("User");
          var query = new Parse.Query(User);
          for(i= 0; i< $scope.memberList.length; i++){

            query.equalTo("username", $scope.memberList[i].email);
            query.find({
              success: function(member){
                $scope.eventSources.push(member[0]._serverData.personalSchedule);
                $scope.$apply();
              },
              error: function(member, error){
                console.log("MEMBER SCHEDULE UPDATE ERROR");
              }


            });
          }
        },
          error: function(group, error){
            console.log("getting group by object id failed");
          }
      });


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
      //  TODO figure out how to use this promise to update view
      //  $scope.memberList = groupService.getMemberList();
      //  $scope.eventSources.push(groupService.getNewMember().personalSchedule);
    })
  };
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
   * Name:        createEvent()

   * Purpose:     Allows the user to add an event to their calendar.

   * Called In:   index.html

   * Description: Removs all groups found in their GroupList userGroups array.
   ************************************************************************/
  $scope.createEvent = function(){


  }
    }]);
