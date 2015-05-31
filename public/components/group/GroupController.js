/*
 * FileName: GroupController.js
 * Authors: Joe d'Eon (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the view of a single
 *              group. It will have all attributes and behaviors of a single
 *              group. To query the database, one must go throught the
 *              dataBaseService.
 *
 * Attributes: name     - The name of the group.
 *             currentGroupID     - unique ID of the group
 *             membersList - a list of members with the group leader in 
 *                           position zero. Each element will be a user email.
 *             groupColor - the color of this group, gotten from service
 * Functions:
 *             addMember() - Adds a member to the current group.
 *             addMemberModal() - Opens a modal to get information from the
 *                                user to add a new member.
 *
 *             
 *
 *          
 * 
 */

var currentUser = Parse.User.current();

app.controller('GroupController', ['$scope','groupService', 'eventService', 'validateService', '$timeout', 'uiCalendarConfig','$log', '$modal', '$window', 
        function($scope, groupService, eventService, validateService, $timeout, uiCalendarConfig, $log, $modal, $window) { 


            /* DEFAULT COLORS */
            var busyTimeColor = '#D2D2CD';
            /* Event Id's */
            var busyId = 1000;

            /* for choosing repeating events */
            $scope.dayRepeat = {
                monday : false,
                tuesday : false,
                wednesday : false,
                thursday : false,
                friday : false,
                saturday : false,
                sunday : false
            };


            /* Initialize event sources to be an array */
            $scope.eventSources = [];
            $scope.eventColor = {mine : '#B9F5FF'};
            $scope.friendList = currentUser.get("friendList");
            

            $scope.animationsEnabled = true;    

            /* generic modal */
            var openModal = function(template, ctrl, size, param ){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: template,
                    controller: ctrl,
                    size: size,
                    resolve: {
                        modalParams: function () {
                            return param;
                        }
                    }
                });
                return modalInstance.result
            }

            /************************************************************************
             * Name:        addMemberModal

             * Purpose:     To create a modal for the user to add a new member to a group.

             * Called In:   index.html

             * Description: Creates a modal for the user to enter new member information
             *              into, so as to add a new member to the group. This function
             *              is in charge of updating the view with the new members
             *              schedule and the new members name.
             ************************************************************************/
            $scope.addMemberModal = function () {

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'addMember.html',
                    controller: 'AddMemberController',
                    size: 'lg',
                    resolve: {
                        friendList: function () {
                            return $scope.friendList;
                        }
                    }
                });

                modalInstance.result.then(function (newMember) {
                    addMember(newMember);
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            /* Group Calendar Settings */
            /* ----------------------- */
            $scope.uiConfig = {
                calendar:{
                    height: 'auto',
                    selectable: true,
                    select: function(start, end, jsEvent, view){
                        $scope.eventStartDate = (start.local()).toDate();
                        $scope.eventEndDate =  (end.local()).toDate();
                        $scope.eventStartTime = ((start.local()).toDate());
                        $scope.eventEndTime = ((end.local()).toDate());
                    },
                    eventClick: function(event, jsEvent, view) {
                        openModal('saveEvent.html', 'SaveGroupEventController', 'sm', null)
                            .then(function(){
                                event.source = null;
                                event.title = event.title + " (" + groupService.getGroupName() + ")";
                                currentUser.get("personalSchedule").push(event);
                                currentUser.save();
                            });

                    },
                    editable: false,
                    viewRender: function(view, element) {
                        //$log.debug("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
                    },
                    defaultView: 'agendaWeek',
                    slotDuration: '01:00:00',
                    minTime: '06:00:00',
                    maxTime: '22:00:00',
                    dayClick: function(date, jsEvent, view) {
                    },
                    allDaySlot:false
                }
            };

            /* END Group Calendar Settings */
            /* --------------------------- */

            /* Watch to see if single group view is set to true, if it is, pull down group info */
            $scope.$watch('singleGroupView', function(){
                if($scope.singleGroupView === false){
                    /* clear current group data */
                    $scope.groupName = '';
                    $scope.eventSources.length = 0;
                    groupService.clearMemberArray();
                }
                /* if we have switched to single group view */
                if($scope.singleGroupView === true){
                    $scope.currentGroupId = groupService.getGroupId();
                    $scope.groupColor = groupService.getGroupColor();

                    /* initialize group data and get an array of the member's events 
                     * through a callback */
                    groupService.initGroup().then(function(returnedEvents){

                        $scope.groupName = groupService.getGroupName();
                        $scope.memberList = groupService.getMemberList();
                        /* display the group Schedule */
                        $scope.eventSources.push(groupService.getGroupSchedule());

                        /* iterate through the returned events array and push all events 
                         * into our source */
                        for(index = 0; index < returnedEvents.length; index++){
                            if(returnedEvents[index].length !== 0){
                                $scope.eventSources.push(returnedEvents[index]);
                            }
                        }
                    })
                }
            });


            /************************************************************************
             * Name:    addMember()

             * Purpose: Add members to group.

             * Called In:   index.html

             * Description: This function queries the database to get the group's memberlist
             *				then updates it with the new member. Once that is done, it 
             *				queries the database to get the groupList associated with the
             *				new member and adds the new group to their list.
             ************************************************************************/
            var addMember = function(newMember){
                var alreadyInGroup = validateService.isEmailInArray($scope.memberList, newMember);

                if(!alreadyInGroup){
                    groupService.addMember($scope.currentGroupId, newMember).then(function(){
                        $scope.memberList = groupService.getMemberList();
                        var newMemberCall = groupService.getNewMember();
                        if(newMemberCall){
                            var tempSched = newMemberCall.personalSchedule;
                            // pull all member events and set their color
                            // and id's to be busy time. Also set their
                            // rendering to background
                            for(index = 0; index < tempSched.length; index++){
                                tempSched[index].rendering = "background";
                                tempSched[index].title = "";
                                tempSched[index]._id = busyId;
                                tempSched[index].__id = busyId;
                                tempSched[index].color = busyTimeColor;
                            }
                            $scope.eventSources.push(tempSched);
                        }
                        else{
                            console.log("New Member not found");
                            alert("New Member not Found");
                        }
                    })
                }
                else{
                    alert("That member is already in the Group!");
                    console.log("Member is already in group");
                }
            };


/************************************************************************
 * Name:    createEvent()

 * Purpose:   Allows the user to add an event to their calendar.

 * Called In:   index.html

 * Description: Removs all groups found in their GroupList userGroups array.
 ************************************************************************/
$scope.createEvent = function(){
    var repeatTheseDays = [];
    var repeat = false;

    if (!$scope.newEventName){
        alert("Enter a event name!");
        return;
    }

    if ($scope.eventColor.mine == '#fff') {
        alert("Choose a color for your event!");
        return;
    }

    if(Date.parse($scope.eventStartTime) > Date.parse($scope.eventEndTime)) {
        alert("Your end time is before your start time!!");
        return;
    }

    if(Date.parse($scope.eventStartTime) == Date.parse($scope.eventEndTime)) {
        alert("Your event starts and ends at the same time!!");
        return;
    }

    if ($scope.dayRepeat.monday || 
            $scope.dayRepeat.tuesday || 
            $scope.dayRepeat.wednesday ||
            $scope.dayRepeat.thursday ||
            $scope.dayRepeat.friday ||
            $scope.dayRepeat.saturday ||
            $scope.dayRepeat.sunday){
                repeat = true;
            }

    if(repeat){

        if ($scope.dayRepeat.monday){
            repeatTheseDays.push(1);
        }
        if ($scope.dayRepeat.tuesday){
            repeatTheseDays.push(2);
        }
        if ($scope.dayRepeat.wednesday){
            repeatTheseDays.push(3);
        }
        if ($scope.dayRepeat.thursday){
            repeatTheseDays.push(4);
        }
        if ($scope.dayRepeat.friday){
            repeatTheseDays.push(5);
        }
        if ($scope.dayRepeat.saturday){
            repeatTheseDays.push(6);
        }
        if ($scope.dayRepeat.sunday){
            repeatTheseDays.push(0); 
        }
    }    


    eventService.createEvent($scope.newEventName, //event name
            $scope.eventColor.mine, //event color
            (moment($scope.eventStartDate.toISOString()).dateOnly()), //start date
            (moment($scope.eventStartTime.toISOString()).hour()), //start hour
            (moment($scope.eventStartTime.toISOString()).minute()), //start min
            (moment($scope.eventEndDate.toISOString()).dateOnly()), //end date
            (moment($scope.eventEndTime.toISOString()).hour()), //end hour
            (moment($scope.eventEndTime.toISOString()).minute()), //end min
            repeat, //does this event repeat?
            repeatTheseDays); //what does does this event repeat on

    newEvents = eventService.getEvents();
    var tempArray = [];
    var tempGroupSched = groupService.getGroupSchedule();

    for (index = 0; index < newEvents.length; index++){
        tempArray.push(newEvents[index]); 
        tempGroupSched.push(newEvents[index]); 
    }

    $scope.eventSources.push(tempArray);
    /* save the new group schedule */
    groupService.saveGroupSchedule(tempGroupSched);
    // SAVE TO GROUP CALENDAR TODO


    $scope.newEventName = "";

    eventService.clearEvents();

    for(index = 0; index < $scope.dayRepeat.length; index++){
        $scope.dayRepeat[i] = false;
    }
}




            /*
             * Time Picker
             *
             */


            $scope.eventStartTime = new Date();
            $scope.eventEndTime = new Date();

            $scope.hstep = 1;
            $scope.mstep = 1;

            $scope.options = {
                hstep: [1, 2, 3],
                mstep: [1, 5, 10, 15, 25, 30]
            };

            $scope.ismeridian = true;
            $scope.toggleMode = function() {
                $scope.ismeridian = ! $scope.ismeridian;
            };

            $scope.update = function() {
                var d = new Date();
                d.setHours( 14 );
                d.setMinutes( 0 );
                $scope.eventStartTime = d;
                $scope.eventEndTime = d;
            };

            $scope.changed = function () {
                $log.log('Time changed to: ' + $scope.mytime);
            };

            $scope.clear = function() {
                $scope.mytime = null;
            };

            $scope.getMemberIcon = function(email) {
                //reference variable to the memberList variable in this class
                var members = $scope.memberList;
                //Create a new query in the User table of the database
                var User = Parse.Object.extend("User");
                var query = new Parse.Query(User);
                //Get record where email column is eqaul to the argument of this function which is member.email in ng-repeat
                query.equalTo("email", email);
                //Issue the query to the database and call a function passing in the record that was found
                query.find().then(function(pulledMember) {
                    //Loop through "memberList"
                    for (var index = 0; index < members.length; ++index) {
                        //Add in an icon field into the correct inner array of member list.
                        if (members[index].email == email) {
                            //Ternary operator to set a default icon if undefined is found in record's userIcon field.
                            members[index]["icon"] = (pulledMember[0]._serverData.userIcon == undefined) ? ("images/userIcon.png") : (pulledMember[0]._serverData.userIcon);
                        }
                    }
                });
            }
        }]);
