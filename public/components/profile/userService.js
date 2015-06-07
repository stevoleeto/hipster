/*
 * FileName: userService.js
 * Authors: Joe d'Eon, Stephen Gilardi
 * Description: This controller will be used to control the view of a single
 *              group. It will have all attributes and behaviors of a single
 *              group. To query the database, one must go throught the
 *              dataBaseService.
 *
 * Attributes: 
 *  groupList - 
 *  email - 
 *  name - 
 *  friendGroupList - 
 *  groupListQuery - 
 *  googleCalendar - 

 *
 * Functions:
 *  getCurrentSchedule - 
 *  getNewGroupList - 
 *  getGroupList - 
 *  getFriendGroupList - 
 *  setEmail - 
 *  setName - 
 *  createGroup - 
 *  removeGroup - 
 *  setGoogleCalendar - 
 *  clearGroupList - 
 *  getGoogleCalendar - 
 *
 */


app.service('userService',['$q','googleCalendarService', 'dataBaseService' ,function($q, googleCalendarService, dataBaseService){

    var groupList;
    var email;
    var name;
    var friendGroupList;
    var groupListQuery;

    var googleCalendar = []; // initialize calendar to an empty array

    /************************************************************************
     * Name:        getCurrentSchedule

     * Purpose:     To get the current group schedule of a user.

     * Called In:   ProfileController.js

     * Description: calls the dataBase service to get the latest user's schedule
     *
     ************************************************************************/
    var getCurrentSchedule = function(email){
        var deferred = $q.defer();
        dataBaseService.queryUser(email).then(function(userQuery){
            deferred.resolve( userQuery[0].get("personalSchedule"));
        });
        return deferred.promise;
    };

    /************************************************************************
     * Name:        getNewGroupList

     * Purpose:     To get the new groupList

     * Called In:   ProfileController.js

     * Description: Gets the current groupList
     *
     ************************************************************************/
    var getNewGroupList = function(){
        return groupList;
    };

    /************************************************************************
     * Name:        getGroupList

     * Purpose:     To query the database and get the latest grouplist

     * Called In:   ProfileController.js

     * Description: Uses dataBase service to get the latest groupList
     *
     ************************************************************************/
    var getGroupList = function(newEmail){
        var deferred = $q.defer();
        dataBaseService.queryGroupList(newEmail).then(function(groupListQuery){
            groupList = groupListQuery[0].get("userGroups");
            deferred.resolve(groupListQuery[0].get("userGroups"));   
        });
        return deferred.promise;
    };


    /************************************************************************
     * Name:        setEmail

     * Purpose:     To set the current email to the passed in parameter.

     * Called In:   ProfileController.js

     * Description: setter for email.
     *
     ************************************************************************/
    var setEmail = function(newEmail){
        email = newEmail;
    }

    /************************************************************************
     * Name:        setName

     * Purpose:     To set the current email to the passed in parameter.

     * Called In:   ProfileController.js

     * Description: setter for name
     *
     ************************************************************************/
    var setName = function(newName){
        name = newName;
    }

    /************************************************************************
     * Name:        createGroup

     * Purpose:     To create a new group.

     * Called In:   ProfileController.js

     * Description: Makes a new parse object and sets all the appropriate 
     *              attributes before savig it to the database.
     * Parameters:
     *              userName - The username of the current user.
     *              userEmail - The current user's email.
     *              userGroupList - The user's groupList to be updated.
     *              newGroupName -  The new group name.
     *              newGroupColor - The new group color.
     *
     ************************************************************************/
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

        //return a promise to query the database
        return dataBaseService.queryGroupList(userEmail).then(function(groupListQuery){
            groupListQuery[0].set("userGroups", userGroupList);
            groupListQuery[0].save();
        });
    };

    /************************************************************************
     * Name:        removeGroup

     * Purpose:     To remove a group from a member's groupList.

     * Called In:   userService.js (this file)

     * Description: Queries a user's groupList and removes a specific group
     *              from said list. Then queries a group and removes a member
     *              from a groupList.
     *
     ************************************************************************/
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

                for (index = 0; index < memberList.length; index++){
                    if(memberList[index]['email'] === email){
                        memberList.splice(index,1);
                        groupQuery[0].set("memberList", memberList);
                        groupQuery[0].save();
                        break;
                    }
                }

                if(memberList.length === 0){
                    groupQuery[0].destroy();
                }

            });
        })};

    /************************************************************************
     * Name:        setGoogleCalendar

     * Purpose:     to set the google calendar in the googleCalendarService

     * Called In:   userService.js (this file)

     * Description: Returns a promise to query the google calendar of a 
     *              specific person and copy all the events from the calendar
     *              and convert to an event format suitable for fullCalendar.
     *
     ************************************************************************/
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
                        // build new event in our desired format
                        var newEvent = {
                            textColor: 'white',
                            title: newCal.items[index].summary + "\nGoogle Calendar",
                            id: 9,
                            start: startTime,
                            end: endTime,
                            color: 'green',
                            stick: true
                        }
                        googleCalendar.push(newEvent);
                    }
                }
            }
        });
    };

    /************************************************************************
     * Name:        clearGroupList

     * Purpose:     To get the groupList of an email and clear it's array
     *              in the database.

     * Called In:   ProfileController.js

     * Description: Gets the groupList and clears its userGroups to empty.
     *
     ************************************************************************/
    var clearGroupList = function(email){
        dataBaseService.queryGroupList().then(function(groupListQuery){
            groupListQuery[0].set("userGroups", []);
            groupListQuery[0].save();
        });
    };

    /************************************************************************
     * Name:        getGoogleCalendar

     * Purpose:     returns the googleCalendar

     * Called In:   ProfileController.js
     ************************************************************************/
    var getGoogleCalendar = function(){
        return googleCalendar;
    };

    /************************************************************************
     * Description: Below is the list of functions that will be available to 
     * any controller, service, or directive that injects this service as a
     * dependency.
     ************************************************************************/
    return {
        // return all functions here so the dependant knows what to call!
        getGroupList: getGroupList,
            getNewGroupList: getNewGroupList,
            createGroup: createGroup,
            removeGroup: removeGroup,
            setEmail : setEmail,
            setName : setName,
            getGoogleCalendar : getGoogleCalendar,
            setGoogleCalendar : setGoogleCalendar,
            getCurrentSchedule : getCurrentSchedule
    };

}]);
