/*
 * Filename: userService.js
 * Description: Service for user information.
 *
 *
 */


app.service('userService',['$q', function($q){

  var groupList;
  var email;
  var friendGroupList;

  var groupListQuery;

  /* Function name: queryGroupList
   * Description: pulls the group list of the desired email, if it already has
   *              it, does nothing, otherwise it pulls it from database.
   * Return: returns a promise since the query runs asynchronously. .then() can
   *         be used to do something after the query has been done.
   *
   */
  var queryGroupList = function(newEmail){
    /* $q is a promise service, we can ask it to wait until something is done
     * then return a promise */
    var deferred = $q.defer();
    var GroupList = Parse.Object.extend("GroupList");
    var query = new Parse.Query(GroupList);
    query.equalTo("userEmail", newEmail);

    /* this will be resolved before returned promise */
    deferred.resolve(
        query.find().then(function(pulledList) {
          if(newEmail === email){
            groupList = pulledList[0]._serverData.userGroups;
          }
          else{
            friendGroupList = pulledList[0]._serverData.userGroups;
          }
          groupListQuery = pulledList;
        })
        );
    return deferred.promise;

  };
  var getGroupList = function(){
    return groupList;
  };

  var getGroupListQuery = function(){
    return groupListQuery;
  }

  var getFriendGroupList = function(){
      return friendGroupList;
  }

  var setEmail = function(newEmail){
      email = newEmail;
  }

  var createGroup = function(userName, userEmail, userGroupList, newGroupName, newGroupColor){
      var Group = Parse.Object.extend("Group");
      var newGroup = new Group();
      newGroup.set("name", newGroupName);
      newGroup.set("memberList", [{name: userName, email: userEmail}]);
      newGroup.save(null, {
        success: function(Group){
          userGroupList[userGroupList.length] = {id: Group.id, name: newGroupName, color: newGroupColor};
        }
      });

      return queryGroupList(userEmail).then(function(){
        groupListQuery[0].set("userGroups", userGroupList);
        groupListQuery[0].save();
      });
  };

  var removeGroup = function(groupToRemove){
     queryGroupList(email).then(function(){
        var groupsList = groupListQuery[0]._serverData.userGroups;
        for (i = 0; i < groupsList.length; i++){
          if(groupsList[i]['id'] === groupToRemove){
             groupsList.splice(i, 1);
             groupListQuery[0].set("userGroups", groupsList);
             groupListQuery[0].save();
             break;
          }
        }
     });
  }

  var addEvent = function(){

  }

  return {
    // return all functions here so the dependant knows what to call!
    queryGroupList: queryGroupList,
      getGroupList: getGroupList,
      getFriendGroupList: getFriendGroupList,
      getGroupListQuery: getGroupListQuery,
      createGroup: createGroup,
      addEvent: addEvent,
      removeGroup: removeGroup,
      setEmail : setEmail
  };

}]);
