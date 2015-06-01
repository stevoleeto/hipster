app.controller('AccountSettingsController', function($scope, $modalInstance, modalParams){

    $scope.newName = modalParams.name;
    $scope.newEmail = modalParams.email;
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

    icons.push({
        id: 18,
        image: 'images/avenger0.png',
        name: 'Black Widow',
        selected: 0
    });

    icons.push({
        id: 19,
        image: 'images/avenger1.png',
        name: 'Captain America',
        selected: 0
    });

    icons.push({
        id: 20,
        image: 'images/avenger2.png',
        name: 'Iron Man',
        selected: 0
    });

    icons.push({
        id: 21,
        image: 'images/avenger3.png',
        name: 'Thor',
        selected: 0
    });

    icons.push({
        id: 22,
        image: 'images/avenger4.png',
        name: 'Hulk',
        selected: 0
    });

    icons.push({
        id: 23,
        image: 'images/avenger5.png',
        name: 'Hawkeye',
        selected: 0
    });


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
                newUserEmail: $scope.newEmail,
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

    $scope.editPassword = function (){
        Parse.User.requestPasswordReset( modalParams.email , {
            success: function() {
                alert("Due to security concerns, an email has been sent with instructions on how to change your password.");
            },
            error: function(error) {}
        });
    };

    $scope.removeAllEvents = function () {

        remEventsFlag = 1;

        newAccountSettings = {
            newUserName: $scope.newName,
            newUserEmail: $scope.newEmail,
            newGoogle: $scope.newGoogleID,
            newUserIcon: $scope.newIcon,
            saveFlag: saveSettingsFlag,
            remFlag: remEventsFlag
        };

        $scope.remLabel = true;

        setTimeout(function(){
            $scope.remLabel = false;
        }, 2000);
    };

    $scope.cancel = function () {
        $modalInstance.close(newAccountSettings);
    };
});