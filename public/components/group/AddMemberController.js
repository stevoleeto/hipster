/*
 * FileName: AddMemberController.js
 * Authors: Michael Cho (if you edit this file, add your name to this list)
 * Description: This controller will be used to control adding members to an exising group
                that the user is part of.
 *
 * Attributes: friendlist     - the friendslist of the user
 *             $scope.newMemberEmail     - unique email of friend desired to be added to groups memberlist
 * Functions:
 *             setEmail() - sets email from the scope email
 *             save() - return new member email to groupController
               cancel() - closes modal
 * 
 */

app.controller('AddMemberController', function($scope, $modalInstance, friendList){

	$scope.friends = friendList;

	$scope.setEmail = function(email) {
		$scope.newMemberEmail = email;
	}

	$scope.save = function(){
		$modalInstance.close($scope.newMemberEmail);
	}

	$scope.cancel = function(){
		$modalInstance.dismiss();
	}
});