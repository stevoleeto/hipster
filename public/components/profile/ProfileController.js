/*
 * FileName: ProfileController.js
 * Authors: Joe d'Eon, Stephen Gilardi (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the main profile view
 *              of a user. It will have all the attributes and behaviors of
 *              a single user defined.
 *
 * Attributes:  
 *  userName - The current user's name.
 *  icon - The current user's icon.
 *  joinDate - The current user's join date.
 *  email - The current user's email.
 *  friendList - The current user's friendList.
 *  googleID - The current user's google ID.
 *  eventColor - Event color attribute to get from the view.
 *  personalSchedule - The current user's personalSchedule.
 *  dayRepeat - An object of repeating day booleans.
 *  googleCalendar - The current user's googleCalendar event array.
 *  eventSources - An array of array of events to be display on the calendar.
 *
 * Modals:
 *  openModal - Generic function to initialize a modal.
 *  addFriendModal - A modal to add friends.
 *  editGroupModal - A modal to edit a user's group color.
 *  friendListModal - A modal to view friends list.
 *  accountSettingsModal - A modal to update a user's personal info.
 *  addGroupModal - A modal to create a new group.
 *  contactModal - A modal to send a message to developers.
 *  editEventModal - A modal to edit an event's information.
 *
 * Behaviors:
 *  updatePersonalSchedule - update the current user's view of personal Schedule
 *  addGroup - add a new group.
 *  updateSingleGroupTab - update single group tab
 *  editGroup - edit a group
 *  addFriend - add a new friend
 *  deleteEvent - delete an existing event
 *  editEvent - edit an existing event's info
 *  settingsSave - save settings
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
 * 
 */

var currentUser = Parse.User.current();
var newIcon = '';


