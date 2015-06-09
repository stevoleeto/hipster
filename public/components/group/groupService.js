/*
 * Filename: groupService.js
 *
 * Purpose: This service is in charge of all business logic for single groups.
 *          When a user clicks on a single group, the group controller uses
 *          this service to initialize the member info and group schedule of
 *          events.
 *
 * Description: Calls the dataBaseService to do all necessary queries for member
 *              information and member events.
 *
 * Attributes:
 *   currentGroupId - The current group id to be queried.
 *   groupColor - The current group's color.
 *   groupName - The current group's name.
 *   memberList - The current list of members associated with the current group.
 *   newMember - a new member to be added to the group.
 *   memberEventArray - An array to hold the member events.
 *   groupSchedule - The events specific to the current group.
 *
 *   busyTimeColor - The color for busy blocks.
 *   busyId - Id for busy events.
 *
 *   lastGroupQuery - The last group queried.
 *
 * Functions:
 *   clearMemberArray - clears member array.
 *   saveGroupSchedule - saves the group schedule.
 *   initGroup - initialized the group data.
 *   addMember - adds a new member to the group.
 *
 *   setters and getters for all attributes
 *
 */
app.service('groupService',['$q','googleCalendarService','dataBaseService', function($q,googleCalendarService,dataBaseService){

    /* attributes - public data fields */
    var currentGroupId;
    var groupColor;
    var groupName;
    var memberList;
    var newMember;
    var memberEventArray = [];
    var groupSchedule;

    /* DEFAULT COLORS */
    var busyTimeColor = '#D2D2CD';
    /* Event Id's */
    var busyId = 999;

    /* query data fields - private data fields */
    var lastGroupQuery;

    /************************************************************************
     * Name:    clearMemberArray()

     * Purpose:  Used to clear the current member array when needed.

     * Called In:   GroupController

     * Description: Clears the member array.
     *
     * Outcome:    The memberEventArray is cleared.
     ************************************************************************/
    var clearMemberArray = function(){
        memberEventArray.length = 0;
    };


    /************************************************************************
     * Name:    saveGroupSchedule()

     * Purpose: Saves the group schedule to the database.

     * Called In:   GroupController

     * Description: Sets groupSchedule to be the newSchedule and saves it to
     *              the database.
     *
     * Outcome:   Group schedule is saved to database.
     ************************************************************************/
    var saveGroupSchedule = function(newSchedule){
        lastGroupQuery[0].set("groupSchedule", newSchedule);
        lastGroupQuery[0].save();
    };


    /************************************************************************
     * Name:    initGroup()

     * Purpose:  Initialize the current group information when user switches to 
     *           single group.

     * Called In:   GroupController

     * Description: In charge of initializing all group data so the controller
     *              can grab the information for the necessary single group.
     *
     * Outcome:     - mergedMemberEvents has an array of arrays of events of all
     *              members.
     *              - groupName has group's name
     *              - memberList variable has groups member list
     ************************************************************************/
    var initGroup = function(viewMemberList){
        memberEventArray.length = 0;
        var deferred = $q.defer();
        dataBaseService.queryGroup(currentGroupId).then(function(groupQuery){

            groupName = groupQuery[0].get("name");
            memberList = groupQuery[0].get("memberList");
            //if the view has an altered member list set it
            if(viewMemberList){
                memberList = viewMemberList;
            }
            groupSchedule = groupQuery[0].get("groupSchedule");
            lastGroupQuery = groupQuery;

            var queriesLeft = memberList.length;
            var googleCalQueriesLeft = memberList.length;
            /* iterate over memberList to pull all their data into */
            for(index = 0; index < memberList.length; index ++){
                if(!viewMemberList || viewMemberList[index].selected){
                    dataBaseService.queryUser(memberList[index].email).then(function(userQuery){
                        var tempSched = userQuery[0].get("personalSchedule");
                        /* iterate over all events and change half to be displayed in
                         * the background and have to be displayed in the foreground */
                        for (indexInner = 0; indexInner < tempSched.length; indexInner++){
                            tempSched[indexInner].rendering = "background";
                            tempSched[indexInner].title = "";
                            tempSched[indexInner]._id = busyId;
                            tempSched[indexInner].__id = busyId;
                            tempSched[indexInner].color = busyTimeColor;
                        } // end inner for
                        memberEventArray.push(tempSched);
                        queriesLeft--; // decrement calls to make


                        /* get the user's google calendar data! */
                        var googleCalendarID = userQuery[0].get("googleCalendarID");
                        if( googleCalendarID){
                            googleCalendarService.queryGoogleCalendar(googleCalendarID).then(function(newCal){
                                googleCalQueriesLeft--;
                                var tempSched = [];
                                // iterate through the newly pulled google calendar
                                for (indexInner = 0; indexInner < newCal.items.length; indexInner++){
                                    var startTime;
                                    var endTime;
                                    if(newCal.items[indexInner].start){
                                        startTime = newCal.items[indexInner].start.dateTime;
                                    }
                                    if(newCal.items[indexInner].end){
                                        endTime = newCal.items[indexInner].end.dateTime;
                                    }
                                    if(startTime && endTime){
                                        var newEvent = {
                                            textColor: 'white',
                                title:"",
                                id: busyId,
                                start: startTime,
                                end: endTime,
                                color: '#d2d2cd',
                                rendering: "background"
                                        }
                                        tempSched.push(newEvent);
                                    }
                                } // end inner for
                                memberEventArray.push(tempSched);
                                if(googleCalQueriesLeft <= 0 && queriesLeft <= 0){
                                    deferred.resolve(memberEventArray);
                                }
                            },
                                function(reason){
                                    googleCalQueriesLeft--;
                                })
                        }
                        /* if no calID, decrement queries anyway and check if we should resolve*/
                        else{
                            googleCalQueriesLeft--;
                            if(googleCalQueriesLeft <= 0 && queriesLeft <= 0){
                                deferred.resolve(memberEventArray);
                            }
                        }
                    })
                }//end query user and end if
                else{
                    queriesLeft--; // decrement calls to make
                    googleCalQueriesLeft--;
                    if(googleCalQueriesLeft <= 0 && queriesLeft <= 0){
                        deferred.resolve(memberEventArray);
                    }
                }
            } //end outer for
        })
        return deferred.promise;

    };


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
        dataBaseService.queryGroup(groupId).then(function(groupQuery){
            memberList = groupQuery[0].attributes.memberList;
            groupName = groupQuery[0].attributes.name;

            /* make sure the new member is resolved */
            /* query the user get it's data */
            deferred.resolve(
                dataBaseService.queryUser(newMemberEmail).then(function(userQuery){
                    if(userQuery[0]){
                        newMember = userQuery[0].attributes;
                    }
                })
                );

            /* make sure the new groupList is resolved */
            /* query the groupList of the new member and do the following:
             * 1) update the new member's groupList with the new group 
             * 2) update our working memberlist
             * 3) update the memberlist of the group */
            return dataBaseService.queryGroupList(newMemberEmail).then(function(groupListQuery){
                if(groupListQuery[0]){
                    var newMemberGroupList = groupListQuery[0]._serverData.userGroups;
                    /* set new member's grouplist to have the new group in it */
                    newMemberGroupList[newMemberGroupList.length] =
            {id: getGroupId(), name: groupName, color: getGroupColor()};
            /* save the new member's grouplist */
            groupListQuery[0].save();
            /* add username and email to memberlist */
            memberList[memberList.length] = 
            {name: groupListQuery[0].attributes.userName, email:groupListQuery[0].attributes.userEmail};
            /* save group to database with updated memberlist */
            groupQuery[0].save();

            /* cloud code call to send an alert to new member */
            Parse.Cloud.run('mailGroupAlert', {email: newMemberEmail, group: groupName}, {
                success: function(result) {},
                error: function(error) {}
            });
                }

            })
        })
        return deferred.promise;
    };




    /* SETTERS AND GETTERS */
    /************************************************************************
     * Description: Below are the setters and getters for this service.
     ************************************************************************/

    var getNewMember = function(){
        return newMember;
    };

    var getGroupSchedule = function(){
        return groupSchedule;
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

    var getMemberEventArray = function(){
        return memberEventArray;
    };

    var getGroupName = function(){
        return groupName;
    };

    /************************************************************************
     * Description: Below is the list of functions that will be available to 
     * any controller, service, or directive that injects this service as a
     * dependency.
     ************************************************************************/
    return {
        addMember : addMember,

                  setGroupId: setGroupId,
                  getGroupId: getGroupId,
                  setGroupColor: setGroupColor,
                  getGroupColor: getGroupColor,
                  setMemberList : setMemberList,
                  getMemberList : getMemberList,
                  getNewMember : getNewMember,
                  getGroupName : getGroupName,
                  getGroupSchedule : getGroupSchedule,
                  saveGroupSchedule : saveGroupSchedule,

                  initGroup : initGroup,
                  getMemberEventArray : getMemberEventArray,
                  clearMemberArray : clearMemberArray

    };

}]);

