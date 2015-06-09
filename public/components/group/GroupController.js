/*
 * FileName: GroupController.js
 * Authors: Joe d'Eon, Stephen Gilardi
 * Description: This controller will be used to control the view of a single
 *              group. It will have all attributes and behaviors of a single
 *              group. To query the database, one must go throught the
 *              dataBaseService.
 *
 * Attributes: 
 *  busyTimeColor - the color to show busy times
 *  busyId - the id to set all pulled member events to so they are displayed
 *           in background together.
 *  dayRepeat - An array of booleans for repeating events.
 *  eventSources - The array of arrays of events for the calendar to render.
 *  friendList - The array of friends belonging to the user.
 *  animationsEnabled - Enable animations for the modals.
 *  uiConfig - The configurations of the calendar.
 *
 * Functions:
 *  openModal - Generic function for opening modals.
 *  addMemberModal - Modal to add a member.
 *  updateGroupSchedule - Update the group Schedule.
 *  addMember - add a member
 *  createEvent -create a new event
 *
 * TimePicker:
 *  Attributes - 
 *    eventStartTime - event start time
 *    eventEndTime - event end time
 *    hstep - what happens when you click the hour button
 *    mstep - what happens when you click the minute button
 *    options - timepicker options
 *    ismeridian - boolean for meridian time
 *  Behaviors -
 *    changed - when the picker is changed
 *    update - update the picker
 *    clear - clear the picker
 */

