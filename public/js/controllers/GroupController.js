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

app.controller('GroupController', ['$scope', function($scope) { 
   // $scope.title = 'This Month\'s Bestsellers'; TEMPLATE for attributes

  
}]);
