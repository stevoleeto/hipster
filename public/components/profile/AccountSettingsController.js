app.controller('AccountSettingsController', function($scope, $modalInstance, modalParams){

    // Grab the data passed in from modalParams
    $scope.newName = modalParams.name;
    /*$scope.newEmail = modalParams.email;*/
    $scope.newGoogleID = modalParams.google;
    $scope.newIcon = (modalParams.icon == undefined) ? ("images/userIcon.png") : (modalParams.icon);
    saveSettingsFlag = 0;
    remEventsFlag = 0;

    newAccountSettings = {};

    //Don't display user icons on load
    $scope.isCollapsed = true;

    //Create an array to hold the icon objects. Think of this as an array of structs (c/c++).
    var icons = $scope.icons = [];

    //Add icons to the list by initializing fields and pushing onto the array
    icons.push({
        id: 1,
        image: 'images/userIcon.png',
        name: 'Super Hero',
        selected: 0
    });

    //Note: this pushes the icons into the array in the following pattern: 
    //Hipster Male 1, Hipster Female 1, Hipster Male 2, Hipster Female 2, Hipster Male 3, ... , Hipster Female 8
    for (var i = 1; i <= 8; ++i) {
        icons.push({
            id: (i + 1),    // Gives id's 2 - 9
            image: 'images/hipsterMale' + i + '.png',
            name: 'Hipster Male ' + i,
            selected: 0
        });
        icons.push({
            id: (i + 9),    // Gives id's 10 - 17
            image: 'images/hipsterFemale' + i + '.png',
            name: 'Hipster Female ' + i,
            selected: 0
        });
    }

    /** AVENGERS ICON PACK **/
    var names = ['Black Widow', 'Captain America', 'Iron Man', 'Thor', 'Hulk', 'Hawkeye', 'Thanos', 'Loki', 'War Machine', 'Ant Man', 'Nick Fury'];
    for (var i = 0; i < 11; ++i) {
        icons.push({
            id: (i + 18),
            image: 'images/avenger' + i + '.png',
            name: names[i],
            selected: 0
        });
    }
    /** END AVENGERS ICON PACK **/

    /************************************************************************
     * Name:        initSelectedIcon

     * Purpose:     Set the selected icon to be the user's current icon.

     * Called In:   AccountSettingsController.js

     * Description: This function loops through the icons and finds the
     *              icon that is currently saved as the user's icon. It
     *              takes that icon and sets it's selected flag to 1.
     *              The program will display this icon with a blue border
     *              to signify that it is the currently selected icon.
     ************************************************************************/
    $scope.initSelectedIcon = function(icon) {
        if (icon.image == modalParams.icon) {
            icon.selected = 1;
        }
    };

    //Sets the selected field of all icons except for the one clicked on to 0. Sets selected field of clicked on icon to 1.
    //Allows ng-class to assign the selected class css to only the icon clicked on.
    $scope.setSel = function(event) {
        //Loops through each element of the array
        angular.forEach(icons, function(icon) {
            //Check if the clicked on icon's src attribute is NOT the same as the current iteration of the array's image field
            if ($(event.target).attr('src') != icon.image) {
                //Sets selected field to false because this icon in the array is not the one clicked on
                icon.selected = 0;
            } else {
                //Sets selected field to true becuase this icon in the array is the one clicked on.
                icon.selected = 1;
                $scope.newIcon = icon.image;
            }
        });
    };

    /************************************************************************
     * Name:        saveSettings

     * Purpose:     Populates an object with the user's new data to be
     *              set in ProfileController.js when the modal closes.

     * Called In:   AccountSettingsController.js

     * Description: This functions performs input validation on the fields
     *              that the user can edit. This includes the name,
     *              google calendar ID, and user icon. If it passes
     *              validation, an object gets populated with the new data.
     *              A flag is also set to say that the save button was
     *              clicked.
     ************************************************************************/
    $scope.saveSettings = function () {
        if($scope.newName /*&& $scope.newEmail*/) {
            saveSettingsFlag = 1;
        } else {
            $scope.errLabel = true;

            setTimeout(function(){
                $scope.errLabel = false;
            }, 2000);
        }

        if(saveSettingsFlag) {
            newAccountSettings = {
                newUserName: $scope.newName,
                /*newUserEmail: $scope.newEmail,*/
                newGoogle: $scope.newGoogleID,
                newUserIcon: $scope.newIcon,
                saveFlag: saveSettingsFlag,
                remFlag: remEventsFlag
            };

            $scope.saveLabel = true;

            setTimeout(function(){
                $scope.saveLabel = false;
            }, 2000);
        }
    };

    /************************************************************************
     * Name:        editPassword

     * Purpose:     Emails the user with instructions on how to change their 
     *              password.

     * Called In:   AccountSettingsController.js

     * Description: This function allows the user to change their account
     *              password. This uses Parse's password reset functionality
     *              to preserve maximum account security.
     ************************************************************************/
    $scope.editPassword = function (){
        Parse.User.requestPasswordReset( modalParams.email , {
            success: function() {
                alert("Due to security concerns, an email has been sent with instructions on how to change your password.");
            },
            error: function(error) {}
        });
    };

    /************************************************************************
     * Name:        removeAllEvents

     * Purpose:     Clears the user's personal events.

     * Called In:   AccountSettingsController.js

     * Description: This function sets the remEventsFlag to 1 and builds an
     *              object with the new data that the user set in the fields
     *              above. The actual removeEvents functonality is 
     *              handled in ProfileController.js
     ************************************************************************/
    $scope.removeAllEvents = function () {

        remEventsFlag = 1;

        newAccountSettings = {
            newUserName: $scope.newName,
            /*newUserEmail: $scope.newEmail,*/
            newGoogle: $scope.newGoogleID,
            newUserIcon: $scope.newIcon,
            saveFlag: saveSettingsFlag,
            remFlag: remEventsFlag
        };

        // Notifies the user that their events have been cleared
        $scope.remLabel = true;

        setTimeout(function(){
            $scope.remLabel = false;
        }, 2000);
    };

    // When the user clicks on the cancel button
    $scope.cancel = function () {
        // Closes the modal
        $modalInstance.close(newAccountSettings);
    };
});