/*
 * FileName: addGroupController.js
 * Authors: Joe d'Eon (if you edit this file, add your name to this list)
 * Description: This controller will be used to control adding a group to the user's group list.
                Contains error checking for user's group name/code input and color choice.
 *
 * Attributes: $scope.newGroupName     - The name of the group.
 *             $scope.newGroupCode     - unique ID of the group
 *             groupInfo - a list of members with the group leader in 
 *                           position zero. Each element will be a user email.
 *             $scope.groupColor - the color of this group, gotten from service
 * Functions:
 *             ok() - Checks that the user has inputted a valid groupName, and also makes sure that both a (groupName OR groupCode) and groupColor are selected
 *             cancel() - Closes modal
 *
 */

app.controller('AddGroupController', function($scope, $modalInstance){
    $scope.ok = function(){
    	if ((($scope.newGroupName != "" && $scope.newGroupName != undefined) || ($scope.newGroupCode != "" && $scope.newGroupCode != undefined))  && $scope.groupColor != undefined) {
        	groupInfo = {name:$scope.newGroupName, color: $scope.groupColor, code: $scope.newGroupCode};
        	$modalInstance.close(groupInfo);
        } else {
        	$scope.errLabel = true;

        	setTimeout(function(){
        		$scope.errLabel = false;
        	}, 2000);
        }
    }
    
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});