/*
 * Filename: dataBaseService.js
 *
 * Purpose: This file holds all querying functions for the application. The
 *          goal of having all dataBase interactions in a single service is so 
 *          that when we move our application to a different database, all the
 *          front-end changes will be in this service.
 *
 * Description: Holds three queries for other services/controllers to call.
 *
 * Functions:
 *  queryGroupList - query a grouplist
 *  queryGroup -     query a Group
 *  queryUser -      query a user
 */


app.service('dataBaseService',['$q', function($q){

    /************************************************************************
     * Name:        queryGroupList

     * Purpose:     To query the database and return the result.

     * Called In:   userService.js and groupService.js

     * Description: Uses parse's library to query the database.
     
     * Parameters: newEmail - the email of the user's groupList to get
     ************************************************************************/
    var queryGroupList = function(newEmail){
        /* $q is a promise service, we can ask it to wait until something is done
         * then return a promise */
        var deferred = $q.defer();
        var GroupList = Parse.Object.extend("GroupList");
        var query = new Parse.Query(GroupList);
        query.equalTo("userEmail", newEmail);

        /* this will be resolved before returned promise */
        query.find().then(function(pulledList) {
            deferred.resolve(pulledList);
        })
        return deferred.promise;
    };

    /************************************************************************
     * Name:        queryGroup

     * Purpose:     To query the database using parse's api and return the
     *              result.

     * Called In:   groupService.js

     * Description: Uses parse's library to query the database.
     
     * Parameters: groupId - the groupID to query.
     ************************************************************************/
    var queryGroup = function(groupId){
        /* $q is a promise service, we can ask it to wait until something is done
         * then return a promise */
        var deferred = $q.defer();
        var Group = Parse.Object.extend("Group");
        var query = new Parse.Query(Group);
        query.equalTo("objectId", groupId);

        /* this will be resolved before returned promise */
        query.find().then(function(pulledGroup) {
            deferred.resolve(pulledGroup);
        })
        return deferred.promise;
    };

    /************************************************************************
     * Name:        queryGroup

     * Purpose:     To query the database using parse's api and return the
     *              result.

     * Called In:   groupService.js and userService.js

     * Description: Uses parse's library to query the database.
     
     * Parameters: groupId - the userEmail to query.
     ************************************************************************/
    var queryUser = function(userEmail){
        /* $q is a promise service, we can ask it to wait until something is done
         * then return a promise */
        var deferred = $q.defer();
        var User = Parse.Object.extend("User");
        var query = new Parse.Query(User);
        query.equalTo("username", userEmail);

        /* this will be resolved before returned promise */
        query.find().then(function(pulledUser) {
            deferred.resolve(pulledUser);
        })
        return deferred.promise;
    };

    /* The names of the functions accessible in any controller, service, or
     * directive that injects this service as a dependancy.*/
    return {
        queryGroup : queryGroup,
                   queryUser : queryUser,
                   queryGroupList : queryGroupList

    };



}]);
