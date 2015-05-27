app.service('dataBaseService',['$q', function($q){
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
        query.find().then(function(pulledList) {
            deferred.resolve(pulledList);
        })
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
        query.find().then(function(pulledGroup) {
            deferred.resolve(pulledGroup);
        })
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
        query.find().then(function(pulledUser) {
            deferred.resolve(pulledUser);
        })
        return deferred.promise;
    };

    /* END query functions */
    /*---------------------*/
    return {
        queryGroup : queryGroup,
        queryUser : queryUser,
        queryGroupList : queryGroupList

    };



}]);
