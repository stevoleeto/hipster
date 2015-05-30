/*
 * Filename: userService.js
 * Description: Service for user information.
 *
 *
 */


app.service('userService',['$q','googleCalendarService', 'dataBaseService' ,function($q, googleCalendarService, dataBaseService){

    var groupList;
    var email;
    var name;
    var friendGroupList;
    var groupListQuery;

    var googleCalendar = []; // initialize calendar to an empty array

    /* Function name: queryGroupList
     * Description: pulls the group list of the desired email, if it already has
     *              it, does nothing, otherwise it pulls it from database.
     * Return: returns a promise since the query runs asynchronously. .then() can
     *         be used to do something after the query has been done.
     *
     */

    var getNewGroupList = function(){
        return groupList;
    };
    var getCurrentSchedule = function(email){
        var deferred = $q.defer();
        dataBaseService.queryUser(email).then(function(userQuery){
            deferred.resolve(userQuery[0].get("personalSchedule"));
        });
        return deferred.promise;
    };


    var getGroupList = function(newEmail){
        var deferred = $q.defer();
        dataBaseService.queryGroupList(newEmail).then(function(groupListQuery){
            groupList = groupListQuery[0].get("userGroups");
            deferred.resolve(groupListQuery[0].get("userGroups"));   
        });
        return deferred.promise;
    };

    var getFriendGroupList = function(){
        return friendGroupList;
    }

    var setEmail = function(newEmail){
        email = newEmail;
    }

    var setName = function(newName){
        name = newName;
    }

    var createGroup = function(userName, userEmail, userGroupList, newGroupName, newGroupColor){
        var Group = Parse.Object.extend("Group");
        var newGroup = new Group();
        newGroup.set("name", newGroupName);
        newGroup.set("memberList", [{name: userName, email: userEmail}]);
        newGroup.set("groupSchedule", []);
        newGroup.save(null, {
            success: function(Group){
                userGroupList[userGroupList.length] = {id: Group.id, name: newGroupName, color: newGroupColor};
            }
        });

        return dataBaseService.queryGroupList(userEmail).then(function(groupListQuery){
            groupListQuery[0].set("userGroups", userGroupList);
            groupListQuery[0].save();
        });
    };

    var removeGroup = function(groupToRemove){
        dataBaseService.queryGroupList(email).then(function(groupListQuery){
            var groupsList = groupListQuery[0]._serverData.userGroups;

            //removes group from member's group list
            for (i = 0; i < groupsList.length; i++){
                if(groupsList[i]['id'] === groupToRemove){
                    groupsList.splice(i, 1);
                    groupListQuery[0].set("userGroups", groupsList);
                    groupListQuery[0].save();
                    break;
                }
            }

            //removes member from GROUP member list
            dataBaseService.queryGroup(groupToRemove).then(function(groupQuery){
                var memberList = groupQuery[0]._serverData.memberList;
                console.log(memberList);
                console.log(email);

                for (index = 0; index < memberList.length; index++){
                    if(memberList[index]['email'] === email){
                        console.log(index);
                        memberList.splice(index,1);
                        console.log(memberList);
                        groupQuery[0].set("memberList", memberList);
                        groupQuery[0].save();
                        break;
                    }
                }
            });
        });
    };

    var setGoogleCalendar = function(calendarID){
        return googleCalendarService.queryGoogleCalendar(calendarID).then(function(newCal){
            /* iterate over items in googleCal */
            if(googleCalendar.length === 0){ //make sure we don't have it already
                for(index = 0; index< newCal.items.length; index++){
                    var startTime;
                    var endTime;

                    if(newCal.items[index].start){
                        startTime = newCal.items[index].start.dateTime;
                    }
                    if(newCal.items[index].end){
                        endTime = newCal.items[index].end.dateTime;
                    }
                    if(startTime && endTime){
                        var newEvent = {
                            textColor: 'white',
               title: newCal.items[index].summary + "\nGoogle Calendar",
               id: 9,
               start: startTime,
               end: endTime,
               color: 'green'
                        }
                        googleCalendar.push(newEvent);
                    }
                }
            }
        });
    };

    var clearGroupList = function(email){
        dataBaseService.queryGroupList().then(function(groupListQuery){
            groupListQuery[0].set("userGroups", []);
            groupListQuery[0].save();
        });
    };

    var getGoogleCalendar = function(){
        return googleCalendar;
    };




    return {
        // return all functions here so the dependant knows what to call!
        getGroupList: getGroupList,
            getNewGroupList: getNewGroupList,
            getFriendGroupList: getFriendGroupList,
            createGroup: createGroup,
            removeGroup: removeGroup,
            setEmail : setEmail,
            setName : setName,
            getGoogleCalendar : getGoogleCalendar,
            setGoogleCalendar : setGoogleCalendar,
            getCurrentSchedule : getCurrentSchedule
    };

}]);
