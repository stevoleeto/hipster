app.controller('AccountSettingsController', function($scope, $modalInstance, modalParams){

    $scope.newName = modalParams.name;
    $scope.newEmail = modalParams.email;
    $scope.newGoogleID = (modalParams.google == undefined) ? ("") : (modalParams.google);
    $scope.newIcon = modalParams.icon;
    $scope.saveSettingsFlag = 0;
    $scope.remEventsFlag = 0;

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
            id: (i + 1),    /* Gives id's 2 - 9 */
            image: 'images/hipsterMale' + i + '.png',
            name: 'Hipster Male ' + i,
            selected: 0
        });
        icons.push({
            id: (i + 9),    /* Gives id's 10 - 17 */
            image: 'images/hipsterFemale' + i + '.png',
            name: 'Hipster Female ' + i,
            selected: 0
        });
    }

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

    $scope.saveSettings = function () {
        console.log($scope.newName);
        if($scope.newName && $scope.newEmail) {
            $scope.saveSettingsFlag = 1;
        } else {
            $scope.errMsg = "Errors found with name and/or email field(s)!";
            $scope.errLabel = true;

            setTimeout(function(){
                $scope.errLabel = false;
            }, 2000);
        }

        if(($scope.newGoogleID == "" || $scope.newGoogleID) && $scope.newName && $scope.newEmail) {
            $scope.saveSettingsFlag = 1;
            console.log($scope.newGoogleID);
        } else {
            $scope.errMsg = "Errors found with google calendar ID, name and/or email field(s)!";
            $scope.errLabel = true;

            setTimeout(function(){
                $scope.errLabel = false;
            }, 2000);
        }

        if($scope.saveSettingsFlag) {
            $scope.saveLabel = true;

            setTimeout(function(){
                $scope.saveLabel = false;
            }, 2000);
        }
    };

    $scope.editPassword = function (){
        Parse.User.requestPasswordReset( modalParams.email , {
            success: function() {
                alert("Due to security concerns, an email has been sent with instructions on how to change your password.");
            },
            error: function(error) {}
        });
    };

    $scope.removeAllEvents = function () {
        $scope.remEventsFlag = 1;

        $scope.remLabel = true;

        setTimeout(function(){
            $scope.remLabel = false;
        }, 2000);
    };

    $scope.cancel = function () {
        $scope.newAccountSettings = {
            newUserName: $scope.newName,
            newUserEmail: $scope.newEmail,
            newGoogle: $scope.newGoogleID,
            newUserIcon: $scope.newIcon,
            saveFlag: $scope.saveSettingsFlag,
            remFlag: $scope.remEventsFlag
        };
        
        $modalInstance.close($scope.newAccountSettings);
    };
});