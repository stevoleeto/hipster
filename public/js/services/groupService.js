/*
 * Filename: groupService.js
 * Purpose: To make database calls and perform business-level logic 
 *          for the controller.
 * Description: Has several query functions which are only to be used 
 *              internally. Also has functions to be called mostly by the
 *              GroupController:
 *              1) addMember: adds a member to the currently selected group.
 *              
 *              Also has getters and setters for all attributes.
 *
 */
app.service('groupService',['$q', function($q){

  /* attributes - public data fields */
  var currentGroupId;
  var groupColor;
  var groupName;
  var memberList;
  var newMember;
  var groupEventArray;

  /* query data fields - private data fields */
  var groupQuery;
  var userQuery;
  var groupListQuery;

  /************************************************************************
   * Name:    addMember()

   * Purpose:  Used by controller to add a member to the group. It can then ask
   *           get the updated fields to update view.

   * Called In:   GroupController

   * Description: Calls the various queries then manipulates the data to
   *              add a member to the group.
   ************************************************************************/
  var addMember = function(groupId, newMemberEmail){
    var deferred = $q.defer();
    /* query the group and get its member list and name */
    queryGroup(groupId).then(function(){
      memberList = groupQuery[0].attributes.memberList;
      groupName = groupQuery[0].attributes.name;

      /* make sure the new member is resolved */
      deferred.resolve(
      /* query the user get it's data */
      queryUser(newMemberEmail).then(function(){
        newMember = userQuery[0].attributes;
      })
      );

      /* make sure the new groupList is resolved */
      deferred.resolve(
      /* query the groupList of the new member and do the following:
       * 1) update the new member's groupList with the new group 
       * 2) update our working memberlist
       * 3) update the memberlist of the group */
      queryGroupList(newMemberEmail).then(function(){
        var newMemberGroupList = groupListQuery[0]._serverData.userGroups;
        /* set new member's grouplist to have the new group in it */
        newMemberGroupList[newMemberGroupList.length] = {id: getGroupId(), name: groupName, color: getGroupColor()};
        /* save the new member's grouplist */
        groupListQuery[0].save();
        /* add username and email to memberlist */
        memberList[memberList.length] = {name: groupListQuery[0].attributes.userName, email:groupListQuery[0].attributes.userEmail};
        /* save group to database with updated memberlist */
        groupQuery[0].save();

        /* cloud code call to send an alert to new member */
        Parse.Cloud.run('mailGroupAlert', {email: newMemberEmail, group: groupName}, {
          success: function(result) {},
          error: function(error) {}
        });

      })
      );

      })
      return deferred.promise;
      };



  /* QUERY FUNCTIONS */
  /*******************/

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
          groupListQuery = pulledList;
        })
        );
    return deferred.promise;
  };

  var queryGroup = function(groupId){
    /* $q is a promise service, we can ask it to wait until something is done
     * then return a promise */
    var deferred = $q.defer();
    var Group = Parse.Object.extend("Group");
    var query = new Parse.Query(Group);
    query.equalTo("objectId", groupId);

    /* this will be resolved before returned promise */
    deferred.resolve(
        query.find().then(function(pulledGroup) {
          groupQuery = pulledGroup;
        })
        );
    return deferred.promise;
  };

  var queryUser = function(userEmail){
    /* $q is a promise service, we can ask it to wait until something is done
     * then return a promise */
    var deferred = $q.defer();
    var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    query.equalTo("username", userEmail);

    /* this will be resolved before returned promise */
    deferred.resolve(
        query.find().then(function(pulledUser) {
          userQuery = pulledUser;
        })
        );
    return deferred.promise;
  };
  
  /* END query functions */
  /*---------------------*/

  /* SETTERS AND GETTERS */
  /***********************/

  var getEventsArray = function(){
      return groupQuery[0].get("groupSchedule");
  }

  var getNewMember = function(){
      return newMember;
  };

  var getGroupList = function(){
    return groupList;
  };

  var setMemberList = function(newMemberList){
    memberList = newMemberList;
  };

  var getMemberList = function(){
    return memberList;
  };

  var setGroupId = function (newGroupId){
    currentGroupId = newGroupId;
  };

  var getGroupId = function(){
    return currentGroupId;
  };

  var setGroupColor = function(color){
    groupColor = color;
  };

  var getGroupColor = function(){
    return groupColor;
  };
    
 var getGroupName = function(){
    return groupName;
 }

  var 

  return {
    addMember : addMember,
      setGroupId: setGroupId,
      getGroupId: getGroupId,
      setGroupColor: setGroupColor,
      getGroupColor: getGroupColor,
      setMemberList : setMemberList,
      getMemberList : getMemberList,
      getNewMember : getNewMember
  };

}]);

