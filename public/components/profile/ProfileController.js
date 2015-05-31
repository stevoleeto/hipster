/*
 * FileName: ProfileController.js
 * Authors: Joe d'Eon, Stephen Gilardi (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the main profile view
 *              of a user. It will have all the attributes and behaviors of
 *              a single user defined, and will be able to access the database
 *              to get said attributes.
 *
 * Attributes: userName  - The name of the user.
 *             email     - The user's unique email
 *             joinDate  - The date the user signed up.   
 *             myGroupList - The array containing the list of groups the currentUser is part of.           
 *             groupList - A list of the groups a user is in.
 *             groupView - Determines if the group element in the HTML is shown.
 *             profileView - Determines if the profile element in the HTML is shown.
 *             newFriendEmail - The email of the friend being added to a group.
 *
 *
 * Behaviors:  
 *             toggleGroupView() - Selects only the Group view to be shown
 *             toggleProfileView() - Selects only the Profile view to be shown
 *             removeAllGroups() - Removes the current user from all groups.
 *
 *             logout() - log out
 *             createGroup() - create a new group
 *
 *             createEvent() - create an event that is either singular or
 *                             recurring in nature TODO
 *             deleteEvent() - delete an event TODO
 *             editEvent()   - edit an existing event TODO
 *
 *          
 * 
 */

