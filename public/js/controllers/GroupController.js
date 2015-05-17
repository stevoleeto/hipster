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

app.controller('GroupController', ['$scope','groupService', '$timeout', 'uiCalendarConfig', function($scope, groupService, $timeout, uiCalendarConfig) { 

  $scope.eventSources = [
    [
      {
        title: 'Event1',
        start: '2015-05-13'
      }
    ]
  ];
    
$scope.uiConfig = {
    calendar:{
        height: "100%",
        viewRender: function(view, element) {
            $log.debug("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
        },
		defaultView: 'agendaWeek'
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
     //   $timeout(function(){ uiCalendarConfig.calendars['groupCalendar'].
      //    fullCalendar('changeView','agendaWeek')}, 50);
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



$scope.addMember = function(){
  var Group = Parse.Object.extend("Group");
  var query = new Parse.Query(Group);
  query.equalTo("objectId", $scope.currentGroupId);
  query.find({
    success: function(group){
      $scope.groupName = group[0]._serverData.name;
      $scope.memberList = group[0]._serverData.memberList;

      /* get new member's schedule and update view with it */
      var User = Parse.Object.extend("User");
      var query = new Parse.Query(User);
      query.equalTo("username", $scope.newMemberEmail);
      query.find({
        success: function(member){
          $scope.eventSources.push(member[0]._serverData.personalSchedule);
          $scope.$apply();
        },
        error: function(member, error){
          console.log("MEMBER SCHEDULE UPDATE ERROR");
        }
      });

      /* get the grouplist for the new member so we can add this group to it! */
      var GroupList = Parse.Object.extend("GroupList");
      var query = new Parse.Query(GroupList);
      query.equalTo("userEmail", $scope.newMemberEmail);
      query.find({
        success: function(object) {
          var tempList = object[0]._serverData.userGroups;
          tempList[tempList.length] = {id: groupService.getGroupId(), name: $scope.groupName, color: groupService.getGroupColor()};
          object[0].set("userGroups", tempList);
          object[0].save();
          $scope.memberList[$scope.memberList.length] = {name:object[0]._serverData.userName, email:object[0]._serverData.userEmail};
          group[0].save();
        },
        error: function(object, error) {
          console.log(error);
        }
      });    
    },
      error: function(group, error){
        console.log("getting group by object id failed");
      }
  });
  $timeout(function(){$scope.$apply()}, 1000);
  $timeout(function(){$scope.$apply()}, 2000);
  $timeout(function(){$scope.$apply()}, 5000);

}




}]);