var currentUser = Parse.User.current();
var dispMembers = [];

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
                        openModal('saveEvent.html', 'SaveGroupEventController', 'lg', null)
                            .then(function(){
                                for(index = 0; index < $scope.eventSources[0].length; index++){
                                    if(event.id === $scope.eventSources[0][index].id){
                                        var newEvent = eventService.copyEvent($scope.eventSources[0][index]);
                                        newEvent.title = event.title + " (" + groupService.getGroupName() + ")";
                                        currentUser.get("personalSchedule").push(newEvent);
                                        currentUser.save(); 
                                    }
                                }
                            });
                    },
                    editable: false,
                    viewRender: function(view, element) {
                        //$log.debug("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
                    },
                    defaultView: 'agendaWeek',
                    slotDuration: '01:00:00',
                    minTime: '06:00:00',
                    maxTime: '24:00:00',
                    dayClick: function(date, jsEvent, view) {
                    },
                    allDaySlot:false
                }
            };

            /************************************************************************
             * Name:        openModal

             * Purpose:     A generic function for initializing a modal.

             * Called In:   GroupController.js

             * Description: Uses the $modal service to open a modal with the
             *              input settings. 
             *
             * Parameters:
             *              template - the template html for the modal
             *              ctrl - the controller for the modal
             *              size - the size of the modal
             *              param - the data the caller wants to send to the
             *                      modal
             ************************************************************************/
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



            /* END Group Calendar Settings */

            /*
             * ********** Initialize Group View **********
             * *******************************************
             * *******************************************
             * *******************************************
             * *******************************************
             * *******************************************
             */

            // This is done every time a user switched to single group view.
            $scope.$watch('singleGroupView', function(){
                if($scope.singleGroupView === false){
                    /* clear current group data */
                    $scope.groupName = '';
                    $scope.eventSources.length = 0;
                    groupService.clearMemberArray();
                }
                /* if we have switched to single group view */
                if($scope.singleGroupView === true){
                    updateGroupSchedule();
                }
            });



             /************************************************************************
             * Name:    updateGroupSchedule

             * Purpose: To update the current single group's calendar with 
             *          the group's most recent events.

             * Called In: GroupController.js

             * Description: Delegates to groupService to initialize the group
             *              information, then gets the groupName, memberList,
             *              and group schedule.
             ************************************************************************/
            var updateGroupSchedule = function(){
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

            /************************************************************************
             * Name:    addMember()

             * Purpose: Add members to group.

             * Called In:   index.html

             * Description: This function queries the database to get the group's memberlist
             *              then updates it with the new member. Once that is done, it 
             *              queries the database to get the groupList associated with the
             *              new member and adds the new group to their list.
             ************************************************************************/
            var addMember = function(newMember){
                var alreadyInGroup = validateService.isEmailInArray($scope.memberList, newMember);

                if (newMember == currentUser.get("username")) {
                    alert("You can't add yourself as a member!!");
                    return;
                }

                if(!alreadyInGroup){
                    groupService.addMember($scope.currentGroupId, newMember).then(function(){
                        $scope.memberList = groupService.getMemberList();
                        $timeout(function(){$scope.$apply()}, 150);
                        $timeout(function(){$scope.$apply()}, 1500);
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
             * Name:        createEvent()TODO

             * Purpose:     Allows the user to add an event to their calendar.

             * Called In:   index.html

             * Description: Removes all groups found in their GroupList userGroups array.
             ************************************************************************/
            $scope.createEvent = function(){
                /* Declare any necesary variables
                 *  repDays - The start of the string to be emailed to group members
                 *  repeatTheseDays - An array of days that the event repeats on
                 *  repeat - Set the repeat boolean off
                 */
                var repDays = "Repeats on: ";
                var repeatTheseDays = [];
                var repeat = false;

                // Check if the user didn't enter an event name
                if (!$scope.newEventName){
                    alert("Enter a event name!");
                    return;
                }

                // Check if the user didn't change the color of the event
                if ($scope.eventColor.mine == '#fff') {
                    alert("Choose a color for your event!");
                    return;
                }

                // Check if the chosen end time is before the chosen start time
                if(Date.parse($scope.eventStartTime) > Date.parse($scope.eventEndTime)) {
                    alert("Your end time is before your start time!!");
                    return;
                }

                // Check if the chosen end time is the same as the chosen start time
                if(Date.parse($scope.eventStartTime) == Date.parse($scope.eventEndTime)) {
                    alert("Your event starts and ends at the same time!!");
                    return;
                }

                // Check if the chosen end time is the same as the chosen start time
                if(Date.parse($scope.eventStartDate) > Date.parse($scope.eventEndDate)) {
                    alert("Your end date is before your start date!!");
                    return;
                }

                // Check if any of the checkboxes for the repeating days was set to true
                // If so, set the repeat boolean to true
                if ($scope.dayRepeat.monday || 
                        $scope.dayRepeat.tuesday || 
                        $scope.dayRepeat.wednIDKesday ||
                        $scope.dayRepeat.thursday ||
                        $scope.dayRepeat.friday ||
                        $scope.dayRepeat.saturday ||
                        $scope.dayRepeat.sunday){
                            repeat = true;
                        }

                // Push which days to repeat onto the array
                // Continue building string to be emailed to group members
                if(repeat){

                    if ($scope.dayRepeat.monday){
                        repeatTheseDays.push(1);
                        repDays += "Monday, ";
                    }
                    if ($scope.dayRepeat.tuesday){
                        repeatTheseDays.push(2);
                        repDays += "Tuesday, ";
                    }
                    if ($scope.dayRepeat.wednesday){
                        repeatTheseDays.push(3);
                        repDays += "Wednesday, ";
                    }
                    if ($scope.dayRepeat.thursday){
                        repeatTheseDays.push(4);
                        repDays += "Thursday, ";
                    }
                    if ($scope.dayRepeat.friday){
                        repeatTheseDays.push(5);
                        repDays += "Friday, ";
                    }
                    if ($scope.dayRepeat.saturday){
                        repeatTheseDays.push(6);
                        repDays += "Saturday, ";
                    }
                    if ($scope.dayRepeat.sunday){
                        repeatTheseDays.push(0);
                        repDays += "Sunday";
                    }
                }    

                // Call the createEvent function handled in shared/eventService.js
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

                // gets all new events from the Event Service.
                newEvents = eventService.getEvents();
                var tempArray = [];

                // gets the group schedule from the group service.
                var tempGroupSched = groupService.getGroupSchedule();

                // Iterates through the new events, pushing each one into both a temp array 
                // and an tempGroupSchedule.
                for (index = 0; index < newEvents.length; index++){
                    tempArray.push(newEvents[index]); 
                    tempGroupSched.push(newEvents[index]); 
                }

                $scope.eventSources.push(tempArray);
                /* save the new group schedule */
                groupService.saveGroupSchedule(tempGroupSched);

                // Get a list of the group's members
                var list = groupService.getMemberList();
                var memberStr = "";
                // Loop through members and add their name and email to a string if they are not the current user
                for (var i = 0; i < list.length; ++i) {
                    if (list[i].name != currentUser.get("name")) {
                        if (i != list.length - 1) {
                            memberStr += (list[i].name + " <" + list[i].email + ">, ");
                        } else {
                            memberStr += (list[i].name + " <" + list[i].email + ">");
                        }
                    }
                }

                // Convert the start date entered by the user into moment date format
                var start = new moment($scope.eventStartDate);
                // Convert the end date entered by the user into moment date format
                var end = new moment($scope.eventEndDate);

                // Check if the event repeats. If it doesn't change the repDays string
                if (repDays == "Repeats on: ") {
                    repDays = "This event does not repeat";
                }

                // Build the string to be emailed to the group's members
                var info = "\tStarts on: " + start.format("MM/DD/YYYY") + " at " + start.format("hh:mm A") + "<br>" + 
                    "\tEnds on: " + end.format("MM/DD/YYYY") + " at " + end.format("hh:mm A") + "<br>\t" + repDays;

                // Send email to members notifying them of a new event being created
                Parse.Cloud.run('mailNewGroupEvent', {user: currentUser.get("name"), eventName: $scope.newEventName, group: $scope.groupName, members: memberStr, details: info}, {
                    success: function(result) {},
                    error: function(error) {}
                });

                // Reset fields
                $scope.newEventName = "";

                eventService.clearEvents();

                for(index = 0; index < $scope.dayRepeat.length; index++){
                    $scope.dayRepeat[i] = false;
                }
            }


             /************************************************************************
             * Name:        Time Picker

             * Purpose:     To display and implement a small box for the user to
             *              adjust the time of the event they would like to create.

             * Called In:   index.html

             * Description: Below is the implementation of time picker.

             ************************************************************************/


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