app.controller('ProfileController', ['$scope', 'groupService', 'eventService', '$timeout','userService', 'dataBaseService', 'validateService', 'uiCalendarConfig', '$modal', '$log', '$window', 
        function($scope, groupService, eventService, $timeout, userService, dataBaseService , validateService, uiCalendarConfig, $modal,$log, $window) {

            $scope.animationsEnabled = true;

            /* user data */
            $scope.userName = currentUser.get("name");
            $scope.icon = currentUser.get("userIcon");
            $scope.joinDate = currentUser.createdAt;
            $scope.email = currentUser.get("username");
            $scope.friendList = currentUser.get("friendList");
            $scope.googleID = currentUser.get("googleCalendarID");
            $scope.eventColor = {mine : '#B9F5FF'};
            var personalSchedule = currentUser.get("personalSchedule");

            var googleCalendar = [];
            $scope.eventSources = [personalSchedule, googleCalendar];

            $scope.dayRepeat = {
                monday : false,
tuesday : false,
wednesday : false,
thursday : false,
friday : false,
saturday : false,
sunday : false
            };

            // Profile Calendar Settings
            // -----------------------
            $scope.uiConfig = {
                calendar:{
                    height: 'auto',
                    viewRender: function(view, element) {
                        //$log.debug("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
                    },
                    editable: false,
                    selectable: true,
                    defaultView: 'agendaWeek',
                    slotDuration: '01:00:00',
                    minTime: '06:00:00',
                    maxTime: '24:00:00',
                    eventClick: function(event, jsEvent, view) {
                        editEventModal(event);
                    },
                    select: function(start, end, jsEvent, view){
                        $scope.eventStartDate = (start.local()).toDate();
                        $scope.eventEndDate =  (end.local()).toDate();
                        $scope.eventStartTime = ((start.local()).toDate());
                        $scope.eventEndTime = ((end.local()).toDate());
                    },
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    allDaySlot:false
                }
            };


            //set users email in service
            userService.setEmail(currentUser.get("username")); 
            userService.setName($scope.userName);

            /* GET USER GROUPLIST */
            userService.getGroupList($scope.email).then(function(groupList){
                $scope.myGroupList = groupList;
            });

            $scope.$watch('profileView', function(){
                if($scope.profileView){
                    updatePersonalSchedule();
                }
            });


            /*
             * **********MODALS***********
             * ***************************
             * ***************************
             * ***************************
             * ***************************
             * ***************************
             * ***************************
             */

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
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
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            $scope.addFriendModal = function(){
                openModal( 'addFriend.html', 'AddFriendController', 'lg').then(function(newFriend){
                    addFriend(newFriend);
                }, function(){
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            $scope.editGroupModal = function (oldName, oldColor, oldID) {

                openModal('editGroup.html', 'EditGroupController', 'lg', {name: oldName, color: oldColor, id:oldID}).then(function (editedGroup) {
                    editGroup(editedGroup.id,editedGroup.newColor);
                }, function () {
                    $scope.myGroupList = userService.getNewGroupList();
                });
            };

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            $scope.friendListModal = function () {
                openModal('friendList.html', 'FriendListController', 'lg', $scope.friendList).then(function () {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            $scope.accountSettingsModal = function () {
                openModal('accountSettings.html', 'AccountSettingsController', 'lg', {name: $scope.userName, email: $scope.email, google: $scope.googleID, icon: $scope.icon}).then(function (newAccountSettings) {
                    if(newAccountSettings.remFlag == 1) {
                        $scope.removeAllEvents();
                    }
                    if(newAccountSettings.saveFlag == 1) {
                        $scope.settingsSave(newAccountSettings.newUserName, newAccountSettings.newUserEmail, newAccountSettings.newGoogle, newAccountSettings.newUserIcon);
                        currentUser.set("googleCalendarID", newAccountSettings.newGoogle); 
                        updatePersonalSchedule();
                    }
                }, function(newAccountSettings) {
                    $log.info('Modal dismissed at: ' + new Date());
                    if(newAccountSettings.remFlag == 1) {
                        $scope.removeAllEvents();
                    }
                    //updatePersonalSchedule();
                });
            };

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            $scope.addGroupModal = function () {
                openModal('addGroup.html', 'AddGroupController', 'lg').then(function (groupInfo){
                    createGroup(groupInfo);
                }, function (groupList){
                    $scope.myGroupList = userService.getNewGroupList();
                });
            };

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            $scope.contactModal = function () {
                openModal('contact.html', 'ContactController', 'lg', {name: $scope.userName, email: $scope.email}).then(function (){

                }, function (){
                    $scope.myGroupList = userService.getNewGroupList();
                });
            };

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            var editEventModal = function(eventClicked){
                openModal('editMyEvent.html','EditEventController', 'lg',eventClicked).then(function (savedEvent) {
                    if(savedEvent){ //save it
                        editEvent(eventClicked);
                    }
                    else{ // delete it
                        deleteEvent(eventClicked);
                    }
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            }
            /* COMPLETED MODALS */


            /* END MODAL SECTION */
            /*********************/
            /*********************/
            /*********************/
            /*********************/
            /*********************/
            /*********************/

            /*
             * ********USER BEHAVIORS********
             * ******************************
             * ******************************
             * ******************************
             * ******************************
             * ******************************
             * ******************************
             */

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            var updatePersonalSchedule = function(){
                personalSchedule.length = 0;
                userService.getCurrentSchedule($scope.email).then(function(currentSchedule){
                    for(index = 0; index < currentSchedule.length; index ++){
                        personalSchedule.push(eventService.copyEvent(currentSchedule[index]));
                    }
                });

                /* GOOGLE CALENDAR */
                if(currentUser.get("googleCalendarID")){ // if user has calID
                    userService.setGoogleCalendar(currentUser.get("googleCalendarID")).then(function(){
                        var newCalendar = userService.getGoogleCalendar();
                        if(newCalendar){ //if successful
                            googleCalendar.length = 0;
                            for(index = 0; index < newCalendar.length; index++){
                                googleCalendar.push(newCalendar[index]);
                            }
                            //console.log(angular.element('#userCalendar'));
                            //angular.element('#userCalendar').fullCalendar('refetchEvents');
                        }
                    });
                }
                else{
                    googleCalendar.length = 0;
                }


            }


            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            $scope.addGroup = function(){	
                groupService.setGroupId($scope.currentGroupId);
                groupService.setGroupColor($scope.currentGroupColor);
            }

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            $scope.updateSingleGroupTab = function(name){
                $scope.singleGroupName = name;
            }

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            var editGroup = function(groupID, newColor){
                for(index = 0; index < $scope.myGroupList.length; index++){
                    if(groupID === $scope.myGroupList[index]['id']){
                        console.log("Found the group!");
                        $scope.myGroupList[index]['color'] = newColor;
                        break;
                    }
                }

                dataBaseService.queryGroupList($scope.email).then(function(groupListQuery){
                    groupListQuery[0].set("userGroups", $scope.myGroupList);
                    groupListQuery[0].save();
                });
            }


            /************************************************************************
             * Name:    removeGroup()

             * Purpose:   Remove a single group.

             * Called In:   index.html

             * Description: Removes a single in their GroupList userGroups array.
             ************************************************************************/
            $scope.removeGroup = function(groupId){
                userService.removeGroup(groupId);
                for (i = 0; i < $scope.myGroupList.length; i++){
                    if($scope.myGroupList[i]['id'] === groupId){
                        $scope.myGroupList.splice(i, 1);
                        break;
                    }
                }
            }

            /************************************************************************
             * Name:		logout()

             * Purpose:		Allows the user to logout.

             * Called In:   main()

             * Description:	Calls Parse's logout function. 
             ************************************************************************/
            $scope.logout = function(){
                Parse.User.logOut();
                location.href='components/login/login.html';
            }

            /************************************************************************
             * Name:    createGroup()

             * Purpose:   Allows the user to create a group and include an email to invite to the group.

             * Called In:   index.html

             * Description: Creates a new group, and adds the new group to the GroupList userGroups array for both the current user the and user they have selected.
             ************************************************************************/
            var createGroup = function(groupInfo){
                if (groupInfo.code != undefined){
                    dataBaseService.queryGroup(groupInfo.code).then(function(groupQuery){
                        if(groupQuery.length == 0){
                            alert("Group Doesn't Exist!");
                            console.log("Group doesn't Exist");
                        }
                        else{
                            var alreadyInGroup = validateService.isEmailInArray(groupQuery[0]._serverData.memberList, $scope.email);
                            if(!alreadyInGroup){
                                groupQuery[0]._serverData.memberList.push({name: $scope.userName, email: $scope.email});
                                groupQuery[0].save();
                                dataBaseService.queryGroupList($scope.email).then(function(groupListQuery){
                                    $scope.myGroupList.push({id: groupQuery[0].id, name: groupQuery[0]._serverData.name, color: groupInfo.color || "#B5FBA3"});
                                    groupListQuery[0].set("userGroups", $scope.myGroupList);
                                    groupListQuery[0].save();
                                });
                            }
                            else{
                                alert("You're already in that group!");
                            }
                        }
                    });
                }
                else{
                    userService.createGroup($scope.userName, $scope.email, $scope.myGroupList, groupInfo.name, groupInfo.color).then(function(){
                        /* this is to ensure scope gets applied even if query takes a bit too long*/
                        $timeout(function(){$scope.$apply()}, 150);
                    });
                    groupName = '';
                }

            }

            /************************************************************************
             * Name:    createEvent()

             * Purpose:   Allows the user to add an event to their calendar.

             * Called In:   index.html

             <<<<<<< HEAD
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
                console.log("In Create event, new event");
                console.log(newEvents);

                for (index = 0; index < newEvents.length; index++){
                    personalSchedule.push(eventService.copyEvent(newEvents[index]));
                }

                currentUser.save();

                $scope.newEventName = "";

                eventService.clearEvents();

                for(index = 0; index < $scope.dayRepeat.length; index++){
                    $scope.dayRepeat[i] = false;
                }
                $scope.dayRepeat.monday = $scope.dayRepeat.tuesday = 
                    $scope.dayRepeat.wednesday = $scope.dayRepeat.thursday = 
                    $scope.dayRepeat.friday = $scope.dayRepeat.saturday = $scope.dayRepeat.sunday = false;
            }

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            $scope.removeAllEvents = function(){
                personalSchedule.length = 0;
                currentUser.save();
            }

            /************************************************************************
             * Name:        

             * Purpose:    

             * Called In:   

             * Description: 
             ************************************************************************/
            var addFriend = function(newFriend) {
                var notAlreadyFriend = 1;
                var User = Parse.Object.extend("User");
                var query = new Parse.Query(User);
                query.equalTo("username", newFriend);
                query.find().then(function(pulledFriend) {
                    if (pulledFriend.length > 0) {
                        console.log($scope.friendList);
                        for ( var i = 0; i < $scope.friendList.length; ++i) {
                            if ($scope.friendList[i].email == newFriend) {
                                notAlreadyFriend = 0;
                                break;
                            }
                        }
                        if (notAlreadyFriend) {
                            $scope.friendList.push({email: newFriend, name:pulledFriend[0].attributes.name});
                            currentUser.set("friendList", $scope.friendList);
                            currentUser.save();
                        } else {
                            alert("User is already your friend!");
                        }
                    } else {
                        alert("User not found.");
                    }
                });
            }


            var deleteEvent = function(eventClicked){    
                for(index = 0; index < personalSchedule.length; index++){
                    if(eventClicked.id == personalSchedule[index].id){
                        personalSchedule.splice(index, 1);
                        index--;
                    }
                }
                currentUser.set("personalSchedule",personalSchedule);
                currentUser.save();
            }

            var editEvent = function(eventClicked){
                var start;
                var end;

                for(index = 0; index < personalSchedule.length; index++){
                    if(eventClicked.id == personalSchedule[index].id){
                        start = personalSchedule[index].start;
                        end = personalSchedule[index].end;
                        personalSchedule[index] = eventService.copyEvent(eventClicked);
                        personalSchedule[index].start = start;
                        personalSchedule[index].end = end;
                    }
                }
                currentUser.save();
            }

            $scope.settingsSave = function(name, email, google, icon){

                currentUser.set("name", name);
                //currentUser.set("username", email);
                //currentUser.set("email", email);
                currentUser.set("googleCalendarID", google);
                currentUser.set("userIcon", icon);

                currentUser.save();
                $scope.newUserName = "";
                userService.setName($scope.newUserName);
                $scope.newEmail = "";
                $scope.newPassword = "";

                $scope.userName = name;
                //$scope.email = email;
                $scope.icon = icon;
                $scope.googleID = google;
            }

            /************************************************************************
             * Name:        timePicker

             * Purpose:     A small section to implement a timepicker selector.

             * Called In:   index.html

             * Description: Below is some functionality for a small
             *              ui box for choosing the time.
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

        }]);//end profilecontrller
