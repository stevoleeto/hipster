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

app.controller('NotifController', function($scope, $modalInstance, modalParams){
	$scope.notifs = modalParams.notifs;
	$scope.notifs[0].selected = true;

	console.log($scope.notifs);

	$scope.displayNotif = function(){
		alert()
	};

    $scope.ok = function(){
        $modalInstance.close();
    }
});