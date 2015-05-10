/*
 * FileName: GroupController.js
 * Authors: Joe d'Eon (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the view of a single
 *              group. It will have all attributes and behaviors of a single
 *              group. It will be able to access the database to get said
 *              attributes of a group.
 *
 * Attributes: name     - The name of the group.
 *             schedule - an array of days where each day is an array of events
 *                        where each event has:
 *                              name: string
 *                              startTime: time
 *                              endTime: time
 *                              startDate: date
 *                              endDate: date
 *                              recurring: boolean
 *             groupID     - unique ID of the group
 *             membersList - a list of members with the group leader in 
 *                           position zero. Each element will be a user email.
 *             groupLeader - can manipulate information.
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

app.controller('GroupController', ['$scope','groupService', function($scope, groupService) { 


  /* Watch to see if single group view is set to true, if it is, pull down group id*/
  $scope.$watch('singleGroupView', function(){
    if($scope.singleGroupView === true){
      /* get the groupId from service */
      $scope.currentGroupId = groupService.getGroupId();

      var Group = Parse.Object.extend("Group");
      var query = new Parse.Query(Group);
      query.equalTo("objectId", $scope.currentGroupId);
      query.find({
        success: function(group){
          $scope.gSchedule = group[0]._serverData.gSchedule;
          $scope.groupName = group[0]._serverData.name;
          $scope.$apply();
        },
        error: function(group, error){
          console.log("getting group by object id failed");
        }
      });


    }
  });


  $scope.addMember = function(){
    var query = new Parse.Query(GroupList);
    query.equalTo("userEmail", $scope.newMemberEmail);
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