//Link to Parse database - accepts application_ID, JavaScript_Key
Parse.initialize( "t5hvXf3wJOYnL3MMIffsemMdhLM7f4brACcf0eBa", "UhqQaEDIEQr6cxhO8XS4Fl8BcGU4ir9jL9To7PVO" );
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
            $scope.eventArray = currentUser.get("personalSchedule");
            $scope.friendList = currentUser.get("friendList");
            $scope.googleID = currentUser.get("googleAcct");
            $scope.eventColor = {mine : '#B9F5FF'};
            $scope.eventEditColor = {color : eventService.getSelectedEvent().color };

            //set users email in service
            userService.setEmail(currentUser.get("username")); 
            userService.setName($scope.userName);

            /* MODAL FUNCTION */
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

            /* COMPLETED MODALS */
            $scope.addFriendModal = function(){
                openModal( 'addFriend.html', 'AddFriendController', 'lg').then(function(newFriend){
                    addFriend(newFriend);
                }, function(){
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.editGroupModal = function (oldName, oldColor) {

                openModal('editGroup.html', 'EditGroupController', 'lg', {name: oldName, color: oldColor}).then(function (newGroupSettings) {
                    console.log(newGroupSettings);
                }, function () {
                    $scope.myGroupList = userService.getNewGroupList();
                });
            };


            $scope.friendListModal = function () {
                openModal('friendList.html', 'FriendListController', 'lg', $scope.friendList).then(function () {
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.groupInfoModal = function(){
                openModal('groupInfo.html', 'GroupInfoController', 'lg', {}).then(function (){

                }, function(){

                });
            };

            $scope.accountSettingsModal = function () {
                openModal('accountSettings.html', 'AccountSettingsController', 'lg', {name: $scope.userName, email: $scope.email, google: $scope.googleID, icon: $scope.icon}).then(function (newAccountSettings) {
                    console.log(newAccountSettings);
                    if(newAccountSettings.remFlag == 1) {
                        $scope.removeAllEvents();
                    }
                    if(newAccountSettings.saveFlag == 1) {
                        $scope.settingsSave(newAccountSettings.newUserName, newAccountSettings.newUserEmail, newAccountSettings.newGoogle, newAccountSettings.newUserIcon);
                    }
                }, function() {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.addGroupModal = function () {

                openModal('addGroup.html', 'AddGroupController', 'lg').then(function (groupInfo){
                    createGroup(groupInfo);
                }, function (groupList){
                    $scope.myGroupList = userService.getNewGroupList();
                });
            };

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



            

            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };

            

            /* END MODAL SECTION */

                                                                                                                     

            $scope.dayRepeat = {
                monday : false,
                tuesday : false,
                wednesday : false,
                thursday : false,
                friday : false,
                saturday : false,
                sunday : false
            };

            $scope.eventSources = [$scope.eventArray];
            /* GOOGLE CALENDAR */
            if(currentUser.get("googleCalendarID")){ // if user has calID
                if(userService.getGoogleCalendar().length === 0){ // if it hasn't been pulled already
                    userService.setGoogleCalendar(currentUser.get("googleCalendarID")).then(function(){
                        var newCalendar = userService.getGoogleCalendar();
                        if(newCalendar){ //if successful
                            var googleCalendar = newCalendar;
                            $scope.eventSources.push(googleCalendar);
                        }

                    });
                }
            }


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
        maxTime: '22:00:00',
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

/* asks the service to please pull the group list of desire email,
 * then it gets the groupList from the service when its done pulling */
userService.getGroupList($scope.email).then(function(groupList){
    $scope.myGroupList = groupList;
});

$scope.addGroup = function(){	
    groupService.setGroupId($scope.currentGroupId);
    groupService.setGroupColor($scope.currentGroupColor);
}

$scope.updateSingleGroupTab = function(name){
    $scope.singleGroupName = name;
}


/************************************************************************
 * Name:    removeAllGroups()

 * Purpose:   Allows the user to remove themselves from all groups they are in.

 * Called In:   index.html

 * Description: Removs all groups found in their GroupList userGroups array.
 ************************************************************************/
$scope.removeAllGroups = function(){
    $scope.myGroupList = []; 
    userService.clearGroupList($scope.email);
}

/************************************************************************
 * Name:    removeGroup()

 * Purpose:   Remove a single group.

 * Called In:   index.html

 * Description: Removs a single in their GroupList userGroups array.
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

 * Description: Removs all groups found in their GroupList userGroups array.
 ************************************************************************/
$scope.createEvent = function(){
    var repeatTheseDays = [];
    var repeat = false;

    if (!$scope.newEventName){
        alert("Enter a event name!!");
        return;
    }

    if ($scope.eventColor.mine == '#fff') {
        alert("Choose a color for your event!!");
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

    for (index = 0; index < newEvents.length; index++){
        $scope.eventArray.push(newEvents[index]); 
    }

    currentUser.save();

    $scope.newEventName = "";

    eventService.clearEvents();

    for(index = 0; index < $scope.dayRepeat.length; index++){
        $scope.dayRepeat[i] = false;
    }
}

$scope.removeAllEvents = function(){
    $scope.eventSources.length = 0;
    currentUser.set("personalSchedule", []);
    currentUser.save();
}

var addFriend = function(newFriend) {
    var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    query.equalTo("username", newFriend);
    query.find().then(function(pulledFriend) {
        $scope.friendList.push({email: newFriend, name:pulledFriend[0].attributes.name});
        currentUser.set("friendList", $scope.friendList);
        currentUser.save();
    });
}

var viewFriends = function(newFriend) {
    var User = Parse.Object.extend("User");
    var query = new Parse.Query(User);
    query.equalTo("username", newFriend);
    query.find().then(function(pulledFriend) {
        $scope.friendList.push({email: newFriend, name:pulledFriend[0].attributes.name});
        currentUser.set("friendList", $scope.friendList);
        currentUser.save();
    });
}

 var deleteEvent = function(eventClicked){    
    var tempArray = [];
    $scope.eventSources.length = 0;

    for(index = 0; index < $scope.eventArray.length; index++){
        if(eventClicked.id == $scope.eventArray[index].id){
            $scope.eventArray.splice(index, 1);
        }
    }
    for(index = 0; index < $scope.eventArray.length; index++){
        tempArray.push($scope.eventArray[index]);
    }
    $scope.eventSources.push(tempArray);
    currentUser.set("personalSchedule", tempArray);
    currentUser.save();
}

var editEvent = function(eventClicked){
    var tempArray = [];
    $scope.eventSources.length = 0;

    for(index = 0; index < $scope.eventArray.length; index++){
        if(eventClicked.id == $scope.eventArray[index].id){
            $scope.eventArray[index].color = eventClicked.color;
            $scope.eventArray[index].title = eventClicked.title;

        }
    }

    for(index = 0; index < $scope.eventArray.length; index++){
        tempArray.push($scope.eventArray[index]);
    }


    $scope.eventSources.push(tempArray);
    currentUser.set("personalSchedule", tempArray);
    currentUser.save();
}

$scope.settingsSave = function(name, email, google, icon){
    /*var good = false;
    if ($scope.newUserName){
        currentUser.set("name", $scope.newUserName);
        $scope.userName = $scope.newUserName;
        good = true;
    }
    if ($scope.newEmail){ 
        currentUser.set("username", $scope.newEmail);
        currentUser.set("email", $scope.newEmail);
        good = true;
    }
    if ($scope.newPassword){
        currentUser.set("password", $scope.newPassword);
        good = true;
    }
    if ($scope.googleCalendarID){
        currentUser.set("googleCalendarID", $scope.googleCalendarID)
            good = true;
    }
    if (newIcon){
        currentUser.set("userIcon", newIcon);
        good = true;
    }*/

    currentUser.set("name", name);
    currentUser.set("username", email);
    currentUser.set("email", email);
    currentUser.set("googleCalendarID", google)
    currentUser.set("userIcon", icon);

    currentUser.save();
    $scope.newUserName = "";
    userService.setName($scope.newUserName);
    $scope.newEmail = "";
    $scope.newPassword = "";

    $scope.userName = name;
    $scope.email = email;
    $scope.icon = icon;
    $scope.googleID = google;
}

//timepicker

$scope.eventStartTime = new Date();
$scope.eventEndTime = new Date();


$scope.hstep = 1;
$scope.mstep = 1;

$scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
};

$scope.ismderidian = true;
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

}]);//end profilecontrller

/************************************************************************
 * Name:        ModalInstanceCtrl

 * Purpose:     Controller for Modal

 * Called In:   ProfileController and GroupController

 * Description: Modal control
 ************************************************************************/
app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.ok = function () {
        $modalInstance.close("Hello");
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

app.controller('PopoverInstanceCtrl', function ($scope) {
    $scope.repDays = {
        templateUrl: 'repDays.html'
    };
    $scope.confirmRemove = {
        templateUrl: 'confirmRemove.html'
    };
    $scope.groupColorSelect = {
        templateUrl: 'eventColorSelect.html'
    };

    $scope.eventEditColor = {
        templateUrl: 'eventEditColor.html'
    };
});
