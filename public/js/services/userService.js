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

  return {
    // return all functions here so the dependant knows what to call!
    queryGroupList: queryGroupList,
      getGroupList: getGroupList,
      getFriendGroupList: getFriendGroupList,
      getGroupListQuery: getGroupListQuery,
      setEmail : setEmail
  };

}]);
