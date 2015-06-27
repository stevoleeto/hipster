/*
 * FileName: notifController.js
 * Authors: Saveen Chadalawada (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the user's notifications.
 *
 * Attributes: $scope.newFriend - grabs users input of newFriend 
 * Functions:
 *             ok() - closes modal and grabs the newFriend email from the input field and returns it to ProfileController.js
 * 
 */

app.controller('notifController', function($scope, $modalInstance){
    $scope.ok = function(){
        $modalInstance.close();
    }
});